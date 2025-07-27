'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot, addDoc, GeoPoint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Search, Filter, MapPin, Clock, TrendingUp } from 'lucide-react';
import { getSuggestedPrice, calculateUrgency, getUrgencyColor, formatDistance, calculateDistance } from '@/lib/ai-functions';
import CreateListingModal from '@/components/CreateListingModal';
import ListingCard from '@/components/ListingCard';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'surplus', 'need'
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.location) return;

    // Listen to nearby listings (excluding own)
    const nearbyQuery = query(
      collection(db, 'listings'),
      where('vendorId', '!=', user.uid),
      where('status', '==', 'active'),
      orderBy('vendorId'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeNearby = onSnapshot(nearbyQuery, (snapshot) => {
      const nearbyListings = [];
      
      snapshot.forEach((doc) => {
        const listing = { id: doc.id, ...doc.data() };
        const distance = calculateDistance(
          user.location.lat, user.location.lng,
          listing.location.latitude, listing.location.longitude
        );
        
        // Only include listings within 5km
        if (distance <= 5) {
          nearbyListings.push({
            ...listing,
            distance,
            urgency: calculateUrgency(listing.expiryHours)
          });
        }
      });

      // Sort by urgency, then distance
      nearbyListings.sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        }
        return a.distance - b.distance;
      });

      setListings(nearbyListings);
      setLoading(false);
    });

    // Listen to user's own listings
    const myQuery = query(
      collection(db, 'listings'),
      where('vendorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeMyListings = onSnapshot(myQuery, (snapshot) => {
      const userListings = [];
      snapshot.forEach((doc) => {
        userListings.push({ id: doc.id, ...doc.data() });
      });
      setMyListings(userListings);
    });

    return () => {
      unsubscribeNearby();
      unsubscribeMyListings();
    };
  }, [user]);

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.type === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Hey {user?.vendorName}! 👋</h1>
              <p className="text-sm text-gray-600">{user?.stallName}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-600 font-medium">Active</p>
              <p className="text-lg font-bold text-green-700">{myListings.filter(l => l.status === 'active').length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <Search className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-blue-600 font-medium">Nearby</p>
              <p className="text-lg font-bold text-blue-700">{listings.length}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-purple-600 font-medium">Urgent</p>
              <p className="text-lg font-bold text-purple-700">{listings.filter(l => l.urgency === 'high').length}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All Items' },
              { key: 'surplus', label: 'Surplus' },
              { key: 'need', label: 'Needed' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Finding nearby listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-4">No {filter === 'all' ? '' : filter} items available nearby</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <CreateListingModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            toast.success('Listing created successfully!');
          }}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 text-orange-500">
            <Search className="w-5 h-5" />
            <span className="text-xs mt-1">Browse</span>
          </button>
          <button 
            onClick={() => window.location.href = '/map'}
            className="flex flex-col items-center py-2 text-gray-400"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Map</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center py-2 text-gray-400"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs mt-1">Post</span>
          </button>
        </div>
      </div>
    </div>
  );
}