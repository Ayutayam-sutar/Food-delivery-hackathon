import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Clock, Users, ArrowUp, ArrowDown, Calendar, Download, BarChart3, PieChart, TrendingDown, AlertTriangle, Target, Zap, Package, Plus, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface InsightsPageProps {
  state?: {
    user?: {
      businessName?: string;
      name?: string;
    } | null;
    inventory?: any[];
    isDemo?: boolean;
  };
}

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

export function InsightsPage({ state }: InsightsPageProps) {
  const navigate = useNavigate();
  const inventory: never[] = [];
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'orders' | 'suppliers'>('revenue');
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const businessName = state?.user?.businessName || state?.user?.name || 'Your Business';

  // Animate numbers on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        savings: 25450,
        suppliers: 24,
        responseTime: 2.4,
        successRate: 94.2
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Total Savings',
      value: `₹${(animatedValues.savings || 0).toLocaleString()}`,
      change: 12.5,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green',
      description: 'Money saved through smart procurement',
      trend: 'up'
    },
    {
      title: 'Active Suppliers',
      value: (animatedValues.suppliers || 0).toString(),
      change: 8.3,
      icon: <Users className="h-6 w-6" />,
      color: 'blue',
      description: 'Verified suppliers in your network',
      trend: 'up'
    },
    {
      title: 'Avg Response Time',
      value: `${animatedValues.responseTime || 0} hrs`,
      change: -15.2,
      icon: <Clock className="h-6 w-6" />,
      color: 'purple',
      description: 'Faster responses save time',
      trend: 'down'
    },
    {
      title: 'Success Rate',
      value: `${animatedValues.successRate || 0}%`,
      change: 3.1,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'orange',
      description: 'Successful order completion rate',
      trend: 'up'
    }
  ];

  const chartData = {
    revenue: [
      { label: 'Jan', value: 12000, color: 'from-green-500 to-green-300' },
      { label: 'Feb', value: 15000, color: 'from-green-500 to-green-300' },
      { label: 'Mar', value: 18000, color: 'from-green-500 to-green-300' },
      { label: 'Apr', value: 22000, color: 'from-green-500 to-green-300' },
      { label: 'May', value: 25000, color: 'from-green-500 to-green-300' },
      { label: 'Jun', value: 28000, color: 'from-green-500 to-green-300' }
    ],
    orders: [
      { label: 'Jan', value: 45, color: 'from-blue-500 to-blue-300' },
      { label: 'Feb', value: 52, color: 'from-blue-500 to-blue-300' },
      { label: 'Mar', value: 48, color: 'from-blue-500 to-blue-300' },
      { label: 'Apr', value: 61, color: 'from-blue-500 to-blue-300' },
      { label: 'May', value: 67, color: 'from-blue-500 to-blue-300' },
      { label: 'Jun', value: 73, color: 'from-blue-500 to-blue-300' }
    ],
    suppliers: [
      { label: 'Jan', value: 18, color: 'from-purple-500 to-purple-300' },
      { label: 'Feb', value: 19, color: 'from-purple-500 to-purple-300' },
      { label: 'Mar', value: 21, color: 'from-purple-500 to-purple-300' },
      { label: 'Apr', value: 22, color: 'from-purple-500 to-purple-300' },
      { label: 'May', value: 23, color: 'from-purple-500 to-purple-300' },
      { label: 'Jun', value: 24, color: 'from-purple-500 to-purple-300' }
    ]
  };

  const topSuppliers = [
    {
      name: 'Kumar Fresh Vegetables',
      orders: 45,
      savings: 8500,
      rating: 4.8,
      category: 'Vegetables',
      responseTime: '1.2 hrs',
      reliability: 98
    },
    {
      name: 'Sharma Spice House',
      orders: 32,
      savings: 6200,
      rating: 4.6,
      category: 'Spices',
      responseTime: '2.1 hrs',
      reliability: 95
    },
    {
      name: 'Ali Meat & Poultry',
      orders: 28,
      savings: 5800,
      rating: 4.9,
      category: 'Meat',
      responseTime: '1.8 hrs',
      reliability: 97
    },
    {
      name: 'Patel Grocery Store',
      orders: 21,
      savings: 4200,
      rating: 4.5,
      category: 'Grocery',
      responseTime: '3.2 hrs',
      reliability: 92
    },
    {
      name: 'Singh Dairy Products',
      orders: 18,
      savings: 3600,
      rating: 4.7,
      category: 'Dairy',
      responseTime: '2.5 hrs',
      reliability: 94
    }
  ];

  const inventoryTrends = [
    {
      item: 'Onions',
      trend: 'up' as const,
      usage: 85,
      prediction: 'Reorder in 3 days',
      currentStock: 25,
      threshold: 30,
      avgConsumption: 8.5,
      priority: 'high'
    },
    {
      item: 'Tomatoes',
      trend: 'stable' as const,
      usage: 60,
      prediction: 'Reorder in 1 week',
      currentStock: 40,
      threshold: 25,
      avgConsumption: 5.2,
      priority: 'medium'
    },
    {
      item: 'Potatoes',
      trend: 'down' as const,
      usage: 25,
      prediction: 'Surplus available',
      currentStock: 80,
      threshold: 20,
      avgConsumption: 3.1,
      priority: 'low'
    },
    {
      item: 'Green Chili',
      trend: 'up' as const,
      usage: 90,
      prediction: 'Reorder now',
      currentStock: 5,
      threshold: 15,
      avgConsumption: 4.5,
      priority: 'critical'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update values with slight variations
    setAnimatedValues({
      savings: 25450 + Math.floor(Math.random() * 1000),
      suppliers: 24 + Math.floor(Math.random() * 3),
      responseTime: 2.4 - Math.random() * 0.5,
      successRate: 94.2 + Math.random() * 2
    });

    setRefreshing(false);
    alert('📊 Dashboard refreshed with latest data!');
  };

  const handleDownloadReport = () => {
    const csvContent = `VendorLink Business Report - ${selectedPeriod.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}
Business: ${businessName}


SUMMARY METRICS
Period,Total Savings,Active Suppliers,Avg Response Time,Success Rate
${selectedPeriod},₹${animatedValues.savings?.toLocaleString()},${animatedValues.suppliers},${animatedValues.responseTime} hours,${animatedValues.successRate}%


TOP PERFORMING SUPPLIERS
Rank,Supplier Name,Orders,Savings,Rating,Category,Response Time,Reliability
${topSuppliers.map((s, i) => `${i + 1},${s.name},${s.orders},₹${s.savings},${s.rating},${s.category},${s.responseTime},${s.reliability}%`).join('\n')}


INVENTORY INSIGHTS
Item,Usage %,Current Stock,Threshold,Priority,Prediction
${inventoryTrends.map(i => `${i.item},${i.usage}%,${i.currentStock},${i.threshold},${i.priority},${i.prediction}`).join('\n')}


REVENUE TRENDS
Month,${selectedChart === 'revenue' ? 'Revenue' : selectedChart === 'orders' ? 'Orders' : 'Suppliers'}
${chartData[selectedChart].map(d => `${d.label},${selectedChart === 'revenue' ? '₹' : ''}${d.value.toLocaleString()}`).join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessName.toLowerCase().replace(/\s+/g, '-')}-insights-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setTimeout(() => {
      alert('📊 Detailed business report downloaded successfully!');
    }, 100);
  };

  const getStatColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const currentData = chartData[selectedChart];
  const maxValue = Math.max(...currentData.map(d => d.value));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-8 w-8 mr-3 text-purple-500" />
              Business Insights
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, <span className="font-semibold text-purple-600">{businessName}</span>! Track your performance and discover opportunities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
            <button
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer group relative"
              onClick={() => setShowDetailModal(stat.title)}
              onMouseEnter={() => setActiveTooltip(stat.title)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${getStatColor(stat.color)} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>

              {/* Tooltip */}
              {activeTooltip === stat.title && (
                <div className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 -mt-2 opacity-90 left-1/2 transform -translate-x-1/2 top-1/3 shadow-lg pointer-events-none">
                  Click for detailed view
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interactive Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
                {selectedChart === 'revenue' ? 'Revenue' : selectedChart === 'orders' ? 'Order' : 'Supplier'} Trends
              </h2>
              <div className="flex space-x-2">
                {['revenue', 'orders', 'suppliers'].map((chart) => (
                  <button
                    key={chart}
                    onClick={() => setSelectedChart(chart as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedChart === chart
                        ? 'bg-purple-100 text-purple-700 scale-105'
                        : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                    }`}
                  >
                    {chart.charAt(0).toUpperCase() + chart.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Bar Chart */}
            <div className="relative h-64">
              <div className="flex items-end justify-between h-full space-x-4">
                {currentData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center group relative">
                    <div
                      className={`w-full bg-gradient-to-t ${data.color} rounded-t-lg transition-all duration-500 hover:scale-105 cursor-pointer relative`}
                      style={{
                        height: `${(data.value / maxValue) * 100}%`,
                        minHeight: '20px'
                      }}
                      onMouseEnter={() => setActiveTooltip(`${data.label}-${data.value}`)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      {activeTooltip === `${data.label}-${data.value}` && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                          {selectedChart === 'revenue' ? '₹' : ''}{data.value.toLocaleString()}
                          {selectedChart !== 'revenue' && (selectedChart === 'orders' ? ' orders' : ' suppliers')}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 mt-2 group-hover:text-purple-600 transition-colors duration-300">
                      {data.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12">
                <span>{selectedChart === 'revenue' ? '₹' : ''}{maxValue.toLocaleString()}</span>
                <span>{selectedChart === 'revenue' ? '₹' : ''}{Math.round(maxValue * 0.5).toLocaleString()}</span>
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Enhanced Top Suppliers */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Top Suppliers
            </h2>
            <div className="space-y-4">
              {topSuppliers.map((supplier, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-blue-200"
                  onClick={() => setShowDetailModal(`supplier-${index}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {supplier.name}
                      </p>
                      <p className="text-sm text-gray-600">{supplier.orders} orders • {supplier.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{supplier.savings.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-500">{supplier.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Inventory Trends */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-orange-500" />
              Inventory Trends & Smart Predictions
            </h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          onClick={() => navigate('/inventory', { state: { inventory } })}> 
              <Eye className="h-4 w-4" />
              <span>View All Items</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventoryTrends.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => setShowDetailModal(`inventory-${index}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {item.item}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  {getTrendIcon(item.trend)}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Usage</span>
                    <span>{item.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.usage > 80
                          ? 'bg-red-500'
                          : item.usage > 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${item.usage}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span className="font-medium">{item.currentStock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Threshold:</span>
                    <span className="font-medium">{item.threshold} units</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-2 group-hover:bg-orange-50 transition-colors duration-300">
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-orange-500" />
                    <span>{item.prediction}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Quick Actions
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Smart Actions Based on Your Data
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 text-left group hover:scale-105"
              onClick={() => alert('🔄 Redirecting to inventory management...')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Reorder Low Stock</h3>
                <AlertTriangle className="h-5 w-5 text-red-300" />
              </div>
              <p className="text-sm text-purple-100">4 items need immediate attention</p>
              <p className="text-xs text-purple-200 mt-2">Green Chili, Onions critical</p>
            </button>

            <button
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 text-left group hover:scale-105"
              onClick={() => alert('🤝 Opening supplier discovery...')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Connect New Suppliers</h3>
                <Plus className="h-5 w-5 text-green-300" />
              </div>
              <p className="text-sm text-purple-100">3 verified suppliers available</p>
              <p className="text-xs text-purple-200 mt-2">Dairy & Spices categories</p>
            </button>

            <button
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 text-left group hover:scale-105"
              onClick={() => alert('📦 Opening surplus marketplace...')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Post Surplus Items</h3>
                <DollarSign className="h-5 w-5 text-yellow-300" />
              </div>
              <p className="text-sm text-purple-100">Reduce waste, earn extra</p>
              <p className="text-xs text-purple-200 mt-2">Potatoes surplus detected</p>
            </button>
          </div>
        </div> */}

        {/* Detail Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Detailed View</h3>
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  aria-label="Close details modal"
                >
                  ✕
                </button>
              </div>

              {showDetailModal.startsWith('supplier-') && (
                <div className="space-y-4">
                  {(() => {
                    const supplierIndex = parseInt(showDetailModal.split('-')[1], 10);
                    const supplier = topSuppliers[supplierIndex];
                    return (
                      <>
                        <div className="text-center">
                          <h4 className="text-lg font-semibold text-gray-900">{supplier.name}</h4>
                          <p className="text-gray-600">{supplier.category} Supplier</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{supplier.orders}</p>
                            <p className="text-sm text-gray-600">Total Orders</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">₹{supplier.savings.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Savings</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">{supplier.rating}⭐</p>
                            <p className="text-sm text-gray-600">Rating</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{supplier.reliability}%</p>
                            <p className="text-sm text-gray-600">Reliability</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Response Time:</span>
                            <span className="font-medium">{supplier.responseTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">{supplier.category}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <a href='tel:8998986'><button
                            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            onClick={() => alert(`📞 Contacting ${supplier.name}...`)}
                        
                          >
                            Contact Supplier
                          </button></a>
                          <button
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
                           onClick={() => navigate('/suppliers', { state: { supplier } })}
                          >
                            Create Order
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {showDetailModal.startsWith('inventory-') && (
                <div className="space-y-4">
                  {(() => {
                    const itemIndex = parseInt(showDetailModal.split('-')[1], 10);
                    const item = inventoryTrends[itemIndex];
                    return (
                      <>
                        <div className="text-center">
                          <h4 className="text-lg font-semibold text-gray-900">{item.item}</h4>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority.toUpperCase()} Priority
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{item.currentStock}</p>
                            <p className="text-sm text-gray-600">Current Stock</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">{item.threshold}</p>
                            <p className="text-sm text-gray-600">Threshold</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{item.usage}%</p>
                            <p className="text-sm text-gray-600">Usage Rate</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{item.avgConsumption}</p>
                            <p className="text-sm text-gray-600">Daily Usage</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-gray-900">Smart Prediction</span>
                          </div>
                          <p className="text-gray-700">{item.prediction}</p>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors duration-300"
                            onClick={() => alert(`🔄 Reordering ${item.item}...`)}
                          >
                            Reorder Now
                          </button>
                          <button
                            className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                            onClick={() => alert(`📊 Viewing full ${item.item} analytics...`)}
                          >
                            View Analytics
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {!showDetailModal.includes('-') && (
                <div className="space-y-4">
                  {(() => {
                    const stat = stats.find(s => s.title === showDetailModal);
                    if (!stat) return null;

                    return (
                      <>
                        <div className="text-center">
                          <div className={`inline-flex p-4 rounded-2xl ${getStatColor(stat.color)} mb-4`}>
                            {stat.icon}
                          </div>
                          <h4 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h4>
                          <p className="text-gray-600">{stat.title}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 mb-3">{stat.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Change from last period:</span>
                            <div className={`flex items-center space-x-1 font-medium ${
                              stat.change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.change > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                              <span>{Math.abs(stat.change)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center text-sm">
                          <div>
                            <p className="font-medium text-gray-900">Target</p>
                            <p className="text-gray-600">
                              {stat.title === 'Total Savings' ? '₹30,000' :
                                stat.title === 'Active Suppliers' ? '30' :
                                  stat.title === 'Avg Response Time' ? '2.0 hrs' : '95%'}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Best</p>
                            <p className="text-gray-600">
                              {stat.title === 'Total Savings' ? '₹28,200' :
                                stat.title === 'Active Suppliers' ? '26' :
                                  stat.title === 'Avg Response Time' ? '1.8 hrs' : '96.5%'}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Average</p>
                            <p className="text-gray-600">
                              {stat.title === 'Total Savings' ? '₹22,800' :
                                stat.title === 'Active Suppliers' ? '20' :
                                  stat.title === 'Avg Response Time' ? '2.8 hrs' : '88.5%'}
                            </p>
                          </div>
                        </div>

                        <button
                          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
                          onClick={() => alert(`📈 Opening detailed ${stat.title} analytics...`)}
                        >
                          View Detailed Analytics
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}