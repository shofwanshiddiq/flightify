import React, { useState } from 'react';
import { Flight, BasketItem } from '../types';
import { X, Check } from 'lucide-react';

interface Props {
  flight: Flight | null;
  onClose: () => void;
  onAddToBasket: (item: BasketItem) => void;
}

const SEATS_GRID = [
  ['A1','B1','','C1','D1','E1'],
  ['A2','B2','','C2','D2','E2'],
  ['A3','B3','','C3','D3','E3'],
  ['A4','B4','','C4','D4','E4'],
  ['A5','B5','','C5','D5','E5'],
];

const TAKEN = new Set(['B1','D1','E1','B2','C3','A4','E4','C5']);

export default function FlightModal({ flight, onClose, onAddToBasket }: Props) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState<'economy'|'business'|'first'>('economy');
  const [added, setAdded] = useState(false);

  if (!flight) return null;

  const toggleSeat = (seat: string) => {
    if (TAKEN.has(seat)) return;
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : prev.length < passengers ? [...prev, seat] : prev
    );
  };

  const handleAdd = () => {
    if (selectedSeats.length === 0) return;
    onAddToBasket({ flight, passengers, class: flightClass, seats: selectedSeats });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1500);
  };

  const classMultiplier = flightClass === 'economy' ? 1 : flightClass === 'business' ? 2.5 : 4;
  const total = Math.round(flight.price * classMultiplier * passengers);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onClose}>
      <div
        className="card"
        style={{ width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24 }}>
              {flight.fromCode} → {flight.toCode}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{flight.airline} · {flight.flightNumber}</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: 8, borderRadius: '50%' }}><X size={18} /></button>
        </div>

        {/* Flight info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Departure', value: flight.departure },
            { label: 'Duration', value: flight.duration },
            { label: 'Arrival', value: flight.arrival },
            { label: 'Date', value: flight.date },
            { label: 'Stops', value: flight.stops === 0 ? 'Direct' : `${flight.stops} stop` },
            { label: 'Status', value: flight.status.replace('-', ' ') },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Configuration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>Passengers</label>
            <select className="input" value={passengers} onChange={e => setPassengers(+e.target.value)}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} passenger{n>1?'s':''}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>Class</label>
            <select className="input" value={flightClass} onChange={e => setFlightClass(e.target.value as 'economy'|'business'|'first')}>
              <option value="economy">Economy (${flight.price})</option>
              <option value="business">Business (${Math.round(flight.price*2.5)})</option>
              <option value="first">First Class (${Math.round(flight.price*4)})</option>
            </select>
          </div>
        </div>

        {/* Seat map */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            Select Seats ({selectedSeats.length}/{passengers})
          </div>
          {/* Cabin header */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
            {['A','B','','C','D','E'].map((col, i) => (
              <div key={i} style={{ width: 36, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}>{col}</div>
            ))}
          </div>
          {SEATS_GRID.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 6 }}>
              {row.map((seat, ci) =>
                seat === '' ? (
                  <div key={ci} style={{ width: 36 }} />
                ) : (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    style={{
                      width: 36, height: 32, borderRadius: 6, cursor: TAKEN.has(seat) ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10,
                      background: TAKEN.has(seat)
                        ? 'var(--bg-surface)'
                        : selectedSeats.includes(seat)
                          ? 'var(--accent-lime)'
                          : 'var(--bg-card2)',
                      color: TAKEN.has(seat)
                        ? 'var(--text-muted)'
                        : selectedSeats.includes(seat)
                          ? '#0a1200'
                          : 'var(--text-secondary)',
                      transition: 'all 0.15s',
                    }}
                  >{TAKEN.has(seat) ? '×' : seat}</button>
                )
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--accent-lime)' }} /> Selected</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--bg-card2)', border: '1px solid var(--border)' }} /> Available</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--bg-surface)', border: '1px solid var(--border)' }} /> Taken</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Total price</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--accent-lime)' }}>${total.toLocaleString()}</div>
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: 15, opacity: selectedSeats.length === 0 ? 0.5 : 1 }}
            onClick={handleAdd}
            disabled={selectedSeats.length === 0}
          >
            {added ? <><Check size={16} /> Added!</> : 'Add to Basket'}
          </button>
        </div>
      </div>
    </div>
  );
}
