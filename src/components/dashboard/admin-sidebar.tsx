"use client";

import { Shield, Users, MessageSquare, ShoppingBag, CreditCard, BarChart3, User } from "lucide-react";
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