import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Image
            className="dark:invert mx-auto"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to My App
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A modern authentication and dashboard system built with Next.js, featuring secure user management and role-based access control.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          <div className="text-center p-6 rounded-lg border">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image
                src="/file.svg"
                alt="Authentication icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Email verification, password reset, and social login support
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg border">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image
                src="/window.svg"
                alt="Dashboard icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">User Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Profile management, account settings, and personalized experience
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg border">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image
                src="/globe.svg"
                alt="Admin icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
            <p className="text-sm text-muted-foreground">
              User management, role assignment, and system administration
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="flex gap-6 flex-wrap items-center justify-center mt-16 pt-8 border-t w-full">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
              className="dark:invert"
            />
            Learn Next.js
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
            href="https://vercel.com/templates?framework=next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
              className="dark:invert"
            />
            Templates
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
              className="dark:invert"
            />
            Next.js →
          </a>
        </footer>
      </div>
    </div>
  );
}
