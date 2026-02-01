
// Re-exporting Enums to match Prisma Schema
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ARTISAN = 'ARTISAN'
}

export enum ProductType {
  FASHION = 'FASHION',
  JEWELRY = 'JEWELRY',
  HANDLOOM = 'HANDLOOM'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum OrderSource {
  WEB = 'WEB',
  WHATSAPP = 'WHATSAPP'
}

// Domain Models

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface Artisan {
  id: string;
  name: string;
  region: string;
  story: string | null;
  // images field removed from DB model, handled via relations or external assets
  image?: string; // Kept for UI compatibility with Mocks
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: ProductType;
  stock: number;
  categoryId: string;
  artisanId: string | null;
  // UI Compatibility: The UI expects images as string[], but DB has ProductImage[]
  // In a real app, API transforms this. For types, we include both to satisfy UI & DB contexts temporarily.
  images: string[]; 
  
  // Optional relations for UI population
  category?: Category | string; // Union for UI compatibility
  artisan?: Artisan;
  featured?: boolean; // UI specific
  newArrival?: boolean; // UI specific
  material?: string; // UI specific
  variants?: any[]; // UI specific
  sku?: string; // UI specific
}

export interface CartItem extends Product {
  variantId?: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string | null;
  whatsappNumber?: string | null;
  source: OrderSource;
  status: OrderStatus;
  total: number;
  items: OrderItem[] | CartItem[]; // Union to support CartItem until API is ready
  createdAt: Date;
  // UI compatibility
  user?: User;
  date?: string; 
}