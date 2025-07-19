const { z } = require('zod');

// Email subscription validation schema
const subscribeEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email address is too long"),
  firstName: z
    .string()
    .max(100, "First name is too long")
    .optional(),
  source: z
    .enum(['hero', 'inline', 'footer', 'popup'])
    .default('hero')
    .optional(),
});

// Test cases
const testCases = [
  { email: "valid@example.com", firstName: "Test" },
  { email: "invalid-email", firstName: "Test" },
  { email: "", firstName: "Test" },
  { firstName: "Test" }, // missing email
];

testCases.forEach((testCase, index) => {
  try {
    const result = subscribeEmailSchema.parse(testCase);
    console.log(`Test ${index + 1}: PASS`, result);
  } catch (error) {
    console.log(`Test ${index + 1}: FAIL`, error.errors?.[0]?.message || error.message);
  }
});