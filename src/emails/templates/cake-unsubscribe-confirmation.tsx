import { Section, Text, Img } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import { emailStyles } from "../styles";

interface CakeUnsubscribeConfirmationProps {
  email: string;
  unsubscribeDate: string;
  resubscribeUrl?: string;
}

export const CakeUnsubscribeConfirmationEmail: React.FC<CakeUnsubscribeConfirmationProps> = ({
  email,
  unsubscribeDate,
  resubscribeUrl,
}) => {
  return (
    <EmailLayout preview="You've been unsubscribed from Dee's Delicious Cakes">
      <EmailHeader 
        title="Unsubscribe Confirmed" 
        subtitle="We&apos;re sorry to see you go!"
      />
      
      {/* Farewell cake image */}
      <Section style={heroSection}>
        <Img
          src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=250&fit=crop&crop=center"
          alt="Thank you cake"
          width="400"
          height="250"
          style={heroImage}
        />
      </Section>
      
      <Section style={emailStyles.section}>
        <Text style={emailStyles.text}>
          Hello,
        </Text>
        
        <Text style={emailStyles.text}>
          This email confirms that you have been successfully unsubscribed from Dee&apos;s Delicious Cakes newsletter.
        </Text>
        
        <Section style={emailStyles.confirmationSection}>
          <Text style={emailStyles.confirmationTitle}>
            Unsubscribe Details:
          </Text>
          <Text style={emailStyles.smallText}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={emailStyles.smallText}>
            <strong>Unsubscribed on:</strong> {unsubscribeDate}
          </Text>
        </Section>
        
        <Text style={emailStyles.text}>
          You will no longer receive marketing emails from us. However, you may still receive important transactional emails if you have an active account or pending orders.
        </Text>
        
        <Text style={emailStyles.text}>
          If you unsubscribed by mistake or change your mind, you can easily resubscribe at any time by visiting our website or clicking the button below.
        </Text>
        
        {resubscribeUrl && (
          <EmailButton href={resubscribeUrl} variant="secondary">
            Resubscribe to Newsletter
          </EmailButton>
        )}
        
        <Section style={emailStyles.supportSection}>
          <Text style={emailStyles.sectionTitle}>
            <strong>Need Help?</strong>
          </Text>
          <Text style={emailStyles.smallText}>
            If you have any questions about your unsubscription or need assistance with anything else, please don&apos;t hesitate to contact us at hello@deescakes.com
          </Text>
        </Section>
        
        <Text style={emailStyles.text}>
          Thank you for being part of our sweet community. Even though you won&apos;t be receiving our newsletters, we hope you&apos;ll still think of us for your special cake needs!
        </Text>
        
        <Text style={emailStyles.text}>
          Best wishes,<br />
          Dee & The Team 🍰
        </Text>
      </Section>
      
      <EmailFooter 
        companyName="Dee's Delicious Cakes" 
        supportEmail="hello@deescakes.com"
        showUnsubscribe={false}
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