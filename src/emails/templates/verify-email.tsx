import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import type { VerifyEmailData } from "../types";

interface VerifyEmailProps {
  data: VerifyEmailData;
}

export const VerifyEmailEmail: React.FC<VerifyEmailProps> = ({
  data,
}) => {
  const { verificationUrl, userEmail, userName, companyName, supportEmail } = data;

  return (
    <EmailLayout preview="Verify your email address">
      <EmailHeader 
        title="Welcome! Please verify your email" 
        subtitle="Just one more step to get started"
      />
      
      <Section style={section}>
        <Text style={text}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={text}>
          Welcome to our platform! We&apos;re excited to have you on board.
        </Text>
        <Text style={text}>
          To complete your account setup and start using all features, please verify 
          your email address ({userEmail}) by clicking the button below.
        </Text>
        
        <EmailButton href={verificationUrl}>
          Verify Email Address
        </EmailButton>
        
        <Text style={infoText}>
          <strong>Account Activation:</strong>
        </Text>
        <Text style={smallText}>
          • Your account is currently inactive until email verification is complete
        </Text>
        <Text style={smallText}>
          • Once verified, you&apos;ll have full access to all platform features
        </Text>
        <Text style={smallText}>
          • This verification link is secure and unique to your account
        </Text>
        
        <Text style={text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>
          {verificationUrl}
        </Text>
        
        <Text style={text}>
          If this verification link expires, you can request a new one by logging into 
          your account and following the verification prompts.
        </Text>
        
        <Text style={text}>
          If you didn&apos;t create an account with us, you can safely ignore this email.
        </Text>
      </Section>
      
      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};

const section = {
  padding: "24px 0",
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px 0",
};

const infoText = {
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