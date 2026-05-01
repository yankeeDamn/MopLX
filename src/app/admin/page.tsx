"use client";
import dynamic from "next/dynamic";

const EnhancedAdminDashboard = dynamic(() => import("./EnhancedAdminDashboard"), { ssr: false });

export default function AdminPage() {
  return <EnhancedAdminDashboard />;
}
