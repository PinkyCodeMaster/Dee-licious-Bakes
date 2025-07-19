import React from 'react';
import type { CakeWelcomeEmailData, CakeUnsubscribeConfirmationData } from "../types";
import { CakeWelcomeEmail } from "../templates/cake-welcome";
import { CakeUnsubscribeConfirmationEmail } from "../templates/cake-unsubscribe-confirmation";
import { render } from "@react-email/components";
import { resend } from "../../lib/resend";
import { env } from "../../lib/env";

// Cake email template types
export type CakeEmailTemplate = "cake-welcome" | "cake-unsubscribe-confirmation";

// Union type for cake email data
export type CakeEmailData = CakeWelcomeEmailData | CakeUnsubscribeConfirmationData;

// Cake email sending parameters
export interface SendCakeEmailParams {
  to: string;
  template: CakeEmailTemplate;
  data: CakeEmailData;
  from?: string;
}

// Email sending result
export interface CakeEmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Template component mapping for cake emails
const cakeTemplateComponents = {
  "cake-welcome": CakeWelcomeEmail,
  "cake-unsubscribe-confirmation": CakeUnsubscribeConfirmationEmail,
} as const;

// Template subject mapping for cake emails
const cakeTemplateSubjects = {
  "cake-welcome": "Welcome to Dee's Delicious Cakes! 🍰",
  "cake-unsubscribe-confirmation": "Unsubscribe Confirmed - Dee's Delicious Cakes",
} as const;

/**
 * Renders a cake email template to HTML string
 */
async function renderCakeEmailTemplate(
  template: CakeEmailTemplate,
  data: CakeEmailData
): Promise<{ html: string; text: string }> {
  try {
    const TemplateComponent = cakeTemplateComponents[template];

    if (!TemplateComponent) {
      throw new Error(`Unknown cake email template: ${template}`);
    }

    // Render HTML version
    const html = await render(React.createElement(TemplateComponent as React.ComponentType<CakeEmailData>, data));

    // Generate plain text fallback
    const text = generateCakePlainTextFallback(template, data);

    return { html, text };
  } catch (error) {
    console.error(`Failed to render cake email template ${template}:`, error);
    throw new Error(`Cake email template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generates a plain text fallback for cake email templates
 */
function generateCakePlainTextFallback(template: CakeEmailTemplate, data: CakeEmailData): string {
  const baseText = `
This is a message from Dee's Delicious Cakes.

`;

  switch (template) {
    case "cake-welcome":
      const welcomeData = data as CakeWelcomeEmailData;
      return baseText + `
Welcome to Dee's Sweet World!

${welcomeData.firstName ? `Hello ${welcomeData.firstName},` : 'Hello there,'}

Welcome to Dee's Delicious Cakes! I'm absolutely thrilled to have you join our sweet community of cake lovers.

My name is Dee, and I've been creating beautiful, delicious cakes for over 15 years. From elegant wedding cakes to fun birthday celebrations, I pour my heart into every creation.

What to expect from our newsletter:
🍰 Behind-the-scenes looks at cake creation
🎂 Seasonal cake designs and flavor inspirations
💝 Exclusive offers and early booking opportunities
📸 Fresh photos of my latest cake masterpieces

I believe every celebration deserves a cake that's as special as the moment itself. Whether you're planning a birthday, anniversary, or just want to treat yourself, I'm here to make your cake dreams come true.

Keep an eye on your inbox for sweet updates, and don't hesitate to reach out if you have any questions about custom cake orders!

Sweet regards,
Dee 🍰

To unsubscribe from these emails, visit: ${welcomeData.unsubscribeUrl}

© ${new Date().getFullYear()} Dee's Delicious Cakes. All rights reserved.
`;

    case "cake-unsubscribe-confirmation":
      const unsubData = data as CakeUnsubscribeConfirmationData;
      return baseText + `
Unsubscribe Confirmed

Hello,

This email confirms that you have been successfully unsubscribed from Dee's Delicious Cakes newsletter.

Unsubscribe Details:
Email: ${unsubData.email}
Unsubscribed on: ${unsubData.unsubscribeDate}

You will no longer receive marketing emails from us. However, you may still receive important transactional emails if you have an active account or pending orders.

If you unsubscribed by mistake or change your mind, you can easily resubscribe at any time by visiting our website${unsubData.resubscribeUrl ? ` or visiting: ${unsubData.resubscribeUrl}` : ''}.

Thank you for being part of our sweet community. Even though you won't be receiving our newsletters, we hope you'll still think of us for your special cake needs!

Best wishes,
Dee & The Team 🍰

© ${new Date().getFullYear()} Dee's Delicious Cakes. All rights reserved.
`;

    default:
      return baseText + 'Please check your account for important updates.';
  }
}

/**
 * Sends a cake email using the specified template and data
 */
export async function sendCakeEmail({
  to,
  template,
  data,
  from = env.RESEND_FROM_EMAIL,
}: SendCakeEmailParams): Promise<CakeEmailSendResult> {
  try {
    // Validate email address
    if (!to || !isValidEmail(to)) {
      throw new Error(`Invalid recipient email address: ${to}`);
    }

    // Render email template
    const { html, text } = await renderCakeEmailTemplate(template, data);

    // Get subject for template
    const subject = cakeTemplateSubjects[template];

    // Send email via Resend
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error('Resend API error for cake email:', result.error);
      return {
        success: false,
        error: `Cake email sending failed: ${result.error.message}`,
      };
    }

    console.log(`Cake email sent successfully: ${template} to ${to}`, {
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
    console.error('Cake email sending error:', {
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
 * Sends a cake welcome email to new subscribers
 */
export async function sendCakeWelcomeEmail(
  to: string,
  data: Omit<CakeWelcomeEmailData, 'companyName' | 'supportEmail'> & {
    companyName?: string;
    supportEmail?: string;
  }
): Promise<CakeEmailSendResult> {
  return sendCakeEmail({
    to,
    template: "cake-welcome",
    data: {
      companyName: "Dee's Delicious Cakes",
      supportEmail: "hello@deeliciousbakes.co.uk",
      ...data,
    },
  });
}

/**
 * Sends a cake unsubscribe confirmation email
 */
export async function sendCakeUnsubscribeConfirmationEmail(
  to: string,
  data: Omit<CakeUnsubscribeConfirmationData, 'companyName' | 'supportEmail'> & {
    companyName?: string;
    supportEmail?: string;
  }
): Promise<CakeEmailSendResult> {
  return sendCakeEmail({
    to,
    template: "cake-unsubscribe-confirmation",
    data: {
      companyName: "Dee's Delicious Cakes",
      supportEmail: "hello@deeliciousbakes.co.uk",
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
 * Retry mechanism for failed cake email sends
 */
export async function sendCakeEmailWithRetry(
  params: SendCakeEmailParams,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<CakeEmailSendResult> {
  let lastError: string = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendCakeEmail(params);

    if (result.success) {
      if (attempt > 1) {
        console.log(`Cake email sent successfully on attempt ${attempt}/${maxRetries}`);
      }
      return result;
    }

    lastError = result.error || 'Unknown error';

    if (attempt < maxRetries) {
      console.log(`Cake email send attempt ${attempt}/${maxRetries} failed, retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt)); // Exponential backoff
    }
  }

  console.error(`Cake email sending failed after ${maxRetries} attempts:`, lastError);
  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
  };
}