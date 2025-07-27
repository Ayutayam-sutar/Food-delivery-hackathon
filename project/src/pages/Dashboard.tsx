import React, { useMemo, useCallback } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Repeat, 
  Wallet, 
  ArrowRight, 
  Star, 
  MapPin, 
  Clock,
  BarChart3,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';

// Type definitions
interface AppState {
  user: {
    name: string;
    businessName?: string;
    profileInitial?: string;
    avatar?: string | null;
  } | null;
  inventory: Array<{
    id: string;
    name: string;
    quantity: number;
    threshold: number;
    unit: string;
  }>;
  requests: Array<{
    id: string;
    status: string;
  }>;
  isDemo?: boolean;
}

interface DashboardProps {
  state: AppState;
  onNavigate: (page: string) => void;
}

type ColorType = 'blue' | 'orange' | 'green' | 'purple' | 'red';

// Mock data (you can replace with your actual imports)
const mockSuppliers = [
  {
    id: '1',
    name: 'John Patra',
    businessName: 'Fresh Vegetables Co.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.5,
    distance: 1.2,
    specialties: ['Vegetables', 'Fruits', 'Spices']
  },
  {
    id: '2',
    name: 'Shreya mallick',
    businessName: 'Spice World',
    image: 'https://plus.unsplash.com/premium_photo-1752644060827-6ff25232c1b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDMzfHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    rating: 4.9,
    distance: 0.8,
    specialties: ['Spices', 'Herbs', 'Seasonings']
  },
  {
    id: '3',
    name: 'Ahmed Khan',
    businessName: 'Sauces & Sauces',
    image: 'https://images.unsplash.com/photo-1753272379230-d11f5662bcf6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDh8dG93SlpGc2twR2d8fGVufDB8fHx8fA%3D%3D',
    rating: 4.7,
    distance: 2.1,
    specialties: ['Tomato sauces ', 'Thickeners', 'Packaged Foods']
  },
  {
    id: '4',
    name: 'Maria Garcia',
    businessName: 'Packaging Bros ',
    image: 'https://images.unsplash.com/photo-1752312641088-3c7425261a5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM4fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    rating: 4.9,
    distance: 4.5,
    specialties: ['Square box', 'Spoons', 'Lids']
  },
  {
    id: '5',
    name: 'Arun Thomas',
    businessName: 'Premium Groceries',
    image: 'https://images.unsplash.com/photo-1753161923972-732769865a43?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    rating: 4.1,
    distance: 1.1,
    specialties: ['Groceries', 'Dairy', 'Packaged Foods']
  },
  {
    id: '6',
    name: 'Raju Williams',
    businessName: 'Wholesale Groceries',
    image: 'https://www.shutterstock.com/image-photo/happy-handsome-caucasian-man-casual-260nw-2378378987.jpg',
    rating: 4.9,
    distance: 3.1,
    specialties: ['Groceries', 'Dairy', 'Packaged Foods']
  }
];

