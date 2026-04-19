import React, { useState } from 'react';
import { FLIGHTS } from '../data/flights';
import WorldMap from '../components/WorldMap';
import { Flight } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TRACKED = FLIGHTS.filter(f => f.status === 'in-flight' || f.status === 'boarding' || f.status === 'on-time');

export default function TrackerPage() {
  const [active, setActive] = useState<Flight>(TRACKED[0]);
  const [idx, setIdx] = useState(0);

  const go = (dir: number) => {
    const newIdx = (idx + dir + TRACKED.length) % TRACKED.length;
    setIdx(newIdx);
    setActive(TRACKED[newIdx]);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>Live Flight Tracker</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>Real-time global flight tracking</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="animate-blink" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-lime)', display: 'inline-block' }} />
          <span style={{ fontSize: 13, color: 'var(--accent-lime)', fontWeight: 600 }}>{TRACKED.length} Live Flights</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden' }}>
        {/* Map */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', margin: 0, padding: 0 }}>
            <WorldMap
              flights={FLIGHTS}
              activeFlight={active}
              onSelectFlight={f => {
                setActive(f);
                const i = TRACKED.findIndex(t => t.id === f.id);
                if (i >= 0) setIdx(i);
              }}
              height={620}
            />
          </div>

          {/* Legend */}
          <div style={{ marginTop: 16, padding: '0 20px 20px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 10, color: 'var(--text-secondary)' }}>TRACKED FLIGHTS — click to switch</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TRACKED.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => { setIdx(i); setActive(f); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 10,
                    border: `1px solid ${i === idx ? f.color : 'var(--border)'}`,
                    background: i === idx ? `${f.color}15` : 'var(--bg-card)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    color: i === idx ? f.color : 'var(--text-secondary)',
                    fontWeight: i === idx ? 700 : 400, fontSize: 13,
                  }}
                >
                  <span style={{ color: f.color, fontSize: 16 }}>✈</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700 }}>{f.flightNumber}</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{f.fromCode}→{f.toCode}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ borderLeft: '1px solid var(--border)', padding: 20, overflowY: 'auto', background: 'var(--bg-card)' }}>
          {/* Carousel nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button onClick={() => go(-1)} className="btn btn-ghost" style={{ padding: '6px 12px' }}>
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{idx + 1} / {TRACKED.length}</span>
            <button onClick={() => go(1)} className="btn btn-ghost" style={{ padding: '6px 12px' }}>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Flight header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', margin: '0 auto 12px',
              background: `${active.color}20`, border: `2px solid ${active.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: active.color,
              animation: 'float-plane 3s ease-in-out infinite',
            }}>✈</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em' }}>
              {active.flightNumber}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{active.airline}</div>
            <div style={{ marginTop: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                background: `${active.color}18`, border: `1px solid ${active.color}40`,
                color: active.color,
              }}>{active.status.replace('-', ' ').toUpperCase()}</span>
            </div>
          </div>

          {/* Route */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32 }}>{active.fromCode}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{active.from}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{active.departure}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{active.duration}</div>
              <div style={{ fontSize: 20, color: active.color }}>- - ✈ - -</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{active.stops === 0 ? 'nonstop' : `${active.stops} stop`}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32 }}>{active.toCode}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{active.to}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{active.arrival}</div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              <span>Flight Progress</span><span>{active.progress}%</span>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 8,
                width: `${active.progress}%`,
                background: `linear-gradient(90deg, ${active.color}60, ${active.color})`,
                transition: 'width 0.8s ease',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', right: -6, top: -4, fontSize: 16, color: active.color }}>✈</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Altitude', value: '38,000 ft' },
              { label: 'Speed', value: '580 mph' },
              { label: 'Distance', value: `${Math.round((active.fromLat - active.toLat) ** 2 + (active.fromLng - active.toLng) ** 2) * 10} km` },
              { label: 'ETA', value: active.arrival },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Coordinates */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 6 }}>COORDINATES</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: active.color }}>
              {`${active.fromLat.toFixed(2)}°N, ${active.fromLng.toFixed(2)}°E → ${active.toLat.toFixed(2)}°N, ${active.toLng.toFixed(2)}°E`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
