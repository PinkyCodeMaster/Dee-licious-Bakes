import { Heading, Section, Text } from "@react-email/components";
import * as React from "react";

interface EmailHeaderProps {
  title: string;
  subtitle?: string;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <Section style={header}>
      <Heading style={h1}>{title}</Heading>
      {subtitle && <Text style={subtitleText}>{subtitle}</Text>}
    </Section>
  );
};

const header = {
  padding: "20px 0",
  textAlign: "center" as const,
};

const h1 = {
  color: "#000000",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 8px 0",
};

const subtitleText = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "1.4",
  margin: "0",
};