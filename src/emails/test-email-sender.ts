// Test script for email sending utilities
// This file is for development testing only

import {
  sendPasswordResetEmail,
  sendEmailVerification,
  sendEmailChangeVerification,
  sendAccountDeletionVerification,
  sendAccountDeletionConfirmation,
} from "./utils/email-sender";

// Test data
const testEmail = "test@example.com";
const testUser = "John Doe";

async function testEmailSending() {
  console.log("🧪 Testing email sending utilities...\n");

  try {
    // Test password reset email
    console.log("1. Testing password reset email...");
    const resetResult = await sendPasswordResetEmail(testEmail, {
      resetUrl: "https://yourapp.com/reset-password?token=test123",
      userEmail: testEmail,
      expirationTime: "24 hours",
    });
    console.log("   Result:", resetResult.success ? "✅ Success" : `❌ Failed: ${resetResult.error}`);

    // Test email verification
    console.log("\n2. Testing email verification...");
    const verifyResult = await sendEmailVerification(testEmail, {
      verificationUrl: "https://yourapp.com/verify-email?token=test123",
      userEmail: testEmail,
      userName: testUser,
    });
    console.log("   Result:", verifyResult.success ? "✅ Success" : `❌ Failed: ${verifyResult.error}`);

    // Test email change verification
    console.log("\n3. Testing email change verification...");
    const changeResult = await sendEmailChangeVerification(testEmail, {
      approvalUrl: "https://yourapp.com/approve-email-change?token=test123",
      oldEmail: testEmail,
      newEmail: "newemail@example.com",
      userName: testUser,
    });
    console.log("   Result:", changeResult.success ? "✅ Success" : `❌ Failed: ${changeResult.error}`);

    // Test account deletion verification
    console.log("\n4. Testing account deletion verification...");
    const deleteResult = await sendAccountDeletionVerification(testEmail, {
      confirmationUrl: "https://yourapp.com/confirm-delete?token=test123",
      userEmail: testEmail,
      userName: testUser,
    });
    console.log("   Result:", deleteResult.success ? "✅ Success" : `❌ Failed: ${deleteResult.error}`);

    // Test account deletion confirmation
    console.log("\n5. Testing account deletion confirmation...");
    const deletedResult = await sendAccountDeletionConfirmation(testEmail, {
      userEmail: testEmail,
      userName: testUser,
      deletionDate: "January 15, 2025",
    });
    console.log("   Result:", deletedResult.success ? "✅ Success" : `❌ Failed: ${deletedResult.error}`);

    console.log("\n🎉 Email sending utility tests completed!");

  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

// Export for potential use in other test files
export { testEmailSending };

// Run tests if this file is executed directly
if (require.main === module) {
  testEmailSending();
}