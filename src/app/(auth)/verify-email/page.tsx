"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"pending" | "verifying" | "success" | "error">("pending");
    const [error, setError] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");



    const verifyEmail = useCallback(async (token: string) => {
        setStatus("verifying");
        setError("");

        try {
            const { error: verifyError } = await authClient.verifyEmail({
                query: { token }
            });

            if (verifyError) {
                setStatus("error");
                setError(verifyError.message || "Failed to verify email");
                return;
            }

            setStatus("success");

            // Redirect to dashboard after successful verification
            setTimeout(() => {
                router.push("/account");
            }, 2000);
        } catch (err) {
            setStatus("error");
            setError("An unexpected error occurred during verification");
            console.error("Email verification error:", err);
        }
    }, [router]);

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            verifyEmail(token);
        }
    }, [searchParams, verifyEmail]);

    const handleResendVerification = async () => {
        setIsResending(true);
        setResendMessage("");
        setError("");

        const email = searchParams.get("email");
        
        if (!email) {
            setError("Email address is required to resend verification");
            setIsResending(false);
            return;
        }

        try {
            const { error: resendError } = await authClient.sendVerificationEmail({ 
                email,
                callbackURL: '/login' 
            });

            if (resendError) {
                setError(resendError.message || "Failed to resend verification email");
                return;
            }

            setResendMessage("Verification email sent! Please check your inbox.");
        } catch (err) {
            setError("Failed to resend verification email");
            console.error("Resend verification error:", err);
        } finally {
            setIsResending(false);
        }
    };

    const renderContent = () => {
        switch (status) {
            case "verifying":
                return (
                    <div className="text-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Verifying your email...</h3>
                            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
                        </div>
                    </div>
                );

            case "success":
                return (
                    <div className="text-center space-y-4">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                        <div>
                            <h3 className="text-lg font-semibold text-green-700">Email verified successfully!</h3>
                            <p className="text-muted-foreground">
                                Your email has been verified. You&apos;ll be redirected to your dashboard shortly.
                            </p>
                        </div>
                        <Button onClick={() => router.push("/account")}>
                            Go to Dashboard
                        </Button>
                    </div>
                );

            case "error":
                return (
                    <div className="text-center space-y-4">
                        <XCircle className="h-12 w-12 mx-auto text-red-500" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-700">Verification failed</h3>
                            <p className="text-muted-foreground">
                                The verification link may be expired or invalid.
                            </p>
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Button
                                onClick={handleResendVerification}
                                disabled={isResending}
                                className="w-full"
                            >
                                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Resend verification email
                            </Button>
                            <p className="text-sm">
                                <Link href="/login" className="text-primary hover:underline">
                                    Back to login
                                </Link>
                            </p>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center space-y-4">
                        <Mail className="h-12 w-12 mx-auto text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Check your email</h3>
                            <p className="text-muted-foreground">
                                We&apos;ve sent a verification link to your email address.
                                Click the link to verify your account.
                            </p>
                        </div>

                        {resendMessage && (
                            <Alert>
                                <AlertDescription>{resendMessage}</AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Button
                                onClick={handleResendVerification}
                                disabled={isResending}
                                variant="outline"
                                className="w-full"
                            >
                                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Resend verification email
                            </Button>
                            <p className="text-sm">
                                <Link href="/login" className="text-primary hover:underline">
                                    Back to login
                                </Link>
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle>Email Verification</CardTitle>
                <CardDescription>
                    Verify your email address to complete your account setup
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}