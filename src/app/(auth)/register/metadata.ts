import { BAKERY_META } from "@/lib/constants/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sign Up | ${BAKERY_META.title}`,
  description: `Create your ${BAKERY_META.title} account to place orders and manage your bakery preferences.`,
};