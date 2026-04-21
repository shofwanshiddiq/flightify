import React, { useEffect, useState } from 'react';

interface Props {
  timezone?: number;
  cityName?: string;
}

export default function AnalogClock({ timezone = 0, cityName = 'Local Time' }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const city = new Date(utc + timezone * 3600000);
      setTime(city);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours * 30) + (minutes * 0.5);
  const minuteDeg = (minutes * 6) + (seconds * 0.1);
  const secondDeg = seconds * 6;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>
          {cityName.toUpperCase()}
        </div>
      </div>
      
      {/* Analog Clock */}
      <div style={{
        position: 'relative',
        width: 84,
        height: 84,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-card2) 100%)',
        border: '2px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
      }}>
        {/* Clock markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x = 42 + 33 * Math.cos(angle);
          const y = 42 + 33 * Math.sin(angle);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 2,
                top: y - 2,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'var(--accent-lime)',
              }}
            />
          );
        })}

        {/* Hour hand */}
        <div
          style={{
            position: 'absolute',
            width: 4,
            height: 21,
            background: 'var(--text-primary)',
            borderRadius: 2,
            transformOrigin: '2px 21px',
            transform: `rotate(${hourDeg}deg)`,
            bottom: '50%',
            left: 'calc(50% - 2px)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        />

        {/* Minute hand */}
        <div
          style={{
            position: 'absolute',
            width: 3,
            height: 27,
            background: 'var(--accent-cyan)',
            borderRadius: 2,
            transformOrigin: '1.5px 27px',
            transform: `rotate(${minuteDeg}deg)`,
            bottom: '50%',
            left: 'calc(50% - 1.5px)',
            transition: 'transform 0.1s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        />

        {/* Second hand */}
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: 30,
            background: 'var(--accent-orange)',
            borderRadius: 1,
            transformOrigin: '0.5px 30px',
            transform: `rotate(${secondDeg}deg)`,
            bottom: '50%',
            left: 'calc(50% - 0.5px)',
            transition: 'transform 0.05s linear',
          }}
        />

        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--accent-lime)',
            zIndex: 10,
          }}
        />
      </div>

      {/* Digital display */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 12,
        color: 'var(--accent-lime)',
        textAlign: 'center',
      }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
      </div>
    </div>
  );
}
