import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
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
      
      <Section style={section}>
        <Text style={text}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={text}>
          We received a request to change the email address for your account.
        </Text>
        
        <Section style={emailChangeSection}>
          <Text style={emailChangeText}>
            <strong>Current email:</strong> {oldEmail}
          </Text>
          <Text style={emailChangeText}>
            <strong>New email:</strong> {newEmail}
          </Text>
        </Section>
        
        <Text style={text}>
          If you requested this change, please click the button below to approve it:
        </Text>
        
        <EmailButton href={approvalUrl}>
          Approve Email Change
        </EmailButton>
        
        <Text style={securityText}>
          <strong>Security Information:</strong>
        </Text>
        <Text style={smallText}>
          • This approval link is secure and unique to your account
        </Text>
        <Text style={smallText}>
          • Your email address won&apos;t change until you approve this request
        </Text>
        <Text style={smallText}>
          • You&apos;ll need to verify the new email address after approval
        </Text>
        
        <Text style={text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>
          {approvalUrl}
        </Text>
        
        <Text style={warningText}>
          <strong>⚠️ Important:</strong> If you didn&apos;t request this email change, please:
        </Text>
        <Text style={smallText}>
          • Do not click the approval button above
        </Text>
        <Text style={smallText}>
          • Change your account password immediately
        </Text>
        <Text style={smallText}>
          • Contact our support team if you have concerns
        </Text>
        
        <Text style={text}>
          You can safely ignore this email if you didn&apos;t request the change.
        </Text>
      </Section>
      
      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};

export default ChangeEmailEmail;

const section = {
  padding: "24px 0",
};

const emailChangeSection = {
  backgroundColor: "#f8f9fa",
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

const emailChangeText = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const securityText = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "24px 0 8px 0",
};

const warningText = {
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