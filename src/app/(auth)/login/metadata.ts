import { BAKERY_META } from "@/lib/constants/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sign In | ${BAKERY_META.title}`,
  description: `Sign in to your ${BAKERY_META.title} account to manage orders and view your bakery account.`,
};