const mockSurplusOffers = [
  {
    id: '1',
    itemName: 'Fresh Tomatoes',
    quantity: 50,
    unit: 'kg',
    originalPrice: 120,
    discountedPrice: 72
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ state, onNavigate }) => {
  // Memoized calculations for better performance
  const dashboardData = useMemo(() => {
    const lowStockItems = state.inventory.filter(item => item.quantity <= item.threshold);
    const totalSavings = 12500;
    const pendingRequests = state.requests.filter(r => r.status === 'pending').length;
    const completedRequests = state.requests.filter(r => r.status === 'completed').length;
    
    return {
      lowStockItems,
      totalSavings,
      pendingRequests,
      completedRequests,
      totalItems: state.inventory.length,
      surplusOffers: mockSurplusOffers.length
    };
  }, [state.inventory, state.requests]);

  // Memoized navigation handlers
  const navigationHandlers = useMemo(() => ({
    inventory: () => onNavigate('inventory'),
    suppliers: () => onNavigate('suppliers'),
    surplus: () => onNavigate('surplus'),
    requests: () => onNavigate('requests'),
    insights: () => onNavigate('insights'),
    profile: () => onNavigate('profile')
  }), [onNavigate]);

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'restock':
        navigationHandlers.inventory();
        break;
      case 'find-supplier':
        navigationHandlers.suppliers();
        break;
      case 'view-surplus':
        navigationHandlers.surplus();
        break;
      case 'check-requests':
        navigationHandlers.requests();
        break;
      default:
        break;
    }
  }, [navigationHandlers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Improved CSS with better animations and performance */}
      <style>{`
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, box-shadow;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .pulse-notification {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>

      {/* Main Content */}
      <main className="pb-16">
        {/* Enhanced Hero Section */}
        <section className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-400 text-white pt-8 pb-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
           
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome back, {state.user?.name || 'Vendor'}! 👋
              </h1>
              <p className="text-lg md:text-xl text-orange-100">
                Your business is growing! Here's what's happening today.
              </p>
              
            </div>

            {/* Enhanced Featured Suppliers Carousel */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Featured Suppliers Near You
                </h3>
                <button
                  onClick={navigationHandlers.suppliers}
                  className="text-white text-opacity-80 hover:text-opacity-100 text-sm flex items-center space-x-1 transition-opacity"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {mockSuppliers.slice(0, 6).map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onClick={navigationHandlers.suppliers}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Summary Tiles */}
        <section className="-mt-6 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <SummaryTile
                icon={<Package className="h-8 w-8 text-blue-600" />}
                value={dashboardData.totalItems}
                label="Total Items"
                color="blue"
                onClick={navigationHandlers.inventory}
                badge={dashboardData.lowStockItems.length > 0 ? `${dashboardData.lowStockItems.length} low stock` : null}
                badgeColor="red"
                trend={dashboardData.totalItems > 0 ? '+5.2%' : null}
              />
              
              <SummaryTile
                icon={<Clock className="h-8 w-8 text-orange-600" />}
                value={dashboardData.pendingRequests}
                label="Pending Requests"
                color="orange"
                onClick={navigationHandlers.requests}
                trend={dashboardData.pendingRequests > 0 ? 'Active' : null}
              />
              
              <SummaryTile
                icon={<Repeat className="h-8 w-8 text-green-600" />}
                value={dashboardData.surplusOffers}
                label="Surplus Offers"
                color="green"
                onClick={navigationHandlers.surplus}
                trend="+2 today"
              />
              
              <SummaryTile
                icon={<Wallet className="h-8 w-8 text-purple-600" />}
                value={`₹${dashboardData.totalSavings.toLocaleString()}`}
                label="Total Savings"
                color="purple"
                onClick={navigationHandlers.insights}
                trend="+15.3%"
              />
            </div>
          </div>
        </section>

        {/* Enhanced AI Recommendations */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-orange-500" />
                {state.isDemo ? 'AI-Powered Smart Recommendations (Demo)' : 'Smart Recommendations'}
              </h2>
              <button
                onClick={navigationHandlers.suppliers}
                className="text-orange-500 hover:text-orange-600 font-medium flex items-center space-x-1 transition-colors hover:scale-105"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Priority Alert - Low Stock */}
              {dashboardData.lowStockItems.length > 0 && (
                <RecommendationCard
                  icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
                  title="Urgent: Low Stock Alert"
                  subtitle={`${dashboardData.lowStockItems.length} items need immediate attention`}
                  color="red"
                  actionText="Restock Now"
                  onAction={navigationHandlers.inventory}
                  priority="high"
                >
                  <div className="space-y-2">
                    {dashboardData.lowStockItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-red-600 font-semibold">
                          {item.quantity} {item.unit} left
                        </span>
                      </div>
                    ))}
                    {dashboardData.lowStockItems.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{dashboardData.lowStockItems.length - 3} more items
                      </p>
                    )}
                  </div>
                </RecommendationCard>
              )}

              {/* Recommended Supplier */}
              <RecommendationCard
                icon={<Users className="h-5 w-5 text-blue-600" />}
                title="Perfect Supplier Match"
                subtitle="95% compatibility • 1.2km away"
                color="blue"
                actionText="Connect Now"
                onAction={navigationHandlers.suppliers}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={mockSuppliers[0].image}
                    alt={mockSuppliers[0].name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{mockSuppliers[0].businessName}</p>
                    <p className="text-sm text-gray-600">
                      {mockSuppliers[0].specialties.slice(0, 2).join(' • ')}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{mockSuppliers[0].rating} rating</span>
                    </div>
                  </div>
                </div>
              </RecommendationCard>

              {/* Hot Surplus Deal */}
              <RecommendationCard
                icon={<Repeat className="h-5 w-5 text-green-600" />}
                title="🔥 Limited Time Deal"
                subtitle="40% off • Expires in 2 days"
                color="green"
                actionText="Claim Deal"
                onAction={navigationHandlers.surplus}
                priority="medium"
              >
                <div className="mb-4">
                  <p className="font-semibold text-gray-900">{mockSurplusOffers[0].itemName}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {mockSurplusOffers[0].quantity} {mockSurplusOffers[0].unit} available
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      ₹{mockSurplusOffers[0].discountedPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{mockSurplusOffers[0].originalPrice}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      40% OFF
                    </span>
                  </div>
                </div>
              </RecommendationCard>
            </div>
          </div>
        </section>

        {/* Enhanced Quick Stats */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-semibold text-center mb-8 text-gray-900">
              Your Business Performance
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <StatItem value="150+" label="Trusted Suppliers" color="orange" trend="+12 this month" />
              <StatItem value="₹25,000" label="Monthly Savings" color="blue" trend="+15% vs last month" />
              <StatItem value="98%" label="Order Success Rate" color="green" trend="Excellent" />
              <StatItem value="1 hrs" label="Avg Response Time" color="purple" trend="50% faster " />
            </div>
          </div>
        </section>

        {/* Navigation Shortcuts */}
        <section className="py-8 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-semibold text-center mb-8 text-gray-900">
              Quick Navigation
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <NavigationCard
                icon={<Package className="h-6 w-6" />}
                title="Inventory"
                subtitle="Manage stock"
                onClick={navigationHandlers.inventory}
                color="blue"
              />
              <NavigationCard
                icon={<Users className="h-6 w-6" />}
                title="Suppliers"
                subtitle="Find partners"
                onClick={navigationHandlers.suppliers}
                color="green"
              />
              <NavigationCard
                icon={<Repeat className="h-6 w-6" />}
                title="Surplus"
                subtitle="Great deals"
                onClick={navigationHandlers.surplus}
                color="orange"
              />
              <NavigationCard
                icon={<ShoppingCart className="h-6 w-6" />}
                title="Requests"
                subtitle="Track orders"
                onClick={navigationHandlers.requests}
                color="purple"
              />
              <NavigationCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Insights"
                subtitle="View analytics"
                onClick={navigationHandlers.insights}
                color="red"
              />
              <NavigationCard
                icon={<Users className="h-6 w-6" />}
                title="Profile"
                subtitle="Account settings"
                onClick={navigationHandlers.profile}
                color="blue"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

interface NavigationCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  color: ColorType;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ icon, title, subtitle, onClick, color }) => {
  const getColorClasses = (colorName: ColorType) => {
    const colorMap: Record<ColorType, { bg: string; text: string; hover: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:bg-green-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', hover: 'hover:bg-red-100' }
    };
    return colorMap[colorName];
  };

  const colorClasses = getColorClasses(color);

  return (
    <div
      onClick={onClick}
      className={`${colorClasses.bg} ${colorClasses.hover} p-4 rounded-xl cursor-pointer transition-all duration-300 hover-lift text-center group border border-gray-200`}
    >
      <div className={`${colorClasses.text} mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  );
};

