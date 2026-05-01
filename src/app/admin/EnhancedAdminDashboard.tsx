"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Resource, ResourceStats } from "@/types/database";
import { useRouter } from "next/navigation";
import MediaUploader from "@/components/MediaUploader";
import ShareButtons from "@/components/ShareButtons";

// ─── Types ────────────────────────────────────────────────────
type FormData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: "free" | "paid";
  image: string;
  content: string;
  published_at: string;
  read_time: string;
  price: string;
  is_published: boolean;
  featured: boolean;
};

const EMPTY_FORM: FormData = {
  slug: "",
  title: "",
  description: "",
  category: "",
  type: "free",
  image: "",
  content: "",
  published_at: new Date().toISOString().split("T")[0],
  read_time: "5 min read",
  price: "",
  is_published: true,
  featured: false,
};

type ViewMode = "list" | "grid" | "analytics";
type FilterType = "all" | "free" | "paid" | "published" | "draft";

// ─── Enhanced Admin Dashboard ─────────────────────────────────
export default function EnhancedAdminDashboard() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // State
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [analytics, setAnalytics] = useState<Record<string, ResourceStats>>({});

  // Auth gate
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (!data.user || (adminEmail && data.user.email !== adminEmail)) {
        router.replace("/signin?error=unauthorized");
      }
    });
  }, [router, supabase]);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("published_at", { ascending: false });
    if (!error) {
      setResources((data ?? []) as Resource[]);
      setFilteredResources((data ?? []) as Resource[]);
    }
    setLoading(false);
  }, [supabase]);

  // Fetch analytics for all resources
  const fetchAnalytics = useCallback(async () => {
    if (viewMode !== "analytics") return;
    
    const stats: Record<string, ResourceStats> = {};
    for (const resource of resources) {
      try {
        const response = await fetch(`/api/analytics?resource_id=${resource.id}&stats=true`);
        if (response.ok) {
          const data = await response.json();
          stats[resource.id] = data.stats || {
            views_count: 0,
            shares_count: 0,
            facebook_shares: 0,
            linkedin_shares: 0,
            twitter_shares: 0,
          };
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    }
    setAnalytics(stats);
  }, [resources, viewMode]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    if (viewMode === "analytics") {
      fetchAnalytics();
    }
  }, [viewMode, fetchAnalytics]);

  // Filter and search
  useEffect(() => {
    let filtered = [...resources];

    // Apply type filter
    if (filterType === "free") {
      filtered = filtered.filter((r) => r.type === "free");
    } else if (filterType === "paid") {
      filtered = filtered.filter((r) => r.type === "paid");
    } else if (filterType === "published") {
      filtered = filtered.filter((r) => r.is_published);
    } else if (filterType === "draft") {
      filtered = filtered.filter((r) => !r.is_published);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.slug.toLowerCase().includes(query)
      );
    }

    setFilteredResources(filtered);
  }, [resources, filterType, searchQuery]);

  // Form handlers
  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setFeedback(null);
    setShowPreview(false);
  }

  function openEdit(r: Resource) {
    setEditing(r);
    setForm({
      slug: r.slug,
      title: r.title,
      description: r.description,
      category: r.category,
      type: r.type,
      image: r.image,
      content: r.content,
      published_at: r.published_at,
      read_time: r.read_time,
      price: r.price != null ? String(r.price) : "",
      is_published: r.is_published,
      featured: r.featured,
    });
    setShowForm(true);
    setFeedback(null);
    setShowPreview(false);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFeedback(null);
    setShowPreview(false);
  }

  function change(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Save handler
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      type: form.type,
      image: form.image.trim(),
      content: form.content,
      published_at: form.published_at,
      read_time: form.read_time.trim(),
      price: form.type === "paid" && form.price ? Number(form.price) : null,
      is_published: form.is_published,
      featured: form.featured,
    };

    let error;
    if (editing) {
      const { error: updateError } = await supabase
        .from("resources")
        .update(payload)
        .eq("id", editing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("resources")
        .insert(payload);
      error = insertError;
    }

    setSaving(false);

    if (error) {
      setFeedback({ type: "error", msg: error.message });
    } else {
      setFeedback({ type: "success", msg: editing ? "Resource updated!" : "Resource created!" });
      await fetchResources();
      setTimeout(cancelForm, 1200);
    }
  }

  // Delete handler
  async function handleDelete(id: string) {
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) {
      setFeedback({ type: "error", msg: error.message });
    } else {
      setDeleteConfirm(null);
      await fetchResources();
    }
  }

  // Bulk operations
  function toggleSelectAll() {
    if (selectedResources.size === filteredResources.length) {
      setSelectedResources(new Set());
    } else {
      setSelectedResources(new Set(filteredResources.map((r) => r.id)));
    }
  }

  function toggleSelect(id: string) {
    const newSelected = new Set(selectedResources);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedResources(newSelected);
  }

  async function bulkPublish() {
    const ids = Array.from(selectedResources);
    for (const id of ids) {
      await supabase.from("resources").update({ is_published: true }).eq("id", id);
    }
    setSelectedResources(new Set());
    await fetchResources();
  }

  async function bulkUnpublish() {
    const ids = Array.from(selectedResources);
    for (const id of ids) {
      await supabase.from("resources").update({ is_published: false }).eq("id", id);
    }
    setSelectedResources(new Set());
    await fetchResources();
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selectedResources.size} resources? This cannot be undone.`)) return;
    
    const ids = Array.from(selectedResources);
    for (const id of ids) {
      await supabase.from("resources").delete().eq("id", id);
    }
    setSelectedResources(new Set());
    await fetchResources();
  }

  // Media upload handler
  function handleMediaUpload(media: { id: string; url: string; type: string }) {
    change("image", media.url);
    setFeedback({ type: "success", msg: "Media uploaded! URL copied to image field." });
  }

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your newsletter content, track analytics, and share on social media
            </p>
          </div>
          {!showForm && (
            <button
              onClick={openNew}
              className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              + New Article
            </button>
          )}
        </div>

        {/* Stats Overview */}
        {!showForm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Articles"
              value={resources.length}
              icon="📄"
              color="blue"
            />
            <StatCard
              label="Published"
              value={resources.filter((r) => r.is_published).length}
              icon="✅"
              color="green"
            />
            <StatCard
              label="Drafts"
              value={resources.filter((r) => !r.is_published).length}
              icon="📝"
              color="yellow"
            />
            <StatCard
              label="Total Views"
              value={resources.reduce((sum, r) => sum + (r.views || 0), 0)}
              icon="👁️"
              color="purple"
            />
          </div>
        )}

        {/* Toolbar */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                <option value="all">All Articles</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-stone-950 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-stone-950 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("analytics")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === "analytics"
                      ? "bg-stone-950 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedResources.size > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedResources.size} selected
                </span>
                <button
                  onClick={bulkPublish}
                  className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Publish
                </button>
                <button
                  onClick={bulkUnpublish}
                  className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Unpublish
                </button>
                <button
                  onClick={bulkDelete}
                  className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedResources(new Set())}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editing ? `Edit: ${editing.title}` : "New Article"}
              </h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>

            {!showPreview ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Title *" htmlFor="title">
                    <input
                      id="title"
                      required
                      value={form.title}
                      onChange={(e) => change("title", e.target.value)}
                      className={inputClass}
                      placeholder="Kubernetes Fundamentals"
                    />
                  </Field>
                  <Field label="Slug *" htmlFor="slug">
                    <input
                      id="slug"
                      required
                      value={form.slug}
                      onChange={(e) => change("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      className={inputClass}
                      placeholder="kubernetes-fundamentals"
                    />
                  </Field>
                  <Field label="Category *" htmlFor="category">
                    <input
                      id="category"
                      required
                      value={form.category}
                      onChange={(e) => change("category", e.target.value)}
                      className={inputClass}
                      placeholder="Kubernetes"
                    />
                  </Field>
                  <Field label="Type *" htmlFor="type">
                    <select
                      id="type"
                      value={form.type}
                      onChange={(e) => change("type", e.target.value)}
                      className={inputClass}
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </Field>
                  {form.type === "paid" && (
                    <Field label="Price (USD) *" htmlFor="price">
                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.price}
                        onChange={(e) => change("price", e.target.value)}
                        className={inputClass}
                        placeholder="49"
                      />
                    </Field>
                  )}
                  <Field label="Read Time" htmlFor="read_time">
                    <input
                      id="read_time"
                      value={form.read_time}
                      onChange={(e) => change("read_time", e.target.value)}
                      className={inputClass}
                      placeholder="15 min read"
                    />
                  </Field>
                  <Field label="Published At" htmlFor="published_at">
                    <input
                      id="published_at"
                      type="date"
                      value={form.published_at}
                      onChange={(e) => change("published_at", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                {/* Image URL and Upload */}
                <Field label="Image URL" htmlFor="image">
                  <div className="space-y-2">
                    <input
                      id="image"
                      value={form.image}
                      onChange={(e) => change("image", e.target.value)}
                      className={inputClass}
                      placeholder="/images/kubernetes.svg"
                    />
                    <MediaUploader
                      onUploadSuccess={handleMediaUpload}
                      buttonText="Upload Image"
                      accept="image/*"
                      maxSizeMB={10}
                    />
                  </div>
                </Field>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => change("is_published", e.target.checked)}
                      className="w-4 h-4 text-stone-950 border-gray-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Published
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => change("featured", e.target.checked)}
                      className="w-4 h-4 text-stone-950 border-gray-300 rounded focus:ring-stone-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured
                    </span>
                  </label>
                </div>

                <Field label="Description *" htmlFor="description">
                  <textarea
                    id="description"
                    required
                    rows={2}
                    value={form.description}
                    onChange={(e) => change("description", e.target.value)}
                    className={inputClass}
                    placeholder="Short description shown on resource cards"
                  />
                </Field>

                <Field label="Content (Markdown) *" htmlFor="content">
                  <textarea
                    id="content"
                    required
                    rows={14}
                    value={form.content}
                    onChange={(e) => change("content", e.target.value)}
                    className={`${inputClass} font-mono text-sm`}
                    placeholder="## Introduction&#10;&#10;Write your markdown content here..."
                  />
                </Field>

                {feedback && (
                  <div
                    className={`p-4 rounded-lg text-sm ${
                      feedback.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {feedback.msg}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium rounded-lg transition-colors"
                  >
                    {saving ? "Saving..." : editing ? "Update Article" : "Create Article"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <PreviewMode form={form} />
            )}
          </div>
        )}

        {/* Resource List */}
        {!showForm && (
          <>
            {loading ? (
              <div className="text-center py-20 text-gray-500">Loading resources...</div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                {searchQuery || filterType !== "all"
                  ? "No articles match your search/filter"
                  : 'No articles yet. Click "New Article" to create one.'}
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-3">
                {filteredResources.length > 0 && (
                  <div className="flex items-center gap-3 px-5 py-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={selectedResources.size === filteredResources.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-stone-950 border-gray-300 rounded focus:ring-stone-500"
                    />
                    <span>Select All</span>
                  </div>
                )}
                {filteredResources.map((r) => (
                  <ResourceListItem
                    key={r.id}
                    resource={r}
                    selected={selectedResources.has(r.id)}
                    onToggleSelect={() => toggleSelect(r.id)}
                    onEdit={() => openEdit(r)}
                    onDelete={() => setDeleteConfirm(r.id)}
                    deleteConfirm={deleteConfirm === r.id}
                    onConfirmDelete={() => handleDelete(r.id)}
                    onCancelDelete={() => setDeleteConfirm(null)}
                  />
                ))}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((r) => (
                  <ResourceGridItem
                    key={r.id}
                    resource={r}
                    selected={selectedResources.has(r.id)}
                    onToggleSelect={() => toggleSelect(r.id)}
                    onEdit={() => openEdit(r)}
                    onDelete={() => setDeleteConfirm(r.id)}
                    deleteConfirm={deleteConfirm === r.id}
                    onConfirmDelete={() => handleDelete(r.id)}
                    onCancelDelete={() => setDeleteConfirm(null)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredResources.map((r) => (
                  <AnalyticsCard key={r.id} resource={r} stats={analytics[r.id]} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`text-4xl ${colors[color as keyof typeof colors]}`}>{icon}</div>
      </div>
    </div>
  );
}

function ResourceListItem({
  resource: r,
  selected,
  onToggleSelect,
  onEdit,
  onDelete,
  deleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: {
  resource: Resource;
  selected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resourceUrl = `${appUrl}/resources/${r.slug}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        className="w-4 h-4 text-stone-950 border-gray-300 rounded focus:ring-stone-500 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {!r.is_published && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400">
              DRAFT
            </span>
          )}
          {r.featured && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
              ⭐ FEATURED
            </span>
          )}
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              r.type === "paid"
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            }`}
          >
            {r.type === "paid" ? `PRO $${r.price}` : "FREE"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{r.category}</span>
          <span className="text-xs text-gray-400">{r.read_time}</span>
          <span className="text-xs text-gray-400">👁️ {r.views || 0}</span>
        </div>
        <p className="font-semibold text-gray-900 dark:text-white truncate">{r.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">/resources/{r.slug}</p>
        <div className="mt-2">
          <ShareButtons url={resourceUrl} title={r.title} description={r.description} resourceId={r.id} className="scale-75 origin-left" />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="px-3 py-1.5 text-sm text-stone-950 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900/20 transition-colors"
        >
          Edit
        </button>
        {deleteConfirm ? (
          <>
            <button
              onClick={onConfirmDelete}
              className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={onCancelDelete}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function ResourceGridItem({
  resource: r,
  selected,
  onToggleSelect,
  onEdit,
  onDelete,
  deleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: {
  resource: Resource;
  selected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 relative">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        className="absolute top-4 right-4 w-4 h-4 text-stone-950 border-gray-300 rounded focus:ring-stone-500"
      />
      <div className="mb-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {!r.is_published && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400">
              DRAFT
            </span>
          )}
          {r.featured && <span className="text-xs">⭐</span>}
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              r.type === "paid"
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            }`}
          >
            {r.type === "paid" ? `$${r.price}` : "FREE"}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{r.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{r.category} • {r.read_time} • {r.views || 0} views</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{r.description}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-1.5 text-sm text-stone-950 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900/20 transition-colors"
        >
          Edit
        </button>
        {deleteConfirm ? (
          <>
            <button
              onClick={onConfirmDelete}
              className="flex-1 px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={onCancelDelete}
              className="flex-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function AnalyticsCard({ resource: r, stats }: { resource: Resource; stats?: ResourceStats }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{r.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{r.category}</p>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            r.type === "paid"
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          }`}
        >
          {r.type === "paid" ? `$${r.price}` : "FREE"}
        </span>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Number(stats.views_count) || r.views || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Shares</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Number(stats.shares_count) || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Facebook</p>
            <p className="text-2xl font-bold text-blue-600">{Number(stats.facebook_shares) || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">LinkedIn</p>
            <p className="text-2xl font-bold text-blue-700">{Number(stats.linkedin_shares) || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Twitter</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Number(stats.twitter_shares) || 0}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Loading analytics...</p>
      )}
    </div>
  );
}

function PreviewMode({ form }: { form: FormData }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>{form.title || "Untitled"}</h1>
      <p className="text-gray-600 dark:text-gray-400">{form.description || "No description"}</p>
      <div className="flex gap-2 my-4">
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{form.category || "Uncategorized"}</span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{form.type}</span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{form.read_time}</span>
      </div>
      {form.image && <img src={form.image} alt={form.title} className="w-full rounded-lg" />}
      <div className="whitespace-pre-wrap">{form.content || "No content yet"}</div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
