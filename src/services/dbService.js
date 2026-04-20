const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const TRIPS_KEY = 'smart_travel_trips';

// Helper to get trips from storage
const getStorageTrips = () => {
  return JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]');
};

// Helper to save trips to storage
const saveStorageTrips = (trips) => {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
};

export const dbService = {
  // Get all trips for a specific user
  getTrips: async (userId) => {
    await delay();
    const trips = getStorageTrips();
    return trips.filter(t => t.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get a single trip
  getTripById: async (tripId) => {
    await delay();
    const trips = getStorageTrips();
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");
    return trip;
  },

  // Create a new trip
  createTrip: async (userId, tripData) => {
    await delay();
    const trips = getStorageTrips();
    const newTrip = {
      id: Date.now().toString(),
      userId,
      ...tripData,
      itinerary: [], // Array of objects
      expenses: [], // Array of objects
      createdAt: new Date().toISOString()
    };
    trips.push(newTrip);
    saveStorageTrips(trips);
    return newTrip;
  },

  // Delete a trip
  deleteTrip: async (tripId) => {
    await delay();
    let trips = getStorageTrips();
    trips = trips.filter(t => t.id !== tripId);
    saveStorageTrips(trips);
  },

  // Update trip general details
  updateTrip: async (tripId, tripData) => {
    await delay();
    let trips = getStorageTrips();
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) throw new Error("Trip not found");
    
    trips[tripIndex] = { ...trips[tripIndex], ...tripData };
    saveStorageTrips(trips);
    return trips[tripIndex];
  },

  // --- Itinerary operations ---
  addItineraryItem: async (tripId, itemData) => {
    await delay(300);
    let trips = getStorageTrips();
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");
    
    const newItem = { id: Date.now().toString(), ...itemData };
    trip.itinerary.push(newItem);
    saveStorageTrips(trips);
    return newItem;
  },

  deleteItineraryItem: async (tripId, itemId) => {
    await delay(300);
    let trips = getStorageTrips();
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      trip.itinerary = trip.itinerary.filter(i => i.id !== itemId);
      saveStorageTrips(trips);
    }
  },

  // --- Budget/Expense operations ---
  addExpense: async (tripId, expenseData) => {
    await delay(300);
    let trips = getStorageTrips();
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");
    
    const newExpense = { 
      id: Date.now().toString(), 
      ...expenseData, 
      amount: parseFloat(expenseData.amount) // Ensure it's a number
    };
    trip.expenses.push(newExpense);
    saveStorageTrips(trips);
    return newExpense;
  },

  deleteExpense: async (tripId, expenseId) => {
    await delay(300);
    let trips = getStorageTrips();
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
      saveStorageTrips(trips);
    }
  }
};
