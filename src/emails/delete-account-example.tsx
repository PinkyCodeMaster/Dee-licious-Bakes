import * as React from "react";
import { DeleteAccountEmail } from "./templates/delete-account";
import type { DeleteAccountData } from "./types";

// Example data for testing the delete account template
const sampleData: DeleteAccountData = {
  confirmationUrl: "https://yourapp.com/confirm-delete-account?token=abc123xyz789",
  userEmail: "user@example.com",
  userName: "John Doe",
  companyName: "Your Company",
  supportEmail: "support@yourcompany.com",
};

export default function DeleteAccountExample() {
  return <DeleteAccountEmail data={sampleData} />;
}