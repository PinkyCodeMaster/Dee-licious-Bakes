"use client";

import { Shield, Users, ShoppingBag, BarChart3, User, FolderTree, Package, ChefHat } from "lucide-react";
import { BaseSidebar } from "./base-sidebar";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null | undefined;
}

interface AdminSidebarProps {
  user: User;
}

const navigation = [
  {
    title: "Bakery Management",
    items: [
      { name: "Dashboard", href: "/admin", icon: BarChart3 },
      { name: "Customers", href: "/admin/users", icon: Users },
      { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    ]
  },
  {
    title: "Catalog Management",
    items: [
      { name: "Catalog Overview", href: "/admin/catalog", icon: BarChart3 },
      { name: "Categories", href: "/admin/catalog/categories", icon: FolderTree },
      { name: "Products", href: "/admin/catalog/products", icon: Package },
      { name: "Recipes", href: "/admin/catalog/recipes", icon: ChefHat },
    ]
  },
  {
    title: "Personal",
    items: [
      { name: "My Account", href: "/account", icon: User },
    ]
  }
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <BaseSidebar user={user} title="Admin Panel" titleIcon={Shield} navigation={navigation} userBadge={{ text: "Admin", icon: Shield }} />
  );
}