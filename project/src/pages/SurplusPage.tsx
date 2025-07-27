import React, { useState, useEffect } from 'react';
import { Repeat, Plus, Clock, MapPin, Star, Calendar, Package, CheckCircle, Camera, X } from 'lucide-react';
import { AppState } from '../types';

interface SurplusOffer {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  originalPrice: number;
  discountedPrice: number;
  expiryDate: Date;
  image: string;
  description?: string;
  vendor: {
    name: string;
    rating: number;
  };
}

interface SurplusPageProps {
  state: AppState;
}

// Initial mock data
const initialMockOffers: SurplusOffer[] = [
  {
    id: '1',
    itemName: 'Fresh Tomatoes',
    quantity: 50,
    unit: 'kg',
    originalPrice: 40,
    discountedPrice: 25,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    image: 'https://images.pexels.com/photos/533282/pexels-photo-533282.jpeg?auto=compress&cs=tinysrgb&w=400',
    vendor: { name: 'Green Farm Co.', rating: 4.5 }
  },
  {
    id: '2',
    itemName: 'Organic Carrots',
    quantity: 30,
    unit: 'kg',
    originalPrice: 60,
    discountedPrice: 35,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    vendor: { name: 'Organic Harvest', rating: 4.8 }
  },
  {
    id: '3',
    itemName: 'Fresh Bananas',
    quantity: 25,
    unit: 'kg',
    originalPrice: 50,
    discountedPrice: 30,
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400',
    vendor: { name: 'Tropical Fruits Ltd', rating: 4.2 }
  }
];

// Utility functions for localStorage
const serializeOffers = (offers: SurplusOffer[]): any[] => {
  return offers.map(offer => ({
    ...offer,
    expiryDate: offer.expiryDate.toISOString()
  }));
};

const deserializeOffers = (serialized: any[]): SurplusOffer[] => {
  return serialized.map(offer => ({
    ...offer,
    expiryDate: new Date(offer.expiryDate)
  }));
};

