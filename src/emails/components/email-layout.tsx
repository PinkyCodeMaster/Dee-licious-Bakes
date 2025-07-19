import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  preview,
  children,
}) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#fefcf8",
  fontFamily: 'Georgia, "Times New Roman", serif',
  color: "#5d4037",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(139, 69, 19, 0.1)",
};

const content = {
  padding: "0 30px",
};