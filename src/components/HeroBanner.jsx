import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Shield, Clock, Film, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

export default function HeroBanner({ featuredItems, onPlayVideo }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!featuredItems || featuredItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredItems]);

  if (!featuredItems || featuredItems.length === 0) return null;
  const current = featuredItems[currentIndex] || featuredItems[0];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '520px',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: '40px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
    }}>
      {/* Background Image / Ambient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${current.bannerUrl || current.posterUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.65) contrast(1.1)',
        transition: 'all 0.8s ease-in-out'
      }} />

      {/* Gradient Overlays for Cinematic Depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(9, 10, 15, 0.2) 0%, rgba(9, 10, 15, 0.85) 70%, #090a0f 100%)'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, #090a0f 0%, rgba(9, 10, 15, 0.7) 45%, transparent 100%)'
      }} />

      {/* Banner Content */}
      <div className="content-wrapper" style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '50px'
      }}>
        <div style={{ maxWidth: '650px' }} className="animate-fade-in" key={current.id}>
          {/* Industry & Featured Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-red">
              <Sparkles size={12} /> Featured 30s Premiere
            </span>
            <span className="badge badge-cyan">
              {current.industry} • {current.type}
            </span>
            <span className="badge badge-gold">
              <Star size={12} fill="#ffc107" /> IMDb {current.imdbRating}
            </span>
            <span className="badge badge-dark">
              {current.maturityRating}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '14px',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}>
            {current.title}
          </h1>

          {/* Meta Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '16px',
            fontWeight: 500
          }}>
            <span>{current.year}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {current.duration}
            </span>
            <span>•</span>
            <span>{current.genres.join(', ')}</span>
          </div>

          {/* Synopsis */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '26px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)'
          }}>
            {current.synopsis}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => onPlayVideo(current)}
              className="btn btn-primary"
              style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: 'var(--radius-md)' }}
            >
              <Play size={20} fill="#ffffff" />
              Watch 30s Video
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#00f2fe',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'rgba(0, 242, 254, 0.1)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(0, 242, 254, 0.2)'
            }}>
              <Film size={16} /> 30-Sec HD Preview Available
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      {featuredItems.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '32px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)}
            className="btn btn-secondary btn-icon"
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0 6px' }}>
            {currentIndex + 1} / {featuredItems.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredItems.length)}
            className="btn btn-secondary btn-icon"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