export const SurplusPage: React.FC<SurplusPageProps> = ({ state }) => {
   <style>{`
  
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
  
      `}</style>
  // Initialize state with localStorage data
  const [surplusOffers, setSurplusOffers] = useState<SurplusOffer[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('surplusOffers');
      return saved ? deserializeOffers(JSON.parse(saved)) : initialMockOffers;
    }
    return initialMockOffers;
  });

  const [claimedOffers, setClaimedOffers] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('claimedOffers');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  const [showPostModal, setShowPostModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const [newOffer, setNewOffer] = useState({
    itemName: '',
    quantity: '',
    unit: 'kg',
    originalPrice: '',
    discountedPrice: '',
    expiryDate: '',
    description: '',
    selectedImage: ''
  });

  // Save to localStorage when data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplusOffers', JSON.stringify(serializeOffers(surplusOffers)));
    }
  }, [surplusOffers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('claimedOffers', JSON.stringify(Array.from(claimedOffers)));
    }
  }, [claimedOffers]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImages([imageUrl]); // Replace existing images with new one
        setNewOffer(prev => ({ ...prev, selectedImage: imageUrl })); // Auto-select the uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImages(prev => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      if (newOffer.selectedImage === prev[indexToRemove]) {
        setNewOffer(prev => ({ ...prev, selectedImage: '' }));
      }
      return updated;
    });
  };

  const selectImage = (imageUrl: string) => {
    setNewOffer(prev => ({ ...prev, selectedImage: imageUrl }));
  };

  const handleClaimOffer = (offer: SurplusOffer) => {
    const updatedClaims = new Set([...claimedOffers, offer.id]);
    setClaimedOffers(updatedClaims);
    setShowSuccessMessage(`🎉 ${offer.itemName} deal claimed successfully! The vendor will contact you shortly.`);
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };

  const handlePostOffer = () => {
    if (!newOffer.itemName || !newOffer.quantity || !newOffer.originalPrice || 
        !newOffer.discountedPrice || !newOffer.expiryDate || !newOffer.selectedImage) {
      alert('Please fill in all required fields including selecting an image');
      return;
    }

    const newOfferData: SurplusOffer = {
      id: Date.now().toString(),
      itemName: newOffer.itemName,
      quantity: parseInt(newOffer.quantity),
      unit: newOffer.unit,
      originalPrice: parseInt(newOffer.originalPrice),
      discountedPrice: parseInt(newOffer.discountedPrice),
      expiryDate: new Date(newOffer.expiryDate),
      image: newOffer.selectedImage,
      description: newOffer.description,
      vendor: {
        name: state.user?.businessName || 'Your Business',
        rating: 4.8
      }
    };
    
    const updatedOffers = [newOfferData, ...surplusOffers];
    setSurplusOffers(updatedOffers);
    
    setShowPostModal(false);
    setNewOffer({
      itemName: '',
      quantity: '',
      unit: 'kg',
      originalPrice: '',
      discountedPrice: '',
      expiryDate: '',
      description: '',
      selectedImage: ''
    });
    setUploadedImages([]);
    
    setShowSuccessMessage('🎉 Surplus offer posted successfully! Other vendors can now see your deal.');
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };

  const calculateSavings = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>{showSuccessMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Repeat className="h-8 w-8 mr-3 text-green-500 animate-spin" />
              Surplus Exchange
            </h1>
            <p className="text-gray-600 mt-2">Find great deals on surplus inventory and reduce waste</p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 animate-pulse"
          >
            <Plus className="h-5 w-5" />
            <span>Post Surplus</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-3xl font-bold text-green-500 animate-pulse">₹{15200 + claimedOffers.size * 150}</div>
              <div className="text-gray-600">Total Savings</div>
            </div>
            <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-3xl font-bold text-blue-500">{42 + claimedOffers.size}</div>
              <div className="text-gray-600">Deals Claimed</div>
            </div>
            <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-3xl font-bold text-orange-500">{surplusOffers.length}</div>
              <div className="text-gray-600">Items Posted</div>
            </div>
            <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-3xl font-bold text-purple-500">{850 + claimedOffers.size * 25}kg</div>
              <div className="text-gray-600">Waste Reduced</div>
            </div>
          </div>
        </div>

        {/* Surplus Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {surplusOffers.map((offer) => {
            const savings = calculateSavings(offer.originalPrice, offer.discountedPrice);
            const daysLeft = getDaysUntilExpiry(offer.expiryDate);
            const isClaimed = claimedOffers.has(offer.id);
            
            return (
              <div
                key={offer.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 relative ${
                  isClaimed ? 'opacity-75 transform scale-95' : 'hover:scale-105'
                }`}
              >
                {/* Savings Badge */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 animate-bounce">
                  {savings}% OFF
                </div>

                {/* Claimed Badge */}
                {isClaimed && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium z-10 flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>CLAIMED</span>
                  </div>
                )}

                {/* Urgency Badge */}
                {!isClaimed && daysLeft <= 1 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium z-10 animate-pulse">
                    Expires {daysLeft === 0 ? 'Today' : 'Tomorrow'}
                  </div>
                )}

                <div className="relative h-48 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.itemName}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isClaimed ? 'grayscale' : 'hover:scale-110'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{offer.itemName}</h3>
                    <p className="text-sm opacity-90">{offer.quantity} {offer.unit}</p>
                  </div>
                </div>

                <div className="p-4">
                  {/* Vendor Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{offer.vendor.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current animate-pulse" />
                          <span className="text-xs text-gray-500">{offer.vendor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1 animate-bounce" />
                      <span>2.5km</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">₹{offer.discountedPrice}</span>
                      <span className="text-lg text-gray-500 line-through">₹{offer.originalPrice}</span>
                    </div>
                    <p className="text-sm text-gray-600">Per {offer.unit}</p>
                  </div>

                  {/* Expiry Info */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
                    </div>
                    {!isClaimed && (
                      <div className="flex items-center space-x-1 text-orange-500">
                        <Clock className="h-4 w-4 animate-spin" />
                        <span>Urgent</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => !isClaimed && handleClaimOffer(offer)}
                    disabled={isClaimed}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isClaimed
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isClaimed ? (
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Deal Claimed</span>
                      </div>
                    ) : (
                      'Claim Deal'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Post Surplus Modal */}
        {showPostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto transform animate-scale-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Plus className="h-6 w-6 mr-2 text-green-500" />
                Post Surplus Item
              </h2>

              <div className="space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Camera className="h-4 w-4 inline mr-2" />
                    Item Photo *
                  </label>
                  
                  {/* Upload Button */}
                  <div className="mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  {/* Uploaded Image Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Photo:</p>
                      <div className="relative">
                        <img
                          src={uploadedImages[0]}
                          alt="Uploaded preview"
                          className="w-full h-48 object-contain rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setUploadedImages([]);
                            setNewOffer(prev => ({ ...prev, selectedImage: '' }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={newOffer.itemName}
                      onChange={(e) => setNewOffer({ ...newOffer, itemName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      placeholder="e.g., Fresh Tomatoes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={newOffer.quantity}
                      onChange={(e) => setNewOffer({ ...newOffer, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      placeholder="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newOffer.unit}
                      onChange={(e) => setNewOffer({ ...newOffer, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    >
                      <option value="kg">kg</option>
                      <option value="pieces">pieces</option>
                      <option value="liters">liters</option>
                      <option value="packets">packets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price *
                    </label>
                    <input
                      type="number"
                      value={newOffer.originalPrice}
                      onChange={(e) => setNewOffer({ ...newOffer, originalPrice: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      placeholder="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discounted Price *
                    </label>
                    <input
                      type="number"
                      value={newOffer.discountedPrice}
                      onChange={(e) => setNewOffer({ ...newOffer, discountedPrice: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      placeholder="75"
                    />
                  </div>
                </div>

                {/* Show calculated savings */}
                {newOffer.originalPrice && newOffer.discountedPrice && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 text-sm font-medium">
                      💰 Savings: {calculateSavings(parseInt(newOffer.originalPrice), parseInt(newOffer.discountedPrice))}% off
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={newOffer.expiryDate}
                    onChange={(e) => setNewOffer({ ...newOffer, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    rows={3}
                    placeholder="Additional details about the item..."
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowPostModal(false);
                    setUploadedImages([]);
                    setNewOffer(prev => ({ ...prev, selectedImage: '' }));
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostOffer}
                  disabled={!newOffer.selectedImage}
                  className={`flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                    !newOffer.selectedImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Post Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

     
    </div>
  );
};