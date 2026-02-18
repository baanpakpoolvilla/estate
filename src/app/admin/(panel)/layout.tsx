import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-w-0 flex flex-col md:flex-row gap-4 md:gap-6">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}

