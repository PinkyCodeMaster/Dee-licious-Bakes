import { Heading, Section, Text, Img } from "@react-email/components";
import * as React from "react";

interface EmailHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({
  title,
  subtitle,
  showLogo = true,
}) => {
  return (
    <Section style={header}>
      {showLogo && (
        <Img
          src="/icon1.png"
          alt="Dee-licious Bakes Logo"
          width="80"
          height="80"
          style={logoStyle}
        />
      )}
      <Heading style={h1}>{title}</Heading>
      {subtitle && <Text style={subtitleText}>{subtitle}</Text>}
    </Section>
  );
};

const header = {
  padding: "20px 0",
  textAlign: "center" as const,
  borderBottom: "2px solid #f4a261",
  marginBottom: "20px",
};

const logoStyle = {
  margin: "0 auto 16px auto",
  borderRadius: "50%",
  border: "3px solid #f4a261",
};

const h1 = {
  color: "#8b4513",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.2",
  margin: "0 0 8px 0",
  fontFamily: "Georgia, serif",
};

const subtitleText = {
  color: "#d2691e",
  fontSize: "16px",
  lineHeight: "1.4",
  margin: "0",
  fontStyle: "italic",
};