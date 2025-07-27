'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, Phone, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { getUrgencyColor, formatDistance } from '@/lib/ai-functions';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ListingCard({ listing }) {
  const [claiming, setClaiming] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

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

  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - date.toDate();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${listing.type === 'surplus' ? 'bg-green-100' : 'bg-blue-100'}`}>
            {listing.type === 'surplus' ? (
              <TrendingUp className={`w-5 h-5 ${listing.type === 'surplus' ? 'text-green-600' : 'text-blue-600'}`} />
            ) : (
              <TrendingDown className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{listing.itemName}</h3>
            <p className="text-sm text-gray-600">by {listing.stallName}</p>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(listing.urgency)}`}>
          {listing.urgency} urgency
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-600">₹{listing.price}</span>
          <span className="text-gray-600">
            {listing.quantity} {listing.unit}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{formatDistance(listing.distance)} away</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{timeAgo(listing.createdAt)}</span>
          </div>
        </div>

        {listing.description && (
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{listing.description}</p>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleClaim}
          disabled={claiming || listing.status === 'claimed'}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            listing.status === 'claimed'
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {claiming ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Claiming...
            </div>
          ) : listing.status === 'claimed' ? (
            'Already Claimed'
          ) : (
            <>
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Claim & Chat
            </>
          )}
        </button>
        
        <button
          onClick={() => router.push(`/listing/${listing.id}`)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
}