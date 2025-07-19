import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { AddUserDialog } from "@/components/dashboard/add-user-dialog";
import { UserSearch } from "@/components/dashboard/user-search";
import { UserActions } from "@/components/dashboard/user-actions";
import { db } from "@/db";
import { authschema } from "@/db/schema";
import { desc, ilike, or, count } from "drizzle-orm";

interface SearchParams {
    search?: string;
    page?: string;
}

async function getUsersData(searchParams: SearchParams) {
    const search = searchParams.search || "";
    const page = parseInt(searchParams.page || "1", 10);
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const searchCondition = search
            ? or(ilike(authschema.user.name, `%${search}%`), ilike(authschema.user.email, `%${search}%`))
            : undefined;

        const usersList = await db
            .select({
                id: authschema.user.id,
                name: authschema.user.name,
                email: authschema.user.email,
                image: authschema.user.image,
                role: authschema.user.role,
                emailVerified: authschema.user.emailVerified,
                banned: authschema.user.banned,
                createdAt: authschema.user.createdAt,
            })
            .from(authschema.user)
            .where(searchCondition)
            .orderBy(desc(authschema.user.createdAt))
            .limit(limit)
            .offset(offset);

        const totalResult = await db
            .select({ count: count() })
            .from(authschema.user)
            .where(searchCondition);

        const total = totalResult[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);

        return {
            users: usersList,
            pagination: {
                page,
                totalPages,
                total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return {
            users: [],
            pagination: {
                page: 1,
                totalPages: 1,
                total: 0,
                hasNext: false,
                hasPrev: false,
            },
        };
    }
}

function UsersTableSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 w-48 bg-gray-300 animate-pulse" />
                        <div className="h-3 w-64 bg-gray-300 animate-pulse" />
                    </div>
                    <div className="h-6 w-16 bg-gray-300 animate-pulse" />
                    <div className="h-6 w-20 bg-gray-300 animate-pulse" />
                    <div className="h-8 w-8 bg-gray-300 animate-pulse" />
                </div>
            ))}
        </div>
    );
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

function getInitials(name: string | null) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

async function UsersTable({ searchParams }: { searchParams: SearchParams }) {
    const { users: usersList, pagination } = await getUsersData(searchParams);

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usersList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No customers found
                            </TableCell>
                        </TableRow>
                    ) : (
                        usersList.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.image || undefined} alt={user.name || user.email || ""} />
                                            <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.name || "No name"}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.role === "admin" ? (
                                        <Badge variant="secondary">
                                            <Shield className="w-3 h-3 mr-1" />
                                            Admin
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Customer</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        {user.banned ? (
                                            <Badge variant="destructive">
                                                <XCircle className="w-3 h-3 mr-1" />
                                                Banned
                                            </Badge>
                                        ) : user.emailVerified ? (
                                            <Badge variant="default">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Unverified
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                                <TableCell>
                                    <UserActions user={user} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * 10 + 1} to {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} customers
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled={!pagination.hasPrev}>
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === pagination.page ? "default" : "outline"}
                                        size="sm"
                                        className="w-8 h-8 p-0"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button variant="outline" size="sm" disabled={!pagination.hasNext}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
    // Await the promise to get the actual searchParams object
    const resolvedSearchParams = searchParams ? await searchParams : {};
    // normalize searchParams from Next.js to your SearchParams type
    const safeSearchParams: SearchParams = {
        search: typeof resolvedSearchParams?.search === "string" ? resolvedSearchParams.search : "",
        page: typeof resolvedSearchParams?.page === "string" ? resolvedSearchParams.page : "1",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
                    <p className="text-muted-foreground">Manage customer accounts and information</p>
                </div>
                <AddUserDialog />
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Search Customers</CardTitle>
                    <CardDescription>Find customers by name or email address</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserSearch />
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>A list of all registered customers</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<UsersTableSkeleton />}>
                        <UsersTable searchParams={safeSearchParams} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
