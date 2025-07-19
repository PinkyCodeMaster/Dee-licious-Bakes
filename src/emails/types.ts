// Base email template data
export interface BaseEmailData {
  companyName?: string;
  supportEmail?: string;
}

// Password reset email data
export interface ResetPasswordEmailData extends BaseEmailData {
  resetUrl: string;
  userEmail: string;
  expirationTime?: string;
}

// Email verification data
export interface VerifyEmailData extends BaseEmailData {
  verificationUrl: string;
  userEmail: string;
  userName?: string;
}

// Email change verification data
export interface ChangeEmailData extends BaseEmailData {
  approvalUrl: string;
  oldEmail: string;
  newEmail: string;
  userName?: string;
}

// Account deletion verification data
export interface DeleteAccountData extends BaseEmailData {
  confirmationUrl: string;
  userEmail: string;
  userName?: string;
}

// Account deleted confirmation data
export interface AccountDeletedData extends BaseEmailData {
  userEmail: string;
  userName?: string;
  deletionDate: string;
}

// Cake newsletter welcome email data
export interface CakeWelcomeEmailData extends BaseEmailData {
  firstName?: string;
  email: string;
  unsubscribeUrl: string;
}

// Cake newsletter unsubscribe confirmation data
export interface CakeUnsubscribeConfirmationData extends BaseEmailData {
  email: string;
  unsubscribeDate: string;
  resubscribeUrl?: string;
}

// Email configuration
export interface EmailConfig {
  brandName: string;
  brandColor: string;
  logoUrl?: string;
  supportEmail: string;
  baseUrl: string;
}

// Email theme configuration
export interface EmailTheme {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    border: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}