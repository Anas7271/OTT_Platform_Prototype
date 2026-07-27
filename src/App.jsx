import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MediaCard from './components/MediaCard';
import VideoPlayerModal from './components/VideoPlayerModal';
import AdminPortal from './components/AdminPortal';
import { initialMediaList, initialAdminsList, GENRE_OPTIONS } from './data/mediaData';
import { Sparkles, Film, Shield, Trash2, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'streamflix_media_v3';
const ADMINS_KEY = 'streamflix_admins_v1';

export default function App() {
  // Media List State
  const [mediaList, setMediaList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load storage', e);
    }
    return initialMediaList;
  });

  // Admins Directory State
  const [adminsList, setAdminsList] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMINS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load admins storage', e);
    }
    return initialAdminsList;
  });

  const [activeTab, setActiveTab] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mediaList));
    } catch (e) {
      console.error('Failed to save media to localStorage', e);
    }
  }, [mediaList]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMINS_KEY, JSON.stringify(adminsList));
    } catch (e) {
      console.error('Failed to save admins to localStorage', e);
    }
  }, [adminsList]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Admin management handlers
  const handleAddAdmin = ({ username, email, role }) => {
    const newAdmin = {
      id: 'admin-' + Date.now(),
      username,
      email,
      role,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdminsList(prev => [...prev, newAdmin]);
    showToast(`Created new admin profile "${username}" (${role})!`);
  };

  const handleDeleteAdmin = (id, username) => {
    if (window.confirm(`Are you sure you want to remove admin "${username}"?`)) {
      setAdminsList(prev => prev.filter(a => a.id !== id));
      showToast(`Removed admin user "${username}".`);
    }
  };

  // Admin delete single video content
  const handleDeleteMedia = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setMediaList(prev => prev.filter(item => item.id !== id));
      showToast(`Deleted "${title}" from library.`);
    }
  };

  // Admin delete all content uploaded by any admin
  const handleDeleteAllAdminContent = () => {
    if (window.confirm('⚠️ ARE YOU SURE? This will delete ALL current media content.')) {
      setMediaList([]);
      showToast('All current content has been deleted.');
    }
  };

  // Reset dataset to 10 default real Hollywood & Bollywood content types
  const handleResetDefaults = () => {
    if (window.confirm('Restore default 10 real Hollywood & Bollywood video clips across 10 content types?')) {
      setMediaList(initialMediaList);
      showToast('Restored 10 real Hollywood & Bollywood video titles across 10 content types.');
    }
  };

  // Add new 30-sec admin video content
  const handleAddMedia = (newItem) => {
    setMediaList(prev => [newItem, ...prev]);
    showToast(`Published "${newItem.title}" with 30s preview video!`);
  };

  // Filter media based on Tab, Genre, and Search Query
  const filteredMedia = mediaList.filter(item => {
    // Tab filter
    if (activeTab === 'Hollywood' && item.industry !== 'Hollywood') return false;
    if (activeTab === 'Bollywood' && item.industry !== 'Bollywood') return false;
    if (activeTab === 'Movie' && item.type !== 'Movie') return false;
    if (activeTab === 'Web Series' && item.type !== 'Web Series') return false;

    // Genre filter
    if (selectedGenre !== 'All' && !item.genres.includes(selectedGenre)) return false;

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchGenre = item.genres.some(g => g.toLowerCase().includes(q));
      const matchCast = item.cast && item.cast.some(c => c.toLowerCase().includes(q));
      const matchIndustry = item.industry.toLowerCase().includes(q);
      return matchTitle || matchGenre || matchCast || matchIndustry;
    }

    return true;
  });

  // Featured items for Hero Banner
  const featuredItems = mediaList.filter(item => item.isFeatured).slice(0, 5);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        totalItemsCount={mediaList.length}
        onResetToDefaults={handleResetDefaults}
      />

      <main className="main-content">
        {isAdminView ? (
          /* Admin Portal View */
          <AdminPortal
            mediaList={mediaList}
            adminsList={adminsList}
            onAddAdmin={handleAddAdmin}
            onDeleteAdmin={handleDeleteAdmin}
            onAddMedia={handleAddMedia}
            onDeleteMedia={handleDeleteMedia}
            onDeleteAllAdminContent={handleDeleteAllAdminContent}
            onResetDefaults={handleResetDefaults}
            onPlayVideo={setSelectedVideo}
          />
        ) : (
          /* Viewer OTT Experience */
          <div>
            <div className="content-wrapper" style={{ paddingTop: '24px' }}>
              
              {/* Featured Hero Slider (only shown on 'All' tab with empty search) */}
              {activeTab === 'All' && !searchQuery && (
                <HeroBanner
                  featuredItems={featuredItems.length > 0 ? featuredItems : mediaList.slice(0, 4)}
                  onPlayVideo={setSelectedVideo}
                />
              )}

              {/* Genre Filter Chips Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '28px',
                overflowX: 'auto',
                paddingBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, paddingRight: '8px' }}>
                  <Filter size={15} /> Genres:
                </div>

                {GENRE_OPTIONS.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: selectedGenre === genre ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                      background: selectedGenre === genre ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.04)',
                      color: selectedGenre === genre ? '#00f2fe' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: selectedGenre === genre ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Empty state when all content deleted */}
              {filteredMedia.length === 0 ? (
                <div className="glass-panel" style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                  margin: '40px 0'
                }}>
                  <Trash2 size={48} color="#e50914" style={{ marginBottom: '16px', opacity: 0.8 }} />
                  <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>No Media Content Available</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
                    All current content was deleted or no items match your search. Switch to Admin Portal to upload new 30s videos or restore defaults.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button onClick={handleResetDefaults} className="btn btn-cyan">
                      <Sparkles size={16} /> Restore 10 Real Hollywood & Bollywood Content Types
                    </button>
                    <button onClick={() => setIsAdminView(true)} className="btn btn-primary">
                      Upload Admin Video
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Media Section */
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {searchQuery ? `Search Results for "${searchQuery}"` : `${activeTab} Releases`}
                      <span className="badge badge-dark" style={{ fontSize: '0.75rem' }}>
                        {filteredMedia.length} Titles
                      </span>
                    </h2>
                  </div>

                  {/* Media Grid */}
                  <div className="media-grid animate-fade-in">
                    {filteredMedia.map(item => (
                      <MediaCard
                        key={item.id}
                        media={item}
                        onPlayVideo={setSelectedVideo}
                        onDelete={handleDeleteMedia}
                        isAdminView={false}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* 30-Second Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          media={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={18} color="#00f2fe" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
