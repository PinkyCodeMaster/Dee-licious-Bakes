import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AccountSidebar } from "@/components/dashboard/account-sidebar";
import { BAKERY_META } from "@/lib/constants/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: `My Account | ${BAKERY_META.title}`,
    template: `%s | ${BAKERY_META.title}`,
  },
  description: `Manage your ${BAKERY_META.title} account, view orders, and update your preferences.`,
};

export default async function AccountLayout({ children, }: { children: React.ReactNode; }) {
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

    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <AccountSidebar user={session.user} />
                <main className="flex-1 lg:ml-64">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}