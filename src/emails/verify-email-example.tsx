import * as React from "react";
import { VerifyEmailEmail } from "./templates/verify-email";
import type { VerifyEmailData } from "./types";

// Example data for testing the verify email template
const sampleData: VerifyEmailData = {
  verificationUrl: "https://yourapp.com/verify-email?token=abc123xyz789",
  userEmail: "newuser@example.com",
  userName: "John Doe",
  companyName: "Your Company",
  supportEmail: "support@yourcompany.com",
};

export default function VerifyEmailExample() {
  return <VerifyEmailEmail data={sampleData} />;
}