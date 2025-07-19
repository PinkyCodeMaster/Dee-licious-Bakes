import React from 'react';
import { render } from "@react-email/components";
import { resend } from "./resend";
import { env } from "../env";
import { BAKERY_BRAND } from "../constants/brand";

// Import all email templates
import { ResetPasswordEmail } from "../../emails/templates/reset-password";
import { VerifyEmailEmail } from "../../emails/templates/verify-email";
import { ChangeEmailEmail } from "../../emails/templates/change-email";
import { DeleteAccountEmail } from "../../emails/templates/delete-account";
import { AccountDeletedEmail } from "../../emails/templates/account-deleted";
import { CakeWelcomeEmail } from "../../emails/templates/cake-welcome";
import { CakeUnsubscribeConfirmationEmail } from "../../emails/templates/cake-unsubscribe-confirmation";

// Import email data types
import type {
  ResetPasswordEmailData,
  VerifyEmailData,
  ChangeEmailData,
  DeleteAccountData,
  AccountDeletedData,
  CakeWelcomeEmailData,
  CakeUnsubscribeConfirmationData,
} from "../../emails/types";

// Unified email template types
export type EmailTemplate =
  | "reset-password"
  | "verify-email"
  | "change-email"
  | "delete-account"
  | "account-deleted"
  | "cake-welcome"
  | "cake-unsubscribe-confirmation";

// Union type for all email data
export type EmailData =
  | ResetPasswordEmailData
  | VerifyEmailData
  | ChangeEmailData
  | DeleteAccountData
  | AccountDeletedData
  | CakeWelcomeEmailData
  | CakeUnsubscribeConfirmationData;

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

// Template configuration mapping
const EMAIL_TEMPLATES = {
  "reset-password": {
    component: ResetPasswordEmail,
    subject: "Reset Your Password - Dee-licious Bakes",
  },
  "verify-email": {
    component: VerifyEmailEmail,
    subject: "Verify Your Email Address - Dee-licious Bakes",
  },
  "change-email": {
    component: ChangeEmailEmail,
    subject: "Approve Email Address Change - Dee-licious Bakes",
  },
  "delete-account": {
    component: DeleteAccountEmail,
    subject: "Confirm Account Deletion - Dee-licious Bakes",
  },
  "account-deleted": {
    component: AccountDeletedEmail,
    subject: "Account Deletion Confirmed - Dee-licious Bakes",
  },
  "cake-welcome": {
    component: CakeWelcomeEmail,
    subject: "Welcome to Dee-licious Bakes! 🍰",
  },
  "cake-unsubscribe-confirmation": {
    component: CakeUnsubscribeConfirmationEmail,
    subject: "Unsubscribe Confirmed - Dee-licious Bakes",
  },
} as const;

/**
 * Unified Email Service
 * Single service that can send any email template with proper bakery branding
 */
export class UnifiedEmailService {
  private readonly fromEmail: string;

  constructor(fromEmail: string = env.RESEND_FROM_EMAIL) {
    this.fromEmail = fromEmail;
  }

