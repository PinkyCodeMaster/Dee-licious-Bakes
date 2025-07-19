import React from 'react';
import type { ResetPasswordEmailData, VerifyEmailData, ChangeEmailData, DeleteAccountData, AccountDeletedData, } from "../types";
import { AccountDeletedEmail } from "../templates/account-deleted";
import { ResetPasswordEmail } from "../templates/reset-password";
import { DeleteAccountEmail } from "../templates/delete-account";
import { VerifyEmailEmail } from "../templates/verify-email";
import { ChangeEmailEmail } from "../templates/change-email";
import { render } from "@react-email/components";
import { resend } from "../../lib/email/resend";
import { env } from "../../lib/env";


// Email template type mapping
export type EmailTemplate =
  | "reset-password"
  | "verify-email"
  | "change-email"
  | "delete-account"
  | "account-deleted";

// Union type for all email data types
export type EmailData =
  | ResetPasswordEmailData
  | VerifyEmailData
  | ChangeEmailData
  | DeleteAccountData
  | AccountDeletedData;

// Email sending parameters
export interface SendEmailParams {
  to: string;
  template: EmailTemplate;
  data: EmailData;
  from?: string;
}

// Email sending result
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Email component props interface
interface EmailComponentProps {
  data: EmailData;
}

// Template component mapping
const templateComponents = {
  "reset-password": ResetPasswordEmail,
  "verify-email": VerifyEmailEmail,
  "change-email": ChangeEmailEmail,
  "delete-account": DeleteAccountEmail,
  "account-deleted": AccountDeletedEmail,
} as const;

// Template subject mapping
const templateSubjects = {
  "reset-password": "Reset Your Password",
  "verify-email": "Verify Your Email Address",
  "change-email": "Approve Email Address Change",
  "delete-account": "Confirm Account Deletion",
  "account-deleted": "Account Deletion Confirmed",
} as const;

/**
 * Renders an email template to HTML string
 */
