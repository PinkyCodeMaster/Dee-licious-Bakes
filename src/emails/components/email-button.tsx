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
    backgroundColor: "#000000",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 20px",
    margin: "16px 0",
};

const secondaryButtonStyle = {
    backgroundColor: "transparent",
    border: "2px solid #000000",
    borderRadius: "6px",
    color: "#000000",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "10px 18px",
    margin: "16px 0",
};