import type {
  ResetPasswordEmailData,
  VerifyEmailData,
  ChangeEmailData,
  DeleteAccountData,
  AccountDeletedData,
  BaseEmailData,
} from "../types";

/**
 * Validation errors for email templates
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Base validation for common email fields
 */
function validateBaseEmailData(data: BaseEmailData & { userEmail?: string }): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.userEmail && !isValidEmail(data.userEmail)) {
    errors.push({ field: 'userEmail', message: 'Invalid email format' });
  }

  if (data.supportEmail && !isValidEmail(data.supportEmail)) {
    errors.push({ field: 'supportEmail', message: 'Invalid support email format' });
  }

  if (data.companyName && typeof data.companyName !== 'string') {
    errors.push({ field: 'companyName', message: 'Company name must be a string' });
  }

  return errors;
}

/**
 * Validates password reset email data
 */
export function validateResetPasswordData(data: ResetPasswordEmailData): ValidationResult {
  const errors: ValidationError[] = [];

  // Base validation
  errors.push(...validateBaseEmailData(data));

  // Required fields
  if (!data.resetUrl) {
    errors.push({ field: 'resetUrl', message: 'Reset URL is required' });
  } else if (!isValidUrl(data.resetUrl)) {
    errors.push({ field: 'resetUrl', message: 'Invalid reset URL format' });
  }

  if (!data.userEmail) {
    errors.push({ field: 'userEmail', message: 'User email is required' });
  }

  // Optional fields validation
  if (data.expirationTime && typeof data.expirationTime !== 'string') {
    errors.push({ field: 'expirationTime', message: 'Expiration time must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email verification data
 */
export function validateVerifyEmailData(data: VerifyEmailData): ValidationResult {
  const errors: ValidationError[] = [];

  // Base validation
  errors.push(...validateBaseEmailData(data));

  // Required fields
  if (!data.verificationUrl) {
    errors.push({ field: 'verificationUrl', message: 'Verification URL is required' });
  } else if (!isValidUrl(data.verificationUrl)) {
    errors.push({ field: 'verificationUrl', message: 'Invalid verification URL format' });
  }

  if (!data.userEmail) {
    errors.push({ field: 'userEmail', message: 'User email is required' });
  }

  // Optional fields validation
  if (data.userName && typeof data.userName !== 'string') {
    errors.push({ field: 'userName', message: 'User name must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email change data
 */
export function validateChangeEmailData(data: ChangeEmailData): ValidationResult {
  const errors: ValidationError[] = [];

  // Base validation
  errors.push(...validateBaseEmailData(data));

  // Required fields
  if (!data.approvalUrl) {
    errors.push({ field: 'approvalUrl', message: 'Approval URL is required' });
  } else if (!isValidUrl(data.approvalUrl)) {
    errors.push({ field: 'approvalUrl', message: 'Invalid approval URL format' });
  }

  if (!data.oldEmail) {
    errors.push({ field: 'oldEmail', message: 'Old email is required' });
  } else if (!isValidEmail(data.oldEmail)) {
    errors.push({ field: 'oldEmail', message: 'Invalid old email format' });
  }

  if (!data.newEmail) {
    errors.push({ field: 'newEmail', message: 'New email is required' });
  } else if (!isValidEmail(data.newEmail)) {
    errors.push({ field: 'newEmail', message: 'Invalid new email format' });
  }

  // Check if old and new emails are different
  if (data.oldEmail && data.newEmail && data.oldEmail === data.newEmail) {
    errors.push({ field: 'newEmail', message: 'New email must be different from old email' });
  }

  // Optional fields validation
  if (data.userName && typeof data.userName !== 'string') {
    errors.push({ field: 'userName', message: 'User name must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates account deletion data
 */
export function validateDeleteAccountData(data: DeleteAccountData): ValidationResult {
  const errors: ValidationError[] = [];

  // Base validation
  errors.push(...validateBaseEmailData(data));

  // Required fields
  if (!data.confirmationUrl) {
    errors.push({ field: 'confirmationUrl', message: 'Confirmation URL is required' });
  } else if (!isValidUrl(data.confirmationUrl)) {
    errors.push({ field: 'confirmationUrl', message: 'Invalid confirmation URL format' });
  }

  if (!data.userEmail) {
    errors.push({ field: 'userEmail', message: 'User email is required' });
  }

  // Optional fields validation
  if (data.userName && typeof data.userName !== 'string') {
    errors.push({ field: 'userName', message: 'User name must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates account deleted confirmation data
 */
export function validateAccountDeletedData(data: AccountDeletedData): ValidationResult {
  const errors: ValidationError[] = [];

  // Base validation
  errors.push(...validateBaseEmailData(data));

  // Required fields
  if (!data.userEmail) {
    errors.push({ field: 'userEmail', message: 'User email is required' });
  }

  if (!data.deletionDate) {
    errors.push({ field: 'deletionDate', message: 'Deletion date is required' });
  } else if (typeof data.deletionDate !== 'string') {
    errors.push({ field: 'deletionDate', message: 'Deletion date must be a string' });
  }

  // Optional fields validation
  if (data.userName && typeof data.userName !== 'string') {
    errors.push({ field: 'userName', message: 'User name must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Simple URL validation
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates email template data based on template type
 */
export function validateEmailTemplateData(template: string, data: Record<string, unknown>): ValidationResult {
  switch (template) {
    case 'reset-password':
      return validateResetPasswordData(data as unknown as ResetPasswordEmailData);
    case 'verify-email':
      return validateVerifyEmailData(data as unknown as VerifyEmailData);
    case 'change-email':
      return validateChangeEmailData(data as unknown as ChangeEmailData);
    case 'delete-account':
      return validateDeleteAccountData(data as unknown as DeleteAccountData);
    case 'account-deleted':
      return validateAccountDeletedData(data as unknown as AccountDeletedData);
    default:
      return {
        isValid: false,
        errors: [{ field: 'template', message: `Unknown template type: ${template}` }],
      };
  }
}