async function renderEmailTemplate(
  template: EmailTemplate,
  data: EmailData
): Promise<{ html: string; text: string }> {
  try {
    const TemplateComponent = templateComponents[template];

    if (!TemplateComponent) {
      throw new Error(`Unknown email template: ${template}`);
    }

    // Render HTML version
    const html = await render(React.createElement(TemplateComponent as React.ComponentType<EmailComponentProps>, { data }));

    // Generate plain text fallback (simplified version)
    const text = generatePlainTextFallback(template, data);

    return { html, text };
  } catch (error) {
    console.error(`Failed to render email template ${template}:`, error);
    throw new Error(`Email template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generates a plain text fallback for email templates
 */
function generatePlainTextFallback(template: EmailTemplate, data: EmailData): string {
  const baseText = `
This is a message from ${(data as { companyName?: string }).companyName || 'Your Company'}.

`;

  switch (template) {
    case "reset-password":
      const resetData = data as ResetPasswordEmailData;
      return baseText + `
Reset Your Password

We received a request to reset the password for your account (${resetData.userEmail}).

To reset your password, please visit: ${resetData.resetUrl}

This reset link will expire in ${resetData.expirationTime || '24 hours'}.

If you didn't request this reset, you can safely ignore this email.

If you need help, contact us at ${resetData.supportEmail || 'support@yourcompany.com'}
`;

    case "verify-email":
      const verifyData = data as VerifyEmailData;
      return baseText + `
Welcome! Please verify your email

${verifyData.userName ? `Hello ${verifyData.userName},` : 'Hello,'}

Welcome to our platform! To complete your account setup, please verify your email address (${verifyData.userEmail}).

To verify your email, please visit: ${verifyData.verificationUrl}

If you need help, contact us at ${verifyData.supportEmail || 'support@yourcompany.com'}
`;

    case "change-email":
      const changeData = data as ChangeEmailData;
      return baseText + `
Approve Email Change

${changeData.userName ? `Hello ${changeData.userName},` : 'Hello,'}

We received a request to change your email address:
- Current email: ${changeData.oldEmail}
- New email: ${changeData.newEmail}

To approve this change, please visit: ${changeData.approvalUrl}

If you didn't request this change, please contact us immediately at ${changeData.supportEmail || 'support@yourcompany.com'}
`;

    case "delete-account":
      const deleteData = data as DeleteAccountData;
      return baseText + `
Confirm Account Deletion

${deleteData.userName ? `Hello ${deleteData.userName},` : 'Hello,'}

We received a request to permanently delete your account (${deleteData.userEmail}).

WARNING: This action cannot be undone and will permanently remove all your data.

To confirm deletion, please visit: ${deleteData.confirmationUrl}

If you didn't request this deletion, please contact us immediately at ${deleteData.supportEmail || 'support@yourcompany.com'}
`;

    case "account-deleted":
      const deletedData = data as AccountDeletedData;
      return baseText + `
Account Deletion Confirmed

${deletedData.userName ? `Hello ${deletedData.userName},` : 'Hello,'}

This confirms that your account (${deletedData.userEmail}) was permanently deleted on ${deletedData.deletionDate}.

Your data has been removed as requested. Order history will be retained for 3 years as required by law.

If you have questions, contact us at ${deletedData.supportEmail || 'support@yourcompany.com'}
`;

    default:
      return baseText + 'Please check your account for important updates.';
  }
}

/**
 * Sends an email using the specified template and data
 */
export async function sendEmail({
  to,
  template,
  data,
  from = env.RESEND_FROM_EMAIL,
}: SendEmailParams): Promise<EmailSendResult> {
  try {
    // Validate email address
    if (!to || !isValidEmail(to)) {
      throw new Error(`Invalid recipient email address: ${to}`);
    }

    // Render email template
    const { html, text } = await renderEmailTemplate(template, data);

    // Get subject for template
    const subject = templateSubjects[template];

    // Send email via Resend
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return {
        success: false,
        error: `Email sending failed: ${result.error.message}`,
      };
    }

    console.log(`Email sent successfully: ${template} to ${to}`, {
      messageId: result.data?.id,
      template,
      recipient: to,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email sending error:', {
      template,
      recipient: to,
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Sends a password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  data: Omit<ResetPasswordEmailData, 'companyName' | 'supportEmail'> & {
    companyName?: string;
    supportEmail?: string;
  }
): Promise<EmailSendResult> {
  return sendEmail({
    to,
    template: "reset-password",
    data: {
      companyName: "Your Company",
      supportEmail: env.RESEND_FROM_EMAIL,
      ...data,
    },
  });
}

/**
 * Sends an email verification email
 */
export async function sendEmailVerification(
  to: string,
  data: Omit<VerifyEmailData, 'companyName' | 'supportEmail'> & {
    companyName?: string;
    supportEmail?: string;
  }
): Promise<EmailSendResult> {
  return sendEmail({
    to,
    template: "verify-email",
    data: {
      companyName: "Your Company",
      supportEmail: env.RESEND_FROM_EMAIL,
      ...data,
    },
  });
}

/**
 * Sends an email change verification email
 */
export async function sendEmailChangeVerification(
  to: string,
  data: Omit<ChangeEmailData, 'companyName' | 'supportEmail'> & {
    companyName?: string;
    supportEmail?: string;
  }
): Promise<EmailSendResult> {
  return sendEmail({
    to,
    template: "change-email",
    data: {
      companyName: "Your Company",
      supportEmail: env.RESEND_FROM_EMAIL,
      ...data,
    },
  });
}

/**
 * Sends an account deletion verification email
 */
export async function sendAccountDeletionVerification(
  to: string,
  data: Omit<DeleteAccountData, 'companyName' | 'supportEmail'> & {
    companyName?: string;
    supportEmail?: string;
  }
): Promise<EmailSendResult> {
  return sendEmail({
    to,
    template: "delete-account",
    data: {
      companyName: "Your Company",
      supportEmail: env.RESEND_FROM_EMAIL,
      ...data,
    },
  });
}

/**
 * Sends an account deletion confirmation email
 */
export async function sendAccountDeletionConfirmation(
  to: string,
  data: Omit<AccountDeletedData, 'companyName' | 'supportEmail'> & {
    companyName?: string;
    supportEmail?: string;
  }
): Promise<EmailSendResult> {
  return sendEmail({
    to,
    template: "account-deleted",
    data: {
      companyName: "Your Company",
      supportEmail: env.RESEND_FROM_EMAIL,
      ...data,
    },
  });
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Retry mechanism for failed email sends
 */
export async function sendEmailWithRetry(
  params: SendEmailParams,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<EmailSendResult> {
  let lastError: string = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendEmail(params);

    if (result.success) {
      if (attempt > 1) {
        console.log(`Email sent successfully on attempt ${attempt}/${maxRetries}`);
      }
      return result;
    }

    lastError = result.error || 'Unknown error';

    if (attempt < maxRetries) {
      console.log(`Email send attempt ${attempt}/${maxRetries} failed, retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt)); // Exponential backoff
    }
  }

  console.error(`Email sending failed after ${maxRetries} attempts:`, lastError);
  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
  };
}