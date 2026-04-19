import React from 'react';
import { useApp } from '../hooks/useApp';
import { Tab } from '../types';
import { LayoutDashboard, Search, Globe, User, ShoppingCart } from 'lucide-react';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'flights', label: 'Flights', icon: <Search size={16} /> },
  { id: 'tracker', label: 'Live Tracker', icon: <Globe size={16} /> },
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
];

export default function Navbar() {
  const { tab, setTab, basket } = useApp();

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '64px',
      background: 'rgba(5,10,20,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent-lime)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>✈</div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
        }}>Flightify</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', padding: '4px', borderRadius: 14, border: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 13,
              transition: 'all 0.2s',
              background: tab === t.id ? 'var(--accent-lime)' : 'transparent',
              color: tab === t.id ? '#0a1200' : 'var(--text-secondary)',
            }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => setTab('flights')}
          style={{
            position: 'relative',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
          }}
        >
          <ShoppingCart size={15} />
          Basket
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setTab('profile')}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4a9eff, #3cffd4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#0a1200',
          }}>SS</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>Shofwan Shiddiq</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Admin</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