// Enhanced Reusable Components

interface QuickActionButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105"
  >
    {icon}
    <span>{text}</span>
  </button>
);

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    businessName: string;
    image: string;
    rating: number;
    distance: number;
    specialties: string[];
  };
  onClick: () => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onClick }) => (
  <div
    className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 hover:bg-white hover:bg-opacity-30 transition-all duration-300 cursor-pointer hover-lift border border-white border-opacity-10"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3 mb-3">
      <img
        src={supplier.image}
        alt={supplier.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-white border-opacity-30"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-white">{supplier.businessName}</h4>
        <div className="flex items-center space-x-2 text-sm text-orange-100">
          <Star className="h-4 w-4 fill-current" />
          <span>{supplier.rating}</span>
          <MapPin className="h-4 w-4" />
          <span>{supplier.distance}km</span>
        </div>
      </div>
    </div>
    <div className="flex flex-wrap gap-1">
      {supplier.specialties.slice(0, 2).map((specialty: string, idx: number) => (
        <span
          key={idx}
          className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs text-white"
        >
          {specialty}
        </span>
      ))}
    </div>
  </div>
);

interface SummaryTileProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: ColorType;
  onClick: () => void;
  badge?: string | null;
  badgeColor?: ColorType;
  trend?: string | null;
}

