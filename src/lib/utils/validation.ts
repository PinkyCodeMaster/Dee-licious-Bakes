import { z } from 'zod';

/**
 * Utility function to safely parse data with a Zod schema
 * Returns parsed data or throws a formatted error
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map(issue =>
      `${issue.path.join('.')}: ${issue.message}`
    ).join(', ');

    throw new Error(errorMessage || `Validation failed: ${errors}`);
  }

  return result.data;
}

/**
 * Utility function to safely parse data with a Zod schema
 * Returns result object with success/error information
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map(issue =>
      `${issue.path.join('.')}: ${issue.message}`
    );

    return { success: false, errors };
  }

  return { success: true, data: result.data };
}

/**
 * Utility function to get validation error messages as an object
 * Useful for form field error mapping
 */
export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.issues.forEach(issue => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });

  return errors;
}

/**
 * Utility function to validate partial data for updates
 * Removes undefined values before validation
 */
export function validatePartialData<T>(
  schema: z.ZodSchema<T>,
  data: Record<string, unknown>
): Partial<T> {
  // Remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([value]) => value !== undefined)
  );

  return validateData(schema, cleanData);
}

/**
 * Type guard to check if a value matches a Zod schema
 */
export function isValidData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): data is T {
  return schema.safeParse(data).success;
}