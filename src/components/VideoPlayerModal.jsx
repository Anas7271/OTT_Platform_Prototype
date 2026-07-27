import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Star, Film, Sparkles, Clock, User, Shield } from 'lucide-react';

export default function VideoPlayerModal({ media, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Default capped at 30s
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isEnded30s, setIsEnded30s] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isEnded30s) {
      videoRef.current.currentTime = 0;
      setIsEnded30s(false);
      videoRef.current.play();
      setIsPlaying(true);
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Enforce strict 30-second preview limit for uploaded video content
    if (time >= 30) {
      videoRef.current.pause();
      videoRef.current.currentTime = 30;
      setIsPlaying(false);
      setIsEnded30s(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextState = !isMuted;
    setIsMuted(nextState);
    videoRef.current.muted = nextState;
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      if (seekTime < 30) {
        setIsEnded30s(false);
      }
    }
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!media) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 3000,
      background: 'rgba(5, 6, 10, 0.9)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }} className="animate-fade-in">
      
      {/* Modal Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        background: '#0d0f18',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 50,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Video Player Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <video
            ref={videoRef}
            src={media.videoUrl}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => {
              const dur = Math.min(e.target.duration || 30, 30);
              setDuration(dur);
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />

          {/* 30s Limit Reached Replay Overlay */}
          {isEnded30s && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(9, 10, 15, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              zIndex: 10
            }}>
              <div className="badge badge-red" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                30-Second Admin Preview Completed
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Replay 30s Trailer</h3>
              <button
                onClick={togglePlay}
                className="btn btn-primary"
                style={{ padding: '12px 24px' }}
              >
                <RotateCcw size={18} /> Replay Preview
              </button>
            </div>
          )}

          {/* Top 30-Sec Counter Banner */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(0, 242, 254, 0.3)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isPlaying ? '#00f2fe' : '#e50914',
              boxShadow: '0 0 10px #00f2fe'
            }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00f2fe' }}>
              30s ADMIN VIDEO PREVIEW
            </span>
            <span style={{ fontSize: '0.85rem', color: '#fff', marginLeft: '6px' }}>
              {formatTime(currentTime)} / 0:30
            </span>
          </div>

          {/* Custom Player Controls Bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 20
          }}>
            {/* Timeline Progress Bar */}
            <input
              type="range"
              min="0"
              max="30"
              step="0.1"
              value={currentTime > 30 ? 30 : currentTime}
              onChange={handleSeek}
              style={{
                width: '100%',
                height: '4px',
                borderRadius: '2px',
                accentColor: '#e50914',
                cursor: 'pointer'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={togglePlay}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  {isPlaying ? <Pause size={22} /> : <Play size={22} fill="white" />}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    style={{ width: '70px', accentColor: '#ffffff', cursor: 'pointer' }}
                  />
                </div>

                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {formatTime(currentTime)} / 0:30 MAX
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={changeSpeed}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {playbackRate}x
                </button>

                <button
                  onClick={toggleFullscreen}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Information Panel */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          background: '#0d0f18'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-gold">
                <Star size={12} fill="#ffc107" /> IMDb {media.imdbRating}
              </span>
              <span className="badge badge-red">{media.maturityRating}</span>
              <span className="badge badge-cyan">{media.industry} • {media.type}</span>
              <span className="badge badge-dark">{media.year}</span>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
              {media.title}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
              {media.synopsis}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {media.genres.map((g, idx) => (
                <span key={idx} style={{
                  fontSize: '0.78rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.88rem'
          }}>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
              Content Metadata
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
              <div><strong style={{ color: '#fff' }}>Director:</strong> {media.director || 'N/A'}</div>
              <div><strong style={{ color: '#fff' }}>Duration:</strong> {media.duration}</div>
              <div><strong style={{ color: '#fff' }}>Cast:</strong> {media.cast ? media.cast.join(', ') : 'N/A'}</div>
              <div><strong style={{ color: '#fff' }}>Uploaded By:</strong> <span style={{ color: '#00f2fe' }}>{media.uploadedBy || 'Admin'}</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
