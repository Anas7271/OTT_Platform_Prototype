import React, { useState } from 'react';
import { Play, Star, Trash2, Clock, Film, Sparkles, AlertCircle } from 'lucide-react';

export default function MediaCard({ media, onPlayVideo, onDelete, isAdminView }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'none',
        boxShadow: isHovered ? '0 16px 36px rgba(0, 0, 0, 0.7)' : 'var(--shadow-card)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Poster Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '145%', // Aspect ratio ~2:3
        overflow: 'hidden',
        background: '#161926'
      }}>
        <img
          src={media.posterUrl}
          alt={media.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
          }}
          onError={(e) => {
            // Fallback placeholder image if poster fails
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isHovered
            ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(9,10,15,0.85) 70%, #090a0f 100%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(9,10,15,0.8) 100%)',
          transition: 'all 0.3s ease'
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5
        }}>
          <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
            <Star size={11} fill="#ffc107" /> {media.imdbRating}
          </span>
          <span className="badge badge-dark" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
            {media.industry}
          </span>
        </div>

        {/* 30s Badge */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '10px',
          zIndex: 5
        }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
            30s Video
          </span>
        </div>

        {/* Admin Delete Action Button */}
        {isAdminView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(media.id, media.title);
            }}
            title="Delete this admin uploaded video"
            className="btn btn-danger"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10,
              padding: '6px 10px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <Trash2 size={14} /> Delete
          </button>
        )}

        {/* Play Button Overlay on Hover */}
        <div
          onClick={() => onPlayVideo(media)}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 6,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.25s ease'
          }}
        >
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'var(--accent-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-red)',
            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
            transition: 'transform 0.25s ease'
          }}>
            <Play size={24} fill="#ffffff" style={{ marginLeft: '3px' }} />
          </div>
        </div>
      </div>

      {/* Card Info Details */}
      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '4px'
          }}>
            <span>{media.year} • {media.duration}</span>
            <span style={{ color: '#00f2fe', fontWeight: 600 }}>{media.type}</span>
          </div>

          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '6px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {media.title}
          </h3>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {media.genres.join(', ')}
          </div>
        </div>

        {/* Watch 30s video CTA */}
        <button
          onClick={() => onPlayVideo(media)}
          className="btn btn-outline"
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '7px 10px',
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Play size={13} fill="currentColor" /> Watch 30s Clip
        </button>
      </div>
    </div>
  );
}
