import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BAKERY_EMAIL } from "@/lib/constants/brand";
import { ShieldX, Mail, Clock } from "lucide-react";
import Link from "next/link";

export default async function BannedPage() {
  // Get session to check ban details
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Redirect if user is not banned
  if (!session?.user?.banned) {
    redirect("/login");
  }

  const user = session.user;
  const banExpires = user.banExpires ? new Date(user.banExpires) : null;
  const isTemporaryBan = banExpires && banExpires > new Date();
  const banReason = user.banReason || "Violation of terms of service";

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ShieldX className="h-16 w-16 mx-auto text-red-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Account Suspended</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your account has been temporarily suspended
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-700">
              {isTemporaryBan ? "Temporary Suspension" : "Account Suspended"}
            </CardTitle>
            <CardDescription className="text-center">
              Your account access has been restricted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <ShieldX className="h-4 w-4" />
              <AlertDescription>
                <strong>Reason:</strong> {banReason}
              </AlertDescription>
            </Alert>

            {isTemporaryBan && banExpires && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Suspension expires:</strong><br />
                  {formatDate(banExpires)}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <h3 className="font-semibold mb-2">What this means:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>You cannot access your account or dashboard</li>
                  <li>All account features are temporarily disabled</li>
                  {isTemporaryBan ? (
                    <li>Your access will be restored automatically when the suspension expires</li>
                  ) : (
                    <li>This suspension requires manual review</li>
                  )}
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <h3 className="font-semibold mb-2">Need help?</h3>
                <p>
                  If you believe this suspension was made in error or would like to appeal, 
                  please contact our support team.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <Link href={`mailto:${BAKERY_EMAIL}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              
              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-primary hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>
            By using our service, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}