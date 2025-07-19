import { Section, Text, Img } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailFooter } from "../components";
import { emailStyles } from "../styles";
import { BAKERY_BRAND } from "@/lib/constants/brand";
import type { CakeWelcomeEmailData } from "../types";

export const CakeWelcomeEmail: React.FC<CakeWelcomeEmailData> = ({
  firstName,
  unsubscribeUrl,
  companyName = BAKERY_BRAND.name,
  supportEmail = BAKERY_BRAND.email,
}) => {
  return (
    <EmailLayout preview={`Welcome to ${BAKERY_BRAND.name}! 🍰`}>
      <EmailHeader 
        title={`Welcome to ${BAKERY_BRAND.name}!`}
        subtitle="Thank you for joining our sweet community of cake lovers"
      />
      
      {/* Hero cake image */}
      <Section style={heroSection}>
        <Img
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=300&fit=crop&crop=center"
          alt="Beautiful decorated cake"
          width="500"
          height="300"
          style={heroImage}
        />
      </Section>
      
      <Section style={emailStyles.section}>
        <Text style={emailStyles.welcomeText}>
          {firstName ? `Hello ${firstName},` : "Hello there,"}
        </Text>
        
        <Text style={emailStyles.text}>
          Welcome to {BAKERY_BRAND.name}! I&apos;m absolutely thrilled to have you join our sweet community of cake lovers.
        </Text>
        
        <Text style={emailStyles.text}>
          My name is {BAKERY_BRAND.owner}, and I&apos;ve been creating beautiful, delicious cakes for over 15 years. From elegant wedding cakes to fun birthday celebrations, I pour my heart into every creation.
        </Text>
        
        <Section style={emailStyles.infoSection}>
          <Text style={emailStyles.sectionTitle}>
            What to expect from our newsletter:
          </Text>
          <Text style={emailStyles.bulletText}>
            🍰 Behind-the-scenes looks at cake creation
          </Text>
          <Text style={emailStyles.bulletText}>
            🎂 Seasonal cake designs and flavor inspirations
          </Text>
          <Text style={emailStyles.bulletText}>
            💝 Exclusive offers and early booking opportunities
          </Text>
          <Text style={emailStyles.bulletText}>
            📸 Fresh photos of my latest cake masterpieces
          </Text>
        </Section>
        
        <Text style={emailStyles.text}>
          I believe every celebration deserves a cake that&apos;s as special as the moment itself. Whether you&apos;re planning a wedding, birthday, anniversary, or just want to treat yourself, I&apos;m here to make your cake dreams come true.
        </Text>
        
        <Text style={emailStyles.text}>
          Keep an eye on your inbox for sweet updates, and don&apos;t hesitate to reach out if you have any questions about custom cake orders!
        </Text>
        
        <Text style={emailStyles.signatureText}>
          Sweet regards,<br />
          {BAKERY_BRAND.owner} 🍰
        </Text>
      </Section>
      
      <EmailFooter 
        companyName={companyName}
        supportEmail={supportEmail}
        unsubscribeUrl={unsubscribeUrl}
      />
    </EmailLayout>
  );
};

// Add default export for React Email preview
export default function CakeWelcomeEmailPreview() {
  return (
    <CakeWelcomeEmail
      firstName="Sarah"
      unsubscribeUrl="https://example.com/unsubscribe"
    />
  );
}

// Add preview props for better preview experience
CakeWelcomeEmailPreview.PreviewProps = {
  firstName: "Sarah",
  unsubscribeUrl: "https://example.com/unsubscribe",
};

const heroSection = {
  textAlign: "center" as const,
  margin: "20px 0",
  padding: "0 20px",
};

const heroImage = {
  borderRadius: "12px",
  maxWidth: "100%",
  height: "auto",
  border: "3px solid #f4a261",
};