import { Section, Text, Img } from "@react-email/components";
import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "../components";
import { emailStyles } from "../styles";
import { BAKERY_BRAND } from "@/lib/constants/brand";
import type { CakeUnsubscribeConfirmationData } from "../types";

export const CakeUnsubscribeConfirmationEmail: React.FC<CakeUnsubscribeConfirmationData> = ({
  email,
  unsubscribeDate,
  resubscribeUrl,
  companyName = BAKERY_BRAND.name,
  supportEmail = BAKERY_BRAND.email,
}) => {
  return (
    <EmailLayout preview={`You've been unsubscribed from ${BAKERY_BRAND.name}`}>
      <EmailHeader 
        title="Unsubscribe Confirmed" 
        subtitle="We're sorry to see you go!"
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
          This email confirms that you have been successfully unsubscribed from {BAKERY_BRAND.name} newsletter.
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
          If you unsubscribed by mistake or change your mind, you can easily resubscribe at any time by visiting our website{resubscribeUrl ? ' or clicking the button below' : ''}.
        </Text>
        
        {resubscribeUrl && (
          <EmailButton href={resubscribeUrl} variant="secondary">
            Resubscribe to Newsletter
          </EmailButton>
        )}
        
        <Section style={emailStyles.supportSection}>
          <Text style={emailStyles.sectionTitle}>
            Need Help?
          </Text>
          <Text style={emailStyles.smallText}>
            If you have any questions about your unsubscription or need assistance with anything else, please don&apos;t hesitate to contact us at {supportEmail}
          </Text>
        </Section>
        
        <Text style={emailStyles.text}>
          Thank you for being part of our sweet community. Even though you won&apos;t be receiving our newsletters, we hope you&apos;ll still think of us for your special cake needs!
        </Text>
        
        <Text style={emailStyles.signatureText}>
          Best wishes,<br />
          {BAKERY_BRAND.owner} & The Team 🍰
        </Text>
      </Section>
      
      <EmailFooter 
        companyName={companyName}
        supportEmail={supportEmail}
        showUnsubscribe={false}
      />
    </EmailLayout>
  );
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