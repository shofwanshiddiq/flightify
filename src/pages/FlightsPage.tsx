import React, { useState, useMemo } from 'react';
import { FLIGHTS, AIRLINES } from '../data/flights';
import { useApp } from '../hooks/useApp';
import FlightCard from '../components/FlightCard';
import FlightModal from '../components/FlightModal';
import { Flight, SearchFilters, BasketItem, Booking } from '../types';
import { Search, Filter, ShoppingCart, Trash2, X, Check } from 'lucide-react';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  priceMin: 0,
  priceMax: 5000,
  airlines: [],
  timeOfDay: [],
  stops: 'any',
  from: '',
  to: '',
  date: '',
  class: 'any',
};

export default function FlightsPage() {
  const { basket, addToBasket, removeFromBasket, clearBasket, addBooking, bookings } = useApp();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [detailFlight, setDetailFlight] = useState<Flight | null>(null);
  const [showBasket, setShowBasket] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    return FLIGHTS.filter(f => {
      if (filters.query && !`${f.fromCode} ${f.toCode} ${f.airline} ${f.from} ${f.to}`.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (f.price < filters.priceMin || f.price > filters.priceMax) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline)) return false;
      if (filters.stops === 'direct' && f.stops > 0) return false;
      if (filters.stops === 'stops' && f.stops === 0) return false;
      if (filters.from && !f.from.toLowerCase().includes(filters.from.toLowerCase()) && !f.fromCode.toLowerCase().includes(filters.from.toLowerCase())) return false;
      if (filters.to && !f.to.toLowerCase().includes(filters.to.toLowerCase()) && !f.toCode.toLowerCase().includes(filters.to.toLowerCase())) return false;
      if (filters.class !== 'any' && f.class !== filters.class) return false;
      if (filters.timeOfDay.length > 0) {
        const hour = parseInt(f.departure.split(':')[0]);
        const tod = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';
        if (!filters.timeOfDay.includes(tod)) return false;
      }
      return true;
    });
  }, [filters]);

  const handleCheckout = () => {
    basket.forEach(item => {
      const booking: Booking = {
        id: `b${Date.now()}${Math.random()}`,
        flightId: item.flight.id,
        flight: item.flight,
        passengers: item.passengers,
        class: item.class,
        seats: item.seats,
        totalPrice: Math.round(item.flight.price * (item.class === 'economy' ? 1 : item.class === 'business' ? 2.5 : 4) * item.passengers),
        bookedAt: new Date().toISOString(),
        status: 'confirmed',
      };
      addBooking(booking);
    });
    clearBasket();
    setCheckoutDone(true);
    setTimeout(() => { setCheckoutDone(false); setShowBasket(false); }, 2500);
  };

  const toggleAirline = (a: string) => {
    setFilters(f => ({
      ...f,
      airlines: f.airlines.includes(a) ? f.airlines.filter(x => x !== a) : [...f.airlines, a],
    }));
  };

  const toggleTime = (t: string) => {
    setFilters(f => ({
      ...f,
      timeOfDay: f.timeOfDay.includes(t) ? f.timeOfDay.filter(x => x !== t) : [...f.timeOfDay, t],
    }));
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Filter panel */}
      {showFilters && (
        <div style={{
          width: 260, flexShrink: 0, borderRight: '1px solid var(--border)',
          overflowY: 'auto', padding: '20px 16px',
          background: 'var(--bg-card)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Filters</div>

          {/* Route */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 8 }}>ROUTE</div>
            <input className="input" placeholder="From (city or code)" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} style={{ marginBottom: 8 }} />
            <input className="input" placeholder="To (city or code)" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
          </div>

          {/* Date */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 8 }}>DATE</div>
            <input className="input" type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
          </div>

          {/* Price */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 8 }}>PRICE RANGE</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input className="input" type="number" placeholder="Min" value={filters.priceMin || ''} onChange={e => setFilters(f => ({ ...f, priceMin: +e.target.value || 0 }))} style={{ width: '50%' }} />
              <span style={{ color: 'var(--text-muted)' }}>–</span>
              <input className="input" type="number" placeholder="Max" value={filters.priceMax || ''} onChange={e => setFilters(f => ({ ...f, priceMax: +e.target.value || 9999 }))} style={{ width: '50%' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              ${filters.priceMin} — ${filters.priceMax}
            </div>
          </div>

          {/* Airlines */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 8 }}>AIRLINES</div>
            {AIRLINES.map(a => (
              <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.airlines.includes(a)} onChange={() => toggleAirline(a)}
                  style={{ accentColor: 'var(--accent-lime)', width: 14, height: 14 }} />
                <span style={{ fontSize: 13, color: filters.airlines.includes(a) ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{a}</span>
              </label>
            ))}
          </div>

          {/* Time of day */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 8 }}>DEPARTURE TIME</div>
            {['morning', 'afternoon', 'evening', 'night'].map(t => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.timeOfDay.includes(t)} onChange={() => toggleTime(t)}
                  style={{ accentColor: 'var(--accent-lime)', width: 14, height: 14 }} />
                <span style={{ fontSize: 13, color: filters.timeOfDay.includes(t) ? 'var(--text-primary)' : 'var(--text-secondary)', textTransform: 'capitalize' }}>{t}</span>
              </label>
            ))}
          </div>

          {/* Stops */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 8 }}>STOPS</div>
            <select className="input" value={filters.stops} onChange={e => setFilters(f => ({ ...f, stops: e.target.value }))}>
              <option value="any">Any</option>
              <option value="direct">Direct only</option>
              <option value="stops">With stops</option>
            </select>
          </div>

          {/* Class */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 8 }}>CLASS</div>
            <select className="input" value={filters.class} onChange={e => setFilters(f => ({ ...f, class: e.target.value }))}>
              <option value="any">Any</option>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>

          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setFilters(DEFAULT_FILTERS)}>
            Clear All
          </button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Search bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0, background: 'var(--bg-card)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              placeholder="Search flights by city, code, or airline..."
              value={filters.query}
              onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <button className="btn btn-ghost" onClick={() => setShowFilters(s => !s)} style={{ gap: 6 }}>
            <Filter size={14} />{showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button className="btn btn-ghost" style={{ position: 'relative' }} onClick={() => setShowBasket(true)}>
            <ShoppingCart size={14} /> Basket
            {basket.length > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: 'var(--accent-lime)', color: '#0a1200',
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>{basket.length}</span>
            )}
          </button>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <div style={{ marginBottom: 12, color: 'var(--text-muted)', fontSize: 13 }}>
            {filtered.length} flights found
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(f => (
              <FlightCard key={f.id} flight={f} onBook={setDetailFlight} onDetail={setDetailFlight} />
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✈</div>
                <div style={{ fontSize: 16, fontFamily: 'var(--font-display)' }}>No flights found</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filters</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flight detail modal */}
      <FlightModal
        flight={detailFlight}
        onClose={() => setDetailFlight(null)}
        onAddToBasket={item => { addToBasket(item); setDetailFlight(null); }}
      />

      {/* Basket drawer */}
      {showBasket && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 150,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        }} onClick={() => setShowBasket(false)}>
          <div
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: 400,
              background: 'var(--bg-card2)', borderLeft: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', padding: 24,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>Your Basket</div>
              <button onClick={() => setShowBasket(false)} className="btn btn-ghost" style={{ padding: 8 }}><X size={16} /></button>
            </div>

            {checkoutDone ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(184,255,60,0.15)', border: '2px solid var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={32} color="var(--accent-lime)" />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>Booking Confirmed!</div>
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Your flights have been booked. Check My Bookings in your profile.</div>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {basket.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      <ShoppingCart size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                      <div>Your basket is empty</div>
                    </div>
                  ) : (
                    basket.map(item => (
                      <div key={item.flight.id} style={{ marginBottom: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                            {item.flight.fromCode} → {item.flight.toCode}
                          </div>
                          <button onClick={() => removeFromBasket(item.flight.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                          {item.flight.airline} · {item.passengers}x {item.class} · Seats: {item.seats.join(', ')}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-lime)' }}>
                          ${(item.flight.price * (item.class==='economy'?1:item.class==='business'?2.5:4) * item.passengers).toFixed(0)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {basket.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Total</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--accent-lime)' }}>
                        ${basket.reduce((sum, item) => sum + Math.round(item.flight.price * (item.class==='economy'?1:item.class==='business'?2.5:4) * item.passengers), 0).toLocaleString()}
                      </span>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }} onClick={handleCheckout}>
                      Checkout & Confirm
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
