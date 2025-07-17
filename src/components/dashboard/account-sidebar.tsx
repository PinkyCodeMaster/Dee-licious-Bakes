"use client";

import { User as userIcon, MessageSquare, ShoppingBag, CreditCard, Home } from "lucide-react";
import { BaseSidebar } from "./base-sidebar";
import { type User } from "better-auth";

interface AccountSidebarProps {
  user: User;
}

const navigation = [
  {
    items: [
      { name: "Overview", href: "/account", icon: Home },
      { name: "Profile", href: "/account/profile", icon: userIcon },
      { name: "Messages", href: "/account/messages", icon: MessageSquare },
      { name: "Orders", href: "/account/orders", icon: ShoppingBag },
      { name: "Subscriptions", href: "/account/subscriptions", icon: CreditCard },
    ]
  }
];

export function AccountSidebar({ user }: AccountSidebarProps) {
  return (
    <BaseSidebar user={user} title="My Account" navigation={navigation} />
  );
}