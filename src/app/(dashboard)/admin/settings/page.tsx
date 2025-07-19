import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BAKERY_EMAIL } from "@/lib/constants/brand";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Mail,
  Users,
  Bell,
  Globe,
  Palette,
  Save
} from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bakery Settings</h1>
        <p className="text-muted-foreground">
          Configure bakery settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Bakery Information
              </CardTitle>
              <CardDescription>
                Basic bakery information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bakery-name">Bakery Name</Label>
                  <Input id="bakery-name" placeholder="Dee-licious Bakes" defaultValue="Dee-licious Bakes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bakery-address">Bakery Address</Label>
                  <Input id="bakery-address" placeholder="The Penruddocke Arms Hindon Rd, Salisbury SP3 5EL" defaultValue="The Penruddocke Arms Hindon Rd, Salisbury SP3 5EL" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bakery-description">Bakery Description</Label>
                <Textarea 
                  id="bakery-description" 
                  placeholder="A brief description of your bakery and specialties"
                  rows={3}
                  defaultValue="Artisan bakery specializing in custom cakes, fresh pastries, and delicious baked goods made with love."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" placeholder={BAKERY_EMAIL} defaultValue={BAKERY_EMAIL} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme by default
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>
                Configure email delivery settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" type="number" placeholder="587" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input id="smtp-username" placeholder="your-email@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Password</Label>
                  <Input id="smtp-password" type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Use TLS</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable TLS encryption for email delivery
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline">
                Test Email Configuration
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Email Templates
              </CardTitle>
              <CardDescription>
                Customize email templates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcome-subject">Welcome Email Subject</Label>
                <Input id="welcome-subject" placeholder="Welcome to [Site Name]!" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-subject">Email Verification Subject</Label>
                <Input id="verification-subject" placeholder="Please verify your email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-subject">Password Reset Subject</Label>
                <Input id="reset-subject" placeholder="Reset your password" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Welcome Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send welcome emails to new users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Settings */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Customer Registration
              </CardTitle>
              <CardDescription>
                Control how customers can register and access your bakery website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new customers to create accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Customers must verify their email before placing orders
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}