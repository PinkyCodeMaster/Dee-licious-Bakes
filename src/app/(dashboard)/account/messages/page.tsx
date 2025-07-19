"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, 
  Plus, 
  Search,
  Filter,
  Send,
  Clock,
  CheckCircle,
  Mail
} from "lucide-react";

// TypeScript interfaces for message data
interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  senderAvatar: string | null;
  status: "read" | "unread";
  priority: "high" | "normal" | "low";
  createdAt: string;
  updatedAt: string;
}

interface ComposeData {
  subject: string;
  content: string;
}

// Mock data - in a real app, this would come from an API
const mockMessages: Message[] = [
  {
    id: "1",
    subject: "Welcome to our platform!",
    content: "Thank you for joining us. We're excited to have you on board.",
    sender: "System",
    senderAvatar: null,
    status: "read" as const,
    priority: "normal" as const,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    subject: "Order confirmation #12345",
    content: "Your order has been confirmed and is being processed.",
    sender: "Orders Team",
    senderAvatar: null,
    status: "unread" as const,
    priority: "high" as const,
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    subject: "Monthly newsletter",
    content: "Check out what's new this month and upcoming features.",
    sender: "Marketing",
    senderAvatar: null,
    status: "read" as const,
    priority: "low" as const,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z"
  }
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [filteredMessages, setFilteredMessages] = useState(mockMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState<ComposeData>({
    subject: "",
    content: ""
  });

  const filterMessages = useCallback(() => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(message => message.status === statusFilter);
    }

    setFilteredMessages(filtered);
  }, [searchTerm, statusFilter, messages]);

  useEffect(() => {
    filterMessages();
  }, [filterMessages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString("en-US", {
        weekday: "short"
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status: "read" } : msg
      )
    );
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      markAsRead(message.id);
    }
  };

  const handleCompose = () => {
    // In a real app, this would send the message to an API
    setIsComposeOpen(false);
    setComposeData({ subject: "", content: "" });
    // You could add a toast notification here
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "read":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "unread":
        return <Mail className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const unreadCount = messages.filter(msg => msg.status === "unread").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            Manage your conversations and notifications
            {unreadCount > 0 && (
              <Badge className="ml-2" variant="destructive">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
              <DialogDescription>
                Send a message to our support team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter message subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={composeData.content}
                  onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Type your message here..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompose}>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Messages ({filteredMessages.length})
          </h2>
          
          {filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No messages found</p>
                <p className="text-sm text-gray-400">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Your messages will appear here"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""
                } ${message.status === "unread" ? "bg-blue-50" : ""}`}
                onClick={() => handleMessageClick(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.senderAvatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {message.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {message.sender}
                        </p>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(message.status)}
                          <span className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm font-medium text-gray-900 truncate mt-1">
                        {message.subject}
                      </p>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {message.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedMessage.senderAvatar || undefined} />
                      <AvatarFallback>
                        {selectedMessage.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <CardDescription>
                        From {selectedMessage.sender} • {formatDate(selectedMessage.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(selectedMessage.priority)}>
                      {selectedMessage.priority}
                    </Badge>
                    {getStatusIcon(selectedMessage.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Received {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                  <Button variant="outline" size="sm">
                    Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a message
                </h3>
                <p className="text-gray-500">
                  Choose a message from the list to view its contents
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}