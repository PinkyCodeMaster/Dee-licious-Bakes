import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Activity, Shield, AlertTriangle } from "lucide-react";
import { sql, count, desc, gte } from "drizzle-orm";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { authschema } from "@/db/schema";
import { Suspense } from "react";
import { db } from "@/db";

async function getAdminStats() {
    try {
        // Get total users
        const totalUsers = await db.select({ count: count() }).from(authschema.user);

        // Get verified users
        const verifiedUsers = await db
            .select({ count: count() })
            .from(authschema.user)
            .where(sql`${authschema.user.emailVerified} IS NOT NULL`);

        // Get banned users
        const bannedUsers = await db
            .select({ count: count() })
            .from(authschema.user)
            .where(sql`${authschema.user.banned} = true`);

        // Get active sessions (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const activeSessions = await db
            .select({ count: count() })
            .from(authschema.session)
            .where(gte(authschema.session.expiresAt, oneDayAgo));

        // Get recent users (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentUsers = await db
            .select({ count: count() })
            .from(authschema.user)
            .where(gte(authschema.user.createdAt, sevenDaysAgo));

        // Get latest users
        const latestUsers = await db
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
            totalUsers: totalUsers[0]?.count || 0,
            verifiedUsers: verifiedUsers[0]?.count || 0,
            bannedUsers: bannedUsers[0]?.count || 0,
            activeSessions: activeSessions[0]?.count || 0,
            recentUsers: recentUsers[0]?.count || 0,
            latestUsers
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return {
            totalUsers: 0,
            verifiedUsers: 0,
            bannedUsers: 0,
            activeSessions: 0,
            recentUsers: 0,
            latestUsers: []
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

    const verificationRate = stats.totalUsers > 0
        ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100)
        : 0;

    return (
        <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{stats.recentUsers} this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.verifiedUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {verificationRate}% verification rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeSessions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{stats.bannedUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>
                        Latest user registrations and their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {stats.latestUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No users found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.latestUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                            <span className="text-sm font-medium">
                                                {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.name || "No name"}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {user.banned && (
                                            <Badge variant="destructive" className="text-xs">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Banned
                                            </Badge>
                                        )}
                                        {user.role === 'admin' && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Admin
                                            </Badge>
                                        )}
                                        <Badge variant={user.emailVerified ? "default" : "outline"} className="text-xs">
                                            {user.emailVerified ? "Verified" : "Unverified"}
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
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your application&apos;s users and activity
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