const SummaryTile: React.FC<SummaryTileProps> = ({ 
  icon, 
  value, 
  label, 
  color, 
  onClick,
  badge,
  badgeColor = 'red',
  trend
}) => {
  const getColorClasses = (colorName: ColorType) => {
    const colorMap: Record<ColorType, { bg: string; border: string; text: string; hover: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', hover: 'hover:bg-green-100' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', hover: 'hover:bg-red-100' }
    };
    return colorMap[colorName];
  };

  const getBadgeColorClasses = (colorName: ColorType) => {
    const badgeColorMap: Record<ColorType, string> = {
      red: 'text-red-700 bg-red-100 border-red-200',
      blue: 'text-blue-700 bg-blue-100 border-blue-200',
      green: 'text-green-700 bg-green-100 border-green-200',
      orange: 'text-orange-700 bg-orange-100 border-orange-200',
      purple: 'text-purple-700 bg-purple-100 border-purple-200'
    };
    return badgeColorMap[colorName];
  };

  const colorClasses = getColorClasses(color);
  const badgeColorClasses = getBadgeColorClasses(badgeColor);

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 ${colorClasses.border} hover-lift group ${colorClasses.hover}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses.bg} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
      </div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className={`text-xs font-medium ${colorClasses.text}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-2">{label}</p>
      {badge && (
        <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block border ${badgeColorClasses}`}>
          {badge}
        </div>
      )}
    </div>
  );
};

interface RecommendationCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: ColorType;
  actionText: string;
  onAction: () => void;
  children: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  icon,
  title,
  subtitle,
  color,
  actionText,
  onAction,
  children,
  priority = 'low'
}) => {
  const getColorClasses = (colorName: ColorType) => {
    const colorMap: Record<ColorType, { bg: string; border: string; button: string; text: string; textLight: string }> = {
      red: { bg: 'bg-red-50', border: 'border-red-200', button: 'bg-red-500 hover:bg-red-600 focus:ring-red-200', text: 'text-red-900', textLight: 'text-red-600' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', button: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-200', text: 'text-blue-900', textLight: 'text-blue-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', button: 'bg-green-500 hover:bg-green-600 focus:ring-green-200', text: 'text-green-900', textLight: 'text-green-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', button: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-200', text: 'text-orange-900', textLight: 'text-orange-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', button: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-200', text: 'text-purple-900', textLight: 'text-purple-600' }
    };
    return colorMap[colorName];
  };

  const colorClasses = getColorClasses(color);
  const priorityRing = priority === 'high' ? 'ring-2 ring-red-200 ring-opacity-50' : '';

  return (
    <div className={`${colorClasses.bg} border ${colorClasses.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover-lift ${priorityRing}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-50 p-2 rounded-lg">
            {icon}
          </div>
          <div className="ml-3">
            <h3 className={`font-semibold ${colorClasses.text}`}>{title}</h3>
            <p className={`text-sm ${colorClasses.textLight}`}>{subtitle}</p>
          </div>
        </div>
        {priority === 'high' && (
          <div className="w-2 h-2 bg-red-500 rounded-full pulse-notification"></div>
        )}
      </div>
      {children}
      <button
        onClick={onAction}
        className={`mt-4 w-full ${colorClasses.button} text-white py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 hover:scale-105`}
      >
        {actionText}
      </button>
    </div>
  );
};

interface StatItemProps {
  value: string;
  label: string;
  color: ColorType;
  trend?: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, color, trend }) => {
  const getColorClass = (colorName: ColorType) => {
    const colorMap: Record<ColorType, string> = {
      orange: 'text-orange-500',
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      red: 'text-red-500'
    };
    return colorMap[colorName];
  };

  return (
    <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`text-3xl font-bold ${getColorClass(color)} mb-2`}>{value}</div>
      <div className="text-gray-900 font-medium mb-1">{label}</div>
      {trend && <div className="text-sm text-gray-500">{trend}</div>}
    </div>)}