import * as React from "react";
import { ResetPasswordEmail } from "./templates/reset-password";
import type { ResetPasswordEmailData } from "./types";

// Example data for testing the reset password email template
const sampleData: ResetPasswordEmailData = {
  resetUrl: "https://yourapp.com/reset-password?token=abc123xyz789",
  userEmail: "user@example.com",
  expirationTime: "24 hours",
  companyName: "Your Company",
  supportEmail: "support@yourcompany.com",
};

export default function ResetPasswordExample() {
  return <ResetPasswordEmail data={sampleData} />;
}