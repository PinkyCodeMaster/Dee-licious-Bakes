import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import { emailStyles } from "../styles";
import type { ChangeEmailData } from "../types";

interface ChangeEmailProps {
  data: ChangeEmailData;
}

export const ChangeEmailEmail: React.FC<ChangeEmailProps> = ({
  data,
}) => {
  const { approvalUrl, oldEmail, newEmail, userName, companyName, supportEmail } = data;

  return (
    <EmailLayout preview="Approve your email change">
      <EmailHeader 
        title="Approve Email Change" 
        subtitle="We received a request to change your email address"
      />
      
      <Section style={emailStyles.section}>
        <Text style={emailStyles.text}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={emailStyles.text}>
          We received a request to change the email address for your account.
        </Text>
        
        <Section style={emailStyles.infoSection}>
          <Text style={emailStyles.text}>
            <strong>Current email:</strong> {oldEmail}
          </Text>
          <Text style={emailStyles.text}>
            <strong>New email:</strong> {newEmail}
          </Text>
        </Section>
        
        <Text style={emailStyles.text}>
          If you requested this change, please click the button below to approve it:
        </Text>
        
        <EmailButton href={approvalUrl}>
          Approve Email Change
        </EmailButton>
        
        <Text style={emailStyles.sectionTitle}>
          <strong>Security Information:</strong>
        </Text>
        <Text style={emailStyles.smallText}>
          • This approval link is secure and unique to your account
        </Text>
        <Text style={emailStyles.smallText}>
          • Your email address won&apos;t change until you approve this request
        </Text>
        <Text style={emailStyles.smallText}>
          • You&apos;ll need to verify the new email address after approval
        </Text>
        
        <Text style={emailStyles.text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={emailStyles.linkText}>
          {approvalUrl}
        </Text>
        
        <Text style={emailStyles.warningText}>
          <strong>⚠️ Important:</strong> If you didn&apos;t request this email change, please:
        </Text>
        <Text style={emailStyles.smallText}>
          • Do not click the approval button above
        </Text>
        <Text style={emailStyles.smallText}>
          • Change your account password immediately
        </Text>
        <Text style={emailStyles.smallText}>
          • Contact our support team if you have concerns
        </Text>
        
        <Text style={emailStyles.text}>
          You can safely ignore this email if you didn&apos;t request the change.
        </Text>
      </Section>
      
      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};

export default ChangeEmailEmail;