import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, BasketItem, Tab, Flight } from '../types';
import { SAMPLE_BOOKINGS } from '../data/flights';

interface AppState {
  tab: Tab;
  setTab: (tab: Tab) => void;
  basket: BasketItem[];
  addToBasket: (item: BasketItem) => void;
  removeFromBasket: (flightId: string) => void;
  clearBasket: () => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (f: Flight | null) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const addToBasket = (item: BasketItem) => {
    setBasket(prev => {
      const exists = prev.find(b => b.flight.id === item.flight.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromBasket = (flightId: string) => {
    setBasket(prev => prev.filter(b => b.flight.id !== flightId));
  };

  const clearBasket = () => setBasket([]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      tab, setTab,
      basket, addToBasket, removeFromBasket, clearBasket,
      bookings, addBooking,
      selectedFlight, setSelectedFlight,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
