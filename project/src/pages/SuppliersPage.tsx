import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Search, MapPin, Star, Clock, Shield, Phone, MessageCircle, 
  Filter, ChevronDown, Heart, Award, Truck, CheckCircle, TrendingUp,
  Package, DollarSign, Calendar, Eye, Zap, Globe
} from 'lucide-react';
import { AppState, Request } from '../types';

interface SuppliersPageProps {
  state: AppState;
  onAddRequest: (request: Request) => void;
}

// Enhanced mock suppliers data
const enhancedMockSuppliers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    businessName: 'Fresh Valley Farms',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    rating: 4.8,
    trustScore: 96,
    distance: 2.3,
    responseTime: '< 2 hours',
    specialties: ['Vegetables', 'Organic Produce', 'Herbs'],
    verified: true,
    completedOrders: 1250,
    joinedDate: '2019',
    priceRange: '₹₹',
    deliverySpeed: 'Same Day',
    languages: ['Hindi', 'English'],
    certifications: ['Organic', 'ISO 9001'],
    description: 'Premium organic vegetables directly from farm to your business.',
    isOnline: true,
    lastSeen: 'Active now',
    isFavorite: false,
    badges: ['Top Rated', 'Fast Delivery', 'Verified']
  },
  {
    id: '2',
    name: 'Priya Sharma',
    businessName: 'Spice Garden Co.',
    image: 'https://images.unsplash.com/photo-1738680722152-88b45b3310ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDgyfHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    rating: 4.9,
    trustScore: 98,
    distance: 1.8,
    responseTime: '< 1 hour',
    specialties: ['Spices', 'Condiments', 'Traditional Masalas'],
    verified: true,
    completedOrders: 2100,
    joinedDate: '2018',
    priceRange: '₹₹₹',
    deliverySpeed: '2-4 Hours',
    languages: ['Hindi', 'English', 'Tamil'],
    certifications: ['FSSAI', 'Export Quality'],
    description: 'Authentic Indian spices with traditional grinding methods.',
    isOnline: true,
    lastSeen: 'Active now',
    isFavorite: true,
    badges: ['Premium Quality', 'Export Ready', 'Trusted']
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    businessName: 'Halal Meat Co.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    rating: 4.7,
    trustScore: 94,
    distance: 3.2,
    responseTime: '< 3 hours',
    specialties: ['Halal Meat', 'Poultry', 'Seafood'],
    verified: true,
    completedOrders: 890,
    joinedDate: '2020',
    priceRange: '₹₹₹₹',
    deliverySpeed: 'Next Day',
    languages: ['Hindi', 'English', 'Urdu'],
    certifications: ['Halal Certified', 'HACCP'],
    description: 'Fresh halal meat with proper cold chain management.',
    isOnline: false,
    lastSeen: '2 hours ago',
    isFavorite: false,
    badges: ['Halal Certified', 'Cold Chain']
  },
  {
    id: '4',
    name: 'Lakshmi Devi',
    businessName: 'South Indian Delights',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    rating: 4.6,
    trustScore: 92,
    distance: 4.1,
    responseTime: '< 4 hours',
    specialties: ['Rice Varieties', 'Lentils', 'South Indian Spices'],
    verified: true,
    completedOrders: 750,
    joinedDate: '2021',
    priceRange: '₹₹',
    deliverySpeed: 'Same Day',
    languages: ['Tamil', 'Telugu', 'English'],
    certifications: ['Traditional Methods', 'Quality Assured'],
    description: 'Authentic South Indian ingredients and specialty items.',
    isOnline: true,
    lastSeen: 'Active now',
    isFavorite: false,
    badges: ['Regional Specialist', 'Authentic']
  },
  {
    id: '5',
    name: 'Amit Patel',
    businessName: 'Gujarat Grocery Hub',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    rating: 4.5,
    trustScore: 89,
    distance: 5.8,
    responseTime: '< 6 hours',
    specialties: ['Grains', 'Oil', 'Pickles', 'Snacks'],
    verified: true,
    completedOrders: 1450,
    joinedDate: '2019',
    priceRange: '₹₹',
    deliverySpeed: 'Next Day',
    languages: ['Gujarati', 'Hindi', 'English'],
    certifications: ['ISO 22000', 'FSSAI'],
    description: 'Wide variety of grocery items with competitive pricing.',
    isOnline: true,
    lastSeen: '30 min ago',
    isFavorite: true,
    badges: ['Bulk Supplier', 'Competitive Pricing']
  },
  {
    id: '6',
    name: 'Sunita Singh',
    businessName: 'Organic Orchard',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    rating: 4.9,
    trustScore: 97,
    distance: 3.7,
    responseTime: '< 2 hours',
    specialties: ['Organic Fruits', 'Seasonal Produce', 'Exotic Fruits'],
    verified: true,
    completedOrders: 980,
    joinedDate: '2020',
    priceRange: '₹₹₹',
    deliverySpeed: 'Same Day',
    languages: ['Hindi', 'English'],
    certifications: ['Organic Certified', 'Pesticide Free'],
    description: 'Premium organic fruits sourced directly from orchards.',
    isOnline: true,
    lastSeen: 'Active now',
    isFavorite: false,
    badges: ['Organic', 'Premium Quality', 'Direct Farm']
  },
  {
    id: '7',
    name: 'Ravi Mehta',
    businessName: 'Dairy Fresh Solutions',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
    rating: 4.7,
    trustScore: 93,
    distance: 2.9,
    responseTime: '< 3 hours',
    specialties: ['Dairy Products', 'Milk', 'Cheese', 'Butter'],
    verified: true,
    completedOrders: 1680,
    joinedDate: '2018',
    priceRange: '₹₹₹',
    deliverySpeed: 'Same Day',
    languages: ['Hindi', 'English', 'Marathi'],
    certifications: ['FSSAI', 'Dairy Certified'],
    description: 'Fresh dairy products with strict quality control.',
    isOnline: true,
    lastSeen: '15 min ago',
    isFavorite: false,
    badges: ['Fresh Daily', 'Quality Control', 'B2B Specialist']
  },
  {
    id: '8',
    name: 'Kavya Reddy',
    businessName: 'Seafood Central',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    rating: 4.8,
    trustScore: 95,
    distance: 6.2,
    responseTime: '< 4 hours',
    specialties: ['Fresh Fish', 'Prawns', 'Crabs', 'Frozen Seafood'],
    verified: true,
    completedOrders: 650,
    joinedDate: '2021',
    priceRange: '₹₹₹₹',
    deliverySpeed: 'Same Day',
    languages: ['Telugu', 'Tamil', 'English'],
    certifications: ['Marine Products Export', 'HACCP'],
    description: 'Fresh seafood with proper cold storage and transportation.',
    isOnline: false,
    lastSeen: '1 hour ago',
    isFavorite: true,
    badges: ['Fresh Catch', 'Export Quality', 'Cold Chain']
  }, 
  {
    id: '9',
    name: 'John Patra',
    businessName: 'Fresh Vegetables Co.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    rating: 4.5,
    trustScore: 92,
    distance: 1.2,
    responseTime: '< 1 hour',
    specialties: ['Vegetables', 'Fruits', 'Spices'],
    verified: true,
    completedOrders: 850,
    joinedDate: '2020',
    priceRange: '₹₹',
    deliverySpeed: 'Same Day',
    languages: ['Hindi', 'English', 'Bengali'],
    certifications: ['FSSAI Certified', 'Organic'],
    description: 'Fresh farm vegetables and seasonal fruits delivered daily with quality assurance.',
    isOnline: true,
    lastSeen: 'Active now',
    isFavorite: false,
    badges: ['Fresh Daily', 'Farm Direct', 'Seasonal']
  },
  {
    id: '10',
    name: 'Shreya Mallick',
    businessName: 'Spice World',
    image: 'https://plus.unsplash.com/premium_photo-1752644060827-6ff25232c1b4?w=300&h=300&fit=crop',
    rating: 4.9,
    trustScore: 97,
    distance: 0.8,
    responseTime: '< 30 mins',
    specialties: ['Spices', 'Herbs', 'Seasonings'],
    verified: true,
    completedOrders: 1200,
    joinedDate: '2018',
    priceRange: '₹₹₹',
    deliverySpeed: '2-4 Hours',
    languages: ['Hindi', 'English', 'Odia'],
    certifications: ['Export Quality', 'ISO 22000'],
    description: 'Authentic Indian spices sourced directly from growers with traditional processing methods.',
    isOnline: true,
    lastSeen: 'Active now',
    isFavorite: true,
    badges: ['Premium Quality', 'Traditional', 'Bulk Supplier']
  },
  {
    id: '11',
    name: 'Ahmed Khan',
    businessName: 'Sauces & More',
    image: 'https://images.unsplash.com/photo-1753272379230-d11f5662bcf6?w=300&h=300&fit=crop',
    rating: 4.7,
    trustScore: 94,
    distance: 2.1,
    responseTime: '< 3 hours',
    specialties: ['Tomato Sauces', 'Thickeners', 'Packaged Foods'],
    verified: true,
    completedOrders: 650,
    joinedDate: '2021',
    priceRange: '₹₹₹',
    deliverySpeed: 'Next Day',
    languages: ['Hindi', 'English', 'Urdu'],
    certifications: ['HACCP', 'FSSAI'],
    description: 'Premium quality sauces and food ingredients for restaurants and food businesses.',
    isOnline: false,
    lastSeen: '1 hour ago',
    isFavorite: false,
    badges: ['Consistent Quality', 'B2B Specialist']
  },
  {
    id: '12',
    name: 'Maria Garcia',
    businessName: 'Packaging Bros',
    image: 'https://images.unsplash.com/photo-1752312641088-3c7425261a5c?w=300&h=300&fit=crop',
    rating: 4.9,
    trustScore: 98,
    distance: 4.5,
    responseTime: '< 4 hours',
    specialties: ['Square Boxes', 'Spoons', 'Lids'],
    verified: true,
    completedOrders: 2100,
    joinedDate: '2017',
    priceRange: '₹₹',
    deliverySpeed: 'Same Day',
    languages: ['English', 'Spanish', 'Hindi'],
    certifications: ['ISO 9001', 'Eco-Friendly'],
    description: 'Sustainable packaging solutions for food businesses with bulk order discounts.',
    isOnline: true,
    lastSeen: 'Active now',
    isFavorite: true,
    badges: ['Eco-Friendly', 'Bulk Discounts', 'Reliable']
  },
  {
    id: '13',
    name: 'Arun Thomas',
    businessName: 'Premium Groceries',
    image: 'https://images.unsplash.com/photo-1753161923972-732769865a43?w=300&h=300&fit=crop',
    rating: 4.1,
    trustScore: 85,
    distance: 1.1,
    responseTime: '< 6 hours',
    specialties: ['Groceries', 'Dairy', 'Packaged Foods'],
    verified: true,
    completedOrders: 420,
    joinedDate: '2022',
    priceRange: '₹₹₹',
    deliverySpeed: 'Same Day',
    languages: ['Hindi', 'English', 'Malayalam'],
    certifications: ['FSSAI'],
    description: 'One-stop shop for all grocery needs with focus on premium quality products.',
    isOnline: true,
    lastSeen: '15 mins ago',
    isFavorite: false,
    badges: ['Wide Variety', 'New Arrivals']
  },
  {
    id: '14',
    name: 'Raju Williams',
    businessName: 'Wholesale Groceries',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=300&h=300&fit=crop',
    rating: 4.9,
    trustScore: 96,
    distance: 3.1,
    responseTime: '< 2 hours',
    specialties: ['Groceries', 'Dairy', 'Packaged Foods'],
    verified: true,
    completedOrders: 1800,
    joinedDate: '2019',
    priceRange: '₹₹',
    deliverySpeed: 'Same Day',
    languages: ['Hindi', 'English', 'Telugu'],
    certifications: ['FSSAI', 'Bulk Handling Certified'],
    description: 'Wholesale grocery supplier with competitive pricing and reliable delivery network.',
    isOnline: false,
    lastSeen: '2 hours ago',
    isFavorite: true,
    badges: ['Wholesale Expert', 'Best Prices', 'Trusted']
  }
];

