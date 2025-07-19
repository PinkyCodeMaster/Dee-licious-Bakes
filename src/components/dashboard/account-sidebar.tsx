"use client";

import { User as userIcon, ShoppingBag, Home } from "lucide-react";
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
      { name: "My Orders", href: "/account/orders", icon: ShoppingBag },
    ]
  }
];

export function AccountSidebar({ user }: AccountSidebarProps) {
  return (
    <BaseSidebar user={user} title="My Account" navigation={navigation} />
  );
}