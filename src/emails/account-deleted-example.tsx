import * as React from "react";
import { AccountDeletedEmail } from "./templates/account-deleted";
import type { AccountDeletedData } from "./types";

// Example data for testing the account deleted template
const sampleData: AccountDeletedData = {
  userEmail: "user@example.com",
  userName: "John Doe",
  deletionDate: "January 15, 2025",
  companyName: "Your Company",
  supportEmail: "support@yourcompany.com",
};

export default function AccountDeletedExample() {
  return <AccountDeletedEmail data={sampleData} />;
}