import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { User, CreditCard, Star, Settings, Bell, Shield, ChevronRight, Plane, Calendar, TrendingUp } from 'lucide-react';

const MENU_ITEMS = [
  { icon: <User size={16} />, label: 'Personal Info', desc: 'Name, email, passport details' },
  { icon: <CreditCard size={16} />, label: 'Payment Methods', desc: 'Cards and billing info' },
  { icon: <Bell size={16} />, label: 'Notifications', desc: 'Flight alerts and updates' },
  { icon: <Shield size={16} />, label: 'Security', desc: 'Password and 2FA' },
  { icon: <Settings size={16} />, label: 'Preferences', desc: 'Language, currency, timezone' },
];

const STATUS_MAP: Record<string, string> = {
  'confirmed': 'var(--accent-lime)',
  'pending': 'var(--accent-orange)',
  'cancelled': '#ff4a6a',
};

export default function ProfilePage() {
  const { bookings } = useApp();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const totalSpent = bookings.reduce((a, b) => a + b.totalPrice, 0);
  const totalFlights = bookings.length;

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Profile header */}
        <div className="card" style={{ padding: 28, display: 'flex', gap: 24, alignItems: 'center', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-surface) 100%)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 84, height: 84, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4a9eff, #3cffd4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, color: '#050a14',
              fontFamily: 'var(--font-display)',
              border: '3px solid var(--accent-lime)',
            }}>SS</div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--accent-lime)', border: '2px solid var(--bg-card)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11,
            }}>✓</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26 }}>Shofwan Shiddiq</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>shofwanjimenez@gmail.com</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <span className="badge badge-lime"><Star size={10} /> Admin</span>
              <span className="badge badge-cyan">Verified Traveler</span>
              <span className="badge badge-blue">12,400 Miles</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'Flights', value: totalFlights, icon: <Plane size={18} /> },
              { label: 'Countries', value: 14, icon: <TrendingUp size={18} /> },
              { label: 'Spent', value: `Rp. ${totalSpent.toLocaleString('id-ID')}`, icon: <CreditCard size={18} /> },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 20px', minWidth: 90 }}>
                <div style={{ color: 'var(--accent-lime)', marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
          {/* Left: menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 8 }}>
              {MENU_ITEMS.map(item => (
                <button
                  key={item.label}
                  onClick={() => setActiveSection(activeSection === item.label ? null : item.label)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', border: 'none', borderRadius: 10,
                    background: activeSection === item.label ? 'var(--bg-surface)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    color: activeSection === item.label ? 'var(--text-primary)' : 'var(--text-secondary)',
                    marginBottom: 2,
                  }}
                  onMouseEnter={e => { if (activeSection !== item.label) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (activeSection !== item.label) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ color: activeSection === item.label ? 'var(--accent-lime)' : 'var(--text-muted)' }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', transform: activeSection === item.label ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              ))}
            </div>

            {/* Loyalty card */}
            <div style={{
              borderRadius: 14, padding: 18, position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(135deg, #1a2f1a, #0f2a0f)',
              border: '1px solid rgba(184,255,60,0.2)',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(184,255,60,0.05)' }} />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-lime)', marginBottom: 8 }}>LOYALTY PROGRAM</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'white', marginBottom: 4 }}>Gold Status</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>12,400 / 20,000 miles to Platinum</div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 5 }}>
                <div style={{ width: '62%', height: '100%', background: 'var(--accent-lime)', borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>62% to next tier</div>
            </div>
          </div>

          {/* Right: bookings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activeSection && (
              <div className="card" style={{ padding: 22 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{activeSection}</div>
                {activeSection === 'Personal Info' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { label: 'First Name', value: 'Shofwan' },
                      { label: 'Last Name', value: 'Shiddiq' },
                      { label: 'Email', value: 'shofwanjimenez@gmail.com' },
                      { label: 'Phone', value: '+62 8128930132' },
                      { label: 'Passport', value: 'ID·XXX909XXX-932' },
                      { label: 'Nationality', value: 'Indonesian' },
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{f.label}</div>
                        <input className="input" defaultValue={f.value} />
                      </div>
                    ))}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <button className="btn btn-primary" style={{ padding: '10px 24px' }}>Save Changes</button>
                    </div>
                  </div>
                )}
                {activeSection === 'Notifications' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {['Flight status changes', 'Check-in reminders', 'Price drop alerts', 'Promotional offers', 'Loyalty updates'].map(n => (
                      <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 14 }}>{n}</span>
                        <div style={{ width: 42, height: 24, borderRadius: 12, background: 'var(--accent-lime)', cursor: 'pointer', position: 'relative' }}>
                          <div style={{ position: 'absolute', right: 3, top: 3, width: 18, height: 18, borderRadius: '50%', background: '#0a1200' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(activeSection === 'Payment Methods' || activeSection === 'Security' || activeSection === 'Preferences') && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14, padding: '20px 0' }}>
                    Settings for {activeSection} coming soon.
                  </div>
                )}
              </div>
            )}

            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>My Bookings</div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                  <Calendar size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <div>No bookings yet</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bookings.map(b => (
                    <div key={b.id} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', background: 'var(--bg-surface)', transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>
                            {b.flight.fromCode} → {b.flight.toCode}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                            {b.flight.airline} · {b.flight.flightNumber}
                          </div>
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                          background: `${STATUS_MAP[b.status]}18`,
                          border: `1px solid ${STATUS_MAP[b.status]}40`,
                          color: STATUS_MAP[b.status],
                        }}>{b.status.toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                        {[
                          { label: 'Date', value: b.flight.date },
                          { label: 'Class', value: b.class },
                          { label: 'Seats', value: b.seats.join(', ') },
                          { label: 'Total', value: `$${b.totalPrice.toLocaleString()}` },
                        ].map(d => (
                          <div key={d.label}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 2 }}>{d.label.toUpperCase()}</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: d.label === 'Total' ? 'var(--accent-lime)' : 'var(--text-primary)' }}>{d.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
