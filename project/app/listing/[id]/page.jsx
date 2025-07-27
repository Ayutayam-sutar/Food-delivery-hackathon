'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MapPin, Clock, Phone, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { getUrgencyColor, formatDistance, calculateDistance } from '@/lib/ai-functions';
import toast from 'react-hot-toast';

export default function ListingDetailPage() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingDoc = await getDoc(doc(db, 'listings', params.id));
        
        if (listingDoc.exists()) {
          const listingData = { id: listingDoc.id, ...listingDoc.data() };
          
          // Calculate distance if user location is available
          if (user?.location) {
            const distance = calculateDistance(
              user.location.lat, user.location.lng,
              listingData.location.latitude, listingData.location.longitude
            );
            listingData.distance = distance;
          }
          
          setListing(listingData);
        } else {
          toast.error('Listing not found');
          router.push('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load listing');
        console.error('Fetch listing error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id, user, router]);

  const handleClaim = async () => {
    setClaiming(true);
    
    try {
      // Create a chat room
      const chatRef = await addDoc(collection(db, 'chats'), {
        participants: [user.uid, listing.vendorId],
        listingId: listing.id,
        listingTitle: listing.itemName,
        createdAt: new Date(),
        lastMessage: '',
        lastMessageAt: new Date()
      });

      // Update listing status
      await updateDoc(doc(db, 'listings', listing.id), {
        status: 'claimed',
        claimedBy: user.uid,
        claimedAt: new Date()
      });

      toast.success('Listing claimed! Starting chat...');
      router.push(`/chat/${chatRef.id}`);
      
    } catch (error) {
      toast.error('Failed to claim listing');
      console.error('Claim error:', error);
    } finally {
      setClaiming(false);
    }
  };

  const formatDate = (date) => {
    return date.toDate().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Listing not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-orange-500 hover:text-orange-600"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Listing Details</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Main Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${listing.type === 'surplus' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {listing.type === 'surplus' ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{listing.itemName}</h2>
                  <p className="text-gray-600">{listing.quantity} {listing.unit}</p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(listing.urgency)}`}>
                {listing.urgency} urgency
              </div>
            </div>

            <div className="text-3xl font-bold text-orange-600 mb-4">₹{listing.price}</div>

            {listing.description && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{listing.description}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Posted</span>
                </div>
                <p className="font-semibold">{formatDate(listing.createdAt)}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">Distance</span>
                </div>
                <p className="font-semibold">
                  {listing.distance ? formatDistance(listing.distance) : 'Unknown'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">Perishability</div>
                <p className="font-semibold capitalize">{listing.perishability}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">Expires in</div>
                <p className="font-semibold">{listing.expiryHours} hours</p>
              </div>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="border-t border-gray-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Vendor Information</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{listing.stallName}</p>
                <p className="text-gray-600 text-sm">by {listing.vendorName}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {listing.vendorId !== user?.uid && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex space-x-3">
                <button
                  onClick={handleClaim}
                  disabled={claiming || listing.status === 'claimed'}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    listing.status === 'claimed'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {claiming ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Claiming...
                    </div>
                  ) : listing.status === 'claimed' ? (
                    'Already Claimed'
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 inline mr-2" />
                      Claim & Start Chat
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => router.push('/map')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}