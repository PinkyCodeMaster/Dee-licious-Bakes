import * as React from "react";
import { EmailLayout, EmailHeader, EmailButton, EmailFooter } from "./components";

export default function Email() {
    return (
        <EmailLayout preview="Example email template">
            <EmailHeader 
                title="Welcome to Our Platform" 
                subtitle="This is an example email template"
            />
            <EmailButton href="https://example.com">
                Click me
            </EmailButton>
            <EmailFooter />
        </EmailLayout>
    );
}