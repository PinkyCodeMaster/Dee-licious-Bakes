import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CreditCard, 
  MessageSquare, 
  ShoppingBag,
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";

export default async function AccountOverviewPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return null; // This should be handled by middleware
  }

  const user = session.user;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update your personal information",
      href: "/account/profile",
      icon: User,
      color: "bg-blue-500"
    },
    {
      title: "View Messages",
      description: "Check your recent messages",
      href: "/account/messages",
      icon: MessageSquare,
      color: "bg-green-500"
    },
    {
      title: "Order History",
      description: "View your past orders",
      href: "/account/orders",
      icon: ShoppingBag,
      color: "bg-purple-500"
    },
    {
      title: "Subscriptions",
      description: "Manage your subscriptions",
      href: "/account/subscriptions",
      icon: CreditCard,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Overview</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      {/* Account Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-gray-600 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={user.emailVerified ? "default" : "destructive"}>
                  {user.emailVerified ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {user.emailVerified ? "Email Verified" : "Email Not Verified"}
                </Badge>
                
                {user.role && (
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                )}
                
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  Member since {formatDate(user.createdAt)}
                </Badge>
              </div>

              {!user.emailVerified && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Please verify your email address to access all features.{" "}
                    <Link href="/verify-email" className="font-medium underline">
                      Verify now
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link href={action.href}>
                    Go to {action.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent account activity and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity to display</p>
            <p className="text-sm">Your account activity will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}