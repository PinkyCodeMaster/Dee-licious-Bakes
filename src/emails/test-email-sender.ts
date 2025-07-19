import { sendCakeWelcomeEmail, sendCakeUnsubscribeConfirmationEmail } from "./utils/cake-email-sender";

// Test function to verify cake email templates work
export async function testCakeEmails() {
  console.log("Testing cake email templates...");

  try {
    // Test welcome email
    console.log("Testing cake welcome email...");
    const welcomeResult = await sendCakeWelcomeEmail("test@example.com", {
      firstName: "Sarah",
      email: "test@example.com",
      unsubscribeUrl: "https://deescakes.com/unsubscribe?token=test123",
    });

    if (welcomeResult.success) {
      console.log("✅ Cake welcome email test passed");
    } else {
      console.log("❌ Cake welcome email test failed:", welcomeResult.error);
    }

    // Test unsubscribe confirmation email
    console.log("Testing cake unsubscribe confirmation email...");
    const unsubResult = await sendCakeUnsubscribeConfirmationEmail("test@example.com", {
      email: "test@example.com",
      unsubscribeDate: new Date().toLocaleDateString(),
      resubscribeUrl: "https://deescakes.com/subscribe",
    });

    if (unsubResult.success) {
      console.log("✅ Cake unsubscribe confirmation email test passed");
    } else {
      console.log("❌ Cake unsubscribe confirmation email test failed:", unsubResult.error);
    }

  } catch (error) {
    console.error("❌ Email testing failed:", error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testCakeEmails();
}