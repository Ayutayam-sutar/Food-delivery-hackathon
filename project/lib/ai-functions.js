// AI-powered functions for pricing and urgency calculation

const MARKET_RATES = {
  'onions': 40,
  'tomatoes': 60,
  'potatoes': 30,
  'ginger': 200,
  'garlic': 300,
  'chilli': 80,
  'coriander': 40,
  'mint': 50,
  'oil': 150,
  'flour': 45,
  'rice': 50,
  'lentils': 120
};

const TIME_MULTIPLIERS = {
  morning: 1.1,    // 6-10 AM
  noon: 1.0,       // 10 AM - 4 PM  
  evening: 1.2,    // 4-8 PM
  night: 0.9       // 8 PM - 6 AM
};

const PERISHABILITY_MULTIPLIERS = {
  high: 0.7,   // High perishability = lower price
  medium: 0.85,
  low: 1.0
};

export const getSuggestedPrice = (itemName, perishability = 'medium', quantity = 1) => {
  const currentHour = new Date().getHours();
  const itemKey = itemName.toLowerCase();
  
  // Get base market rate
  const baseRate = MARKET_RATES[itemKey] || 50;
  
  // Determine time multiplier
  let timeMultiplier = TIME_MULTIPLIERS.noon;
  if (currentHour >= 6 && currentHour < 10) timeMultiplier = TIME_MULTIPLIERS.morning;
  else if (currentHour >= 16 && currentHour < 20) timeMultiplier = TIME_MULTIPLIERS.evening;
  else if (currentHour >= 20 || currentHour < 6) timeMultiplier = TIME_MULTIPLIERS.night;
  
  // Apply perishability factor
  const perishabilityMultiplier = PERISHABILITY_MULTIPLIERS[perishability];
  
  // Calculate quantity discount (bulk discount)
  const quantityMultiplier = quantity > 5 ? 0.9 : quantity > 10 ? 0.8 : 1.0;
  
  // Final price calculation
  const suggestedPrice = Math.round(
    baseRate * timeMultiplier * perishabilityMultiplier * quantityMultiplier
  );
  
  return Math.max(suggestedPrice, 5); // Minimum price of ₹5
};

export const calculateUrgency = (expiryHours) => {
  if (expiryHours <= 2) return 'high';
  if (expiryHours <= 6) return 'medium';
  return 'low';
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    default: return 'text-green-600 bg-green-50';
  }
};

export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};