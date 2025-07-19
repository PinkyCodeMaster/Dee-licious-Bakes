import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, ShoppingBag, Activity, Shield, AlertTriangle, CakeSlice } from "lucide-react";
import { sql, count, desc, gte } from "drizzle-orm";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { authschema, ordersschema } from "@/db/schema";
import { Suspense } from "react";
import { db } from "@/db";

async function getAdminStats() {
    try {
        // Get total customers
        const totalCustomers = await db.select({ count: count() }).from(authschema.user);

        // Get verified customers
        const verifiedCustomers = await db
            .select({ count: count() })
            .from(authschema.user)
            .where(sql`${authschema.user.emailVerified} IS NOT NULL`);

        // Get total orders
        const totalOrders = await db.select({ count: count() }).from(ordersschema.orders);

        // Get recent orders (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentOrders = await db
            .select({ count: count() })
            .from(ordersschema.orders)
            .where(gte(ordersschema.orders.createdAt, sevenDaysAgo));

        // Get new customers (last 7 days)
        const newCustomers = await db
            .select({ count: count() })
            .from(authschema.user)
            .where(gte(authschema.user.createdAt, sevenDaysAgo));

        // Get latest customers
        const latestCustomers = await db
            .select({
                id: authschema.user.id,
                name: authschema.user.name,
                email: authschema.user.email,
                createdAt: authschema.user.createdAt,
                emailVerified: authschema.user.emailVerified,
                banned: authschema.user.banned,
                role: authschema.user.role
            })
            .from(authschema.user)
            .orderBy(desc(authschema.user.createdAt))
            .limit(5);

        return {
            totalCustomers: totalCustomers[0]?.count || 0,
            verifiedCustomers: verifiedCustomers[0]?.count || 0,
            totalOrders: totalOrders[0]?.count || 0,
            recentOrders: recentOrders[0]?.count || 0,
            newCustomers: newCustomers[0]?.count || 0,
            latestCustomers
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return {
            totalCustomers: 0,
            verifiedCustomers: 0,
            totalOrders: 0,
            recentOrders: 0,
            newCustomers: 0,
            latestCustomers: []
        };
    }
}

function StatsCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    );
}

function RecentUsersTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-32 mb-1" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </div>
                            <Skeleton className="h-5 w-16" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

async function AdminStats() {
    const stats = await getAdminStats();

    const verificationRate = stats.totalCustomers > 0
        ? Math.round((stats.verifiedCustomers / stats.totalCustomers) * 100)
        : 0;

    return (
        <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{stats.newCustomers} this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Verified Customers</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.verifiedCustomers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {verificationRate}% verification rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                        <CakeSlice className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recentOrders.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            This week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Customers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Customers</CardTitle>
                    <CardDescription>
                        Latest customer registrations and their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {stats.latestCustomers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No customers found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.latestCustomers.map((customer) => (
                                <div key={customer.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                            <span className="text-sm font-medium">
                                                {customer.name?.charAt(0)?.toUpperCase() || customer.email.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{customer.name || "No name"}</p>
                                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {customer.banned && (
                                            <Badge variant="destructive" className="text-xs">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Banned
                                            </Badge>
                                        )}
                                        {customer.role === 'admin' && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Admin
                                            </Badge>
                                        )}
                                        <Badge variant={customer.emailVerified ? "default" : "outline"} className="text-xs">
                                            {customer.emailVerified ? "Verified" : "Unverified"}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bakery Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your bakery&apos;s customers and orders
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                        </div>
                        <RecentUsersTableSkeleton />
                    </div>
                }
            >
                <AdminStats />
            </Suspense>
        </div>
    );
}