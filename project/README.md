# SurplusX - Street Vendor Trading App

A real-time marketplace for street food vendors in India to trade surplus ingredients and find needed items nearby.

## 🚀 Features

- **Phone OTP Authentication** - Secure login via Firebase Auth
- **Smart Matching** - AI-powered ingredient matching within 3-5km radius
- **Real-time Chat** - Coordinate pickups and negotiate trades
- **Interactive Map** - Leaflet.js integration showing nearby vendors
- **Dynamic Pricing** - AI suggests prices based on perishability, time, and market rates
- **Voice Input** - Quick listing creation with voice commands
- **Urgency-based Sorting** - High priority for items expiring soon

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **Maps**: Leaflet.js with OpenStreetMap
- **AI Features**: Custom pricing algorithms
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📱 Pages Structure

- `/login` - Phone OTP authentication
- `/profile` - Vendor onboarding and profile setup
- `/dashboard` - Main trading interface
- `/listing/[id]` - Detailed listing view
- `/chat/[chatId]` - Real-time messaging
- `/map` - Interactive map with nearby vendors

## 🔧 Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication (Phone provider)
   - Create Firestore database
   - Copy config to `.env.local`

3. **Environment Variables**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=app-id
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📊 Database Collections

### Users
```javascript
{
  uid: string,
  phone: string,
  vendorName: string,
  stallName: string,
  category: string,
  location: GeoPoint,
  address: string,
  createdAt: timestamp
}
```

### Listings
```javascript
{
  vendorId: string,
  itemName: string,
  quantity: number,
  unit: string,
  price: number,
  type: 'surplus' | 'need',
  perishability: 'low' | 'medium' | 'high',
  expiryHours: number,
  location: GeoPoint,
  status: 'active' | 'claimed' | 'completed',
  createdAt: timestamp
}
```

### Chats
```javascript
{
  participants: [uid1, uid2],
  listingId: string,
  listingTitle: string,
  lastMessage: string,
  lastMessageAt: timestamp,
  messages: subcollection
}
```

## 🤖 AI Functions

- **getSuggestedPrice()** - Dynamic pricing based on time, perishability, quantity
- **calculateUrgency()** - Urgency levels based on expiry time
- **calculateDistance()** - Haversine formula for geo-distance

## 🚀 Deployment

Deploy to Vercel with automatic CI/CD:

```bash
npm run build
```

The app is optimized for mobile-first usage with PWA capabilities.

## 🔒 Security Features

- Phone number verification
- Firestore security rules
- Location-based access control
- Real-time data validation

## 📄 License

MIT License - feel free to use for commercial purposes.