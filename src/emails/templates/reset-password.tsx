import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import type { ResetPasswordEmailData } from "../types";

interface ResetPasswordEmailProps {
  data: ResetPasswordEmailData;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  data,
}) => {
  const { resetUrl, userEmail, expirationTime = "24 hours", companyName, supportEmail } = data;

  return (
    <EmailLayout preview="Reset your password">
      <EmailHeader 
        title="Reset Your Password" 
        subtitle="We received a request to reset your password"
      />
      
      <Section style={section}>
        <Text style={text}>
          Hello,
        </Text>
        <Text style={text}>
          We received a request to reset the password for your account ({userEmail}). 
          Click the button below to create a new password.
        </Text>
        
        <EmailButton href={resetUrl}>
          Reset Password
        </EmailButton>
        
        <Text style={securityText}>
          <strong>Security Information:</strong>
        </Text>
        <Text style={smallText}>
          • This reset link will expire in {expirationTime}
        </Text>
        <Text style={smallText}>
          • If you didn&apos;t request this reset, you can safely ignore this email
        </Text>
        <Text style={smallText}>
          • Your password won&apos;t change until you create a new one using the link above
        </Text>
        
        <Text style={text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>
          {resetUrl}
        </Text>
        
        <Text style={text}>
          If you need a new reset link after this one expires, you can request another one 
          from the login page.
        </Text>
      </Section>
      
      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};

export default ResetPasswordEmail;

const section = {
  padding: "24px 0",
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px 0",
};

const securityText = {
  color: "#333333",
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