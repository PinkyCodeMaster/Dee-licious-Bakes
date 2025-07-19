import type { EmailConfig, EmailTheme } from "../../emails/types";
import { render } from "@react-email/components";
import * as React from 'react';
import { Resend } from 'resend'
import { env } from "../env";

export const resend = new Resend(env.RESEND_API_KEY);

// Email configuration constants
export const emailConfig: EmailConfig = {
    brandName: "Your Company",
    brandColor: "#000000",
    logoUrl: undefined, // Add your logo URL here
    supportEmail: env.RESEND_FROM_EMAIL,
    baseUrl: env.BETTER_AUTH_URL,
};

// Email theme constants
export const emailTheme: EmailTheme = {
    colors: {
        primary: "#000000",
        secondary: "#666666",
        text: "#333333",
        background: "#ffffff",
        border: "#e6e6e6",
    },
    fonts: {
        primary: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        secondary: 'Georgia, serif',
    },
    spacing: {
        small: "8px",
        medium: "16px",
        large: "24px",
    },
};

/**
 * Enhanced email sending function with HTML template rendering
 */
export interface SendTemplateEmailParams<T = Record<string, unknown>> {
    to: string | string[];
    subject: string;
    template: React.ComponentType<T>;
    templateData: T;
    from?: string;
}

export interface EmailSendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Sends an email with HTML template rendering
 */
export async function sendTemplateEmail<T = Record<string, unknown>>({
    to,
    subject,
    template: TemplateComponent,
    templateData,
    from = env.RESEND_FROM_EMAIL,
}: SendTemplateEmailParams<T>): Promise<EmailSendResult> {
    try {
        // Render HTML template
        const html = await render(React.createElement(TemplateComponent as React.ComponentType<Record<string, unknown>>, templateData as Record<string, unknown>));

        // Generate plain text fallback
        const text = generatePlainTextFromHtml(html);

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

        console.log(`Template email sent successfully to ${Array.isArray(to) ? to.join(', ') : to}`, {
            messageId: result.data?.id,
            subject,
        });

        return {
            success: true,
            messageId: result.data?.id,
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Template email sending error:', {
            subject,
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
 * Fallback function to generate plain text from HTML
 * This is a simple implementation - for production, consider using a proper HTML-to-text library
 */
function generatePlainTextFromHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
        .replace(/&amp;/g, '&') // Replace HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
}

export interface SendSimpleEmailParams {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    from?: string;
}

/**
 * Sends a simple email without template rendering
 */
export async function sendSimpleEmail({ to, subject, html, text, from = env.RESEND_FROM_EMAIL, }: SendSimpleEmailParams): Promise<EmailSendResult> {
    try {
        // Ensure we have either html or text content
        const emailContent = html || text;
        if (!emailContent) {
            throw new Error('Either html or text content must be provided');
        }

        let result;
        if (html) {
            result = await resend.emails.send({
                from,
                to,
                subject,
                html,
                text: text || generatePlainTextFromHtml(html),
            });
        } else {
            result = await resend.emails.send({
                from,
                to,
                subject,
                text: text!,
            });
        }

        if (result.error) {
            console.error('Resend API error:', result.error);
            return {
                success: false,
                error: `Email sending failed: ${result.error.message}`,
            };
        }

        console.log(`Simple email sent successfully to ${Array.isArray(to) ? to.join(', ') : to}`, {
            messageId: result.data?.id,
            subject,
        });

        return {
            success: true,
            messageId: result.data?.id,
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Simple email sending error:', {
            subject,
            recipient: to,
            error: errorMessage,
        });

        return {
            success: false,
            error: errorMessage,
        };
    }
}
