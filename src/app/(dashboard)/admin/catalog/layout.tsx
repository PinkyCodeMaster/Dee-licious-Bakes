import type { Metadata } from "next";
import { BAKERY_META } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: {
    default: `Catalog Management | Admin | ${BAKERY_META.title}`,
    template: `%s | Catalog | Admin | ${BAKERY_META.title}`,
  },
  description: `Manage your bakery's catalog - categories, products, and recipes.`,
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}