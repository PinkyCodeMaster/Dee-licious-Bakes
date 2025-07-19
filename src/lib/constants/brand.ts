/**
 * Bakery Brand Constants
 * Centralized configuration for Dee-licious Bakes branding and information
 */

export const BAKERY_BRAND = {
  name: "Dee-licious Bakes",
  owner: "Deanna Jones",
  address: "The Penruddocke Arms Hindon Rd, Salisbury SP3 5EL",
  email: "info@deeliciousbakes.co.uk",
  website: "https://deeliciousbakes.co.uk/",
  developer: "Scott Jones",
  phone: "", // Add phone number if available
  description: "Artisan bakery specializing in custom cakes, pastries, and baked goods",
  tagline: "Freshly baked with love",
} as const;

export const BAKERY_CONTACT = {
  email: BAKERY_BRAND.email,
  address: BAKERY_BRAND.address,
  owner: BAKERY_BRAND.owner,
} as const;

export const BAKERY_META = {
  title: BAKERY_BRAND.name,
  description: `${BAKERY_BRAND.description} - ${BAKERY_BRAND.tagline}`,
  keywords: "bakery, cakes, pastries, custom cakes, Salisbury, baked goods, artisan",
  author: BAKERY_BRAND.developer,
} as const;

export const BAKERY_SOCIAL = {
  // Add social media links when available
  facebook: "",
  instagram: "",
  twitter: "",
} as const;

// Export individual constants for convenience
export const BAKERY_NAME = BAKERY_BRAND.name;
export const BAKERY_OWNER = BAKERY_BRAND.owner;
export const BAKERY_EMAIL = BAKERY_BRAND.email;
export const BAKERY_ADDRESS = BAKERY_BRAND.address;
export const BAKERY_WEBSITE = BAKERY_BRAND.website;
export const DEVELOPER_NAME = BAKERY_BRAND.developer;