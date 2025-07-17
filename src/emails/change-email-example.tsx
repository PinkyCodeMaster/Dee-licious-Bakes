import * as React from "react";
import { ChangeEmailEmail } from "./templates/change-email";
import type { ChangeEmailData } from "./types";

// Example data for testing the change email template
const sampleData: ChangeEmailData = {
  approvalUrl: "https://yourapp.com/approve-email-change?token=abc123xyz789",
  oldEmail: "user@example.com",
  newEmail: "newemail@example.com",
  userName: "John Doe",
  companyName: "Your Company",
  supportEmail: "support@yourcompany.com",
};

export default function ChangeEmailExample() {
  return <ChangeEmailEmail data={sampleData} />;
}