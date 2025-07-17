import { anonymousClient, adminClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    plugins: [
        anonymousClient(),
        adminClient(),
        stripeClient({
            subscription: true
        })
    ]
})