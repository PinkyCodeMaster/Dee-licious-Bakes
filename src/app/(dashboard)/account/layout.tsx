import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AccountSidebar } from "@/components/dashboard/account-sidebar";

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