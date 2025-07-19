import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { BAKERY_META } from "@/lib/constants/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: `Admin Dashboard | ${BAKERY_META.title}`,
    template: `%s | Admin | ${BAKERY_META.title}`,
  },
  description: `Admin dashboard for ${BAKERY_META.title} - manage users, settings, and bakery operations.`,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Redirect if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Redirect if banned
  if (session.user.banned) {
    redirect("/banned");
  }

  // Redirect if email not verified
  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  // Check if user is admin
  const isAdmin = session.user.role === 'admin' || 
                 (Array.isArray(session.user.role) && session.user.role.includes('admin'));

  // Redirect non-admin users to account dashboard
  if (!isAdmin) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar user={session.user} />
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}