import React, { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, Users, Shield, Star } from 'lucide-react';

interface LandingPageProps {
  onExploreDemo?: () => void; 
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Dynamic style injection
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out forwards;
      }
      
      .delay-300 {
        animation-delay: 0.3s;
      }
      
      .delay-500 {
        animation-delay: 0.5s;
      }
      
      .delay-700 {
        animation-delay: 0.7s;
      }
      
      .delay-1000 {
        animation-delay: 1s;
      }
      
      .delay-1200 {
        animation-delay: 1.2s;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        />
        <div 
          className="absolute top-3/4 right-1/4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"
          style={{
            transform: `translate(${mousePosition.x * 0.7}px, ${mousePosition.y * 0.7}px)`
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-3 mb-6">
              <ShoppingBag className="h-16 w-16 text-orange-500 animate-bounce" />
              <h1 className="text-6xl sm:text-7xl font-bold">
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  VendorLink
                </span>
              </h1>
            </div>
            
            <div className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
              <span className="inline-block animate-fade-in-up delay-300">Find.</span>
              <span className="inline-block animate-fade-in-up delay-500 text-orange-500 mx-3">Trust.</span>
              <span className="inline-block animate-fade-in-up delay-700 text-red-500">Source.</span>
            </div>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-1000">
              Connect with trusted suppliers, manage your inventory smartly, and grow your street food business with India's most comprehensive vendor marketplace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button
              onClick={() => onNavigate('auth')}
              className="bg-white text-orange-500 border-2 border-orange-500 text-lg font-semibold px-8 py-4 rounded-full hover:bg-orange-50 transition-all duration-300 hover:scale-105"
            >
              Get Started Free
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 animate-fade-in-up delay-1200">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className='text-lg'>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className='text-lg'>10,000+ Vendors</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className='text-lg'>100% Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools designed specifically for Indian street food vendors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-orange-100">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl w-fit mb-6">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Inventory</h3>
              <p className="text-gray-600">
                Track your stock levels, get low-stock alerts, and never run out of essential ingredients again.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl w-fit mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trusted Network</h3>
              <p className="text-gray-600">
                Connect with verified suppliers in your area with trust scores and real reviews.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl w-fit mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Surplus Exchange</h3>
              <p className="text-gray-600">
                Reduce waste and save money by trading surplus inventory with other vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer of this page */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of vendors already using VendorLink to grow their business
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => onNavigate('auth')}
              className="bg-transparent text-white border-2 border-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-orange-500 transition-all duration-300 hover:scale-105"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};