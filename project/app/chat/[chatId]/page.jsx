'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Send, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!params.chatId) return;

    // Fetch chat details
    const fetchChat = async () => {
      try {
        const chatDoc = await getDoc(doc(db, 'chats', params.chatId));
        if (chatDoc.exists()) {
          setChat({ id: chatDoc.id, ...chatDoc.data() });
        } else {
          toast.error('Chat not found');
          router.push('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load chat');
        console.error('Fetch chat error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();

    // Listen to messages
    const messagesQuery = query(
      collection(db, 'chats', params.chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = [];
      snapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesList);
    });

    return unsubscribe;
  }, [params.chatId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Add message to subcollection
      await addDoc(collection(db, 'chats', params.chatId, 'messages'), {
        text: messageText,
        senderId: user.uid,
        senderName: user.vendorName,
        createdAt: new Date()
      });

      // Update chat's last message
      await updateDoc(doc(db, 'chats', params.chatId), {
        lastMessage: messageText,
        lastMessageAt: new Date()
      });

    } catch (error) {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return date.toDate().toLocaleTimeString('en-IN', {
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

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Chat not found</h2>
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

  const otherParticipant = chat.participants.find(id => id !== user.uid);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-semibold text-gray-800">{chat.listingTitle}</h1>
                <p className="text-sm text-gray-600">Trade Chat</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => router.push('/map')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MapPin className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-2">Start the conversation!</h3>
              <p className="text-gray-600 text-sm">
                Discuss pickup time, location, and other details for your trade.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.senderId === user.uid
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === user.uid ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}