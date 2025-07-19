import { z } from "zod";

// Email subscription validation schema
export const subscribeEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email address is too long"),
  firstName: z
    .string()
    .max(100, "First name is too long")
    .optional(),
  source: z
    .enum(['hero', 'inline', 'footer', 'popup'])
    .default('hero')
    .optional(),
});

// Unsubscribe validation schema
export const unsubscribeEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email address is too long")
    .optional(),
  token: z
    .string()
    .min(1, "Unsubscribe token is required")
    .optional(),
}).refine(data => data.email || data.token, {
  message: "Either email or unsubscribe token is required",
});

// API response types
export type SubscribeResponse = {
  success: boolean;
  message: string;
  contactId?: string;
};

export type UnsubscribeResponse = {
  success: boolean;
  message: string;
};