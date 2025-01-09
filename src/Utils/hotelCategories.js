export const CATEGORIES = {
  LAKESIDE: "Lakeside Hotels",
  VIP: "VIP Hotels",
  STANDARD: "Standard Hotels",
  BUDGET: "Budget Hotels"
};

export const categorizeHotel = (hotel) => {
  // Categorize based on price, location, and features
  if (hotel.location?.toLowerCase().includes('lakeside') || 
      hotel.name?.toLowerCase().includes('lake') || 
      hotel.description?.toLowerCase().includes('lake')) {
    return CATEGORIES.LAKESIDE;
  }
  
  if (hotel.price >= 15000 || 
      hotel.features?.includes('VIP') || 
      hotel.name?.toLowerCase().includes('luxury') || 
      hotel.name?.toLowerCase().includes('premium')) {
    return CATEGORIES.VIP;
  }
  
  if (hotel.price <= 8000) {
    return CATEGORIES.BUDGET;
  }
  
  return CATEGORIES.STANDARD;
};
