"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Verify admin access for all actions
async function verifyAdminAccess() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === 'admin' || 
                 (Array.isArray(session.user.role) && session.user.role.includes('admin'));

  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return session;
}

export async function setUserRole(userId: string, targetRole: string) {
  try {
    await verifyAdminAccess();
    
    const updatedUser = await authClient.admin.setRole({
      userId,
      role: targetRole as 'admin' | 'user',
    });

    revalidatePath("/admin/users");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error setting user role:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update user role" 
    };
  }
}

export async function banUser(userId: string) {
  try {
    await verifyAdminAccess();
    
    const bannedUser = await authClient.admin.banUser({
      userId,
    });

    revalidatePath("/admin/users");
    return { success: true, user: bannedUser };
  } catch (error) {
    console.error("Error banning user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to ban user" 
    };
  }
}

export async function unbanUser(userId: string) {
  try {
    await verifyAdminAccess();
    
    const unbannedUser = await authClient.admin.unbanUser({
      userId,
    });

    revalidatePath("/admin/users");
    return { success: true, user: unbannedUser };
  } catch (error) {
    console.error("Error unbanning user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to unban user" 
    };
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}) {
  try {
    await verifyAdminAccess();
    
    const newUser = await authClient.admin.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "user",
      data: {
        // Additional user data can be added here
      },
    });

    revalidatePath("/admin/users");
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create user" 
    };
  }
}