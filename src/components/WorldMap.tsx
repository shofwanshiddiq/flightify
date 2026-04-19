import React, { useEffect, useRef, useState } from 'react';
import { Flight } from '../types';

interface Props {
  flights: Flight[];
  activeFlight: Flight | null;
  onSelectFlight?: (f: Flight) => void;
  height?: number;
}

// Simple Mercator projection
function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng + 180) / 360) * w;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = h / 2 - (w * mercN) / (2 * Math.PI);
  return { x, y };
}

// Convert TopoJSON/GeoJSON coordinates to SVG path
function geoJsonToPath(geometry: any, w: number, h: number): string {
  let pathData = '';
  
  const drawCoordinates = (coords: any[]) => {
    for (let i = 0; i < coords.length; i++) {
      const [lng, lat] = coords[i];
      const { x, y } = project(lat, lng, w, h);
      pathData += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    pathData += ' Z';
  };

  if (geometry.type === 'Polygon') {
    for (const ring of geometry.coordinates) {
      drawCoordinates(ring);
    }
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      for (const ring of polygon) {
        drawCoordinates(ring);
      }
    }
  }
  
  return pathData;
}

function angleBetween(from: { x: number; y: number }, to: { x: number; y: number }) {
  return Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
}

const geoUrl = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

export default function WorldMap({ flights, activeFlight, onSelectFlight, height = 400 }: Props) {
  const W = 700, H = 300;
  const [tick, setTick] = useState(0);
  const [geoData, setGeoData] = useState<any>(null);
  const rafRef = useRef<number>();
  const startRef = useRef(Date.now());

  // Fetch GeoJSON data
  useEffect(() => {
    fetch(geoUrl)
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load geo data:', err));
  }, []);

  useEffect(() => {
    const animate = () => {
      setTick(Date.now() - startRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const inFlightFlights = flights.filter(f => f.status === 'in-flight' || f.status === 'boarding' || f.status === 'on-time');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', overflow: 'hidden', margin: 0, padding: 0 }}
    >
      {/* Ocean background */}
      <defs>
        <radialGradient id="ocean-grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0d2040" />
          <stop offset="100%" stopColor="#050a14" />
        </radialGradient>
        <filter id="glow-plane">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-path">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(74,158,255,0.04)" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Ocean */}
      {/* <rect width={W} height={H} fill="url(#ocean-grad)"/> */}
      <rect width={W} height={H} fill="url(#grid)" />

      {/* Continents - from real world atlas data */}
      <g fill="rgba(20,45,80,0.8)" stroke="rgba(60,120,200,0.2)" strokeWidth="0.5">
        {geoData?.features?.map((feature: any, idx: number) => {
          const pathData = geoJsonToPath(feature.geometry, W, H);
          return pathData ? (
            <path key={idx} d={pathData} />
          ) : null;
        })}
      </g>

      {/* Flight paths */}
      {inFlightFlights.map(f => {
        const from = project(f.fromLat, f.fromLng, W, H);
        const to = project(f.toLat, f.toLng, W, H);
        const isActive = activeFlight?.id === f.id;
        const midX = (from.x + to.x) / 2;
        const midY = Math.min(from.y, to.y) - 40;

        return (
          <g key={`path-${f.id}`}>
            {/* Shadow path */}
            <path
              d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
              fill="none"
              stroke={f.color}
              strokeWidth={isActive ? 2 : 0.5}
              strokeOpacity={isActive ? 0.4 : 0.15}
              strokeDasharray="4 4"
              filter={isActive ? 'url(#glow-path)' : undefined}
            />
          </g>
        );
      })}

      {/* Animated planes */}
      {inFlightFlights.map(f => {
        const from = project(f.fromLat, f.fromLng, W, H);
        const to = project(f.toLat, f.toLng, W, H);
        const isActive = activeFlight?.id === f.id;

        // Animate progress based on tick
        const speed = isActive ? 0.00003 : 0.00002;
        const baseProgress = f.progress / 100;
        const animProgress = baseProgress + ((tick * speed) % (1 - baseProgress));
        const clampedProgress = Math.min(animProgress, 0.99);

        const midX = (from.x + to.x) / 2;
        const midY = Math.min(from.y, to.y) - 40;

        // Quadratic bezier point
        const t = clampedProgress;
        const pos = {
          x: (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * midX + t * t * to.x,
          y: (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * midY + t * t * to.y,
        };
        const dt = 0.01;
        const t2 = Math.min(t + dt, 1);
        const pos2 = {
          x: (1 - t2) * (1 - t2) * from.x + 2 * (1 - t2) * t2 * midX + t2 * t2 * to.x,
          y: (1 - t2) * (1 - t2) * from.y + 2 * (1 - t2) * t2 * midY + t2 * t2 * to.y,
        };
        const angle = angleBetween(pos, pos2);

        return (
          <g
            key={`plane-${f.id}`}
            transform={`translate(${pos.x}, ${pos.y}) rotate(${angle})`}
            onClick={() => onSelectFlight?.(f)}
            style={{ cursor: 'pointer' }}
            filter={isActive ? 'url(#glow-plane)' : undefined}
          >
            {/* Glow */}
            <circle r={isActive ? 10 : 6} fill={f.color} opacity={0.15} />
            <circle r={isActive ? 5 : 3} fill={f.color} opacity={0.4} />
            {/* Plane icon */}
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={isActive ? 14 : 10}
              fill={f.color}
              style={{ userSelect: 'none' }}
            >✈</text>
            {/* Label for active */}
            {isActive && (
              <g transform={`rotate(-${angle})`}>
                <rect x={-30} y={-24} width={60} height={18} rx={5} fill="rgba(5,10,20,0.9)" stroke={f.color} strokeWidth={0.5} />
                <text x={0} y={-14} textAnchor="middle" fill={f.color} fontSize={8} fontFamily="var(--font-display)" fontWeight={700}>
                  {f.flightNumber}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* City dots */}
      {inFlightFlights.map(f => {
        const from = project(f.fromLat, f.fromLng, W, H);
        const to = project(f.toLat, f.toLng, W, H);
        return (
          <g key={`cities-${f.id}`}>
            <circle cx={from.x} cy={from.y} r={3} fill={f.color} opacity={0.5} />
            <circle cx={to.x} cy={to.y} r={3} fill={f.color} opacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
}
