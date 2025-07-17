import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import type { DeleteAccountData } from "../types";

interface DeleteAccountProps {
  data: DeleteAccountData;
}

export const DeleteAccountEmail: React.FC<DeleteAccountProps> = ({
  data,
}) => {
  const { confirmationUrl, userEmail, userName, companyName, supportEmail } = data;

  return (
    <EmailLayout preview="Confirm account deletion">
      <EmailHeader 
        title="Confirm Account Deletion" 
        subtitle="We received a request to delete your account"
      />
      
      <Section style={section}>
        <Text style={text}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={text}>
          We received a request to permanently delete your account ({userEmail}).
        </Text>
        
        <Section style={warningSection}>
          <Text style={warningTitle}>
            ⚠️ <strong>IMPORTANT: This action cannot be undone</strong>
          </Text>
          <Text style={warningText}>
            Deleting your account will permanently remove:
          </Text>
          <Text style={bulletText}>• Your profile and personal information</Text>
          <Text style={bulletText}>• Your account settings and preferences</Text>
          <Text style={bulletText}>• Your saved data and content</Text>
          <Text style={bulletText}>• Access to all platform features</Text>
        </Section>
        
        <Text style={retentionText}>
          <strong>Data Retention:</strong> Order history and transaction records will be retained 
          for 3 years as required by law, but will not be accessible to you.
        </Text>
        
        <Text style={text}>
          If you&apos;re sure you want to proceed with account deletion, click the button below:
        </Text>
        
        <EmailButton href={confirmationUrl} variant="secondary">
          Confirm Account Deletion
        </EmailButton>
        
        <Text style={securityText}>
          <strong>Security Information:</strong>
        </Text>
        <Text style={smallText}>
          • This confirmation link is secure and unique to your account
        </Text>
        <Text style={smallText}>
          • The deletion will be processed immediately after confirmation
        </Text>
        <Text style={smallText}>
          • You will receive a final confirmation email once deletion is complete
        </Text>
        
        <Text style={text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>
          {confirmationUrl}
        </Text>
        
        <Section style={alternativeSection}>
          <Text style={alternativeTitle}>
            <strong>Consider these alternatives:</strong>
          </Text>
          <Text style={smallText}>
            • Temporarily deactivate your account instead of deleting it
          </Text>
          <Text style={smallText}>
            • Update your privacy settings to limit data usage
          </Text>
          <Text style={smallText}>
            • Contact support to discuss your concerns
          </Text>
        </Section>
        
        <Text style={urgentText}>
          <strong>⚠️ Important:</strong> If you didn&apos;t request this account deletion, please:
        </Text>
        <Text style={smallText}>
          • Do not click the confirmation button above
        </Text>
        <Text style={smallText}>
          • Change your account password immediately
        </Text>
        <Text style={smallText}>
          • Contact our support team right away
        </Text>
        
        <Text style={text}>
          You can safely ignore this email if you didn&apos;t request the account deletion.
        </Text>
      </Section>
      
      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};

export default DeleteAccountEmail;

const section = {
  padding: "24px 0",
};

const warningSection = {
  backgroundColor: "#fef2f2",
  border: "2px solid #fecaca",
  padding: "16px",
  borderRadius: "6px",
  margin: "16px 0",
};

const alternativeSection = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #bae6fd",
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

const warningTitle = {
  color: "#dc2626",
  fontSize: "18px",
  lineHeight: "1.4",
  margin: "0 0 12px 0",
};

const warningText = {
  color: "#dc2626",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const bulletText = {
  color: "#dc2626",
  fontSize: "14px",
  lineHeight: "1.4",
  margin: "0 0 4px 0",
  paddingLeft: "8px",
};

const retentionText = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "16px 0",
  backgroundColor: "#f9fafb",
  padding: "12px",
  borderRadius: "4px",
};

const securityText = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "24px 0 8px 0",
};

const alternativeTitle = {
  color: "#1e40af",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const urgentText = {
  color: "#d73027",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "24px 0 8px 0",
};

const smallText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.4",
  margin: "0 0 4px 0",
};

const linkText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.4",
  margin: "8px 0 16px 0",
  wordBreak: "break-all" as const,
  backgroundColor: "#f5f5f5",
  padding: "8px",
  borderRadius: "4px",
};