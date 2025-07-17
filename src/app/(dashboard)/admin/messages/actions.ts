"use server";

import { db } from "@/db";
import { authschema } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Check if user is admin
async function checkAdminAccess() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  const isAdmin = session.user.role === 'admin' || 
                 (Array.isArray(session.user.role) && session.user.role.includes('admin'));

  if (!isAdmin) {
    throw new Error("Admin access required");
  }

  return session;
}

export async function markMessageAsRead(messageId: string) {
  try {
    await checkAdminAccess();

    await db
      .update(authschema.message)
      .set({ 
        status: 'read',
        updatedAt: new Date()
      })
      .where(eq(authschema.message.id, messageId));

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to mark message as read" 
    };
  }
}

export async function markMessageAsUnread(messageId: string) {
  try {
    await checkAdminAccess();

    await db
      .update(authschema.message)
      .set({ 
        status: 'unread',
        updatedAt: new Date()
      })
      .where(eq(authschema.message.id, messageId));

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error marking message as unread:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to mark message as unread" 
    };
  }
}

export async function archiveMessage(messageId: string) {
  try {
    await checkAdminAccess();

    await db
      .update(authschema.message)
      .set({ 
        status: 'archived',
        updatedAt: new Date()
      })
      .where(eq(authschema.message.id, messageId));

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error archiving message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to archive message" 
    };
  }
}

export async function deleteMessage(messageId: string) {
  try {
    await checkAdminAccess();

    await db
      .update(authschema.message)
      .set({ 
        isDeleted: true,
        updatedAt: new Date()
      })
      .where(eq(authschema.message.id, messageId));

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete message" 
    };
  }
}

export async function bulkUpdateMessages(messageIds: string[], action: 'read' | 'unread' | 'archive' | 'delete') {
  try {
    await checkAdminAccess();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    switch (action) {
      case 'read':
        updateData.status = 'read';
        break;
      case 'unread':
        updateData.status = 'unread';
        break;
      case 'archive':
        updateData.status = 'archived';
        break;
      case 'delete':
        updateData.isDeleted = true;
        break;
      default:
        throw new Error("Invalid action");
    }

    await db
      .update(authschema.message)
      .set(updateData)
      .where(inArray(authschema.message.id, messageIds));

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error performing bulk update:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to perform bulk update" 
    };
  }
}

export async function createMessage(data: {
  subject: string;
  content: string;
  recipientId?: string;
  priority: 'low' | 'normal' | 'high';
  type: 'system' | 'admin' | 'user';
}) {
  try {
    const session = await checkAdminAccess();

    const messageId = crypto.randomUUID();

    await db.insert(authschema.message).values({
      id: messageId,
      subject: data.subject,
      content: data.content,
      sender: session.user.name || 'Admin',
      senderAvatar: session.user.image,
      recipientId: data.recipientId,
      status: 'unread',
      priority: data.priority,
      type: data.type,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    revalidatePath("/admin/messages");
    return { success: true, messageId };
  } catch (error) {
    console.error("Error creating message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create message" 
    };
  }
}

export async function getMessageDetails(messageId: string) {
  try {
    await checkAdminAccess();

    const message = await db
      .select({
        id: authschema.message.id,
        subject: authschema.message.subject,
        content: authschema.message.content,
        sender: authschema.message.sender,
        senderAvatar: authschema.message.senderAvatar,
        status: authschema.message.status,
        priority: authschema.message.priority,
        type: authschema.message.type,
        createdAt: authschema.message.createdAt,
        updatedAt: authschema.message.updatedAt,
        recipientId: authschema.message.recipientId,
        recipientName: authschema.user.name,
        recipientEmail: authschema.user.email,
        recipientImage: authschema.user.image
      })
      .from(authschema.message)
      .leftJoin(authschema.user, eq(authschema.message.recipientId, authschema.user.id))
      .where(eq(authschema.message.id, messageId))
      .limit(1);

    if (message.length === 0) {
      return { success: false, error: "Message not found" };
    }

    return { success: true, message: message[0] };
  } catch (error) {
    console.error("Error fetching message details:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch message details" 
    };
  }
}