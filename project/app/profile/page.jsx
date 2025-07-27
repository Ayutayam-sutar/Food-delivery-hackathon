'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Store, User, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';

const FOOD_CATEGORIES = [
  'Street Food', 'South Indian', 'North Indian', 'Chinese', 'Beverages', 
  'Snacks', 'Sweets', 'Fast Food', 'Regional Cuisine', 'Others'
];

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    vendorName: '',
    stallName: '',
    category: '',
    address: '',
    location: null
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          setLocationLoading(false);
          toast.success('Location captured successfully!');
        },
        (error) => {
          setLocationLoading(false);
          toast.error('Failed to get location. Please enable location services.');
          console.error('Location error:', error);
        }
      );
    } else {
      setLocationLoading(false);
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location) {
      toast.error('Please enable location to continue');
      return;
    }

    setLoading(true);
    const success = await updateProfile(formData);
    
    if (success) {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Setup Your Profile</h1>
            <p className="text-gray-600">Tell us about your food business</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Vendor Name
              </label>
              <input
                type="text"
                value={formData.vendorName}
                onChange={(e) => setFormData(prev => ({ ...prev, vendorName: e.target.value }))}
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Store className="w-4 h-4 inline mr-2" />
                Stall Name
              </label>
              <input
                type="text"
                value={formData.stallName}
                onChange={(e) => setFormData(prev => ({ ...prev, stallName: e.target.value }))}
                placeholder="e.g., Ravi's Chaat Corner"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ChefHat className="w-4 h-4 inline mr-2" />
                Food Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              >
                <option value="">Select category</option>
                {FOOD_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Your stall address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-sm text-gray-700">
                  {formData.location ? 'Location captured' : 'Location required'}
                </span>
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm"
              >
                {locationLoading ? 'Getting...' : 'Update'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.location}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Creating Profile...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}