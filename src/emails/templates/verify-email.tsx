import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import { emailStyles } from "../styles";
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
      
      <Section style={emailStyles.section}>
        <Text style={emailStyles.text}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={emailStyles.text}>
          Welcome to our platform! We&apos;re excited to have you on board.
        </Text>
        <Text style={emailStyles.text}>
          To complete your account setup and start using all features, please verify 
          your email address ({userEmail}) by clicking the button below.
        </Text>
        
        <EmailButton href={verificationUrl}>
          Verify Email Address
        </EmailButton>
        
        <Text style={emailStyles.sectionTitle}>
          <strong>Account Activation:</strong>
        </Text>
        <Text style={emailStyles.smallText}>
          • Your account is currently inactive until email verification is complete
        </Text>
        <Text style={emailStyles.smallText}>
          • Once verified, you&apos;ll have full access to all platform features
        </Text>
        <Text style={emailStyles.smallText}>
          • This verification link is secure and unique to your account
        </Text>
        
        <Text style={emailStyles.text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={emailStyles.linkText}>
          {verificationUrl}
        </Text>
        
        <Text style={emailStyles.text}>
          If this verification link expires, you can request a new one by logging into 
          your account and following the verification prompts.
        </Text>
        
        <Text style={emailStyles.text}>
          If you didn&apos;t create an account with us, you can safely ignore this email.
        </Text>
      </Section>
      
      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};