"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Resource } from "@/types/database";
import { useRouter } from "next/navigation";

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
};

// ─── Admin Page ───────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Auth gate — redirect if not logged in or not admin
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (!data.user || (adminEmail && data.user.email !== adminEmail)) {
        router.replace("/signin?error=unauthorized");
      }
    });
  }, [router, supabase]);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("published_at", { ascending: false });
    if (!error) setResources((data ?? []) as Resource[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResources();
  }, [fetchResources]);

  // ─── Form helpers ─────────────────────────────────────────
  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setFeedback(null);
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
    });
    setShowForm(true);
    setFeedback(null);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFeedback(null);
  }

  function change(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // ─── Save (create or update) ──────────────────────────────
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
    };

    let error;
    if (editing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ error } = await (supabase.from("resources") as any).update(payload).eq("id", editing.id));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ error } = await (supabase.from("resources") as any).insert(payload));
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

  // ─── Delete ───────────────────────────────────────────────
  async function handleDelete(id: string) {
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) {
      setFeedback({ type: "error", msg: error.message });
    } else {
      setDeleteConfirm(null);
      await fetchResources();
    }
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin — Resources</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Create, edit, and delete learning resources.</p>
          </div>
          {!showForm && (
            <button
              onClick={openNew}
              className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors"
            >
              + New Resource
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {editing ? `Edit: ${editing.title}` : "New Resource"}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Title *" htmlFor="title">
                  <input id="title" required value={form.title} onChange={(e) => change("title", e.target.value)} className={input} placeholder="Kubernetes Fundamentals" />
                </Field>
                <Field label="Slug *" htmlFor="slug">
                  <input id="slug" required value={form.slug} onChange={(e) => change("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} className={input} placeholder="kubernetes-fundamentals" />
                </Field>
                <Field label="Category *" htmlFor="category">
                  <input id="category" required value={form.category} onChange={(e) => change("category", e.target.value)} className={input} placeholder="Kubernetes" />
                </Field>
                <Field label="Type *" htmlFor="type">
                  <select id="type" value={form.type} onChange={(e) => change("type", e.target.value)} className={input}>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </Field>
                {form.type === "paid" && (
                  <Field label="Price (USD) *" htmlFor="price">
                    <input id="price" type="number" min="0" step="0.01" required value={form.price} onChange={(e) => change("price", e.target.value)} className={input} placeholder="49" />
                  </Field>
                )}
                <Field label="Read Time" htmlFor="read_time">
                  <input id="read_time" value={form.read_time} onChange={(e) => change("read_time", e.target.value)} className={input} placeholder="15 min read" />
                </Field>
                <Field label="Published At" htmlFor="published_at">
                  <input id="published_at" type="date" value={form.published_at} onChange={(e) => change("published_at", e.target.value)} className={input} />
                </Field>
                <Field label="Image URL" htmlFor="image">
                  <input id="image" value={form.image} onChange={(e) => change("image", e.target.value)} className={input} placeholder="/images/kubernetes.svg" />
                </Field>
              </div>

              <Field label="Description *" htmlFor="description">
                <textarea id="description" required rows={2} value={form.description} onChange={(e) => change("description", e.target.value)} className={input} placeholder="Short description shown on resource cards" />
              </Field>

              <Field label="Content (Markdown) *" htmlFor="content">
                <textarea id="content" required rows={14} value={form.content} onChange={(e) => change("content", e.target.value)} className={`${input} font-mono text-sm`} placeholder="## Introduction&#10;&#10;Write your markdown content here..." />
              </Field>

              {feedback && (
                <div className={`p-4 rounded-lg text-sm ${feedback.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
                  {feedback.msg}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium rounded-lg transition-colors">
                  {saving ? "Saving..." : editing ? "Update Resource" : "Create Resource"}
                </button>
                <button type="button" onClick={cancelForm} className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resource List */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No resources yet. Click &quot;New Resource&quot; to create one.</div>
        ) : (
          <div className="space-y-3">
            {resources.map((r) => (
              <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.type === "paid" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`}>
                      {r.type === "paid" ? `PRO $${r.price}` : "FREE"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{r.category}</span>
                    <span className="text-xs text-gray-400">{r.read_time}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{r.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">/resources/{r.slug}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(r)} className="px-3 py-1.5 text-sm text-stone-950 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900/20 transition-colors">
                    Edit
                  </button>
                  {deleteConfirm === r.id ? (
                    <>
                      <button onClick={() => handleDelete(r.id)} className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                        Confirm
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setDeleteConfirm(r.id)} className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────
const input =
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
