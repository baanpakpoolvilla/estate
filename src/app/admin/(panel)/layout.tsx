import { isAdminEmail } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (process.env.NODE_ENV === "development") {
    const store = await cookies();
    if (store.get("adminDevBypass")?.value === "1") {
      return (
        <div className="w-full min-w-0 flex flex-col md:flex-row gap-4 md:gap-6">
          <AdminSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      );
    }
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    if (!isAdminEmail(user.email ?? undefined))
      redirect("/admin/login?error=unauthorized");
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className="w-full min-w-0 flex flex-col md:flex-row gap-4 md:gap-6">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

