"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { Menu, User, Settings, LogOut, MessageSquare, Shield, Home, X, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    emailVerified: boolean;
    role?: string;
}

interface SiteHeaderProps {
    hideOnLanding?: boolean;
}

export function SiteHeader({ hideOnLanding = false }: SiteHeaderProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const { data } = await authClient.getSession();
            if (data?.user) {
                setUser(data.user as User);
            }
        } catch (error) {
            console.error("Failed to check auth status:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            setUser(null);
            toast.success("Signed out successfully");
            router.push("/");
        } catch (error) {
            toast.error("Failed to sign out");
            console.error("Sign out error:", error);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const navigationItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/about", label: "About", icon: Info }
    ];

    const userMenuItems = user ? [
        { href: "/account", label: "Account", icon: User },
        { href: "/account/profile", label: "Profile", icon: Settings },
        { href: "/account/messages", label: "Messages", icon: MessageSquare },
        ...(user.role === "admin" ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
    ] : [];

    if (hideOnLanding) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">A</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block">My App</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth Section */}
                <div className="hidden md:flex items-center space-x-4">
                    <ModeToggle />

                    {loading ? (
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image} alt={user.name} />
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {userMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <DropdownMenuItem key={item.href} asChild>
                                            <Link href={item.href} className="flex items-center">
                                                <Icon className="mr-2 h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" asChild>
                                <Link href="/login">Sign in</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden items-center space-x-2">
                    <ModeToggle />

                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle className="flex items-center justify-between">
                                    <span>Menu</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </SheetTitle>
                                <SheetDescription>
                                    Navigate through the application
                                </SheetDescription>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                                {/* User Info */}
                                {user && (
                                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.image} alt={user.name} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <nav className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground px-3">Navigation</h3>
                                    {navigationItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="text-sm">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* User Menu */}
                                {user ? (
                                    <nav className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground px-3">Account</h3>
                                        {userMenuItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    <span className="text-sm">{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors w-full text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span className="text-sm">Sign out</span>
                                        </button>
                                    </nav>
                                ) : (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground px-3">Authentication</h3>
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            <span className="text-sm">Sign in</span>
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            <span className="text-sm">Sign up</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}