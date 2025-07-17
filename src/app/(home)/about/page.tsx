import { Code2, Database, Globe, Layers, Lock, Mail, CreditCard, Users, Zap, Shield, CheckCircle, Star, ExternalLink, GitBranch, Smartphone, Palette, Settings, Bell, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
    const techStack = [
        {
            category: "Frontend",
            icon: <Globe className="h-5 w-5" />,
            technologies: [
                { name: "Next.js 15", description: "React framework with App Router" },
                { name: "TypeScript", description: "Type-safe JavaScript" },
                { name: "Tailwind CSS", description: "Utility-first CSS framework" },
                { name: "Shadcn/ui", description: "Beautiful UI components" },
                { name: "Lucide React", description: "Beautiful icons" }
            ]
        },
        {
            category: "Backend & Database",
            icon: <Database className="h-5 w-5" />,
            technologies: [
                { name: "Better Auth", description: "Modern authentication solution" },
                { name: "Drizzle ORM", description: "Type-safe database toolkit" },
                { name: "PostgreSQL", description: "Relational database" },
                { name: "Resend", description: "Email delivery service" },
                { name: "UploadThing", description: "File upload service" }
            ]
        },
        {
            category: "Payments & Services",
            icon: <CreditCard className="h-5 w-5" />,
            technologies: [
                { name: "Stripe", description: "Payment processing platform" },
                { name: "Sentry", description: "Error monitoring & performance" }
            ]
        },
        {
            category: "Development & Deployment",
            icon: <Code2 className="h-5 w-5" />,
            technologies: [
                { name: "ESLint", description: "Code linting and formatting" },
                { name: "pnpm", description: "Fast package manager" },
                { name: "Vercel", description: "Deployment platform" }
            ]
        }
    ];

    const features = [
        {
            icon: <Shield className="h-6 w-6 text-blue-500" />,
            title: "Secure Authentication",
            description: "Email/password login, social providers (Google, Facebook, Microsoft), email verification, and password reset functionality."
        },
        {
            icon: <Users className="h-6 w-6 text-green-500" />,
            title: "User Management",
            description: "Complete dashboard for user profiles, account settings, and admin portal with role-based access control."
        },
        {
            icon: <CreditCard className="h-6 w-6 text-purple-500" />,
            title: "Subscription Management",
            description: "Stripe integration for payments, billing management, and customer portal access."
        },
        {
            icon: <Mail className="h-6 w-6 text-orange-500" />,
            title: "Email System",
            description: "Automated email notifications, email verification, password reset emails, and messaging system."
        },
        {
            icon: <Lock className="h-6 w-6 text-red-500" />,
            title: "Security First",
            description: "CSRF protection, secure session management, input validation, and comprehensive error handling."
        },
        {
            icon: <Zap className="h-6 w-6 text-yellow-500" />,
            title: "Modern UI/UX",
            description: "Responsive design, dark/light theme support, accessible components, and smooth user experience."
        }
    ];

    const gettingStarted = [
        {
            step: "1",
            title: "Create Account",
            description: "Sign up with email or use social login (Google, Facebook, Microsoft)"
        },
        {
            step: "2",
            title: "Verify Email",
            description: "Check your inbox and click the verification link to activate your account"
        },
        {
            step: "3",
            title: "Complete Profile",
            description: "Add your personal information and customize your profile settings"
        },
        {
            step: "4",
            title: "Explore Features",
            description: "Access the dashboard, manage your account, and explore available features"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 mb-6">
                        <Star className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Modern Web Application</span>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        About Our Platform
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        A comprehensive authentication and user management system built with modern technologies.
                        Secure, scalable, and user-friendly platform designed for the next generation of web applications.
                    </p>
                </div>

                {/* Architecture Overview */}
                <section className="mb-16">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Layers className="h-6 w-6" />
                                <span>Architecture Overview</span>
                            </CardTitle>
                            <CardDescription>
                                Modern full-stack architecture designed for scalability and maintainability
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Next.js with TypeScript, server-side rendering, and modern React patterns
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Database className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Backend</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        API routes, authentication middleware, and database integrations
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Security</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        End-to-end encryption, secure sessions, input validation, and comprehensive error handling
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Key Features */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Everything you need for a modern web application with user authentication and management
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-3">
                                        {feature.icon}
                                        <span className="text-lg">{feature.title}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Technology Stack</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Built with cutting-edge technologies for optimal performance
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {techStack.map((stack, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        {stack.icon}
                                        <span>{stack.category}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stack.technologies.map((tech, techIndex) => (
                                            <div key={techIndex} className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">{tech.name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{tech.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Getting Started */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Getting Started</h2>
                        <p className="text-gray-600 dark:text-gray-300">Follow these simple steps to get up and running</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {gettingStarted.map((step, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{step.step}</span>
                                    </div>
                                    <CardTitle className="text-lg">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Additional Features */}
                <section className="mb-16">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                        <CardHeader>
                            <CardTitle className="text-center">Additional Features</CardTitle>
                            <CardDescription className="text-center">
                                Comprehensive functionality for modern web applications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex items-center space-x-3">
                                    <Smartphone className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm">Responsive Design</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Palette className="h-5 w-5 text-purple-500" />
                                    <span className="text-sm">Dark/Light Theme</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Settings className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm">Account Settings</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Bell className="h-5 w-5 text-orange-500" />
                                    <span className="text-sm">Email Notifications</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <UserCheck className="h-5 w-5 text-green-500" />
                                    <span className="text-sm">Admin Dashboard</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <GitBranch className="h-5 w-5 text-indigo-500" />
                                    <span className="text-sm">Version Control</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* CTA Section */}
                <section className="text-center">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="pt-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join thousands of users who trust our platform for their authentication and user management needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                                    <Link href="/register">
                                        Get Started Free
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/login">
                                        Sign In
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}