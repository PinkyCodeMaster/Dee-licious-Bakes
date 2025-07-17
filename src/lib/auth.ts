import { sendPasswordResetEmail, sendEmailVerification, sendEmailChangeVerification, sendAccountDeletionVerification, sendAccountDeletionConfirmation, } from "../emails/utils/email-sender";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, anonymous } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { authschema } from "@/db/schema";
import { stripeClient } from "./stripe";
import { db } from "@/db";
import { env } from "./env";

export const auth = betterAuth({
    appName: "My App",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authschema
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail(user.email, {
                resetUrl: url,
                userEmail: user.email,
                expirationTime: "24 hours",
            });
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmailVerification(user.email, {
                verificationUrl: url,
                userEmail: user.email,
                userName: user.name,
            });
        },
        autoSignInAfterVerification: true,
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, url, newEmail }) => {
                await sendEmailChangeVerification(user.email, {
                    approvalUrl: url,
                    oldEmail: user.email,
                    newEmail: newEmail,
                    userName: user.name,
                });
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                await sendAccountDeletionVerification(user.email, {
                    confirmationUrl: url,
                    userEmail: user.email,
                    userName: user.name,
                });
            },
            beforeDelete: async (user) => {
                if (user.email.includes("admin")) {
                    const error = new Error("Admin accounts can't be deleted");
                    error.name = "BAD_REQUEST";
                    throw error;
                } else {
                    // Delete users from db 
                }
            },
            afterDelete: async (user) => {
                await sendAccountDeletionConfirmation(user.email, {
                    userEmail: user.email,
                    userName: user.name,
                    deletionDate: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                });
            },
        }
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "facebook", "microsoft", "email-password"],
            allowDifferentEmails: true,
            updateUserInfoOnLink: true,
            allowUnlinkingAll: true
        }
    },
    socialProviders: {
        facebook: {
            clientId: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
            scopes: ["email", "public_profile",]
        },
        google: {
            prompt: "select_account",
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        },
        microsoft: {
            clientId: env.MICROSOFT_CLIENT_ID as string,
            clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
            prompt: "select_account",
        },
    },
    plugins: [
        nextCookies(),
        anonymous(),
        admin({
            adminUserIds: ["NrVRYCpHiLuoOxXe9oO2O6cQbORQkwLd"],
            defaultBanReason: "Spamming",
            defaultBanExpiresIn: 60 * 60 * 24, // 1 day
            bannedUserMessage: "You have been banned please check you emails",
        }),
        stripe({
            stripeClient,
            stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
            createCustomerOnSignUp: true,
            onCustomerCreate: async ({ stripeCustomer, user }) => {
                // Do something with the newly created customer
                console.log(`Customer ${stripeCustomer.id} created for user ${user.id}`);
            },
            onEvent: async (event) => {
                // Handle any Stripe event
                switch (event.type) {
                    case "invoice.paid":
                        // Handle paid invoice
                        break;
                    case "payment_intent.succeeded":
                        // Handle successful payment
                        break;
                }
            },
            subscription: {
                enabled: true,
                getCheckoutSessionParams: async ({ user, plan, }) => {
                    return {
                        params: {
                            allow_promotion_codes: true,
                            tax_id_collection: {
                                enabled: true
                            },
                            billing_address_collection: "required",
                            custom_text: {
                                submit: {
                                    message: "We'll start your subscription right away"
                                }
                            },
                            metadata: {
                                planType: "business",
                                referralCode: user.metadata?.referralCode
                            }
                        },
                        options: {
                            idempotencyKey: `sub_${user.id}_${plan.name}_${Date.now()}`
                        }
                    };
                },
                plans: [
                    {
                        name: "basic", // the name of the plan, it'll be automatically lower cased when stored in the database
                        priceId: "price_1234567890", // the price ID from stripe
                        annualDiscountPriceId: "price_1234567890", // (optional) the price ID for annual billing with a discount
                        limits: {
                            projects: 5,
                            storage: 10
                        }
                    },
                    {
                        name: "pro",
                        priceId: "price_0987654321",
                        limits: {
                            projects: 20,
                            storage: 50
                        },
                        freeTrial: {
                            days: 14,
                        }
                    },
                ],
                // onSubscriptionComplete: async ({ event, subscription, stripeSubscription, plan }) => {
                //     // Called when a subscription is successfully created
                //     await sendWelcomeEmail(subscription.referenceId, plan.name);
                // },
                // onSubscriptionUpdate: async ({ event, subscription }) => {
                //     // Called when a subscription is updated
                //     console.log(`Subscription ${subscription.id} updated`);
                // },
                // onSubscriptionCancel: async ({ event, subscription, stripeSubscription, cancellationDetails }) => {
                //     // Called when a subscription is canceled
                //     await sendCancellationEmail(subscription.referenceId);
                // },
                // onSubscriptionDeleted: async ({ event, subscription, stripeSubscription }) => {
                //     // Called when a subscription is deleted
                //     console.log(`Subscription ${subscription.id} deleted`);
                // }
            }
        })
    ]
});