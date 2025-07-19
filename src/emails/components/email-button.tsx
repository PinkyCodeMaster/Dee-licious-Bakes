import { Button } from "@react-email/components";
import * as React from "react";

interface EmailButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: "primary" | "secondary";
}

export const EmailButton: React.FC<EmailButtonProps> = ({
    href,
    children,
    variant = "primary",
}) => {
    const buttonStyle = variant === "primary" ? primaryButtonStyle : secondaryButtonStyle;

    return (
        <Button href={href} style={buttonStyle}>
            {children}
        </Button>
    );
};

const primaryButtonStyle = {
    backgroundColor: "#8b4513",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "14px 24px",
    margin: "20px 0",
    border: "2px solid #8b4513",
    boxShadow: "0 2px 4px rgba(139, 69, 19, 0.2)",
};

const secondaryButtonStyle = {
    backgroundColor: "transparent",
    border: "2px solid #f4a261",
    borderRadius: "8px",
    color: "#8b4513",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 22px",
    margin: "20px 0",
};