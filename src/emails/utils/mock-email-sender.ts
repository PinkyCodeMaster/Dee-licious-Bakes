import type { EmailSendResult, SendEmailParams, EmailData, EmailTemplate } from "./email-sender";

/**
 * Mock email sender for testing environments
 * Logs email details instead of actually sending emails
 */
export class MockEmailSender {
  private static sentEmails: Array<{
    timestamp: Date;
    to: string;
    template: EmailTemplate;
    data: EmailData;
    success: boolean;
  }> = [];

  /**
   * Mock implementation of sendEmail that logs instead of sending
   */
  static async sendEmail(params: SendEmailParams): Promise<EmailSendResult> {
    const { to, template, data } = params;
    
    console.log('📧 [MOCK EMAIL SENDER] Email would be sent:', {
      to,
      template,
      data,
      timestamp: new Date().toISOString(),
    });

    // Store the email for testing verification
    this.sentEmails.push({
      timestamp: new Date(),
      to,
      template,
      data,
      success: true,
    });

    // Simulate successful send
    return {
      success: true,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    };
  }

  /**
   * Get all sent emails (for testing verification)
   */
  static getSentEmails() {
    return [...this.sentEmails];
  }

  /**
   * Get emails sent to a specific recipient
   */
  static getEmailsForRecipient(email: string) {
    return this.sentEmails.filter(sent => sent.to === email);
  }

  /**
   * Get emails of a specific template type
   */
  static getEmailsByTemplate(template: EmailTemplate) {
    return this.sentEmails.filter(sent => sent.template === template);
  }

  /**
   * Clear all sent emails (useful for test cleanup)
   */
  static clearSentEmails() {
    this.sentEmails = [];
  }

  /**
   * Get the count of sent emails
   */
  static getSentEmailCount() {
    return this.sentEmails.length;
  }

  /**
   * Check if an email was sent to a specific recipient with a specific template
   */
  static wasEmailSent(to: string, template: EmailTemplate): boolean {
    return this.sentEmails.some(sent => sent.to === to && sent.template === template);
  }
}

/**
 * Mock email sending functions that mirror the real ones
 */
export const mockSendPasswordResetEmail = async (to: string, data: EmailData) => {
  return MockEmailSender.sendEmail({ to, template: "reset-password", data });
};

export const mockSendEmailVerification = async (to: string, data: EmailData) => {
  return MockEmailSender.sendEmail({ to, template: "verify-email", data });
};

export const mockSendEmailChangeVerification = async (to: string, data: EmailData) => {
  return MockEmailSender.sendEmail({ to, template: "change-email", data });
};

export const mockSendAccountDeletionVerification = async (to: string, data: EmailData) => {
  return MockEmailSender.sendEmail({ to, template: "delete-account", data });
};

export const mockSendAccountDeletionConfirmation = async (to: string, data: EmailData) => {
  return MockEmailSender.sendEmail({ to, template: "account-deleted", data });
};