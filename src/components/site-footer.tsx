import { BAKERY_BRAND, BAKERY_EMAIL, BAKERY_ADDRESS, DEVELOPER_NAME } from "@/lib/constants/brand";
import { Cake, Mail, MapPin, Heart } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-pink-500 flex items-center justify-center">
                <Cake className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-pink-600 dark:text-pink-400">{BAKERY_BRAND.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {BAKERY_BRAND.description} - {BAKERY_BRAND.tagline}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${BAKERY_EMAIL}`} className="hover:text-primary transition-colors">
                  {BAKERY_EMAIL}
                </a>
              </div>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{BAKERY_ADDRESS}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/login" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {BAKERY_BRAND.name}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              Website made with <Heart className="h-3 w-3 mx-1 text-red-500" /> by {DEVELOPER_NAME}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}