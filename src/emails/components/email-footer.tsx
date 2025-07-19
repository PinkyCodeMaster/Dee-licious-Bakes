import { Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { BAKERY_BRAND } from "@/lib/constants/brand";

interface EmailFooterProps {
    companyName?: string;
    supportEmail?: string;
    unsubscribeUrl?: string;
    showUnsubscribe?: boolean;
}

export const EmailFooter: React.FC<EmailFooterProps> = ({
    companyName = BAKERY_BRAND.name,
    supportEmail = BAKERY_BRAND.email,
    unsubscribeUrl,
    showUnsubscribe = true,
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
                {BAKERY_BRAND.address}
            </Text>
            {showUnsubscribe && unsubscribeUrl && (
                <Text style={footerText}>
                    Don&apos;t want to receive these emails?{" "}
                    <a href={unsubscribeUrl} style={link}>
                        Unsubscribe here
                    </a>
                </Text>
            )}
            <Text style={footerText}>
                © {new Date().getFullYear()} {companyName}. All rights reserved.
            </Text>
            <Text style={developerText}>
                Website made by {BAKERY_BRAND.developer}
            </Text>
        </Section>
    );
};

const footer = {
    marginTop: "32px",
    textAlign: "center" as const,
    backgroundColor: "#fdf6e3",
    padding: "20px",
    borderRadius: "8px",
    borderTop: "3px solid #f4a261",
};

const hr = {
    borderColor: "#f4a261",
    margin: "20px 0",
};

const footerText = {
    color: "#8b4513",
    fontSize: "12px",
    lineHeight: "1.4",
    margin: "4px 0",
};

const developerText = {
    color: "#d2691e",
    fontSize: "11px",
    lineHeight: "1.4",
    margin: "8px 0 0 0",
    fontStyle: "italic",
};

const link = {
    color: "#d2691e",
    textDecoration: "underline",
};