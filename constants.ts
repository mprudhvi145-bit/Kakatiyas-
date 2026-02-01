import { Product, Artisan } from './types';

export const BRAND_NAME = "KAKATIYAS";
export const CURRENCY = "₹";

export const ARTISANS: Artisan[] = [
  {
    id: 'a1',
    name: 'Master Weaver Rao',
    region: 'Warangal',
    story: 'Third-generation weaver specializing in intricate Kakatiya motifs using pure gold zari.',
    image: 'https://picsum.photos/id/1005/400/400'
  },
  {
    id: 'a2',
    name: 'Lakshmi Devi',
    region: 'Pochampally',
    story: 'Expert in Ikat dyeing techniques passed down through centuries of family tradition.',
    image: 'https://picsum.photos/id/1011/400/400'
  },
  {
    id: 'a3',
    name: 'Vishwakarma Brothers',
    region: 'Hyderabad',
    story: 'Creating temple jewelry inspired by the Ramappa Temple sculptures.',
    image: 'https://picsum.photos/id/1025/400/400'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sku: 'KAK-SILK-001',
    name: 'Royal Warangal Silk Saree',
    description: 'Handwoven silk saree featuring the iconic hamsa motif in muted gold zari. A tribute to the royal court attire of the Kakatiya era.',
    price: 45000,
    category: 'HANDLOOM',
    material: 'Pure Silk & Gold Zari',
    images: ['https://picsum.photos/id/106/800/1000', 'https://picsum.photos/id/109/800/1000'],
    artisanId: 'a1',
    variants: [
      { id: 'v1', name: 'Standard', priceModifier: 0, stock: 5 },
      { id: 'v2', name: 'Custom Blouse Piece', priceModifier: 2000, stock: 5 }
    ],
    featured: true
  },
  {
    id: 'p2',
    sku: 'KAK-JEWEL-002',
    name: 'Rudrama Ruby Necklace',
    description: 'Heirloom-grade necklace set with unfinished rubies and pearls, designed to reflect the warrior queen Rudrama Devi’s elegance.',
    price: 125000,
    category: 'JEWELRY',
    material: '22k Gold, Rubies, Pearls',
    images: ['https://picsum.photos/id/112/800/1000', 'https://picsum.photos/id/113/800/1000'],
    artisanId: 'a3',
    variants: [
      { id: 'v3', name: 'Standard', priceModifier: 0, stock: 1 }
    ],
    featured: true,
    newArrival: true
  },
  {
    id: 'p3',
    sku: 'KAK-FASH-003',
    name: 'Indigo Block Print Tunic',
    description: 'Contemporary silhouette meeting traditional block printing. Made from organic cotton sourced from the Godavari belt.',
    price: 8500,
    category: 'FASHION',
    material: 'Organic Cotton',
    images: ['https://picsum.photos/id/129/800/1000', 'https://picsum.photos/id/130/800/1000'],
    artisanId: 'a2',
    variants: [
      { id: 'v4', name: 'S', priceModifier: 0, stock: 10 },
      { id: 'v5', name: 'M', priceModifier: 0, stock: 12 },
      { id: 'v6', name: 'L', priceModifier: 0, stock: 8 }
    ]
  },
  {
    id: 'p4',
    sku: 'KAK-HAND-004',
    name: 'Telangana Cotton Dhoti',
    description: 'Ceremonial dhoti with wide gold borders. Breathable, regal, and crafted with precision.',
    price: 6000,
    category: 'HANDLOOM',
    material: 'Cotton',
    images: ['https://picsum.photos/id/158/800/1000'],
    artisanId: 'a1',
    variants: [
      { id: 'v7', name: 'Standard', priceModifier: 0, stock: 20 }
    ],
    newArrival: true
  },
  {
    id: 'p5',
    sku: 'KAK-JEWEL-005',
    name: 'Temple Arch Earrings',
    description: 'Gold earrings mimicking the stone arches of the Thousand Pillar Temple.',
    price: 35000,
    category: 'JEWELRY',
    material: '22k Gold',
    images: ['https://picsum.photos/id/146/800/1000'],
    artisanId: 'a3',
    variants: [
      { id: 'v8', name: 'Standard', priceModifier: 0, stock: 3 }
    ]
  }
];
