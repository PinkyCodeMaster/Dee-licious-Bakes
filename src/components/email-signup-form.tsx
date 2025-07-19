"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Form validation schema
const emailSignupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email address is too long"),
  firstName: z
    .string()
    .max(100, "First name is too long")
    .optional(),
});

type EmailSignupFormData = z.infer<typeof emailSignupSchema>;

// API response type
interface SubscribeResponse {
  success: boolean;
  message: string;
  contactId?: string;
}

// Component props
interface EmailSignupFormProps {
  variant?: 'hero' | 'inline' | 'footer' | 'card';
  className?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  showFirstName?: boolean;
  onSuccess?: (response: SubscribeResponse) => void;
  onError?: (error: string) => void;
}

export function EmailSignupForm({
  variant = 'hero',
  className,
  title,
  description,
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  showFirstName = false,
  onSuccess,
  onError,
}: EmailSignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmailSignupFormData>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      email: "",
      firstName: "",
    },
  });

  const handleSubmit = async (data: EmailSignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName || undefined,
          source: variant,
        }),
      });

      const result: SubscribeResponse = await response.json();

      if (result.success) {
        setIsSuccess(true);
        form.reset();
        onSuccess?.(result);
      } else {
        setError(result.message);
        onError?.(result.message);
      }
    } catch (error) {
      const errorMessage = 'Failed to subscribe. Please check your connection and try again.';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className={cn(getVariantStyles(variant).container, className)}>
        <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">
            Successfully subscribed! Check your email for confirmation.
          </span>
        </div>
      </div>
    );
  }

  const styles = getVariantStyles(variant);

  // Card variant
  if (variant === 'card') {
    return (
      <Card className={cn(styles.container, className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">
            {title || "Stay Updated"}
          </CardTitle>
          {description && (
            <CardDescription>
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <EmailSignupFormContent
            form={form}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            placeholder={placeholder}
            buttonText={buttonText}
            showFirstName={showFirstName}
            styles={styles}
          />
        </CardContent>
      </Card>
    );
  }

  // Other variants (hero, inline, footer)
  return (
    <div className={cn(styles.container, className)}>
      {(title || description) && (
        <div className="mb-4 text-center">
          {title && (
            <h3 className={styles.title}>
              {title}
            </h3>
          )}
          {description && (
            <p className={styles.description}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <EmailSignupFormContent
        form={form}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        placeholder={placeholder}
        buttonText={buttonText}
        showFirstName={showFirstName}
        styles={styles}
      />
    </div>
  );
}

// Form content component to avoid duplication
interface EmailSignupFormContentProps {
  form: ReturnType<typeof useForm<EmailSignupFormData>>;
  onSubmit: (data: EmailSignupFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  placeholder: string;
  buttonText: string;
  showFirstName: boolean;
  styles: ReturnType<typeof getVariantStyles>;
}

function EmailSignupFormContent({
  form,
  onSubmit,
  isLoading,
  error,
  placeholder,
  buttonText,
  showFirstName,
  styles,
}: EmailSignupFormContentProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className={styles.fields}>
          {showFirstName && (
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First name (optional)"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={showFirstName ? "" : "flex-1"}>
                <FormLabel className="sr-only">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={placeholder}
                      disabled={isLoading}
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Variant-specific styling
function getVariantStyles(variant: EmailSignupFormProps['variant']) {
  const baseStyles = {
    hero: {
      container: "w-full max-w-md mx-auto",
      title: "text-2xl font-bold text-center mb-2",
      description: "text-muted-foreground text-center",
      form: "space-y-4",
      fields: "space-y-4",
      button: "w-full",
    },
    inline: {
      container: "w-full",
      title: "text-lg font-semibold mb-2",
      description: "text-sm text-muted-foreground",
      form: "space-y-3",
      fields: "flex flex-col sm:flex-row gap-3",
      button: "sm:w-auto whitespace-nowrap",
    },
    footer: {
      container: "w-full max-w-sm",
      title: "text-base font-medium mb-2",
      description: "text-xs text-muted-foreground",
      form: "space-y-2",
      fields: "space-y-2",
      button: "w-full text-sm",
    },
    card: {
      container: "w-full max-w-md",
      title: "",
      description: "",
      form: "space-y-4",
      fields: "space-y-4",
      button: "w-full",
    },
  };

  return baseStyles[variant || 'hero'];
}