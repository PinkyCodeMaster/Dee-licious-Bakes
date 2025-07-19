"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { FormField } from "@/components/auth/form-field";
import { SocialProviders } from "@/components/auth/social-providers";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/account"
      });

      if (authError) {
        setError(authError.message || "Invalid email or password");
        return;
      }

      // Redirect will be handled by the auth client callback
      router.push("/account");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthForm
        title="Sign in to your bakery account"
        description="Enter your email and password to access your Dee-licious Bakes account"
        onSubmit={handleSubmit}
        submitText="Sign in"
        isLoading={isLoading}
        error={error}
        footer={
          <div className="space-y-2">
            <p>
              Don&apos;t have an account?{" "}
              <Link 
                href="/register" 
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p>
              <Link 
                href="/forgot-password" 
                className="font-medium text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
      </AuthForm>

      <SocialProviders mode="signin" />
    </div>
  );
}