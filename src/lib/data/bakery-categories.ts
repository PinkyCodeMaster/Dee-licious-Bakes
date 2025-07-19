// Bakery-specific category definitions and utilities

export interface BakerySubcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface BakeryCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  subcategories?: BakerySubcategory[];
}

export const BAKERY_CATEGORIES: BakeryCategory[] = [
  {
    id: 'cakes',
    name: 'Cakes',
    slug: 'cakes',
    description: 'Custom and ready-made cakes for all occasions',
    sortOrder: 1,
    subcategories: [
      {
        id: 'birthday-cakes',
        name: 'Birthday Cakes',
        slug: 'birthday-cakes',
        description: 'Celebration cakes perfect for birthdays',
        sortOrder: 1,
      },
      {
        id: 'wedding-cakes',
        name: 'Wedding Cakes',
        slug: 'wedding-cakes',
        description: 'Elegant wedding cakes for your special day',
        sortOrder: 2,
      },
      {
        id: 'cupcakes',
        name: 'Cupcakes',
        slug: 'cupcakes',
        description: 'Individual portion cakes perfect for any occasion',
        sortOrder: 3,
      },
      {
        id: 'celebration-cakes',
        name: 'Celebration Cakes',
        slug: 'celebration-cakes',
        description: 'Special occasion cakes for graduations, anniversaries, and more',
        sortOrder: 4,
      },
    ],
  },
  {
    id: 'pastries',
    name: 'Pastries',
    slug: 'pastries',
    description: 'Fresh baked pastries and sweet treats',
    sortOrder: 2,
    subcategories: [
      {
        id: 'croissants',
        name: 'Croissants',
        slug: 'croissants',
        description: 'Buttery, flaky croissants baked fresh daily',
        sortOrder: 1,
      },
      {
        id: 'danish-pastries',
        name: 'Danish Pastries',
        slug: 'danish-pastries',
        description: 'Sweet Danish pastries with various fillings',
        sortOrder: 2,
      },
      {
        id: 'eclairs',
        name: 'Éclairs',
        slug: 'eclairs',
        description: 'Classic French éclairs with cream filling',
        sortOrder: 3,
      },
    ],
  },
  {
    id: 'cookies',
    name: 'Cookies',
    slug: 'cookies',
    description: 'Homemade cookies and biscuits',
    sortOrder: 3,
    subcategories: [
      {
        id: 'chocolate-chip',
        name: 'Chocolate Chip',
        slug: 'chocolate-chip',
        description: 'Classic chocolate chip cookies',
        sortOrder: 1,
      },
      {
        id: 'sugar-cookies',
        name: 'Sugar Cookies',
        slug: 'sugar-cookies',
        description: 'Decorated sugar cookies for special occasions',
        sortOrder: 2,
      },
      {
        id: 'shortbread',
        name: 'Shortbread',
        slug: 'shortbread',
        description: 'Traditional buttery shortbread cookies',
        sortOrder: 3,
      },
    ],
  },
  {
    id: 'bread',
    name: 'Bread',
    slug: 'bread',
    description: 'Fresh baked breads and rolls',
    sortOrder: 4,
    subcategories: [
      {
        id: 'artisan-loaves',
        name: 'Artisan Loaves',
        slug: 'artisan-loaves',
        description: 'Handcrafted artisan bread loaves',
        sortOrder: 1,
      },
      {
        id: 'dinner-rolls',
        name: 'Dinner Rolls',
        slug: 'dinner-rolls',
        description: 'Soft dinner rolls perfect for any meal',
        sortOrder: 2,
      },
      {
        id: 'specialty-breads',
        name: 'Specialty Breads',
        slug: 'specialty-breads',
        description: 'Unique and seasonal bread varieties',
        sortOrder: 3,
      },
    ],
  },
  {
    id: 'seasonal',
    name: 'Seasonal Specials',
    slug: 'seasonal',
    description: 'Limited-time seasonal baked goods',
    sortOrder: 5,
    subcategories: [
      {
        id: 'holiday-treats',
        name: 'Holiday Treats',
        slug: 'holiday-treats',
        description: 'Special treats for holidays and celebrations',
        sortOrder: 1,
      },
      {
        id: 'seasonal-flavors',
        name: 'Seasonal Flavors',
        slug: 'seasonal-flavors',
        description: 'Limited-time flavors using seasonal ingredients',
        sortOrder: 2,
      },
    ],
  },
];

