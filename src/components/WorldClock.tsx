import React, { useEffect, useState } from 'react';
import { WORLD_CITIES } from '../data/flights';

export default function WorldClock() {
  const [times, setTimes] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimes(WORLD_CITIES.map(c => {
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const city = new Date(utc + c.offset * 3600000);
        return city.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      {WORLD_CITIES.map((c, i) => (
        <div key={c.name} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '10px 14px',
          minWidth: 100,
          flexShrink: 0,
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>{c.name.toUpperCase()}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{times[i] || '--:--'}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 2 }}>UTC{c.offset >= 0 ? '+' : ''}{c.offset}</div>
        </div>
      ))}
    </div>
  );
}