  /**
   * Sends an email using the specified template and data
   */
  async sendEmail({ to, template, data, from }: SendEmailParams): Promise<EmailSendResult> {
    try {
      // Validate email address
      if (!to || !this.isValidEmail(to)) {
        throw new Error(`Invalid recipient email address: ${to}`);
      }

      // Get template configuration
      const templateConfig = EMAIL_TEMPLATES[template];
      if (!templateConfig) {
        throw new Error(`Unknown email template: ${template}`);
      }

      // Enhance data with bakery branding
      const enhancedData = this.enhanceDataWithBranding(data);

      // Render email template
      const { html, text } = await this.renderEmailTemplate(template, enhancedData);

      // Send email via Resend
      const result = await resend.emails.send({
        from: from || this.fromEmail,
        to,
        subject: templateConfig.subject,
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
   * Renders an email template to HTML and text
   */
  private async renderEmailTemplate(
    template: EmailTemplate,
    data: EmailData
  ): Promise<{ html: string; text: string }> {
    try {
      const templateConfig = EMAIL_TEMPLATES[template];
      const TemplateComponent = templateConfig.component;

      // Render HTML version
      const html = await render(
        React.createElement(TemplateComponent as React.ComponentType<EmailData>, data)
      );

      // Generate plain text fallback
      const text = this.generatePlainTextFallback(template, data);

      return { html, text };
    } catch (error) {
      console.error(`Failed to render email template ${template}:`, error);
      throw new Error(`Email template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Enhances email data with bakery branding information
   */
  private enhanceDataWithBranding(data: EmailData): EmailData {
    return {
      ...data,
      companyName: BAKERY_BRAND.name,
      supportEmail: BAKERY_BRAND.email,
    };
  }

  /**
   * Generates plain text fallback for email templates
   */
  private generatePlainTextFallback(template: EmailTemplate, data: EmailData): string {
    const baseText = `This is a message from ${BAKERY_BRAND.name}.\n\n`;

    switch (template) {
      case "reset-password":
        const resetData = data as ResetPasswordEmailData;
        return baseText + `Reset Your Password\n\nWe received a request to reset the password for your account (${resetData.userEmail}).\n\nTo reset your password, please visit: ${resetData.resetUrl}\n\nThis reset link will expire in ${resetData.expirationTime || '24 hours'}.\n\nIf you didn't request this reset, you can safely ignore this email.\n\nIf you need help, contact us at ${BAKERY_BRAND.email}`;

      case "verify-email":
        const verifyData = data as VerifyEmailData;
        return baseText + `Welcome! Please verify your email\n\n${verifyData.userName ? `Hello ${verifyData.userName},` : 'Hello,'}\n\nWelcome to ${BAKERY_BRAND.name}! To complete your account setup, please verify your email address (${verifyData.userEmail}).\n\nTo verify your email, please visit: ${verifyData.verificationUrl}\n\nIf you need help, contact us at ${BAKERY_BRAND.email}`;

      case "change-email":
        const changeData = data as ChangeEmailData;
        return baseText + `Approve Email Change\n\n${changeData.userName ? `Hello ${changeData.userName},` : 'Hello,'}\n\nWe received a request to change your email address:\n- Current email: ${changeData.oldEmail}\n- New email: ${changeData.newEmail}\n\nTo approve this change, please visit: ${changeData.approvalUrl}\n\nIf you didn't request this change, please contact us immediately at ${BAKERY_BRAND.email}`;

      case "delete-account":
        const deleteData = data as DeleteAccountData;
        return baseText + `Confirm Account Deletion\n\n${deleteData.userName ? `Hello ${deleteData.userName},` : 'Hello,'}\n\nWe received a request to permanently delete your account (${deleteData.userEmail}).\n\nWARNING: This action cannot be undone and will permanently remove all your data.\n\nTo confirm deletion, please visit: ${deleteData.confirmationUrl}\n\nIf you didn't request this deletion, please contact us immediately at ${BAKERY_BRAND.email}`;

      case "account-deleted":
        const deletedData = data as AccountDeletedData;
        return baseText + `Account Deletion Confirmed\n\n${deletedData.userName ? `Hello ${deletedData.userName},` : 'Hello,'}\n\nThis confirms that your account (${deletedData.userEmail}) was permanently deleted on ${deletedData.deletionDate}.\n\nYour data has been removed as requested. Order history will be retained for 3 years as required by law.\n\nIf you have questions, contact us at ${BAKERY_BRAND.email}`;

      case "cake-welcome":
        const welcomeData = data as CakeWelcomeEmailData;
        return baseText + `Welcome to ${BAKERY_BRAND.name}!\n\n${welcomeData.firstName ? `Hello ${welcomeData.firstName},` : 'Hello there,'}\n\nWelcome to ${BAKERY_BRAND.name}! I'm absolutely thrilled to have you join our sweet community of cake lovers.\n\nMy name is ${BAKERY_BRAND.owner}, and I've been creating beautiful, delicious cakes for over 15 years. From elegant wedding cakes to fun birthday celebrations, I pour my heart into every creation.\n\nWhat to expect from our newsletter:\n🍰 Behind-the-scenes looks at cake creation\n🎂 Seasonal cake designs and flavor inspirations\n💝 Exclusive offers and early booking opportunities\n📸 Fresh photos of my latest cake masterpieces\n\nI believe every celebration deserves a cake that's as special as the moment itself. Whether you're planning a birthday, anniversary, or just want to treat yourself, I'm here to make your cake dreams come true.\n\nKeep an eye on your inbox for sweet updates, and don't hesitate to reach out if you have any questions about custom cake orders!\n\nSweet regards,\n${BAKERY_BRAND.owner} 🍰\n\nTo unsubscribe from these emails, visit: ${welcomeData.unsubscribeUrl}\n\n© ${new Date().getFullYear()} ${BAKERY_BRAND.name}. All rights reserved.`;

      case "cake-unsubscribe-confirmation":
        const unsubData = data as CakeUnsubscribeConfirmationData;
        return baseText + `Unsubscribe Confirmed\n\nHello,\n\nThis email confirms that you have been successfully unsubscribed from ${BAKERY_BRAND.name} newsletter.\n\nUnsubscribe Details:\nEmail: ${unsubData.email}\nUnsubscribed on: ${unsubData.unsubscribeDate}\n\nYou will no longer receive marketing emails from us. However, you may still receive important transactional emails if you have an active account or pending orders.\n\nIf you unsubscribed by mistake or change your mind, you can easily resubscribe at any time by visiting our website${unsubData.resubscribeUrl ? ` or visiting: ${unsubData.resubscribeUrl}` : ''}.\n\nThank you for being part of our sweet community. Even though you won't be receiving our newsletters, we hope you'll still think of us for your special cake needs!\n\nBest wishes,\n${BAKERY_BRAND.owner} & The Team 🍰\n\n© ${new Date().getFullYear()} ${BAKERY_BRAND.name}. All rights reserved.`;

      default:
        return baseText + 'Please check your account for important updates.';
    }
  }

  /**
   * Simple email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Retry mechanism for failed email sends
   */
  async sendEmailWithRetry(
    params: SendEmailParams,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<EmailSendResult> {
    let lastError: string = '';

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.sendEmail(params);

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
}

// Create and export a singleton instance
export const emailService = new UnifiedEmailService();

// Convenience functions for common email operations
export async function sendPasswordResetEmail(
  to: string,
  data: Omit<ResetPasswordEmailData, 'companyName' | 'supportEmail'>
): Promise<EmailSendResult> {
  return emailService.sendEmail({
    to,
    template: "reset-password",
    data: data as ResetPasswordEmailData,
  });
}

export async function sendEmailVerification(
  to: string,
  data: Omit<VerifyEmailData, 'companyName' | 'supportEmail'>
): Promise<EmailSendResult> {
  return emailService.sendEmail({
    to,
    template: "verify-email",
    data: data as VerifyEmailData,
  });
}

export async function sendEmailChangeVerification(
  to: string,
  data: Omit<ChangeEmailData, 'companyName' | 'supportEmail'>
): Promise<EmailSendResult> {
  return emailService.sendEmail({
    to,
    template: "change-email",
    data: data as ChangeEmailData,
  });
}

export async function sendAccountDeletionVerification(
  to: string,
  data: Omit<DeleteAccountData, 'companyName' | 'supportEmail'>
): Promise<EmailSendResult> {
  return emailService.sendEmail({
    to,
    template: "delete-account",
    data: data as DeleteAccountData,
  });
}

export async function sendAccountDeletionConfirmation(
  to: string,
  data: Omit<AccountDeletedData, 'companyName' | 'supportEmail'>
): Promise<EmailSendResult> {
  return emailService.sendEmail({
    to,
    template: "account-deleted",
    data: data as AccountDeletedData,
  });
}

export async function sendCakeWelcomeEmail(
  to: string,
  data: Omit<CakeWelcomeEmailData, 'companyName' | 'supportEmail'>
): Promise<EmailSendResult> {
  return emailService.sendEmail({
    to,
    template: "cake-welcome",
    data: data as CakeWelcomeEmailData,
  });
}

export async function sendCakeUnsubscribeConfirmationEmail(
  to: string,
  data: Omit<CakeUnsubscribeConfirmationData, 'companyName' | 'supportEmail'>
): Promise<EmailSendResult> {
  return emailService.sendEmail({
    to,
    template: "cake-unsubscribe-confirmation",
    data: data as CakeUnsubscribeConfirmationData,
  });
}