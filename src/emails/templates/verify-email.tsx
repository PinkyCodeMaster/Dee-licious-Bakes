import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import { emailStyles } from "../styles";
import { BAKERY_BRAND } from "@/lib/constants/brand";
import type { VerifyEmailData } from "../types";

export const VerifyEmailEmail: React.FC<VerifyEmailData> = ({
  verificationUrl,
  userEmail,
  userName,
  companyName = BAKERY_BRAND.name,
  supportEmail = BAKERY_BRAND.email,
}) => {
  return (
    <EmailLayout preview={`Verify your email address - ${BAKERY_BRAND.name}`}>
      <EmailHeader 
        title="Welcome! Please verify your email" 
        subtitle="Just one more step to get started with us"
      />
      
      <Section style={emailStyles.section}>
        <Text style={emailStyles.welcomeText}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={emailStyles.text}>
          Welcome to {BAKERY_BRAND.name}! We&apos;re excited to have you join our sweet community.
        </Text>
        <Text style={emailStyles.text}>
          To complete your account setup and start exploring our delicious offerings, please verify 
          your email address ({userEmail}) by clicking the button below.
        </Text>
        
        <EmailButton href={verificationUrl}>
          Verify Email Address
        </EmailButton>
        
        <Section style={emailStyles.infoSection}>
          <Text style={emailStyles.sectionTitle}>
            Account Activation:
          </Text>
          <Text style={emailStyles.bulletText}>
            • Your account is currently inactive until email verification is complete
          </Text>
          <Text style={emailStyles.bulletText}>
            • Once verified, you&apos;ll have full access to browse our cake gallery and place orders
          </Text>
          <Text style={emailStyles.bulletText}>
            • This verification link is secure and unique to your account
          </Text>
        </Section>
        
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