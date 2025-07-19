"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { FormField } from "@/components/auth/form-field";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: resetError } = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password"
      });

      if (resetError) {
        setError(resetError.message || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            If you don&apos;t see the email in your inbox, please check your spam folder.
            The reset link will expire in 1 hour.
          </AlertDescription>
        </Alert>

        <div className="text-sm">
          <p>
            Remember your password?{" "}
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

  return (
    <AuthForm
      title="Reset your bakery account password"
      description="Enter your email address and we'll send you a link to reset your Dee-licious Bakes account password"
      onSubmit={handleSubmit}
      submitText="Send reset link"
      isLoading={isLoading}
      error={error}
      footer={
        <div className="space-y-2">
          <p>
            Remember your password?{" "}
            <Link 
              href="/login" 
              className="font-medium text-primary hover:underline"
            >
              Back to login
            </Link>
          </p>
          <p>
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      }
    >
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={handleInputChange}
        required
      />
    </AuthForm>
  );
}