import { Section, Text, Img } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailFooter } from "../components";
import { emailStyles } from "../styles";

interface CakeWelcomeEmailProps {
  firstName?: string;
  email: string;
  unsubscribeUrl: string;
}

export const CakeWelcomeEmail: React.FC<CakeWelcomeEmailProps> = ({
  firstName,
  unsubscribeUrl,
}) => {
  return (
    <EmailLayout preview="Welcome to Dee's Delicious Cakes! 🍰">
      <EmailHeader 
        title="Welcome to Dee's Sweet World!" 
        subtitle="Thank you for joining our cake-loving community"
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
        <Text style={emailStyles.text}>
          {firstName ? `Hello ${firstName},` : "Hello there,"}
        </Text>
        
        <Text style={emailStyles.text}>
          Welcome to Dee&apos;s Delicious Cakes! I&apos;m absolutely thrilled to have you join our sweet community of cake lovers.
        </Text>
        
        <Text style={emailStyles.text}>
          My name is Dee, and I&apos;ve been creating beautiful, delicious cakes for over 15 years. From elegant Chesses cakes to fun birthday celebrations, I pour my heart into every creation.
        </Text>
        
        <Section style={emailStyles.infoSection}>
          <Text style={emailStyles.sectionTitle}>
            <strong>What to expect from our newsletter:</strong>
          </Text>
          <Text style={emailStyles.smallText}>
            🍰 Behind-the-scenes looks at cake creation
          </Text>
          <Text style={emailStyles.smallText}>
            🎂 Seasonal cake designs and flavor inspirations
          </Text>
          <Text style={emailStyles.smallText}>
            💝 Exclusive offers and early booking opportunities
          </Text>
          <Text style={emailStyles.smallText}>
            📸 Fresh photos of my latest cake masterpieces
          </Text>
        </Section>
        
        <Text style={emailStyles.text}>
          I believe every celebration deserves a cake that&apos;s as special as the moment itself. Whether you&apos;re planning a wedding, birthday, anniversary, or just want to treat yourself, I&apos;m here to make your cake dreams come true.
        </Text>
        
        <Text style={emailStyles.text}>
          Keep an eye on your inbox for sweet updates, and don&apos;t hesitate to reach out if you have any questions about custom cake orders!
        </Text>
        
        <Text style={emailStyles.text}>
          Sweet regards,<br />
          Dee 🍰
        </Text>
      </Section>
      
      <EmailFooter 
        companyName="Dee's Delicious Cakes" 
        supportEmail="hello@deescakes.com"
        unsubscribeUrl={unsubscribeUrl}
      />
    </EmailLayout>
  );
};

const heroSection = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const heroImage = {
  borderRadius: "8px",
  maxWidth: "100%",
  height: "auto",
};