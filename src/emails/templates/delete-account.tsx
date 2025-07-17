import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import { emailStyles } from "../styles";
import type { DeleteAccountData } from "../types";

interface DeleteAccountProps {
  data: DeleteAccountData;
}

export const DeleteAccountEmail: React.FC<DeleteAccountProps> = ({ data, }) => {
  const { confirmationUrl, userEmail, userName, companyName, supportEmail } = data;

  return (
    <EmailLayout preview="Confirm account deletion">
      <EmailHeader
        title="Confirm Account Deletion"
        subtitle="We received a request to delete your account"
      />

      <Section style={emailStyles.section}>
        <Text style={emailStyles.text}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={emailStyles.text}>
          We received a request to permanently delete your account ({userEmail}).
        </Text>

        <Text style={emailStyles.warningText}>
          <strong>⚠️ IMPORTANT: This action cannot be undone</strong><br />
          Deleting your account will permanently remove:
          <br />• Your profile and personal information
          <br />• Your account settings and preferences
          <br />• Your saved data and content
          <br />• Access to all platform features
        </Text>

        <Text style={emailStyles.text}>
          <strong>Data Retention:</strong> Order history and transaction records will be retained
          for 3 years as required by law, but will not be accessible to you.
        </Text>

        <Text style={emailStyles.text}>
          If you&apos;re sure you want to proceed with account deletion, click the button below:
        </Text>

        <EmailButton href={confirmationUrl} variant="secondary">
          Confirm Account Deletion
        </EmailButton>

        <Text style={emailStyles.sectionTitle}>
          <strong>Security Information:</strong>
        </Text>
        <Text style={emailStyles.smallText}>
          • This confirmation link is secure and unique to your account
        </Text>
        <Text style={emailStyles.smallText}>
          • The deletion will be processed immediately after confirmation
        </Text>
        <Text style={emailStyles.smallText}>
          • You will receive a final confirmation email once deletion is complete
        </Text>

        <Text style={emailStyles.text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={emailStyles.linkText}>
          {confirmationUrl}
        </Text>

        <Section style={emailStyles.infoSection}>
          <Text style={emailStyles.sectionTitle}>
            <strong>Consider these alternatives:</strong>
          </Text>
          <Text style={emailStyles.smallText}>
            • Temporarily deactivate your account instead of deleting it
          </Text>
          <Text style={emailStyles.smallText}>
            • Update your privacy settings to limit data usage
          </Text>
          <Text style={emailStyles.smallText}>
            • Contact support to discuss your concerns
          </Text>
        </Section>

        <Text style={emailStyles.warningText}>
          <strong>⚠️ Important:</strong> If you didn&apos;t request this account deletion, please:
          <br />• Do not click the confirmation button above
          <br />• Change your account password immediately
          <br />• Contact our support team right away
        </Text>

        <Text style={emailStyles.text}>
          You can safely ignore this email if you didn&apos;t request the account deletion.
        </Text>
      </Section>

      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout >
  );
};


export default DeleteAccountEmail;