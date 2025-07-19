// src/lib/env.ts
import { z, ZodError } from "zod";

// Load dotenv only in Node.js environments (not Edge Runtime)
function loadDotenv() {
    if (
        typeof process !== "undefined" &&
        process.env.NODE_ENV !== "production" &&
        // @ts-expect-error EdgeRuntime is not defined in standard TypeScript types
        typeof globalThis.EdgeRuntime === "undefined"
    ) {
        try {
            // Use require for synchronous loading to avoid top-level await
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const dotenv = require("dotenv");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const dotenvExpand = require("dotenv-expand");
            dotenvExpand.expand(dotenv.config());
        } catch {
            // Silently fail in environments where dotenv isn't available
            // No need to throw error in this case
        }
    }
}

// Load environment variables
loadDotenv();

// Define your schema
const EnvSchema = z.object({
    NODE_ENV: z.string().default("development"),

    DATABASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string().nonempty(),
    BETTER_AUTH_URL: z.string().default("http://localhost:3000"),

    RESEND_API_KEY: z.string().nonempty(),
    RESEND_FROM_EMAIL: z.string(),

    FACEBOOK_CLIENT_ID: z.string(),
    FACEBOOK_CLIENT_SECRET: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    MICROSOFT_CLIENT_ID: z.string(),
    MICROSOFT_CLIENT_SECRET: z.string(),

    UPLOADTHING_TOKEN: z.string(),

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),

    CAKE_AUDIENCE_ID: z.string()
});

type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
    env = EnvSchema.parse(process.env);
} catch (error) {
    if (error instanceof ZodError) {
        let message = "❌ Missing or invalid required values in .env:\n\n";
        for (const issue of error.issues) {
            message += `- ${issue.path.join(".")}: ${issue.message}\n`;
        }
        throw new Error(message);
    } else {
        throw error;
    }
}

export { env };
