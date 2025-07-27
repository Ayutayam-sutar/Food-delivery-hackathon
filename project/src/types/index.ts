export interface User {
  profileInitial: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
  image: string;
  price: number;
  lastUpdated: Date;
}

export interface Supplier {
  id: string;
  name: string;
  businessName: string;
  rating: number;
  trustScore: number;
  distance: number;
  image: string;
  specialties: string[];
  responseTime: string;
  verified: boolean;
}

export interface SurplusOffer {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  originalPrice: number;
  discountedPrice: number;
  expiryDate: Date;
  image: string;
  vendor: {
    name: string;
    rating: number;
  };
}

export interface Request {
  id: string;
  type: 'inventory' | 'surplus' | 'supplier';
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  quantity?: number;
  price?: number;
}

export interface AppState {
  isDemo: boolean;
  user: User | null;
  currentPage: string;
  showGuidedTour: boolean;
  inventory: InventoryItem[];
  requests: Request[];
  notifications: Request[];
}