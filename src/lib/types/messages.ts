import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { messageThreads, messages, customRequests } from "@/db/schema/messages";
import { User } from "./auth";
import { Order } from "./orders";

// Message thread types
export type MessageThread = InferSelectModel<typeof messageThreads>;
export type NewMessageThread = InferInsertModel<typeof messageThreads>;

// Message types
export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

// Custom request types
export type CustomRequest = InferSelectModel<typeof customRequests>;
export type NewCustomRequest = InferInsertModel<typeof customRequests>;

// Extended types with relationships
export type MessageThreadWithDetails = MessageThread & {
  user?: User | null;
  order?: Order | null;
  messages?: MessageWithSender[];
  unreadCount?: number;
  lastMessage?: Message | null;
};

export type MessageWithSender = Message & {
  sender?: User | null;
  thread?: MessageThread;
};

export type CustomRequestWithDetails = CustomRequest & {
  user?: User;
  order?: Order | null;
};

// Message thread status enum
export type MessageThreadStatus = 'open' | 'closed' | 'pending';

// Message thread priority enum
export type MessageThreadPriority = 'low' | 'normal' | 'high' | 'urgent';

// Custom request status enum
export type CustomRequestStatus = 
  | 'pending'
  | 'reviewing'
  | 'quoted'
  | 'approved'
  | 'declined'
  | 'completed';

// Custom request type enum
export type CustomRequestType = 
  | 'custom_cake'
  | 'custom_cookies'
  | 'special_flavor'
  | 'custom_decoration'
  | 'bulk_order'
  | 'other';

// Message attachments type for JSON field
export type MessageAttachments = {
  files?: {
    url: string;
    name: string;
    size: number;
    type: string;
  }[];
  images?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];
};

// Custom request specifications type for JSON field
export type CustomRequestSpecifications = {
  size?: string;
  servings?: number;
  flavors?: string[];
  decorations?: {
    theme?: string;
    colors?: string[];
    text?: string;
    design?: string;
  };
  dietary?: {
    glutenFree?: boolean;
    vegan?: boolean;
    sugarFree?: boolean;
    nutFree?: boolean;
    dairyFree?: boolean;
  };
  delivery?: {
    date?: string;
    time?: string;
    location?: string;
  };
  customOptions?: Record<string, unknown>;
};

// Reference images type for JSON field
export type CustomRequestReferenceImages = {
  images?: {
    url: string;
    description?: string;
    source?: string;
  }[];
};

// Message filtering and sorting types
export type MessageThreadSortOption = 
  | 'updated-desc'
  | 'updated-asc'
  | 'created-desc'
  | 'created-asc'
  | 'priority'
  | 'status';

export type MessageThreadFilterOptions = {
  status?: MessageThreadStatus[];
  priority?: MessageThreadPriority[];
  userId?: string;
  hasOrder?: boolean;
  unreadOnly?: boolean;
  search?: string;
};

export type CustomRequestSortOption = 
  | 'created-desc'
  | 'created-asc'
  | 'updated-desc'
  | 'updated-asc'
  | 'event-date'
  | 'status';

export type CustomRequestFilterOptions = {
  status?: CustomRequestStatus[];
  requestType?: CustomRequestType[];
  userId?: string;
  hasQuote?: boolean;
  eventDateFrom?: Date;
  eventDateTo?: Date;
  search?: string;
};