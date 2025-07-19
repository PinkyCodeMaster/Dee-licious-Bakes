import { CakeWelcomeEmail } from "./templates/cake-welcome";
import { CakeUnsubscribeConfirmationEmail } from "./templates/cake-unsubscribe-confirmation";

// Test data for cake welcome email
export const CakeWelcomeEmailTest = () => (
  <CakeWelcomeEmail
    firstName="Sarah"
    email="sarah@example.com"
    unsubscribeUrl="https://deescakes.com/unsubscribe?token=abc123"
  />
);

// Test data for cake unsubscribe confirmation email
export const CakeUnsubscribeConfirmationEmailTest = () => (
  <CakeUnsubscribeConfirmationEmail
    email="sarah@example.com"
    unsubscribeDate="January 15, 2025"
    resubscribeUrl="https://deescakes.com/subscribe"
  />
);

export default CakeWelcomeEmailTest;