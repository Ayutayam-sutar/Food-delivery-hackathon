import { useState, useEffect } from 'react';
import { AppState, User, InventoryItem, Request, Supplier, SurplusOffer } from '../types';

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Onions',
    quantity: 5,
    threshold: 10,
    unit: 'kg',
    image: 'https://images.pexels.com/photos/533282/pexels-photo-533282.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 40,
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Tomatoes',
    quantity: 15,
    threshold: 8,
    unit: 'kg',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 60,
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Green Chili',
    quantity: 2,
    threshold: 5,
    unit: 'kg',
    image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 80,
    lastUpdated: new Date()
  }
];

const mockRequests: Request[] = [
  {
    id: '1',
    type: 'surplus',
    title: ' From Kumar Vegetables',
    description: 'Wants to supply fresh vegetables ',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'inventory',
    title: 'Bulk order request - 50kg Rice',
    description: 'Urgent requirement for weekend festival',
    status: 'pending',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    quantity: 50,
    price: 2500
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    businessName: 'Kumar Fresh Vegetables',
    rating: 4.8,
    trustScore: 95,
    distance: 2.5,
    image: 'https://images.pexels.com/photos/8112196/pexels-photo-8112196.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['Vegetables', 'Fruits', 'Spices'],
    responseTime: '< 2 hours',
    verified: true
  },
  {
    id: '2',
    name: 'Priya Sharma',
    businessName: 'Sharma Spice House',
    rating: 4.6,
    trustScore: 88,
    distance: 1.8,
    image: 'https://images.pexels.com/photos/8112203/pexels-photo-8112203.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['Spices', 'Masalas', 'Dried Goods'],
    responseTime: '< 4 hours',
    verified: true
  },
  {
    id: '3',
    name: 'Mohammad Ali',
    businessName: 'Ali Meat & Poultry',
    rating: 4.9,
    trustScore: 92,
    distance: 3.2,
    image: 'https://images.pexels.com/photos/8112190/pexels-photo-8112190.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialties: ['Meat', 'Poultry', 'Seafood'],
    responseTime: '< 1 hour',
    verified: true
  }
];

export const mockSurplusOffers: SurplusOffer[] = [
  {
    id: '1',
    itemName: 'Fresh Bananas',
    quantity: 20,
    unit: 'kg',
    originalPrice: 800,
    discountedPrice: 500,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    image: 'https://images.pexels.com/photos/2316466/pexels-photo-2316466.jpeg?auto=compress&cs=tinysrgb&w=400',
    vendor: {
      name: 'Fruit Paradise',
      rating: 4.7
    }
  },
  {
    id: '2',
    itemName: 'Bread Loaves',
    quantity: 15,
    unit: 'pieces',
    originalPrice: 450,
    discountedPrice: 200,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    vendor: {
      name: 'City Bakery',
      rating: 4.5
    }
  }
];

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    isDemo: false,
    user: null,
    currentPage: 'landing',
    showGuidedTour: false,
    inventory: [],
    requests: [],
    notifications: []
  });

  const enterDemo = () => {
    setState(prev => ({
      ...prev,
      isDemo: true,
      user: {
        id: 'demo-user',
        name: 'Demo Vendor',
        email: 'demo@vendorlink.com',
        phone: '+91 98765 43210',
        businessName: 'Street Food Corner',
        avatar: 'https://images.pexels.com/photos/8112190/pexels-photo-8112190.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      currentPage: 'dashboard',
      showGuidedTour: !localStorage.getItem('vendorlink-tour-completed'),
      inventory: mockInventory,
      requests: mockRequests,
      notifications: mockRequests.filter(r => r.status === 'pending')
    }));
  };

  const login = (user: User) => {
    setState(prev => ({
      ...prev,
      user,
      currentPage: 'dashboard',
      inventory: mockInventory,
      requests: mockRequests,
      notifications: mockRequests.filter(r => r.status === 'pending')
    }));
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      user: null,
      isDemo: false,
      currentPage: 'landing',
      showGuidedTour: false,
      inventory: [],
      requests: [],
      notifications: []
    }));
  };

  const navigateTo = (page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const completeTour = () => {
    localStorage.setItem('vendorlink-tour-completed', 'true');
    setState(prev => ({ ...prev, showGuidedTour: false }));
  };

  const updateInventory = (items: InventoryItem[]) => {
    setState(prev => ({ ...prev, inventory: items }));
  };

  const addRequest = (request: Request) => {
    setState(prev => ({
      ...prev,
      requests: [request, ...prev.requests],
      notifications: [request, ...prev.notifications]
    }));
  };

  const updateRequestStatus = (id: string, status: Request['status']) => {
    setState(prev => ({
      ...prev,
      requests: prev.requests.map(r => r.id === id ? { ...r, status } : r),
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  return {
    state,
    actions: {
      enterDemo,
      login,
      logout,
      navigateTo,
      completeTour,
      updateInventory,
      addRequest,
      updateRequestStatus
    }
  };
};