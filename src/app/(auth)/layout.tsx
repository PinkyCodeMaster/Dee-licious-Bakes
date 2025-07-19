import { BAKERY_NAME, BAKERY_META } from "@/lib/constants/brand";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { Cake } from "lucide-react";
import { auth } from "@/lib/auth";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: `Account | ${BAKERY_META.title}`,
    template: `%s | ${BAKERY_META.title}`,
  },
  description: `Access your ${BAKERY_NAME} account to manage orders, view messages, and update your profile.`,
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is already authenticated
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Redirect authenticated users to their dashboard
  if (session && !session.user.banned) {
    const isAdmin = session.user.role === 'admin' ||
      (Array.isArray(session.user.role) && session.user.role.includes('admin'));
    const redirectUrl = isAdmin ? '/admin' : '/account';
    redirect(redirectUrl);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href='/' className="flex flex-col items-center space-y-2">
              <div className="h-12 w-12 rounded-lg bg-pink-500 flex items-center justify-center">
                <Cake className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">{BAKERY_NAME}</h1>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome to your bakery account
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}