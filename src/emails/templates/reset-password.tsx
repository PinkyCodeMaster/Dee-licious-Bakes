import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import { emailStyles } from "../styles";
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
      
      <Section style={emailStyles.section}>
        <Text style={emailStyles.text}>
          Hello,
        </Text>
        <Text style={emailStyles.text}>
          We received a request to reset the password for your account ({userEmail}). 
          Click the button below to create a new password.
        </Text>
        
        <EmailButton href={resetUrl}>
          Reset Password
        </EmailButton>
        
        <Text style={emailStyles.sectionTitle}>
          <strong>Security Information:</strong>
        </Text>
        <Text style={emailStyles.smallText}>
          • This reset link will expire in {expirationTime}
        </Text>
        <Text style={emailStyles.smallText}>
          • If you didn&apos;t request this reset, you can safely ignore this email
        </Text>
        <Text style={emailStyles.smallText}>
          • Your password won&apos;t change until you create a new one using the link above
        </Text>
        
        <Text style={emailStyles.text}>
          If the button doesn&apos;t work, you can copy and paste this link into your browser:
        </Text>
        <Text style={emailStyles.linkText}>
          {resetUrl}
        </Text>
        
        <Text style={emailStyles.text}>
          If you need a new reset link after this one expires, you can request another one 
          from the login page.
        </Text>
      </Section>
      
      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};

export default ResetPasswordEmail;