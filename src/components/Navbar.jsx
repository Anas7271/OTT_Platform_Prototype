import React from 'react';
import { Film, Tv, Search, ShieldCheck, PlusCircle, Trash2, Clapperboard, Sparkles } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isAdminView,
  setIsAdminView,
  totalItemsCount,
  onResetToDefaults
}) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 0'
    }}>
      <div className="content-wrapper" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveTab('All'); setIsAdminView(false); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e50914 0%, #7928ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(229, 9, 20, 0.4)'
          }}>
            <Clapperboard size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #ffffff 30%, #a0a5b5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              STREAMFLIX <span style={{ fontSize: '0.7rem', background: '#e50914', color: '#fff', padding: '2px 6px', borderRadius: '4px', textFillColor: 'initial', WebkitTextFillColor: '#fff', verticalAlign: 'middle' }}>PROTOTYPE</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real Content & 30s Admin Uploads
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        {!isAdminView && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {[
              { id: 'All', label: 'All Content' },
              { id: 'Hollywood', label: 'Hollywood' },
              { id: 'Bollywood', label: 'Bollywood' },
              { id: 'Movie', label: 'Movies' },
              { id: 'Web Series', label: 'Web Series' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--accent-red)' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Search & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Box */}
          {!isAdminView && (
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
              <input
                type="text"
                placeholder="Search movies, cast, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '9px 16px 9px 40px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  width: '210px',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.width = '260px'}
                onBlur={(e) => e.target.style.width = '210px'}
              />
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={onResetToDefaults}
            title="Reset library to default 16 real Hollywood & Bollywood videos"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '8px 12px' }}
          >
            <Sparkles size={14} color="#00f2fe" />
            Reset Defaults
          </button>

          {/* Admin Mode Toggle */}
          <button
            onClick={() => setIsAdminView(!isAdminView)}
            className={isAdminView ? "btn btn-cyan" : "btn btn-secondary"}
            style={{
              fontSize: '0.85rem',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <ShieldCheck size={16} />
            {isAdminView ? 'Viewer Mode' : 'Admin Portal'}
          </button>
        </div>
      </div>
    </nav>
  );
}
