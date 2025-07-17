import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailFooter } from "../components";
import type { AccountDeletedData } from "../types";

interface AccountDeletedProps {
  data: AccountDeletedData;
}

export const AccountDeletedEmail: React.FC<AccountDeletedProps> = ({
  data,
}) => {
  const { userEmail, userName, deletionDate, companyName, supportEmail } = data;

  return (
    <EmailLayout preview="Your account has been deleted">
      <EmailHeader
        title="Account Deletion Confirmed"
        subtitle="Your account has been permanently deleted"
      />

      <Section style={section}>
        <Text style={text}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={text}>
          This email confirms that your account ({userEmail}) was permanently deleted on {deletionDate}.
        </Text>

        <Section style={confirmationSection}>
          <Text style={confirmationTitle}>
            ✓ <strong>Deletion Complete</strong>
          </Text>
          <Text style={confirmationText}>
            The following data has been permanently removed:
          </Text>
          <Text style={bulletText}>• Your profile and personal information</Text>
          <Text style={bulletText}>• Your account settings and preferences</Text>
          <Text style={bulletText}>• Your saved data and content</Text>
          <Text style={bulletText}>• Access credentials and login information</Text>
        </Section>

        <Section style={retentionSection}>
          <Text style={retentionTitle}>
            <strong>Data Retention Policy</strong>
          </Text>
          <Text style={retentionText}>
            As required by law, we will retain your order history and transaction records
            for 3 years from the deletion date. This data is stored securely and is not
            accessible through any user interface.
          </Text>
          <Text style={retentionText}>
            After the 3-year retention period, all remaining data will be permanently purged
            from our systems.
          </Text>
        </Section>

        <Text style={recoveryText}>
          <strong>Important:</strong> Account deletion is irreversible. Your data cannot be
          recovered, and you cannot reactivate this account.
        </Text>

        <Text style={text}>
          If you wish to use our services again in the future, you will need to create
          a new account with a different email address.
        </Text>

        <Section style={supportSection}>
          <Text style={supportTitle}>
            <strong>Need Help?</strong>
          </Text>
          <Text style={supportText}>
            If you have questions about this deletion or our data retention policies,
            please contact our support team at{" "}
            <a href={`mailto:${supportEmail}`} style={link}>
              {supportEmail}
            </a>
          </Text>
          <Text style={supportText}>
            Please note that we cannot restore deleted accounts, but we&apos;re happy to
            answer any questions about our policies or help you with creating a new account.
          </Text>
        </Section>

        <Text style={text}>
          Thank you for being part of our community. We&apos;re sorry to see you go.
        </Text>
      </Section>

      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};

export default AccountDeletedEmail;

const section = {
  padding: "24px 0",
};

const confirmationSection = {
  backgroundColor: "#f0f9ff",
  border: "2px solid #bae6fd",
  padding: "16px",
  borderRadius: "6px",
  margin: "16px 0",
};

const retentionSection = {
  backgroundColor: "#fffbeb",
  border: "1px solid #fed7aa",
  padding: "16px",
  borderRadius: "6px",
  margin: "16px 0",
};

const supportSection = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  padding: "16px",
  borderRadius: "6px",
  margin: "16px 0",
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px 0",
};

const confirmationTitle = {
  color: "#1e40af",
  fontSize: "18px",
  lineHeight: "1.4",
  margin: "0 0 12px 0",
};

const confirmationText = {
  color: "#1e40af",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const bulletText = {
  color: "#1e40af",
  fontSize: "14px",
  lineHeight: "1.4",
  margin: "0 0 4px 0",
  paddingLeft: "8px",
};

const retentionTitle = {
  color: "#d97706",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const retentionText = {
  color: "#d97706",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const recoveryText = {
  color: "#dc2626",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "16px 0",
  backgroundColor: "#fef2f2",
  padding: "12px",
  borderRadius: "4px",
};

const supportTitle = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const supportText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const link = {
  color: "#1e40af",
  textDecoration: "underline",
};