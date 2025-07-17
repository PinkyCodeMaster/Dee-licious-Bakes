import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href='/'>
          <h1 className="text-3xl font-bold text-foreground">My App</h1>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to your account
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}