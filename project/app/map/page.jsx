'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { calculateDistance } from '@/lib/ai-functions';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function MapPage() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Import leaflet CSS on client side
    import('leaflet/dist/leaflet.css');
    
    // Fix default markers
    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
        iconUrl: '/leaflet-images/marker-icon.png',
        shadowUrl: '/leaflet-images/marker-shadow.png',
      });
      setMapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!user?.location) return;

    const listingsQuery = query(
      collection(db, 'listings'),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(listingsQuery, (snapshot) => {
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
            distance
          });
        }
      });

      setListings(nearbyListings);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.type === filter;
  });

  if (!mapReady || !user?.location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-semibold text-gray-800">Nearby Vendors</h1>
                <p className="text-sm text-gray-600">{filteredListings.length} items found</p>
              </div>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All' },
              { key: 'surplus', label: 'Surplus' },
              { key: 'need', label: 'Need' }
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

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[user.location.lat, user.location.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User's location */}
          <Marker position={[user.location.lat, user.location.lng]}>
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong><br />
                {user.stallName}
              </div>
            </Popup>
          </Marker>

          {/* Listings */}
          {filteredListings.map(listing => (
            <Marker
              key={listing.id}
              position={[listing.location.latitude, listing.location.longitude]}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{listing.itemName}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      listing.type === 'surplus' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {listing.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{listing.stallName}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-orange-600">₹{listing.price}</span>
                    <span className="text-sm text-gray-500">{listing.quantity} {listing.unit}</span>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/listing/${listing.id}`)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating action button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute bottom-6 right-4 bg-white shadow-lg p-3 rounded-full z-10"
        >
          <MapPin className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
}