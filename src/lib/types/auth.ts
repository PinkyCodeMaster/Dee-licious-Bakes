import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { user, session, account, verification } from "@/db/schema/auth";

// User types
export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

// Session types
export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;

// Account types
export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;

// Verification types
export type Verification = InferSelectModel<typeof verification>;
export type NewVerification = InferInsertModel<typeof verification>;

// Extended user type with relationships
export type UserWithAccounts = User & {
  accounts?: Account[];
  sessions?: Session[];
};

// User role enum (if not already defined in auth schema)
export type UserRole = 'user' | 'admin';

// User status enum (if not already defined in auth schema)
export type UserStatus = 'active' | 'inactive' | 'banned';