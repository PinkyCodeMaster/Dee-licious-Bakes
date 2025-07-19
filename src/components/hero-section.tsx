"use client";

import { EmailSignupForm } from "@/components/email-signup-form";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  backgroundImage?: string;
  className?: string;
}

export function HeroSection({
  title = "Dee's Delicious Cakes",
  subtitle = "Handcrafted with love, baked to perfection. Get exclusive updates on new flavors, special offers, and cake decorating tips delivered straight to your inbox.",
  ctaText = "Join Our Sweet Community",
  backgroundImage = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80",
  className,
}: HeroSectionProps) {
  return (
    <section 
      className={cn(
        "relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden",
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      {/* Gradient Background (fallback when no image) */}
      {!backgroundImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-yellow-950/20" />
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <div className="space-y-6 sm:space-y-8">
          {/* Main Headline */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className={cn(
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight",
              backgroundImage 
                ? "text-white drop-shadow-lg" 
                : "text-gray-900 dark:text-gray-100"
            )}>
              {title}
            </h1>
            
            <p className={cn(
              "text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-4",
              backgroundImage 
                ? "text-white/90 drop-shadow-md" 
                : "text-gray-600 dark:text-gray-300"
            )}>
              {subtitle}
            </p>
          </div>

          {/* Email Signup Form */}
          <div className="max-w-md mx-auto px-4">
            <div className={cn(
              "p-4 sm:p-6 rounded-2xl backdrop-blur-sm border shadow-lg",
              backgroundImage 
                ? "bg-white/95 dark:bg-gray-900/95 border-white/20" 
                : "bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50"
            )}>
              <EmailSignupForm
                variant="hero"
                title={ctaText}
                description="No spam, just sweet updates!"
                placeholder="Enter your email for sweet updates"
                buttonText="Get Sweet Updates"
                className="space-y-4"
              />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm px-4">
            <div className={cn(
              "flex items-center gap-2",
              backgroundImage 
                ? "text-white/80" 
                : "text-gray-500 dark:text-gray-400"
            )}>
              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
              <span>Fresh ingredients daily</span>
            </div>
            <div className={cn(
              "flex items-center gap-2",
              backgroundImage 
                ? "text-white/80" 
                : "text-gray-500 dark:text-gray-400"
            )}>
              <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></span>
              <span>Custom designs available</span>
            </div>
            <div className={cn(
              "flex items-center gap-2",
              backgroundImage 
                ? "text-white/80" 
                : "text-gray-500 dark:text-gray-400"
            )}>
              <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
              <span>Local delivery & pickup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-200/30 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-200/30 rounded-full blur-xl animate-pulse delay-500" />
    </section>
  );
}