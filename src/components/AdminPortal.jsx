import React, { useState } from 'react';
import { Trash2, PlusCircle, Upload, ShieldAlert, Sparkles, Film, Star, CheckCircle, AlertTriangle, RefreshCw, UserPlus, Users, Shield } from 'lucide-react';
import { GENRE_OPTIONS } from '../data/mediaData';

export default function AdminPortal({
  mediaList = [],
  adminsList = [],
  onAddAdmin,
  onDeleteAdmin,
  onAddMedia,
  onDeleteMedia,
  onDeleteAllAdminContent,
  onResetDefaults,
  onPlayVideo
}) {
  const [activeSubTab, setActiveSubTab] = useState('upload'); // 'upload' | 'inventory' | 'admins'

  // Content Upload Form State
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('Hollywood');
  const [type, setType] = useState('Movie');
  const [selectedGenres, setSelectedGenres] = useState(['Action']);
  const [imdbRating, setImdbRating] = useState('8.5');
  const [maturityRating, setMaturityRating] = useState('PG-13');
  const [year, setYear] = useState('2024');
  const [duration, setDuration] = useState('2h 15m');
  const [posterUrl, setPosterUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [castStr, setCastStr] = useState('');
  const [director, setDirector] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);

  // New Admin Form State
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Super Admin');

  // File upload handlers
  const handlePosterFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPosterUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Sample quick templates for popular real movies
  const fillSampleMovie = (sampleType) => {
    if (sampleType === 'inception') {
      setTitle('Inception');
      setIndustry('Hollywood');
      setType('Movie');
      setSelectedGenres(['Sci-Fi', 'Action', 'Thriller']);
      setImdbRating('8.8');
      setMaturityRating('PG-13');
      setYear('2010');
      setDuration('2h 28m');
      setPosterUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80');
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
      setSynopsis('A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.');
      setCastStr('Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy');
      setDirector('Christopher Nolan');
    } else if (sampleType === 'jawan') {
      setTitle('Jawan');
      setIndustry('Bollywood');
      setType('Movie');
      setSelectedGenres(['Action', 'Thriller', 'Drama']);
      setImdbRating('7.1');
      setMaturityRating('U/A 16+');
      setYear('2023');
      setDuration('2h 49m');
      setPosterUrl('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80');
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      setSynopsis('A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.');
      setCastStr('Shah Rukh Khan, Nayanthara, Vijay Sethupathi, Deepika Padukone');
      setDirector('Atlee');
    }
  };

  const handleGenreToggle = (genre) => {
    if (genre === 'All') return;
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContentSubmit = (e) => {
    e.preventDefault();
    if (!title || !synopsis) {
      alert('Please fill in at least the Title and Description.');
      return;
    }

    const defaultPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
    const defaultVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
    const activeAdminName = adminsList.length > 0 ? adminsList[0].username : 'AnasAdmin';

    const newItem = {
      id: 'admin-' + Date.now(),
      title,
      industry,
      type,
      genres: selectedGenres.length > 0 ? selectedGenres : ['Action'],
      imdbRating: parseFloat(imdbRating) || 8.0,
      maturityRating: maturityRating || 'PG-13',
      year: parseInt(year) || 2024,
      duration: duration || '2h 00m',
      posterUrl: posterUrl || defaultPoster,
      bannerUrl: posterUrl || defaultPoster,
      videoUrl: videoUrl || defaultVideo,
      synopsis,
      cast: castStr ? castStr.split(',').map(s => s.trim()) : ['Cast Member'],
      director: director || 'Admin Director',
      isFeatured: isFeatured,
      isTrending: true,
      uploadedBy: activeAdminName,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    onAddMedia(newItem);

    // Reset form
    setTitle('');
    setPosterUrl('');
    setVideoUrl('');
    setSynopsis('');
    setCastStr('');
    setDirector('');
    alert(`Successfully uploaded "${newItem.title}" with 30s preview video!`);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) {
      alert('Please enter Admin Username and Email.');
      return;
    }

    onAddAdmin({
      username: newAdminName,
      email: newAdminEmail,
      role: newAdminRole
    });

    setNewAdminName('');
    setNewAdminEmail('');
  };

  return (
    <div className="content-wrapper animate-fade-in" style={{ padding: '30px 24px' }}>
      
      {/* Admin Header & Danger Zone */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        borderLeft: '5px solid var(--accent-red)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-red" style={{ fontSize: '0.8rem' }}>
              <ShieldAlert size={14} /> Admin Portal Mode
            </span>
            <span className="badge badge-cyan">
              Total Videos: {mediaList.length}
            </span>
            <span className="badge badge-dark">
              Active Admins: {adminsList.length}
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Content & Role Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Upload 30-second preview videos, manage content across 10 types, and administer user permissions.
          </p>
        </div>

        {/* Global Danger Zone Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onResetDefaults}
            className="btn btn-outline"
            style={{ fontSize: '0.88rem' }}
          >
            <RefreshCw size={16} color="#00f2fe" /> Restore 10 Real Default Titles
          </button>

          <button
            onClick={onDeleteAllAdminContent}
            className="btn btn-danger"
            style={{ padding: '12px 20px', fontSize: '0.9rem' }}
          >
            <Trash2 size={18} /> Delete All Current Content
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveSubTab('upload')}
          className={activeSubTab === 'upload' ? 'btn btn-primary' : 'btn btn-outline'}
          style={{ padding: '9px 20px', fontSize: '0.9rem' }}
        >
          <PlusCircle size={18} /> Upload 30s Video
        </button>

        <button
          onClick={() => setActiveSubTab('inventory')}
          className={activeSubTab === 'inventory' ? 'btn btn-cyan' : 'btn btn-outline'}
          style={{ padding: '9px 20px', fontSize: '0.9rem' }}
        >
          <Film size={18} /> Content Inventory ({mediaList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('admins')}
          className={activeSubTab === 'admins' ? 'btn btn-cyan' : 'btn btn-outline'}
          style={{ padding: '9px 20px', fontSize: '0.9rem' }}
        >
          <Users size={18} /> Manage Admins ({adminsList.length})
        </button>
      </div>

      {/* SUB-TAB 1: UPLOAD FORM */}
      {activeSubTab === 'upload' && (
        <div className="glass-panel" style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)'
        }}>
          {/* Quick Preset Buttons */}
          <div style={{
            background: 'rgba(0, 242, 254, 0.08)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#00f2fe', fontWeight: 600 }}>
              ⚡ Fill Quick Template (Real Movies):
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => fillSampleMovie('inception')}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                Inception (Hollywood 30s)
              </button>
              <button
                type="button"
                onClick={() => fillSampleMovie('jawan')}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                Jawan (Bollywood 30s)
              </button>
            </div>
          </div>

          <form onSubmit={handleContentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Row 1: Title & Industry & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Movie / Series Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oppenheimer, Stree 2, Stranger Things"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Hollywood" style={{ background: '#12141d' }}>Hollywood</option>
                  <option value="Bollywood" style={{ background: '#12141d' }}>Bollywood</option>
                  <option value="International" style={{ background: '#12141d' }}>International</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Content Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Movie" style={{ background: '#12141d' }}>Movie</option>
                  <option value="Web Series" style={{ background: '#12141d' }}>Web Series</option>
                </select>
              </div>
            </div>

            {/* Row 2: Ratings & Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  IMDb Star Rating (0-10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={imdbRating}
                  onChange={(e) => setImdbRating(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Maturity Rating
                </label>
                <select
                  value={maturityRating}
                  onChange={(e) => setMaturityRating(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="PG-13" style={{ background: '#12141d' }}>PG-13</option>
                  <option value="U/A 13+" style={{ background: '#12141d' }}>U/A 13+</option>
                  <option value="U/A 16+" style={{ background: '#12141d' }}>U/A 16+</option>
                  <option value="R" style={{ background: '#12141d' }}>R</option>
                  <option value="TV-MA" style={{ background: '#12141d' }}>TV-MA</option>
                  <option value="18+" style={{ background: '#12141d' }}>18+</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Release Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2h 45m or 3 Seasons"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Row 3: Genres Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Select Genres (Click to toggle)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {GENRE_OPTIONS.filter(g => g !== 'All').map(genre => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: selectedGenres.includes(genre) ? '1px solid #e50914' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedGenres.includes(genre) ? 'rgba(229, 9, 20, 0.2)' : 'rgba(0,0,0,0.3)',
                      color: selectedGenres.includes(genre) ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: selectedGenres.includes(genre) ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {selectedGenres.includes(genre) ? '✓ ' : ''}{genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 4: Poster Image & 30s Video Links / Uploads */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Poster Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none',
                    marginBottom: '8px'
                  }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or upload poster file from device:</div>
                <input type="file" accept="image/*" onChange={handlePosterFileUpload} style={{ marginTop: '6px', fontSize: '0.8rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  30-Second Preview Video URL (.mp4)
                </label>
                <input
                  type="url"
                  placeholder="https://commondatastorage.googleapis.com/.../TearsOfSteel.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none',
                    marginBottom: '8px'
                  }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or upload 30s video file directly:</div>
                <input type="file" accept="video/mp4,video/*" onChange={handleVideoFileUpload} style={{ marginTop: '6px', fontSize: '0.8rem' }} />
              </div>
            </div>

            {/* Row 5: Cast & Director */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Star Cast (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cillian Murphy, Emily Blunt, Matt Damon"
                  value={castStr}
                  onChange={(e) => setCastStr(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Director
                </label>
                <input
                  type="text"
                  placeholder="e.g. Christopher Nolan"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Row 6: Synopsis */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Synopsis / Description *
              </label>
              <textarea
                rows={3}
                placeholder="Enter compelling storyline description..."
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Row 7: Checkbox & Submit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                Feature in Top Hero Slider Banner
              </label>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1rem' }}>
                <Upload size={18} /> Publish 30s Video Content
              </button>
            </div>

          </form>
        </div>
      )}

      {/* SUB-TAB 2: CONTENT INVENTORY */}
      {activeSubTab === 'inventory' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>
            Current Content List ({mediaList.length} items across Hollywood & Bollywood)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mediaList.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-md)',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 700, minWidth: '24px' }}>#{idx + 1}</span>
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{item.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span className="badge badge-red">{item.industry}</span>
                      <span className="badge badge-dark">{item.type}</span>
                      <span>⭐ {item.imdbRating}</span>
                      <span>• {item.year}</span>
                      <span>• Admin: {item.uploadedBy || 'AnasAdmin'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => onPlayVideo(item)}
                    className="btn btn-cyan"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    Test 30s Video
                  </button>

                  <button
                    onClick={() => onDeleteMedia(item.id, item.title)}
                    className="btn btn-danger"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MANAGE ADMINS */}
      {activeSubTab === 'admins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Create New Admin Card */}
          <div className="glass-panel" style={{ padding: '24px 32px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={20} color="#00f2fe" /> Create New Admin User
            </h3>
            
            <form onSubmit={handleAdminSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Admin Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. AnasAdmin, ContentLead"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. admin@streamflix.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Role
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Super Admin" style={{ background: '#12141d' }}>Super Admin</option>
                  <option value="Content Manager" style={{ background: '#12141d' }}>Content Manager</option>
                  <option value="Moderator" style={{ background: '#12141d' }}>Moderator</option>
                </select>
              </div>

              <button type="submit" className="btn btn-cyan" style={{ padding: '11px 20px', fontSize: '0.9rem' }}>
                Add New Admin
              </button>
            </form>
          </div>

          {/* Active Admins Directory */}
          <div className="glass-panel" style={{ padding: '24px 32px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="#e50914" /> Active Admin Directory ({adminsList.length})
            </h3>

            {adminsList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No active admins found. Please create a new admin above.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {adminsList.map((admin) => (
                  <div
                    key={admin.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                          {admin.username}
                        </h4>
                        <span className="badge badge-red">{admin.role}</span>
                        <span className="badge badge-cyan">{admin.status || 'Active'}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {admin.email} • Created: {admin.createdAt}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteAdmin(admin.id, admin.username)}
                      className="btn btn-danger"
                      style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                    >
                      <Trash2 size={14} /> Remove Admin
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
