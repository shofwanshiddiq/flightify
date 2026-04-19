export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  from: string;
  fromCode: string;
  fromLat: number;
  fromLng: number;
  to: string;
  toCode: string;
  toLat: number;
  toLng: number;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  class: 'economy' | 'business' | 'first';
  date: string;
  flightNumber: string;
  status: 'on-time' | 'delayed' | 'boarding' | 'landed' | 'in-flight';
  progress: number; // 0-100 for live tracking
  color: string;
}

export interface Booking {
  id: string;
  flightId: string;
  flight: Flight;
  passengers: number;
  class: 'economy' | 'business' | 'first';
  seats: string[];
  totalPrice: number;
  bookedAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface BasketItem {
  flight: Flight;
  passengers: number;
  class: 'economy' | 'business' | 'first';
  seats: string[];
}

export interface SearchFilters {
  query: string;
  priceMin: number;
  priceMax: number;
  airlines: string[];
  timeOfDay: string[];
  stops: string;
  from: string;
  to: string;
  date: string;
  class: string;
}

export type Tab = 'dashboard' | 'flights' | 'tracker' | 'profile';
