import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { MessageSquare, Search, MoreHorizontal, Eye, Archive, Trash2, AlertTriangle, CheckCircle, Clock, Mail, Users, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { count, desc, eq, like, or, and, ne } from "drizzle-orm";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { authschema } from "@/db/schema";
import { Suspense } from "react";
import { db } from "@/db";

interface SearchParams {
    search?: string;
    status?: string;
    priority?: string;
    type?: string;
    page?: string;
}

async function getMessagesData(searchParams: SearchParams) {
    try {
        const page = parseInt(searchParams.page || "1");
        const limit = 20;
        const offset = (page - 1) * limit;

        // Build where conditions
        const whereConditions = [ne(authschema.message.isDeleted, true)];

        if (searchParams.search) {
            const searchCondition = or(
                like(authschema.message.subject, `%${searchParams.search}%`),
                like(authschema.message.content, `%${searchParams.search}%`),
                like(authschema.message.sender, `%${searchParams.search}%`)
            );
            if (searchCondition) {
                whereConditions.push(searchCondition);
            }
        }

        if (searchParams.status && searchParams.status !== "all") {
            whereConditions.push(eq(authschema.message.status, searchParams.status));
        }

        if (searchParams.priority && searchParams.priority !== "all") {
            whereConditions.push(eq(authschema.message.priority, searchParams.priority));
        }

        if (searchParams.type && searchParams.type !== "all") {
            whereConditions.push(eq(authschema.message.type, searchParams.type));
        }

        // Get messages with user data
        const messages = await db
            .select({
                id: authschema.message.id,
                subject: authschema.message.subject,
                content: authschema.message.content,
                sender: authschema.message.sender,
                senderAvatar: authschema.message.senderAvatar,
                status: authschema.message.status,
                priority: authschema.message.priority,
                type: authschema.message.type,
                createdAt: authschema.message.createdAt,
                updatedAt: authschema.message.updatedAt,
                recipientId: authschema.message.recipientId,
                recipientName: authschema.user.name,
                recipientEmail: authschema.user.email,
                recipientImage: authschema.user.image
            })
            .from(authschema.message)
            .leftJoin(authschema.user, eq(authschema.message.recipientId, authschema.user.id))
            .where(and(...whereConditions))
            .orderBy(desc(authschema.message.createdAt))
            .limit(limit)
            .offset(offset);

        // Get total count for pagination
        const totalCountResult = await db
            .select({ count: count() })
            .from(authschema.message)
            .where(and(...whereConditions));

        const totalCount = totalCountResult[0]?.count || 0;

        // Get stats
        const stats = await Promise.all([
            // Total messages
            db.select({ count: count() }).from(authschema.message).where(ne(authschema.message.isDeleted, true)),
            // Unread messages
            db.select({ count: count() }).from(authschema.message).where(
                and(eq(authschema.message.status, 'unread'), ne(authschema.message.isDeleted, true))
            ),
            // High priority messages
            db.select({ count: count() }).from(authschema.message).where(
                and(eq(authschema.message.priority, 'high'), ne(authschema.message.isDeleted, true))
            ),
            // System messages
            db.select({ count: count() }).from(authschema.message).where(
                and(eq(authschema.message.type, 'system'), ne(authschema.message.isDeleted, true))
            )
        ]);

        return {
            messages,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            stats: {
                total: stats[0][0]?.count || 0,
                unread: stats[1][0]?.count || 0,
                highPriority: stats[2][0]?.count || 0,
                system: stats[3][0]?.count || 0
            }
        };
    } catch (error) {
        console.error("Error fetching messages data:", error);
        return {
            messages: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            stats: {
                total: 0,
                unread: 0,
                highPriority: 0,
                system: 0
            }
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

function MessagesTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function getStatusIcon(status: string) {
    switch (status) {
        case "read":
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "unread":
            return <Mail className="h-4 w-4 text-blue-500" />;
        case "archived":
            return <Archive className="h-4 w-4 text-gray-500" />;
        default:
            return <Clock className="h-4 w-4 text-gray-400" />;
    }
}

function getPriorityBadge(priority: string) {
    switch (priority) {
        case "high":
            return <Badge variant="destructive">High</Badge>;
        case "normal":
            return <Badge variant="secondary">Normal</Badge>;
        case "low":
            return <Badge variant="outline">Low</Badge>;
        default:
            return <Badge variant="outline">Normal</Badge>;
    }
}

function getTypeBadge(type: string) {
    switch (type) {
        case "system":
            return <Badge className="bg-purple-100 text-purple-800">System</Badge>;
        case "admin":
            return <Badge className="bg-orange-100 text-orange-800">Admin</Badge>;
        case "user":
            return <Badge className="bg-blue-100 text-blue-800">User</Badge>;
        default:
            return <Badge variant="outline">User</Badge>;
    }
}

async function MessagesStats({ searchParams }: { searchParams: SearchParams }) {
    const data = await getMessagesData(searchParams);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.stats.total.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        All messages in system
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{data.stats.unread.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Require attention
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{data.stats.highPriority.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Urgent messages
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Messages</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{data.stats.system.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Automated messages
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

async function MessagesTable({ searchParams }: { searchParams: SearchParams }) {
    const data = await getMessagesData(searchParams);

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
            });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit"
            });
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Messages Management</CardTitle>
                        <CardDescription>
                            Manage and moderate all system messages ({data.totalCount} total)
                        </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Compose
                        </Button>
                        <Button variant="outline" size="sm">
                            <Archive className="h-4 w-4 mr-2" />
                            Bulk Actions
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {data.messages.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                        <p className="text-gray-500">
                            {searchParams.search || searchParams.status !== "all" || searchParams.priority !== "all" || searchParams.type !== "all"
                                ? "Try adjusting your filters"
                                : "Messages will appear here when users send them"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${message.status === "unread" ? "bg-blue-50 border-blue-200" : ""
                                    }`}
                            >
                                <Checkbox />

                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(message.status)}
                                </div>

                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.senderAvatar || message.recipientImage || undefined} />
                                    <AvatarFallback className="text-xs">
                                        {message.sender?.charAt(0) || message.recipientName?.charAt(0) || "?"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {message.subject}
                                        </p>
                                        {getPriorityBadge(message.priority)}
                                        {getTypeBadge(message.type)}
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <span>From: {message.sender}</span>
                                        {message.recipientName && (
                                            <>
                                                <span>•</span>
                                                <span>To: {message.recipientName} ({message.recipientEmail})</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate mt-1">
                                        {message.content}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        {formatDate(message.createdAt)}
                                    </p>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark as Read
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Archive className="h-4 w-4 mr-2" />
                                            Archive
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}

                        {/* Pagination */}
                        {data.totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-gray-700">
                                    Showing {((data.currentPage - 1) * 20) + 1} to {Math.min(data.currentPage * 20, data.totalCount)} of {data.totalCount} messages
                                </p>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={data.currentPage <= 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm">
                                        Page {data.currentPage} of {data.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={data.currentPage >= data.totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default async function AdminMessagesPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages Management</h1>
                <p className="text-muted-foreground">
                    Monitor and manage all system messages and user communications
                </p>
            </div>

            {/* Stats Cards */}
            <Suspense
                fallback={
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                    </div>
                }
            >
                <MessagesStats searchParams={searchParams} />
            </Suspense>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search messages, senders, or recipients..."
                                    defaultValue={searchParams.search}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select defaultValue={searchParams.status || "all"}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue={searchParams.priority || "all"}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue={searchParams.type || "all"}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Messages Table */}
            <Suspense fallback={<MessagesTableSkeleton />}>
                <MessagesTable searchParams={searchParams} />
            </Suspense>
        </div>
    );
}