// Bakery-specific tags for filtering and categorization
export const BAKERY_TAGS = [
  // Dietary tags
  { name: 'Gluten-Free', type: 'dietary', color: '#10B981' },
  { name: 'Dairy-Free', type: 'dietary', color: '#3B82F6' },
  { name: 'Vegan', type: 'dietary', color: '#059669' },
  { name: 'Sugar-Free', type: 'dietary', color: '#8B5CF6' },
  { name: 'Nut-Free', type: 'dietary', color: '#F59E0B' },
  
  // Occasion tags
  { name: 'Birthday', type: 'occasion', color: '#EC4899' },
  { name: 'Wedding', type: 'occasion', color: '#F97316' },
  { name: 'Anniversary', type: 'occasion', color: '#EF4444' },
  { name: 'Graduation', type: 'occasion', color: '#6366F1' },
  { name: 'Baby Shower', type: 'occasion', color: '#14B8A6' },
  { name: 'Corporate', type: 'occasion', color: '#64748B' },
  
  // Flavor tags
  { name: 'Chocolate', type: 'flavor', color: '#92400E' },
  { name: 'Vanilla', type: 'flavor', color: '#FDE047' },
  { name: 'Strawberry', type: 'flavor', color: '#FB7185' },
  { name: 'Lemon', type: 'flavor', color: '#FCD34D' },
  { name: 'Caramel', type: 'flavor', color: '#D97706' },
  { name: 'Red Velvet', type: 'flavor', color: '#DC2626' },
  { name: 'Carrot', type: 'flavor', color: '#EA580C' },
  
  // Style tags
  { name: 'Custom Design', type: 'style', color: '#7C3AED' },
  { name: 'Rustic', type: 'style', color: '#A3A3A3' },
  { name: 'Elegant', type: 'style', color: '#1F2937' },
  { name: 'Fun & Colorful', type: 'style', color: '#F472B6' },
  { name: 'Minimalist', type: 'style', color: '#6B7280' },
  
  // Texture tags
  { name: 'Moist', type: 'texture', color: '#06B6D4' },
  { name: 'Fluffy', type: 'texture', color: '#E5E7EB' },
  { name: 'Dense', type: 'texture', color: '#78716C' },
  { name: 'Crispy', type: 'texture', color: '#F59E0B' },
  { name: 'Chewy', type: 'texture', color: '#84CC16' },
];

// Common allergens for bakery products
export const BAKERY_ALLERGENS = [
  { name: 'Wheat/Gluten', description: 'Contains wheat flour and gluten', severity: 'severe' },
  { name: 'Eggs', description: 'Contains eggs or egg products', severity: 'moderate' },
  { name: 'Dairy/Milk', description: 'Contains milk, butter, or dairy products', severity: 'moderate' },
  { name: 'Nuts', description: 'Contains tree nuts (almonds, walnuts, etc.)', severity: 'severe' },
  { name: 'Peanuts', description: 'Contains peanuts or peanut products', severity: 'severe' },
  { name: 'Soy', description: 'Contains soy or soy products', severity: 'mild' },
  { name: 'Sesame', description: 'Contains sesame seeds or sesame oil', severity: 'moderate' },
];

// Bakery-specific product sizes and serving information
export const BAKERY_SIZES = {
  cakes: [
    { name: '6-inch', serves: '6-8 people', description: 'Perfect for small gatherings' },
    { name: '8-inch', serves: '10-12 people', description: 'Great for family celebrations' },
    { name: '10-inch', serves: '15-20 people', description: 'Ideal for parties' },
    { name: '12-inch', serves: '25-30 people', description: 'Perfect for large events' },
    { name: 'Sheet Cake', serves: '30-40 people', description: 'Great for big celebrations' },
  ],
  cupcakes: [
    { name: 'Mini', serves: '1-2 bites', description: 'Perfect for sampling' },
    { name: 'Standard', serves: '1 person', description: 'Classic cupcake size' },
    { name: 'Jumbo', serves: '2-3 people', description: 'Extra large treat' },
  ],
  cookies: [
    { name: 'Small', serves: '1 person', description: '2-inch cookies' },
    { name: 'Medium', serves: '1 person', description: '3-inch cookies' },
    { name: 'Large', serves: '1-2 people', description: '4-inch cookies' },
    { name: 'Giant', serves: '2-3 people', description: '6-inch cookies' },
  ],
  pastries: [
    { name: 'Individual', serves: '1 person', description: 'Single serving pastry' },
    { name: 'Sharing', serves: '2-3 people', description: 'Perfect for sharing' },
  ],
};

// Preparation times for different bakery items
export const PREPARATION_TIMES = {
  'ready-made': '0-30 minutes',
  'same-day': '2-4 hours',
  'next-day': '24 hours',
  'custom-order': '2-3 days',
  'wedding-cake': '1-2 weeks',
  'special-occasion': '3-5 days',
};

// Helper function to get category hierarchy
export function getCategoryHierarchy() {
  const hierarchy: Record<string, Omit<BakeryCategory, 'subcategories'> & { subcategories: Record<string, BakerySubcategory> }> = {};
  
  BAKERY_CATEGORIES.forEach(category => {
    hierarchy[category.slug] = {
      ...category,
      subcategories: category.subcategories?.reduce((acc, sub) => {
        acc[sub.slug] = sub;
        return acc;
      }, {} as Record<string, BakerySubcategory>) || {},
    };
  });
  
  return hierarchy;
}

// Helper function to get all category slugs
export function getAllCategorySlugs(): string[] {
  const slugs: string[] = [];
  
  BAKERY_CATEGORIES.forEach(category => {
    slugs.push(category.slug);
    if (category.subcategories) {
      category.subcategories.forEach(sub => {
        slugs.push(sub.slug);
      });
    }
  });
  
  return slugs;
}

// Helper function to get category by slug
export function getCategoryBySlug(slug: string) {
  for (const category of BAKERY_CATEGORIES) {
    if (category.slug === slug) {
      return category;
    }
    if (category.subcategories) {
      const subcategory = category.subcategories.find(sub => sub.slug === slug);
      if (subcategory) {
        return { ...subcategory, parent: category };
      }
    }
  }
  return null;
}