export const SuppliersPage: React.FC<SuppliersPageProps> = ({ state, onAddRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [suppliers, setSuppliers] = useState(enhancedMockSuppliers);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    rating: 0,
    distance: 10,
    specialty: 'all',
    priceRange: 'all',
    onlineOnly: false,
    verified: false,
    deliverySpeed: 'all'
  });
  const [requestForm, setRequestForm] = useState({
    item: '',
    quantity: '',
    notes: '',
    urgency: 'normal',
    budget: ''
  });

  // Animation states
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter and sort suppliers
  const filteredAndSortedSuppliers = useMemo(() => {
    let filtered = suppliers.filter(supplier => {
      const matchesSearch = supplier.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = supplier.rating >= selectedFilters.rating;
      const matchesDistance = supplier.distance <= selectedFilters.distance;
      const matchesSpecialty = selectedFilters.specialty === 'all' || 
                              supplier.specialties.some(s => s.toLowerCase().includes(selectedFilters.specialty.toLowerCase()));
      const matchesPriceRange = selectedFilters.priceRange === 'all' || supplier.priceRange === selectedFilters.priceRange;
      const matchesOnline = !selectedFilters.onlineOnly || supplier.isOnline;
      const matchesVerified = !selectedFilters.verified || supplier.verified;
      const matchesDeliverySpeed = selectedFilters.deliverySpeed === 'all' || supplier.deliverySpeed === selectedFilters.deliverySpeed;

      return matchesSearch && matchesRating && matchesDistance && matchesSpecialty && 
             matchesPriceRange && matchesOnline && matchesVerified && matchesDeliverySpeed;
    });

    // Sort suppliers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return a.distance - b.distance;
        case 'trustScore':
          return b.trustScore - a.trustScore;
        case 'orders':
          return b.completedOrders - a.completedOrders;
        case 'name':
          return a.businessName.localeCompare(b.businessName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [suppliers, searchTerm, selectedFilters, sortBy]);

  const toggleFavorite = (supplierId: string) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId 
        ? { ...supplier, isFavorite: !supplier.isFavorite }
        : supplier
    ));
  };

  const handleRequestSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const request: Request = {
        id: Date.now().toString(),
        type: 'supplier',
        title: `Request from ${selectedSupplier?.businessName}`,
        description: `${requestForm.item} - ${requestForm.quantity}${requestForm.notes ? ` (${requestForm.notes})` : ''}`,
        status: 'pending',
        createdAt: new Date()
      };

      onAddRequest(request);
      setShowRequestModal(false);
      setRequestForm({ item: '', quantity: '', notes: '', urgency: 'normal', budget: '' });
      setIsLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const SupplierCard = ({ supplier }: { supplier: any }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 group">
      {/* Trust Badge and Favorite */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="flex space-x-2">
          {supplier.verified && (
            <div className="bg-blue-500 text-white p-2 rounded-full">
              <Shield className="h-4 w-4" />
            </div>
          )}
          {supplier.isOnline && (
            <div className="bg-green-500 text-white p-2 rounded-full">
              <Zap className="h-3 w-3" />
            </div>
          )}
        </div>
        <button
          onClick={() => toggleFavorite(supplier.id)}
          className={`p-2 rounded-full transition-all duration-300 ${
            supplier.isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${supplier.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="relative h-48 overflow-hidden">
        <img
          src={supplier.image}
          alt={supplier.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{supplier.businessName}</h3>
          <p className="text-sm opacity-90">{supplier.name}</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${supplier.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span className="text-xs">{supplier.lastSeen}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="font-semibold">{supplier.rating}</span>
            <span className="text-gray-500 text-sm">({supplier.completedOrders})</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">{supplier.trustScore}% Trust</div>
            <div className="text-xs text-gray-500">{supplier.priceRange}</div>
          </div>
        </div>

        {/* Location and Response Time */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{supplier.distance}km away</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{supplier.responseTime}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {supplier.badges.slice(0, 2).map((badge: string, idx: number) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {supplier.specialties.slice(0, 3).map((specialty: string, idx: number) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleRequestSupplier(supplier)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1"
          >
            <Phone className="h-4 w-4" />
            <span>Request</span>
          </button>
          <button
            onClick={() => setSelectedSupplier(supplier)}
            className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            className="bg-green-100 text-green-700 px-4 py-3 rounded-lg hover:bg-green-200 transition-colors duration-300"
          ><a href='https://www.whatsapp.com/' target='main'><MessageCircle className="h-4 w-4" /></a>
            
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Request sent successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              <Users className="h-10 w-10 mr-3 text-blue-500" />
              Supplier Marketplace
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Connect with {filteredAndSortedSuppliers.length} trusted suppliers near you</p>
          </div>
          
          {/* View Controls */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex bg-white rounded-lg shadow-sm border">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-l-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-r-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Search and Sort Row */}
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suppliers, specialties, or businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:border-blue-500 transition-colors duration-300 min-w-[150px]"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="distance">Sort by Distance</option>
                  <option value="trustScore">Sort by Trust Score</option>
                  <option value="orders">Sort by Orders</option>
                  <option value="name">Sort by Name</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                {/* Rating Filter */}
                <div className="relative">
                  <select
                    value={selectedFilters.rating}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, rating: Number(e.target.value) })}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:border-blue-500 transition-colors duration-300 w-full"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.8}>4.8+ Stars</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Distance Filter */}
                <div className="relative">
                  <select
                    value={selectedFilters.distance}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, distance: Number(e.target.value) })}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:border-blue-500 transition-colors duration-300 w-full"
                  >
                    <option value={10}>Within 10km</option>
                    <option value={5}>Within 5km</option>
                    <option value={2}>Within 2km</option>
                    <option value={1}>Within 1km</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedFilters.specialty}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, specialty: e.target.value })}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:border-blue-500 transition-colors duration-300 w-full"
                  >
                    <option value="all">All Categories</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Spices">Spices</option>
                    <option value="Meat">Meat & Poultry</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Grains">Grains & Cereals</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Price Range Filter */}
                <div className="relative">
                  <select
                    value={selectedFilters.priceRange}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, priceRange: e.target.value })}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:border-blue-500 transition-colors duration-300 w-full"
                  >
                    <option value="all">All Prices</option>
                    <option value="₹">Budget (₹)</option>
                    <option value="₹₹">Moderate (₹₹)</option>
                    <option value="₹₹₹">Premium (₹₹₹)</option>
                    <option value="₹₹₹₹">Luxury (₹₹₹₹)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Quick Filters */}
                <div className="flex items-center space-x-4 md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.onlineOnly}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, onlineOnly: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Online Only</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.verified}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, verified: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Verified Only</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedSuppliers.length} of {suppliers.length} suppliers
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Suppliers Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedSuppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 p-6"
              >
                <div className="flex items-center space-x-6">
                  {/* Supplier Image */}
                  <div className="relative">
                    <img
                      src={supplier.image}
                      alt={supplier.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      supplier.isOnline ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                  </div>

                  {/* Supplier Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 truncate">{supplier.businessName}</h3>
                        <p className="text-gray-600">{supplier.name}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{supplier.rating}</span>
                            <span className="text-gray-500 text-sm">({supplier.completedOrders})</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{supplier.distance}km</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{supplier.responseTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trust Score and Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{supplier.trustScore}%</div>
                        <div className="text-sm text-gray-500">Trust Score</div>
                        <div className="mt-1 text-sm font-medium">{supplier.priceRange}</div>
                      </div>
                    </div>

                    {/* Specialties and Badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {supplier.specialties.slice(0, 4).map((specialty: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                      {supplier.badges.slice(0, 2).map((badge: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 min-w-[120px]">
                    <button
                      onClick={() => toggleFavorite(supplier.id)}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        supplier.isFavorite 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 mx-auto ${supplier.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleRequestSupplier(supplier)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm font-medium"
                    >
                      Request
                    </button>
                    <button
                      onClick={() => setSelectedSupplier(supplier)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedSuppliers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilters({
                  rating: 0,
                  distance: 10,
                  specialty: 'all',
                  priceRange: 'all',
                  onlineOnly: false,
                  verified: false,
                  deliverySpeed: 'all'
                });
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Enhanced Request Modal */}
        {showRequestModal && selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedSupplier.image}
                  alt={selectedSupplier.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold">Request from {selectedSupplier.businessName}</h2>
                  <p className="text-gray-600">{selectedSupplier.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{selectedSupplier.rating}</span>
                    <span className="text-gray-500 text-sm">• {selectedSupplier.responseTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Needed *
                  </label>
                  <input
                    type="text"
                    value={requestForm.item}
                    onChange={(e) => setRequestForm({ ...requestForm, item: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., Fresh Onions, Basmati Rice"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="text"
                      value={requestForm.quantity}
                      onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="e.g., 50 kg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <input
                      type="text"
                      value={requestForm.budget}
                      onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="e.g., ₹2000-3000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    value={requestForm.urgency}
                    onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="low">Low - Within a week</option>
                    <option value="normal">Normal - Within 2-3 days</option>
                    <option value="high">High - Within 24 hours</option>
                    <option value="urgent">Urgent - ASAP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    rows={3}
                    placeholder="Any specific requirements, quality preferences, delivery instructions..."
                  />
                </div>

                {/* Request Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Request Summary</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Supplier: {selectedSupplier.businessName}</div>
                    <div>Expected Response: {selectedSupplier.responseTime}</div>
                    <div>Trust Score: {selectedSupplier.trustScore}%</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={isLoading || !requestForm.item || !requestForm.quantity}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Supplier Detail Modal */}
        {selectedSupplier && !showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end lg:items-center justify-center z-50">
            <div className="bg-white rounded-t-2xl lg:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={selectedSupplier.image}
                        alt={selectedSupplier.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${
                        selectedSupplier.isOnline ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedSupplier.businessName}</h2>
                      <p className="text-xl text-gray-600">{selectedSupplier.name}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-medium text-lg">{selectedSupplier.rating}</span>
                          <span className="text-gray-500">({selectedSupplier.completedOrders} orders)</span>
                        </div>
                        <div className="text-green-600 font-medium">{selectedSupplier.trustScore}% Trust</div>
                      </div>
                      <p className="text-gray-600 mt-2">{selectedSupplier.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSupplier(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <MapPin className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{selectedSupplier.distance}km</div>
                    <div className="text-sm text-gray-600">Distance</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Clock className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-green-600">{selectedSupplier.responseTime}</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <Award className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">{selectedSupplier.joinedDate}</div>
                    <div className="text-sm text-gray-600">Member Since</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{selectedSupplier.priceRange}</div>
                    <div className="text-sm text-gray-600">Price Range</div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-blue-500" />
                        Specialties
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.specialties.map((specialty: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-green-500" />
                        Badges & Certifications
                      </h3>
                      <div className="space-y-2">
                        {selectedSupplier.badges.map((badge: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{badge}</span>
                          </div>
                        ))}
                        {selectedSupplier.certifications.map((cert: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Globe className="h-5 w-5 mr-2 text-purple-500" />
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.languages.map((language: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Truck className="h-5 w-5 mr-2 text-orange-500" />
                        Delivery Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Delivery Speed:</span>
                          <span className="font-medium">{selectedSupplier.deliverySpeed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={`font-medium ${selectedSupplier.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                            {selectedSupplier.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Seen:</span>
                          <span className="font-medium">{selectedSupplier.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => toggleFavorite(selectedSupplier.id)}
                    className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                      selectedSupplier.isFavorite 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${selectedSupplier.isFavorite ? 'fill-current' : ''}`} />
                    <span>{selectedSupplier.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</span>
                  </button>
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Send Request</span>
                  </button>
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Start Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )}