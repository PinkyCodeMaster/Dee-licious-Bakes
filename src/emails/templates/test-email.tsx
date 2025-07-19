import { Button, Html, Text, Section } from "@react-email/components";
import * as React from "react";

export default function TestEmail() {
  return (
    <Html>
      <Section style={{ padding: "20px" }}>
        <Text style={{ fontSize: "18px", marginBottom: "16px" }}>
          Hello from React Email! 🎂
        </Text>
        <Text style={{ marginBottom: "16px" }}>
          This is a test email template to verify that React Email is working correctly.
        </Text>
        <Button
          href="https://example.com"
          style={{ 
            background: "#d2691e", 
            color: "#fff", 
            padding: "12px 20px",
            borderRadius: "6px",
            textDecoration: "none"
          }}
        >
          Click me!
        </Button>
      </Section>
    </Html>
  );
}