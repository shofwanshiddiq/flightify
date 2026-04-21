import React from 'react';
import { Flight } from '../types';
import { Clock, Users, ArrowRight } from 'lucide-react';

interface Props {
  flight: Flight;
  onBook?: (flight: Flight) => void;
  onDetail?: (flight: Flight) => void;
  compact?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  'on-time': 'var(--accent-lime)',
  'delayed': 'var(--accent-orange)',
  'boarding': 'var(--accent-cyan)',
  'landed': 'var(--text-secondary)',
  'in-flight': '#4a9eff',
};

export default function FlightCard({ flight, onBook, onDetail, compact }: Props) {
  const statusColor = STATUS_COLORS[flight.status] || 'var(--text-secondary)';

  if (compact) {
    return (
      <div
        className="card"
        style={{ padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.2s', marginBottom: 8 }}
        onClick={() => onDetail?.(flight)}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>✈</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
                {flight.fromCode} <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--text-muted)' }} /> {flight.toCode}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{flight.airline} · {flight.flightNumber}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--accent-lime)' }}>Rp. {flight.price.toLocaleString('id-ID')}</div>
            <div style={{ fontSize: 11, color: statusColor, fontWeight: 600 }}>{flight.status.replace('-', ' ').toUpperCase()}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{ padding: '20px', transition: 'all 0.25s', animation: 'fade-in-up 0.4s ease forwards' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-bright)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--bg-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, border: '1px solid var(--border)',
          }}>✈</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{flight.airline}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{flight.flightNumber}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            color: statusColor,
            background: `${statusColor}18`,
            border: `1px solid ${statusColor}40`,
            padding: '3px 9px', borderRadius: 20,
          }}>{flight.status.replace('-', ' ').toUpperCase()}</div>
        </div>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>{flight.fromCode}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{flight.from}</div>
          <div style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, marginTop: 2 }}>{flight.departure}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{flight.duration}</div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <div style={{ color: 'var(--accent-lime)', fontSize: 14 }}>✈</div>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>{flight.toCode}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{flight.to}</div>
          <div style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, marginTop: 2 }}>{flight.arrival}</div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 14, borderTop: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)', fontSize: 12 }}>
            <Clock size={13} />{flight.date}
          </div>
          <span style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
            color: 'var(--text-secondary)',
          }}>{flight.class.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>from</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--accent-lime)' }}>Rp. {flight.price.toLocaleString('id-ID')}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => onDetail?.(flight)}>Details</button>
            <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 12 }} onClick={() => onBook?.(flight)}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
