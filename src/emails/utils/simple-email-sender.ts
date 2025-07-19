import React from 'react';
import { render } from "@react-email/components";
import { resend } from "../../lib/email/resend";
import { env } from "../../lib/env";
import type { 
  ResetPasswordEmailData, 
  VerifyEmailData, 
  ChangeEmailData, 
  DeleteAccountData, 
  AccountDeletedData 
} from "../types";

// Import templates
import { ResetPasswordEmail } from "../templates/reset-password";
import { VerifyEmailEmail } from "../templates/verify-email";
import { ChangeEmailEmail } from "../templates/change-email";
import { DeleteAccountEmail } from "../templates/delete-account";
import { AccountDeletedEmail } from "../templates/account-deleted";

// Template configuration
const EMAIL_CONFIG = {
  "reset-password": {
    component: ResetPasswordEmail,
    subject: "Reset Your Password"
  },
  "verify-email": {
    component: VerifyEmailEmail,
    subject: "Verify Your Email Address"
  },
  "change-email": {
    component: ChangeEmailEmail,
    subject: "Approve Email Address Change"
  },
  "delete-account": {
    component: DeleteAccountEmail,
    subject: "Confirm Account Deletion"
  },
  "account-deleted": {
    component: AccountDeletedEmail,
    subject: "Account Deletion Confirmed"
  }
} as const;

type EmailTemplate = keyof typeof EMAIL_CONFIG;
type EmailData = ResetPasswordEmailData | VerifyEmailData | ChangeEmailData | DeleteAccountData | AccountDeletedData;

interface SendEmailParams {
  to: string;
  template: EmailTemplate;
  data: EmailData;
}

/**
 * Simple email sender - renders template and sends via Resend
 */
export async function sendEmail({ to, template, data }: SendEmailParams) {
  try {
    const config = EMAIL_CONFIG[template];
    const Component = config.component as React.ComponentType<{ data: EmailData }>;
    
    // Render email HTML
    const html = await render(React.createElement(Component, { data }));
    
    // Send email
    const result = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: config.subject,
      html,
    });

    if (result.error) {
      throw new Error(`Email sending failed: ${result.error.message}`);
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error(`Failed to send ${template} email to ${to}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Convenience functions with default company data
const DEFAULT_COMPANY_DATA = {
  companyName: "Your Company",
  supportEmail: env.RESEND_FROM_EMAIL,
};

export async function sendPasswordResetEmail(
  to: string, 
  data: Omit<ResetPasswordEmailData, 'companyName' | 'supportEmail'>
) {
  return sendEmail({
    to,
    template: "reset-password",
    data: { ...DEFAULT_COMPANY_DATA, ...data }
  });
}

export async function sendEmailVerification(
  to: string, 
  data: Omit<VerifyEmailData, 'companyName' | 'supportEmail'>
) {
  return sendEmail({
    to,
    template: "verify-email",
    data: { ...DEFAULT_COMPANY_DATA, ...data }
  });
}

export async function sendEmailChangeVerification(
  to: string, 
  data: Omit<ChangeEmailData, 'companyName' | 'supportEmail'>
) {
  return sendEmail({
    to,
    template: "change-email",
    data: { ...DEFAULT_COMPANY_DATA, ...data }
  });
}

export async function sendAccountDeletionVerification(
  to: string, 
  data: Omit<DeleteAccountData, 'companyName' | 'supportEmail'>
) {
  return sendEmail({
    to,
    template: "delete-account",
    data: { ...DEFAULT_COMPANY_DATA, ...data }
  });
}

export async function sendAccountDeletionConfirmation(
  to: string, 
  data: Omit<AccountDeletedData, 'companyName' | 'supportEmail'>
) {
  return sendEmail({
    to,
    template: "account-deleted",
    data: { ...DEFAULT_COMPANY_DATA, ...data }
  });
}