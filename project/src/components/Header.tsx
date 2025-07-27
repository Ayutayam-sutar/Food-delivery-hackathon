import React from 'react';
import { ShoppingBag, Bell, User, Menu, BarChart3, Repeat, Users, Package, LayoutDashboard } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AppState } from '../types';

interface HeaderProps {
  state: AppState;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onNavigate, onLogout }) => {
  const location = useLocation();
  const notificationCount = state.notifications.length;

  // Get current page from URL path instead of state
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'landing';
    return path.substring(1); // Remove leading slash
  };

  const currentPage = getCurrentPage();

  // Don't show navigation header on landing page
  if (currentPage === 'landing' || location.pathname === '/') {
    return (
      <header className="bg-white shadow-sm border-b border-orange-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 ">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-400  bg-clip-text text-transparent">
                VendorLink
              </span>
            </div>
            <div className="flex items-center space-x-4">
            
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 shadow-sm backdrop-blur-sm bg-white/30 backdrop-saturate-150 backdrop-brightness-125 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-orange-500" />
            <span 
              className="text-2xl font-bold  bg-gradient-to-r from-orange-500 via-red-500 to-pink-400  bg-clip-text text-transparent cursor-pointer"
              onClick={() => onNavigate('dashboard')}
            >
              VendorLink
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className={` flex text-base font-medium transition-colors duration-300 ${
                currentPage === 'dashboard' 
                  ? ' bg-gradient-to-r from-orange-400 via-red-500 to-pink-400  p-3 rounded-lg ' 
                  : 'text-gray-600 hover:bg-gradient-to-r from-orange-300 via-red-400 to-pink-300  p-3 rounded-lg'
              }`}
            >
             <LayoutDashboard className="h-4 w-4 mr-1 mt-1.5"/>Dashboard
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className={` flex text-base font-medium transition-colors duration-300 ${
                currentPage === 'inventory' 
                  ? ' bg-gradient-to-r from-orange-400 via-red-500 to-pink-400  p-3 rounded-lg' 
                  : 'text-gray-600 hover:bg-gradient-to-r from-orange-300 via-red-400 to-pink-300  p-3 rounded-lg'
              }`}
            >
            <Package className="h-4 w-4 mr-1 mt-1.5" /> Inventory
            </button>
            <button
              onClick={() => onNavigate('suppliers')}
              className={` flex text-base font-medium transition-colors duration-300 ${
                currentPage === 'suppliers' 
                  ? ' bg-gradient-to-r from-orange-400 via-red-500 to-pink-400  p-3 rounded-lg' 
                  : 'text-gray-600 hover:bg-gradient-to-r from-orange-300 via-red-400 to-pink-300 p-3 rounded-lg'
              }`}
            >
           <Users className="h-4 w-4 mr-1 mt-1.5" />   Suppliers
            </button>
            <button
              onClick={() => onNavigate('surplus')}
              className={` flex text-base font-medium transition-colors duration-300 ${
                currentPage === 'surplus' 
                  ? ' bg-gradient-to-r from-orange-400 via-red-500 to-pink-400  p-3 rounded-lg' 
                  : 'text-gray-600 hover:bg-gradient-to-r from-orange-300 via-red-400 to-pink-300 p-3 rounded-lg'
              }`}
            >
               <Repeat className="h-4 w-4 mr-1 mt-1.5" /> Surplus
            </button>
            <button
              onClick={() => onNavigate('insights')}
          
              className={` flex text-base font-medium transition-colors duration-300 ${
                currentPage === 'insights' 
                  ? ' bg-gradient-to-r from-orange-400 via-red-500 to-pink-400  p-3 rounded-lg' 
                  : 'text-gray-600 hover:bg-gradient-to-r from-orange-300 via-red-400 to-pink-300 p-3 rounded-lg'
              }`}
            > <BarChart3 className="h-4 w-4 mr-1 mt-1.5" />Insights </button>
          </nav>

          <div className="flex items-center space-x-4">
             <div className='h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-400 hover:shadow-lg shadow-orange-600/50 '>  <button
              onClick={() => onNavigate('requests')}
              className="relative p-2 text-gray-600 hover:text-white transition-colors duration-300"
            >
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse ">
                  {notificationCount}
                </span>
              )}
            </button></div>

            <div className="relative group">
             <div className='h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-400 hover:shadow-lg shadow-orange-600/50 '> <button className="flex items-center space-x-2 p-2 text-gray-600 transition-colors duration-300 hover:text-white ">
               <User className="h-6 w-6" />
                {state.user && <span className="hidden md:block text-sm">  <pre> {state.user.name}</pre></span>}
                {state.isDemo && <span className="hidden md:block text-sm text-orange-500">Demo Mode</span>}
              </button> </div>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    Profile & Settings
                  </button>
                  {state.isDemo && (
                    <button
                      onClick={() => onNavigate('insights')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      Business Insights
                    </button>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    {state.isDemo ? 'Exit Demo' : 'Logout'}
                  </button>
                </div>
              </div>
            </div>

            <button className="md:hidden p-2 text-gray-600 hover:text-orange-500">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};