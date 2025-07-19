import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailFooter } from "../components";
import { emailStyles } from "../styles";
import { BAKERY_BRAND } from "@/lib/constants/brand";
import type { AccountDeletedData } from "../types";

interface AccountDeletedProps {
  data: AccountDeletedData;
}

export const AccountDeletedEmail: React.FC<AccountDeletedProps> = ({
  data,
}) => {
  const { 
    userEmail, 
    userName, 
    deletionDate, 
    companyName = BAKERY_BRAND.name, 
    supportEmail = BAKERY_BRAND.email 
  } = data;

  return (
    <EmailLayout preview="Your account has been deleted">
      <EmailHeader
        title="Account Deletion Confirmed"
        subtitle="Your account has been permanently deleted"
      />

      <Section style={emailStyles.section}>
        <Text style={emailStyles.text}>
          {userName ? `Hello ${userName},` : "Hello,"}
        </Text>
        <Text style={emailStyles.text}>
          This email confirms that your account ({userEmail}) was permanently deleted on {deletionDate}.
        </Text>

        <Section style={emailStyles.confirmationSection}>
          <Text style={emailStyles.confirmationTitle}>
            ✓ <strong>Deletion Complete</strong>
          </Text>
          <Text style={emailStyles.text}>
            The following data has been permanently removed:
          </Text>
          <Text style={emailStyles.bulletText}>• Your profile and personal information</Text>
          <Text style={emailStyles.bulletText}>• Your account settings and preferences</Text>
          <Text style={emailStyles.bulletText}>• Your saved data and content</Text>
          <Text style={emailStyles.bulletText}>• Access credentials and login information</Text>
        </Section>

        <Section style={emailStyles.retentionSection}>
          <Text style={emailStyles.sectionTitle}>
            <strong>Data Retention Policy</strong>
          </Text>
          <Text style={emailStyles.smallText}>
            As required by law, we will retain your order history and transaction records
            for 3 years from the deletion date. This data is stored securely and is not
            accessible through any user interface.
          </Text>
          <Text style={emailStyles.smallText}>
            After the 3-year retention period, all remaining data will be permanently purged
            from our systems.
          </Text>
        </Section>

        <Text style={emailStyles.warningText}>
          <strong>Important:</strong> Account deletion is irreversible. Your data cannot be
          recovered, and you cannot reactivate this account.
        </Text>

        <Text style={emailStyles.text}>
          If you wish to use our services again in the future, you will need to create
          a new account with a different email address.
        </Text>

        <Section style={emailStyles.supportSection}>
          <Text style={emailStyles.sectionTitle}>
            <strong>Need Help?</strong>
          </Text>
          <Text style={emailStyles.smallText}>
            If you have questions about this deletion or our data retention policies,
            please contact our support team at{" "}
            <a href={`mailto:${supportEmail}`} style={emailStyles.link}>
              {supportEmail}
            </a>
          </Text>
          <Text style={emailStyles.smallText}>
            Please note that we cannot restore deleted accounts, but we&apos;re happy to
            answer any questions about our policies or help you with creating a new account.
          </Text>
        </Section>

        <Text style={emailStyles.text}>
          Thank you for being part of our sweet {BAKERY_BRAND.name} community. We&apos;re sorry to see you go, and we hope our paths cross again in the future.
        </Text>
      </Section>

      <EmailFooter companyName={companyName} supportEmail={supportEmail} />
    </EmailLayout>
  );
};

export default AccountDeletedEmail;