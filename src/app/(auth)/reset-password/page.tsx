"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { FormField } from "@/components/auth/form-field";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const resetToken = searchParams.get("token");
        if (!resetToken) {
            setError("Invalid or missing reset token");
        } else {
            setToken(resetToken);
        }
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user starts typing
        if (error) setError("");
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError("Invalid reset token");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const { error: resetError } = await authClient.resetPassword({
                token,
                newPassword: formData.password
            });

            if (resetError) {
                if (resetError.message?.includes("expired")) {
                    setError("Reset link has expired. Please request a new one.");
                } else if (resetError.message?.includes("invalid")) {
                    setError("Invalid reset link. Please request a new one.");
                } else {
                    setError(resetError.message || "Failed to reset password");
                }
                return;
            }

            setSuccess(true);

            // Redirect to login after successful reset
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Reset password error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Show error state if no token
    if (!token && error) {
        return (
            <div className="text-center space-y-6">
                <div className="space-y-4">
                    <XCircle className="h-12 w-12 mx-auto text-red-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            This password reset link is invalid or has expired.
                        </p>
                    </div>
                </div>

                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>

                <div className="text-sm space-y-2">
                    <p>
                        <Link
                            href="/forgot-password"
                            className="font-medium text-primary hover:underline"
                        >
                            Request a new reset link
                        </Link>
                    </p>
                    <p>
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    // Show success state
    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="space-y-4">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Password reset successful</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Your password has been successfully reset. You can now log in with your new password.
                        </p>
                    </div>
                </div>

                <Alert>
                    <AlertDescription>
                        You&apos;ll be redirected to the login page in a few seconds.
                    </AlertDescription>
                </Alert>

                <div className="text-sm">
                    <Link
                        href="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Continue to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <AuthForm
            title="Set new password"
            description="Enter your new password below"
            onSubmit={handleSubmit}
            submitText="Reset password"
            isLoading={isLoading}
            error={error}
            footer={
                <p>
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Back to login
                    </Link>
                </p>
            }
        >
            <div className="space-y-4">
                <FormField
                    label="New Password"
                    name="password"
                    type="password"
                    placeholder="Enter your new password (min. 8 characters)"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={fieldErrors.password}
                    required
                />

                <FormField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={fieldErrors.confirmPassword}
                    required
                />
            </div>
        </AuthForm>
    );
}