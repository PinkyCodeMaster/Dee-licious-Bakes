import { env } from "@/lib/env";
import { Hr, Section, Text } from "@react-email/components";
import * as React from "react";

interface EmailFooterProps {
    companyName?: string;
    supportEmail?: string;
}

export const EmailFooter: React.FC<EmailFooterProps> = ({
    companyName = "Your Company",
    supportEmail = env.RESEND_FROM_EMAIL,
}) => {
    return (
        <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>
                If you have any questions, please contact us at{" "}
                <a href={`mailto:${supportEmail}`} style={link}>
                    {supportEmail}
                </a>
            </Text>
            <Text style={footerText}>
                © {new Date().getFullYear()} {companyName}. All rights reserved.
            </Text>
        </Section>
    );
};

const footer = {
    marginTop: "32px",
    textAlign: "center" as const,
};

const hr = {
    borderColor: "#e6e6e6",
    margin: "20px 0",
};

const footerText = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "1.4",
    margin: "4px 0",
};

const link = {
    color: "#8898aa",
    textDecoration: "underline",
};