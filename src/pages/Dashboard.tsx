import React, { useState } from 'react';
import { FLIGHTS, WORLD_CITIES } from '../data/flights';
import { useApp } from '../hooks/useApp';
import WorldMap from '../components/WorldMap';
import WorldClock from '../components/WorldClock';
import AnalogClock from '../components/AnalogClock';
import FlightCard from '../components/FlightCard';
import FlightModal from '../components/FlightModal';
import { Flight } from '../types';
import { TrendingUp, Plane, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const IN_FLIGHT = FLIGHTS.filter(f => f.status === 'in-flight' || f.status === 'boarding' || f.status === 'on-time');

export default function Dashboard() {
  const { bookings, addToBasket } = useApp();
  const [activeFlight, setActiveFlight] = useState<Flight>(IN_FLIGHT[0]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [detailFlight, setDetailFlight] = useState<Flight | null>(null);

  const carouselFlights = IN_FLIGHT;
  const totalFlights = carouselFlights.length;

  const prev = () => {
    const idx = (carouselIdx - 1 + totalFlights) % totalFlights;
    setCarouselIdx(idx);
    setActiveFlight(carouselFlights[idx]);
  };
  const next = () => {
    const idx = (carouselIdx + 1) % totalFlights;
    setCarouselIdx(idx);
    setActiveFlight(carouselFlights[idx]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px', overflowY: 'auto', height: '100%' }}>
      {/* Top ticker */}
      <div style={{
        overflow: 'clip', background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '8px 0',
      }}>
        <div style={{ display: 'flex', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...FLIGHTS, ...FLIGHTS].map((f, i) => (
            <span key={i} style={{ padding: '0 24px', color: 'var(--text-secondary)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: f.color || 'var(--accent-lime)', fontWeight: 700 }}>✈ {f.flightNumber}</span>
              {f.fromCode} → {f.toCode}
              <span style={{ color: f.status === 'in-flight' ? 'var(--accent-lime)' : 'var(--text-muted)' }}>
                {f.status.toUpperCase()}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* Analog Clock */}
      <div className="card" style={{ padding: '20px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
          <AnalogClock timezone={-5} cityName="New York" />
          <AnalogClock timezone={0} cityName="London" />
          <AnalogClock timezone={4} cityName="Dubai" />
          <AnalogClock timezone={7} cityName="Jakarta" />
          <AnalogClock timezone={9} cityName="Tokyo" />
          <AnalogClock timezone={1} cityName="Paris" />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Bookings', value: bookings.length, icon: <Calendar size={48} />, color: 'var(--accent-cyan)' },
          { label: 'Flights Today', value: FLIGHTS.filter(f => f.status !== 'landed').length, icon: <Plane size={48} />, color: 'var(--accent-lime)' },
          { label: 'In-Flight Now', value: IN_FLIGHT.filter(f=>f.status==='in-flight').length, icon: <TrendingUp size={48} />, color: 'var(--accent-blue)' },
          { label: 'Total Spent', value: `Rp. ${bookings.reduce((a, b) => a + b.totalPrice, 0).toLocaleString('id-ID')}`, icon: <TrendingUp size={48} />, color: 'var(--accent-orange)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}18`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>{stat.label.toUpperCase()}</div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: stat.label === 'Total Spent' ? 16 : 32
                }}
              >{stat.value}
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: map + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Map + carousel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Map */}
          <div className="card" style={{ padding: 0, overflow: 'clip' }}>
            <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Live Flight Tracker</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--accent-lime)' }}>
                <span className="animate-blink" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-lime)', display: 'inline-block' }} />
                {IN_FLIGHT.length} flights tracked
              </div>
            </div>
            <div style={{ width: '100%', margin: 0, padding: 0 }}>
              <WorldMap
                flights={FLIGHTS}
                activeFlight={activeFlight}
                onSelectFlight={f => {
                  setActiveFlight(f);
                  const idx = carouselFlights.findIndex(cf => cf.id === f.id);
                  if (idx >= 0) setCarouselIdx(idx);
                }}
                height={450}
              />
            </div>
          </div>

          {/* Carousel */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Tracked Flight</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={prev} className="btn btn-ghost" style={{ padding: '6px 10px' }}><ChevronLeft size={14} /></button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{carouselIdx+1}/{totalFlights}</span>
                <button onClick={next} className="btn btn-ghost" style={{ padding: '6px 10px' }}><ChevronRight size={14} /></button>
              </div>
            </div>
            {/* Active flight detail */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>
                  {activeFlight.fromCode} → {activeFlight.toCode}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>{activeFlight.airline} · {activeFlight.flightNumber}</div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>{activeFlight.from}</span><span>{activeFlight.to}</span>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', borderRadius: 4, height: 6, position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${activeFlight.progress}%`,
                      background: `linear-gradient(90deg, ${activeFlight.color}80, ${activeFlight.color})`,
                      borderRadius: 4,
                      transition: 'width 1s ease',
                    }} />
                    <div style={{
                      position: 'absolute', top: '50%', left: `${activeFlight.progress}%`,
                      transform: 'translate(-50%,-50%)',
                      fontSize: 10, color: activeFlight.color,
                    }}>✈</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{activeFlight.progress}% complete</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {carouselFlights.map((f, i) => (
                  <button
                    key={f.id}
                    onClick={() => { setCarouselIdx(i); setActiveFlight(f); }}
                    style={{
                      width: 10, height: 10, borderRadius: '50%', cursor: 'pointer',
                      background: i === carouselIdx ? f.color : 'var(--bg-surface)',
                      border: `1px solid ${f.color}`,
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {carouselFlights.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => { setCarouselIdx(i); setActiveFlight(f); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: i === carouselIdx ? `${f.color}18` : 'var(--bg-surface)',
                    border: `1px solid ${i === carouselIdx ? f.color : 'var(--border)'}`,
                    borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, color: i === carouselIdx ? f.color : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ color: f.color }}>●</span>{f.flightNumber}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* My Bookings */}
          <div className="card" style={{ padding: '16px 18px', flex: '0 0 auto' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>My Bookings</div>
            {bookings.slice(0, 3).map(b => (
              <div key={b.id} style={{ marginBottom: 10 }}>
                <div style={{
                  background: 'var(--bg-surface)', borderRadius: 10, padding: '12px 14px',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
                      {b.flight.fromCode} → {b.flight.toCode}
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                      background: b.status === 'confirmed' ? 'rgba(184,255,60,0.12)' : 'rgba(255,140,66,0.12)',
                      color: b.status === 'confirmed' ? 'var(--accent-lime)' : 'var(--accent-orange)',
                      border: `1px solid ${b.status === 'confirmed' ? 'rgba(184,255,60,0.3)' : 'rgba(255,140,66,0.3)'}`,
                    }}>{b.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    {b.flight.airline} · {b.flight.flightNumber} · {b.seats.join(', ')}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{b.flight.date}</span>
                    <span style={{ color: 'var(--accent-lime)', fontWeight: 700 }}>Rp. {b.totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Flights */}
          <div className="card" style={{ padding: '16px 18px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Recent Flights</div>
            {FLIGHTS.slice(0, 5).map(f => (
              <FlightCard key={f.id} flight={f} compact onDetail={setDetailFlight} />
            ))}
          </div>
        </div>
      </div>

      <FlightModal
        flight={detailFlight}
        onClose={() => setDetailFlight(null)}
        onAddToBasket={item => { addToBasket(item); setDetailFlight(null); }}
      />
    </div>
  );
}
