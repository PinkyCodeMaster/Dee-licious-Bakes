import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import { emailStyles } from "../styles";
import { BAKERY_BRAND } from "@/lib/constants/brand";
import type { ResetPasswordEmailData } from "../types";

export const ResetPasswordEmail: React.FC<ResetPasswordEmailData> = ({
  resetUrl,
  userEmail,
  expirationTime = "24 hours",
  companyName = BAKERY_BRAND.name,
  supportEmail = BAKERY_BRAND.email,
}) => {
  return (
    <EmailLayout preview={`Reset your password - ${BAKERY_BRAND.name}`}>
      <EmailHeader 
        title="Reset Your Password" 
        subtitle="We received a request to reset your password"
      />
      
      <Section style={emailStyles.section}>
        <Text style={emailStyles.text}>
          Hello,
        </Text>
        <Text style={emailStyles.text}>
          We received a request to reset the password for your {BAKERY_BRAND.name} account ({userEmail}). 
          Click the button below to create a new password.
        </Text>
        
        <EmailButton href={resetUrl}>
          Reset Password
        </EmailButton>
        
        <Section style={emailStyles.infoSection}>
          <Text style={emailStyles.sectionTitle}>
            Security Information:
          </Text>
          <Text style={emailStyles.bulletText}>
            • This reset link will expire in {expirationTime}
          </Text>
          <Text style={emailStyles.bulletText}>
            • If you didn&apos;t request this reset, you can safely ignore this email
          </Text>
          <Text style={emailStyles.bulletText}>
            • Your password won&apos;t change until you create a new one using the link above
          </Text>
        </Section>
        
        <Text style={emailStyles.text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={emailStyles.linkText}>
          {resetUrl}
        </Text>
        
        <Text style={emailStyles.text}>
          If you need a new reset link after this one expires, you can request another one 
          from the login page on our website.
        </Text>
      </Section>
      
      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};