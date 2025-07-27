'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, GeoPoint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { X, Package, Clock, DollarSign, Mic } from 'lucide-react';
import { getSuggestedPrice } from '@/lib/ai-functions';
import toast from 'react-hot-toast';

const COMMON_ITEMS = [
  'Onions', 'Tomatoes', 'Potatoes', 'Ginger', 'Garlic', 
  'Green Chilli', 'Coriander', 'Mint', 'Oil', 'Flour', 
  'Rice', 'Lentils', 'Spices', 'Salt', 'Sugar'
];

const UNITS = ['kg', 'grams', 'pieces', 'bunches', 'liters', 'packets'];

export default function CreateListingModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'surplus',
    itemName: '',
    quantity: '',
    unit: 'kg',
    perishability: 'medium',
    expiryHours: '',
    price: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const { user } = useAuth();

  const handleItemSelect = (item) => {
    const newFormData = { ...formData, itemName: item };
    const suggestedPrice = getSuggestedPrice(item, formData.perishability, formData.quantity || 1);
    
    setFormData({
      ...newFormData,
      price: suggestedPrice.toString()
    });
  };

  const handleQuantityChange = (quantity) => {
    const newFormData = { ...formData, quantity };
    if (formData.itemName) {
      const suggestedPrice = getSuggestedPrice(formData.itemName, formData.perishability, quantity || 1);
      setFormData({
        ...newFormData,
        price: suggestedPrice.toString()
      });
    } else {
      setFormData(newFormData);
    }
  };

  const handlePerishabilityChange = (perishability) => {
    const newFormData = { ...formData, perishability };
    if (formData.itemName) {
      const suggestedPrice = getSuggestedPrice(formData.itemName, perishability, formData.quantity || 1);
      setFormData({
        ...newFormData,
        price: suggestedPrice.toString()
      });
    } else {
      setFormData(newFormData);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({ ...prev, description: transcript }));
      };
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } else {
      toast.error('Voice input not supported on this browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.quantity || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    try {
      await addDoc(collection(db, 'listings'), {
        ...formData,
        vendorId: user.uid,
        vendorName: user.vendorName,
        stallName: user.stallName,
        location: new GeoPoint(user.location.lat, user.location.lng),
        status: 'active',
        createdAt: new Date(),
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        expiryHours: parseInt(formData.expiryHours) || 24
      });
      
      onSuccess();
    } catch (error) {
      toast.error('Failed to create listing');
      console.error('Create listing error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Create Listing</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Listing Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'surplus', label: 'I have surplus', color: 'bg-green-50 border-green-200 text-green-700' },
                { value: 'need', label: 'I need this', color: 'bg-blue-50 border-blue-200 text-blue-700' }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                    formData.type === type.value 
                      ? type.color 
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Item Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              Item Name *
            </label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
              placeholder="Type or select item"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none mb-3"
              required
            />
            <div className="grid grid-cols-3 gap-2">
              {COMMON_ITEMS.slice(0, 9).map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleItemSelect(item)}
                  className="px-3 py-2 text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="0"
                min="0.1"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Perishability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Perishability Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'low', label: 'Low', color: 'bg-green-50 border-green-200 text-green-700' },
                { value: 'medium', label: 'Medium', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                { value: 'high', label: 'High', color: 'bg-red-50 border-red-200 text-red-700' }
              ].map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handlePerishabilityChange(level.value)}
                  className={`p-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    formData.perishability === level.value 
                      ? level.color 
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Expiry (hours)
              </label>
              <input
                type="number"
                value={formData.expiryHours}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryHours: e.target.value }))}
                placeholder="24"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Description with Voice Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details..."
                rows={3}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
              />
              <button
                type="button"
                onClick={startVoiceInput}
                className={`absolute right-3 top-3 p-2 rounded-full ${
                  isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}