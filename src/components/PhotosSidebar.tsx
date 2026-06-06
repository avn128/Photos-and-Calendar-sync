import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Calendar, 
  Search, 
  Eye, 
  X, 
  Camera, 
  Clock, 
  RefreshCw,
  Sparkles,
  ExternalLink,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GooglePhotoItem } from '../types';
import { ClockStyleType, SharedAlbum } from './SettingsModal';

interface PhotosSidebarProps {
  photos: GooglePhotoItem[];
  selectedDate: Date;
  onRefresh: () => void;
  isLoading: boolean;
  clockStyle: ClockStyleType;
  clockSize: 'small' | 'medium' | 'large';
  clockPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  slideshowInterval: number;
  photoFilter: 'hdr' | 'vivid' | 'bw' | 'natural' | 'iphone' | 'samsung';
  sharedAlbums: SharedAlbum[];
  weatherData?: any;
  isWeatherLoading?: boolean;
}

export default function PhotosSidebar({ 
  photos, 
  selectedDate, 
  onRefresh, 
  isLoading,
  clockStyle,
  clockSize,
  clockPosition = 'bottom-right',
  slideshowInterval,
  photoFilter,
  sharedAlbums,
  weatherData,
  isWeatherLoading = false
}: PhotosSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'date'>('date');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showLightboxInfo, setShowLightboxInfo] = useState(true);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const slideshowVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (showSlideshow && slideshowVideoRef.current) {
      slideshowVideoRef.current.muted = isAudioMuted;
      slideshowVideoRef.current.play().catch((err) => {
        console.warn("Autoplay or audio state switch prevented by browser policy:", err);
      });
    }
  }, [isAudioMuted, showSlideshow]);

  // Touch swipe states
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setSlideshowIndex((prev) => (prev + 1) % processedPhotos.length);
    } else if (isRightSwipe) {
      setSlideshowIndex((prev) => (prev - 1 + processedPhotos.length) % processedPhotos.length);
    }
  };

  const getFilterClass = (filter: string) => {
    switch (filter) {
      case 'hdr':
        return 'contrast-[1.25] saturate-[1.2] brightness-[1.05]';
      case 'vivid':
        return 'saturate-[1.55] sepia-[0.05] contrast-[1.1]';
      case 'bw':
        return 'grayscale brightness-[0.95] contrast-[1.35]';
      case 'iphone':
        return 'sepia-[0.14] saturate-[1.15] contrast-[1.08] brightness-[0.98]';
      case 'samsung':
        return 'saturate-[1.35] brightness-[1.03] hue-rotate-[2deg] contrast-[1.12]';
      case 'natural':
      default:
        return '';
    }
  };
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('primary');

  // Determine active source list of photos
  const activePhotosSource = useMemo(() => {
    if (selectedAlbumId === 'primary') {
      return photos;
    }
    const matchedAlbum = sharedAlbums?.find(a => a.id === selectedAlbumId);
    return (matchedAlbum && matchedAlbum.isActive) ? matchedAlbum.photos : photos;
  }, [photos, sharedAlbums, selectedAlbumId]);

  // Fallback to library primary if currently selected album gets deleted or disabled
  useEffect(() => {
    if (selectedAlbumId !== 'primary') {
      const album = sharedAlbums?.find(a => a.id === selectedAlbumId);
      if (!album || !album.isActive) {
        setSelectedAlbumId('primary');
      }
    }
  }, [sharedAlbums, selectedAlbumId]);

  const formattedSelectedDate = useMemo(() => {
    return selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }, [selectedDate]);

  // Check if a photo item corresponds to the selected date
  const isPhotoOnSelectedDate = (photo: GooglePhotoItem, date: Date) => {
    if (!photo.mediaMetadata?.creationTime) return false;
    const photoD = new Date(photo.mediaMetadata.creationTime);
    return (
      photoD.getDate() === date.getDate() &&
      photoD.getMonth() === date.getMonth() &&
      photoD.getFullYear() === date.getFullYear()
    );
  };

  // Filter photos based on selection
  const processedPhotos = useMemo(() => {
    let filtered = activePhotosSource;

    if (activeTab === 'date') {
      filtered = activePhotosSource.filter(photo => isPhotoOnSelectedDate(photo, selectedDate));
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(photo => 
        (photo.filename || '').toLowerCase().includes(q) || 
        (photo.description || '').toLowerCase().includes(q) ||
        (photo.mediaMetadata?.photo?.cameraModel || '').toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [activePhotosSource, activeTab, selectedDate, searchQuery]);

  // Handle slideshow auto-advance interval
  useEffect(() => {
    if (!showSlideshow || !isPlaying || processedPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % processedPhotos.length);
    }, slideshowInterval);
    return () => clearInterval(interval);
  }, [showSlideshow, isPlaying, processedPhotos.length, slideshowInterval]);

  // Tick slideshow real-time clock
  useEffect(() => {
    if (!showSlideshow) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [showSlideshow]);

  // Render photo lightbox details
  const currentLightboxPhoto = lightboxIndex !== null ? processedPhotos[lightboxIndex] : null;

  const handlePrevLightbox = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && processedPhotos.length > 0) {
      setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + processedPhotos.length) % processedPhotos.length));
    }
  };

  const handleNextLightbox = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && processedPhotos.length > 0) {
      setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % processedPhotos.length));
    }
  };

  // Keyboard navigation for photo lightbox stream
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') {
          handlePrevLightbox();
        } else if (e.key === 'ArrowRight') {
          handleNextLightbox();
        } else if (e.key === 'Escape') {
          setLightboxIndex(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, processedPhotos]);

  const getUnmuteButtonStyles = (styleId: string) => {
    switch (styleId) {
      case 'neon':
        return {
          btnClass: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 border border-indigo-500/40 text-cyan-400 font-mono text-[10px] font-black tracking-widest uppercase shadow-[0_0_10px_rgba(34,211,238,0.4)] hover:border-cyan-400 hover:text-white transition-all duration-300 pointer-events-auto",
          label: isAudioMuted ? "AUDIO // OFF" : "AUDIO // ON",
        };
      case 'vintage':
        return {
          btnClass: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#120F0D]/70 border border-amber-500/20 text-amber-100 font-serif italic text-xs hover:border-amber-400/50 hover:bg-black/90 transition-all duration-300 pointer-events-auto",
          label: isAudioMuted ? "audio off" : "audio playing",
        };
      case 'terminal':
        return {
          btnClass: "flex items-center gap-1.5 px-3 py-1 bg-black border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest hover:border-emerald-400 hover:text-emerald-300 transition-all duration-300 pointer-events-auto",
          label: isAudioMuted ? "SYS_AUDIO:MUTED" : "SYS_AUDIO:ACTIVE",
        };
      case 'tech':
        return {
          btnClass: "flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#0F0F1A]/90 border border-rose-500/20 text-rose-500 font-mono text-[9px] font-black uppercase tracking-widest hover:border-rose-500 hover:text-rose-400 transition-all duration-300 pointer-events-auto",
          label: isAudioMuted ? "AUDIO_OFF" : "AUDIO_ON",
        };
      case 'minimal':
      default:
        return {
          btnClass: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-neutral-850 text-neutral-300 font-sans font-semibold text-[10px] uppercase tracking-widest hover:text-white hover:border-neutral-500 transition-all duration-300 pointer-events-auto",
          label: isAudioMuted ? "Muted" : "Unmuted",
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F0F0F] border-l border-[#2A2A2A] shadow-xl overflow-hidden md:w-96 w-full text-gray-250" id="google_photos_sidebar">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#2A2A2A] space-y-3" id="photos_header_controls">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/30">
              <ImageIcon size={16} />
            </div>
            <h3 className="font-sans font-semibold text-sm text-[#E5E7EB] tracking-tight">
              Google Photos Library
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5">
            {processedPhotos.length > 0 && (
              <button
                onClick={() => {
                  setSlideshowIndex(0);
                  setShowSlideshow(true);
                  setIsPlaying(true);
                }}
                className="flex items-center gap-1.5 py-1 px-2.5 bg-indigo-950/40 text-indigo-400 hover:bg-indigo-900/50 border border-indigo-800/40 rounded-lg text-xs font-semibold cursor-pointer transition-all animate-fade-in"
                title="Start Slideshow"
                id="btn_start_slideshow"
              >
                <Play size={12} className="fill-indigo-400/20" />
                <span>Slideshow</span>
              </button>
            )}
            
            <button 
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 hover:bg-[#2A2A2A] rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Photos"
              id="btn_refresh_photos"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Album Source Selector (If there are shared albums connected) */}
        {sharedAlbums?.length > 0 && (
          <div className="space-y-1.5 pb-1" id="sidebar_album_selector_section">
            <div className="relative">
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="w-full pl-3 pr-8 py-2 font-sans text-xs bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] text-gray-200 rounded-xl focus:outline-hidden cursor-pointer appearance-none font-semibold transition-all shadow-inner"
                id="select_photo_album_source"
              >
                <option value="primary">📸 Personal Stream Gallery</option>
                {sharedAlbums.map((album) => (
                  <option key={album.id} value={album.id} disabled={!album.isActive}>
                    📁 {album.name} {!album.isActive ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight size={12} className="rotate-90 text-indigo-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tab Selectors */}
        <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-[#2A2A2A]" id="photos_tab_selectors">
          <button
            onClick={() => setActiveTab('date')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 font-sans text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'date'
                ? 'bg-[#2A2A2A] text-white shadow-xs border border-[#3A3A3A]'
                : 'text-gray-400 hover:text-white'
            }`}
            id="tab_photos_on_date"
          >
            <Calendar size={12} />
            On {formattedSelectedDate}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 font-sans text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#2A2A2A] text-white shadow-xs border border-[#3A3A3A]'
                : 'text-gray-400 hover:text-white'
            }`}
            id="tab_photos_all"
          >
            <Sparkles size={12} />
            All Photos
          </button>
        </div>

        {/* Search within photos */}
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search filenames, cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 font-sans text-[11px] bg-[#1A1A1A] border border-[#2A2A2A] text-gray-200 rounded-xl placeholder:text-gray-550 focus:bg-[#242424] focus:outline-hidden focus:ring-1 focus:ring-[#3A3A3A] transition-all font-medium"
            id="photos_search_input"
          />
        </div>
      </div>

      {/* Grid Content / Scrollable area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#0A0A0A]" id="google_photos_grid_scroll">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-3" id="photos_loading_state">
            <div className="w-6 h-6 border-2 border-gray-750 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="font-sans text-[11px] text-gray-500 font-medium">Fetching photos stream...</p>
          </div>
        ) : processedPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 font-sans px-4" id="no_photos_state">
            <ImageIcon size={32} className="text-gray-600 mb-2" />
            <p className="text-xs font-semibold text-gray-300">No Photos Found</p>
            <p className="text-[11px] text-gray-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
              {activeTab === 'date' 
                ? `Sync a photo capture to Google Photos on ${formattedSelectedDate} to see it here, or switch to All Photos.`
                : 'Search another term or sync backup camera roll in your dashboard.'}
            </p>
            {activeTab === 'date' && (
              <button
                onClick={() => setActiveTab('all')}
                className="mt-3 py-1 px-3 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/40 font-semibold text-[10px] rounded-lg border border-indigo-800/40 cursor-pointer transition-all"
              >
                View General Gallery
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3" id="photos_gird_container">
            {processedPhotos.map((photo, index) => {
              const photoDateStr = photo.mediaMetadata?.creationTime 
                ? new Date(photo.mediaMetadata.creationTime).toLocaleDateString([], { month: 'short', day: 'numeric' })
                : '';
              
              return (
                <motion.div
                  key={photo.id}
                  whileHover={{ y: -2 }}
                  className="group relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden cursor-pointer aspect-square shadow-tiny"
                  onClick={() => setLightboxIndex(index)}
                  id={`photo_card_${photo.id}`}
                >
                  <img
                    src={photo.baseUrl}
                    alt={photo.filename}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Video Play Badge */}
                  {photo.mimeType?.startsWith('video/') && (
                    <div className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-indigo-400 border border-indigo-500/25 flex items-center justify-center shadow-md z-10" title="Video file">
                      <Play size={10} className="fill-indigo-400/20" />
                    </div>
                  )}
                  
                  {/* Subtle info banner on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2 text-white">
                    <p className="font-sans font-medium text-[9px] truncate">{photo.filename}</p>
                    <div className="flex items-center justify-between text-[8px] opacity-80 mt-0.5">
                      <span className="flex items-center gap-0.5"><Clock size={8} />{photoDateStr}</span>
                      <Eye size={10} />
                    </div>
                  </div>
                  
                  {/* Small tag icon for date sync match */}
                  {activeTab === 'all' && isPhotoOnSelectedDate(photo, selectedDate) && (
                    <span className="absolute top-1 right-1 bg-amber-600/40 text-amber-200 border border-amber-500/30 text-[8px] font-bold px-1.5 py-0.5 rounded-md flex items-center shadow-tiny">
                      Matched Date
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid statistics metadata */}
      <div className="p-3 bg-[#0F0F0F] border-t border-[#2A2A2A] text-[10px] font-sans text-gray-500 flex justify-between items-center" id="photos_footer_stats">
        <span>Displaying {processedPhotos.length} matching photos</span>
        <span className="flex items-center gap-0.5">
          <Sparkles size={10} className="text-indigo-400 animate-pulse" /> Live Client Sync
        </span>
      </div>

      {/* High resolution Lightbox Modal / Image Viewer */}
      <AnimatePresence>
        {currentLightboxPhoto && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="photo_lightbox_panel">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl lg:max-w-6xl w-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-[#2A2A2A]"
            >
              {/* Left Side: Photo/Video core display panel */}
              <div className="flex-1 bg-black flex items-center justify-center p-2 md:p-6 relative min-h-[300px] md:min-h-[500px] lg:min-h-[580px] group select-none">
                
                {/* Left navigation arrow on hover */}
                {processedPhotos.length > 1 && (
                  <button
                    onClick={handlePrevLightbox}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2.5 rounded-full text-white/95 hover:text-white transition-all cursor-pointer z-30 opacity-0 group-hover:opacity-100 border border-white/10 shadow-lg scale-90 hover:scale-100 active:scale-95"
                    title="Previous Photo (Left Arrow)"
                  >
                    <ChevronLeft size={22} />
                  </button>
                )}

                {/* Right navigation arrow on hover */}
                {processedPhotos.length > 1 && (
                  <button
                    onClick={handleNextLightbox}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2.5 rounded-full text-white/95 hover:text-white transition-all cursor-pointer z-30 opacity-0 group-hover:opacity-100 border border-white/10 shadow-lg scale-90 hover:scale-100 active:scale-95"
                    title="Next Photo (Right Arrow)"
                  >
                    <ChevronRight size={22} />
                  </button>
                )}

                {/* Top overlay controls for the active lightbox */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
                  <button 
                    onClick={() => setShowLightboxInfo(!showLightboxInfo)}
                    className={`p-2 rounded-full transition-all cursor-pointer border shadow-lg scale-95 hover:scale-105 active:scale-95 ${
                      showLightboxInfo 
                        ? 'bg-indigo-650 hover:bg-indigo-700 text-white border-indigo-500' 
                        : 'bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border-white/10'
                    }`}
                    title={showLightboxInfo ? "Hide information panel" : "Show information panel"}
                  >
                    <Info size={16} />
                  </button>

                  <button 
                    onClick={() => setLightboxIndex(null)}
                    className="bg-black/60 hover:bg-black/90 p-2 rounded-full text-white/80 hover:text-white transition-all cursor-pointer border border-white/10 shadow-lg scale-95 hover:scale-105 active:scale-95"
                    title="Close (Escape)"
                    id="btn_close_lightbox"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Main Media renderer */}
                {currentLightboxPhoto.mimeType?.startsWith('video/') ? (
                  <video
                    key={currentLightboxPhoto.id}
                    src={currentLightboxPhoto.videoUrl || currentLightboxPhoto.baseUrl}
                    controls
                    autoPlay
                    playsInline
                    muted
                    className="max-h-[60vh] md:max-h-[75vh] max-w-full object-contain rounded-xl shadow-xl focus:outline-hidden"
                  />
                ) : (
                  <img
                    src={currentLightboxPhoto.baseUrl}
                    alt={currentLightboxPhoto.filename}
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] md:max-h-[75vh] max-w-full object-contain rounded-xl shadow-xl"
                  />
                )}
                
                {/* Media index counter overlay */}
                {processedPhotos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/80 font-mono text-[10px] px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md pointer-events-none tracking-wider">
                    {lightboxIndex !== null ? lightboxIndex + 1 : 1} / {processedPhotos.length}
                  </div>
                )}
              </div>

              {/* Right Side: Photo Information / Metadata Panel */}
              {showLightboxInfo && (
                <div className="w-full md:w-80 bg-gray-950 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 text-white overflow-y-auto">
                  <div className="space-y-5">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded-md inline-block border border-indigo-900/30">
                        Google Photo Stream
                      </span>
                      <h4 className="font-sans font-bold text-sm tracking-tight pt-2 line-clamp-2">
                        {currentLightboxPhoto.filename}
                      </h4>
                      {currentLightboxPhoto.description && (
                        <p className="text-xs text-gray-400 font-sans mt-2 italic leading-relaxed">
                          "{currentLightboxPhoto.description}"
                        </p>
                      )}
                    </div>

                    {/* Photo Details Specifications List */}
                    <div className="space-y-3 pt-4 border-t border-white/5 text-xs text-gray-400 font-sans">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-500" />
                        <div>
                          <span className="text-[10px] text-gray-600 block leading-tight font-semibold">Captured On</span>
                          <span className="font-medium text-gray-300">
                            {currentLightboxPhoto.mediaMetadata?.creationTime 
                              ? new Date(currentLightboxPhoto.mediaMetadata.creationTime).toLocaleString([], { 
                                  dateStyle: 'medium', 
                                  timeStyle: 'short' 
                                })
                              : 'Unknown Date'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Camera size={14} className="text-gray-500" />
                        <div>
                          <span className="text-[10px] text-gray-600 block leading-tight font-semibold">Camera Details</span>
                          <span className="font-medium text-gray-300">
                            {currentLightboxPhoto.mediaMetadata?.photo?.cameraMake || currentLightboxPhoto.mediaMetadata?.photo?.cameraModel
                              ? `${currentLightboxPhoto.mediaMetadata.photo.cameraMake || ''} ${currentLightboxPhoto.mediaMetadata.photo.cameraModel || ''}`
                              : 'N/A: Scanned / Web Upload'}
                          </span>
                        </div>
                      </div>

                      {currentLightboxPhoto.mediaMetadata?.photo && (
                        <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-2xl border border-white/5 mt-2">
                          <div>
                            <span className="text-[9px] text-gray-500 block">Aperture</span>
                            <span className="text-xxs font-mono font-bold text-gray-350">
                              {currentLightboxPhoto.mediaMetadata.photo.apertureFNumber ? `f/${currentLightboxPhoto.mediaMetadata.photo.apertureFNumber}` : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">Exposure</span>
                            <span className="text-xxs font-mono font-bold text-gray-350">
                              {currentLightboxPhoto.mediaMetadata.photo.exposureTime ? `${currentLightboxPhoto.mediaMetadata.photo.exposureTime}s` : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">ISO Speed</span>
                            <span className="text-xxs font-mono font-bold text-gray-350">
                              {currentLightboxPhoto.mediaMetadata.photo.isoEquivalent ? `ISO ${currentLightboxPhoto.mediaMetadata.photo.isoEquivalent}` : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">Focal Length</span>
                            <span className="text-xxs font-mono font-bold text-gray-350">
                              {currentLightboxPhoto.mediaMetadata.photo.focalLength ? `${currentLightboxPhoto.mediaMetadata.photo.focalLength}mm` : '—'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5">
                    <a
                      href={currentLightboxPhoto.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-200 border border-[#2A2A2A] font-sans text-xs font-bold rounded-2xl transition-all cursor-pointer"
                      id="link_open_google_photos"
                    >
                      <ExternalLink size={13} />
                      Open in Google Photos
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Screen Slideshow Modal */}
      <AnimatePresence>
        {showSlideshow && processedPhotos.length > 0 && (() => {
          const currentSlideshowPhoto = processedPhotos[slideshowIndex] || processedPhotos[0] || null;
          if (!currentSlideshowPhoto) return null;
          
          return (
            <div 
              className="fixed inset-0 bg-neutral-950 z-50 flex flex-col justify-between overflow-hidden select-none"
              id="fullscreen_slideshow_panel"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slideshow Top Controls Bar */}
              <div className="w-full bg-gradient-to-b from-black/80 to-transparent p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSlideshow(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 rounded-xl text-white/90 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-white/10"
                    title="Close Slideshow"
                    id="btn_close_slideshow"
                  >
                    <X size={18} />
                  </button>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">
                      Slideshow
                    </span>
                    <h4 className="font-sans font-medium text-xs text-gray-400 leading-tight">
                      {activeTab === 'date' ? `Memories on ${formattedSelectedDate}` : 'All Photos Library'} ({slideshowIndex + 1} of {processedPhotos.length})
                    </h4>
                  </div>
                </div>

                {/* Central control panel: Previous, Play/Pause, Next */}
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/10">
                  <button
                    onClick={() => setSlideshowIndex((prev) => (prev - 1 + processedPhotos.length) % processedPhotos.length)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all cursor-pointer"
                    title="Previous Photo"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white hover:text-indigo-400 transition-all cursor-pointer flex items-center justify-center"
                    title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-white/15" />}
                  </button>
                  <button
                    onClick={() => setSlideshowIndex((prev) => (prev + 1) % processedPhotos.length)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all cursor-pointer"
                    title="Next Photo"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="hidden sm:flex items-center gap-2 text-xxs font-mono font-bold uppercase tracking-wider text-gray-400 bg-white/5 py-1.5 px-3 rounded-xl border border-white/5">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-indigo-500 animate-pulse' : 'bg-gray-600'}`}></span>
                  {isPlaying ? 'AutoPlaying' : 'Paused'}
                </div>
              </div>

              {/* Slideshow Core Display Layer */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 bg-neutral-950">
                {/* Previous & Next Floating Large arrows */}
                <button
                  onClick={() => setSlideshowIndex((prev) => (prev - 1 + processedPhotos.length) % processedPhotos.length)}
                  className="absolute left-6 p-4 bg-black/30 hover:bg-black/60 text-white/45 hover:text-white rounded-2xl transition-all cursor-pointer opacity-0 hover:opacity-100 sm:opacity-50 border border-white/5 z-20"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => setSlideshowIndex((prev) => (prev + 1) % processedPhotos.length)}
                  className="absolute right-6 p-4 bg-black/30 hover:bg-black/60 text-white/45 hover:text-white rounded-2xl transition-all cursor-pointer opacity-0 hover:opacity-100 sm:opacity-50 border border-white/5 z-20"
                >
                  <ChevronRight size={28} />
                </button>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlideshowPhoto.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
                  >
                    {currentSlideshowPhoto.mimeType?.startsWith('video/') ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <video
                          key={currentSlideshowPhoto.id}
                          ref={(el) => {
                            // Assign back to our ref
                            (slideshowVideoRef as any).current = el;
                            if (el) {
                              el.muted = isAudioMuted;
                              el.play().catch((err) => {
                                console.warn("Autoplay or audio state switch prevented by browser policy:", err);
                              });
                            }
                          }}
                          src={currentSlideshowPhoto.videoUrl || currentSlideshowPhoto.baseUrl}
                          autoPlay
                          loop
                          playsInline
                          muted={isAudioMuted}
                          preload="auto"
                          crossOrigin="anonymous"
                          className={`w-full h-full object-contain bg-neutral-950 transition-all duration-500 ${getFilterClass(photoFilter)}`}
                        />
                        
                        {/* Styled unmute button matching choose clockStyle */}
                        <div className="absolute bottom-16 right-6 sm:bottom-24 sm:right-10 z-40">
                          {(() => {
                            const customStyle = getUnmuteButtonStyles(clockStyle);
                            return (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsAudioMuted(!isAudioMuted);
                                }}
                                className={customStyle.btnClass}
                              >
                                {isAudioMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                <span>{customStyle.label}</span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <img
                        src={currentSlideshowPhoto.baseUrl}
                        alt={currentSlideshowPhoto.filename}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-contain bg-neutral-950 transition-all duration-500 ${getFilterClass(photoFilter)}`}
                      />
                    )}
                    
                    {/* Overlay metadata at bottom left of current image */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-6 pt-20 text-white flex flex-col gap-1 select-text z-10 pb-28">
                      {currentSlideshowPhoto.description && (
                        <p className="text-xs text-gray-200 font-sans italic leading-relaxed max-w-xl">
                          "{currentSlideshowPhoto.description}"
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xxs text-gray-400 mt-1">
                        {currentSlideshowPhoto.mediaMetadata?.creationTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} className="text-gray-500" />
                            {new Date(currentSlideshowPhoto.mediaMetadata.creationTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slideshow Bottom Bar (Clean metadata space) */}
              <div className="w-full h-16 bg-gradient-to-t from-black/95 to-transparent p-6 flex justify-between items-end z-10 pointer-events-none select-none">
                <div className="text-[10px] text-gray-400/50 font-sans tracking-wide">
                  Tip: Use arrows to navigate, space or play button to stream
                </div>
              </div>

              {/* Floating Position-Aligned Real-Time Clock */}
              {(() => {
                let positionClass = '';
                let isLeft = clockPosition === 'top-left' || clockPosition === 'bottom-left';
                let alignClass = isLeft ? 'items-start text-left' : 'items-end text-right';
                
                if (clockPosition === 'top-left') {
                  positionClass = 'absolute top-16 left-6 sm:top-20 sm:left-10 z-30';
                } else if (clockPosition === 'top-right') {
                  positionClass = 'absolute top-16 right-6 sm:top-20 sm:right-10 z-30';
                } else if (clockPosition === 'bottom-left') {
                  // Offset up to prevent overlap with metadata description block
                  positionClass = 'absolute bottom-16 left-6 sm:bottom-24 sm:left-10 z-30';
                } else {
                  positionClass = 'absolute bottom-16 right-6 sm:bottom-24 sm:right-10 z-30';
                }

                let titleSizeClass = '';
                let subtitleSizeClass = '';
                
                if (clockSize === 'small') {
                  titleSizeClass = 'text-lg sm:text-xl md:text-2xl';
                  subtitleSizeClass = 'text-[8px] mt-1';
                } else if (clockSize === 'medium') {
                  titleSizeClass = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl';
                  subtitleSizeClass = 'text-[10px] sm:text-xs mt-2';
                } else {
                  titleSizeClass = 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl';
                  subtitleSizeClass = 'text-sm sm:text-base mt-2.5';
                }

                let wrapperClass = '';
                if (clockSize === 'small') {
                  wrapperClass = 'p-2.5 rounded-xl';
                } else if (clockSize === 'medium') {
                  wrapperClass = 'p-4 rounded-2xl';
                } else {
                  wrapperClass = 'p-6 rounded-3xl';
                }

                switch (clockStyle) {
                  case 'neon':
                    return (
                      <div 
                        className={`pointer-events-auto flex flex-col ${alignClass} select-text bg-black/70 border border-indigo-500/20 shadow-[0_0_25px_rgba(99,102,241,0.25)] backdrop-blur-md ${wrapperClass} ${positionClass}`}
                        id="slideshow_realtime_clock"
                      >
                        <div className={`font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-widest leading-none drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] ${titleSizeClass}`}>
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                        <div className={`font-mono uppercase tracking-widest font-black text-indigo-400 flex items-center gap-1.5 ${subtitleSizeClass}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                          <span>{currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                        </div>
                        {weatherData && (
                          <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-cyan-400 mt-2.5 border-t border-indigo-500/15 pt-2 flex items-center gap-1.5">
                            <span>● WEATHER:</span>
                            <span className="text-white font-black">{weatherData.city} {weatherData.temp}°F ({weatherData.description})</span>
                          </div>
                        )}
                      </div>
                    );
                  case 'vintage':
                    return (
                      <div 
                        className={`pointer-events-auto flex flex-col ${alignClass} select-text font-serif ${clockSize === 'small' ? 'm-2' : clockSize === 'medium' ? 'm-4' : 'm-6'} ${positionClass}`}
                        id="slideshow_realtime_clock"
                      >
                        <div className={`font-light text-amber-100 italic leading-none tracking-tight ${titleSizeClass}`}>
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                        </div>
                        <div className={`text-amber-200/60 font-medium italic border-t border-amber-500/15 pt-1.5 tracking-wide ${subtitleSizeClass}`}>
                          {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        {weatherData && (
                          <div className="text-amber-100/40 font-serif italic text-[11px] mt-1.5 border-t border-amber-500/10 pt-1">
                            Currently {weatherData.temp}°F and {weatherData.description} in {weatherData.city}
                          </div>
                        )}
                      </div>
                    );
                  case 'terminal':
                    return (
                      <div 
                        className={`pointer-events-auto flex flex-col ${alignClass} select-text bg-black/90 border border-emerald-500/30 text-emerald-400 font-mono shadow-[0_0_15px_rgba(16,185,129,0.15)] ${wrapperClass} ${positionClass}`}
                        id="slideshow_realtime_clock"
                      >
                        <div className={`font-bold tracking-widest leading-none text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] ${titleSizeClass}`}>
                          &gt; {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                        <div className={`uppercase tracking-wider text-emerald-500/80 font-bold select-none ${subtitleSizeClass}`}>
                          SYS_CLOCK // {currentTime.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' })}
                        </div>
                        {weatherData && (
                          <div className="uppercase text-[9px] tracking-wider text-emerald-500/70 font-bold mt-2 border-t border-emerald-500/20 pt-1.5 font-mono select-none">
                            METEO_SYNC // TEMP={weatherData.temp}F DESC={weatherData.description.toUpperCase()} LOC={weatherData.city.toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  case 'tech':
                    return (
                      <div 
                        className={`pointer-events-auto flex flex-col ${alignClass} select-text bg-[#0F0F1A]/80 border border-rose-500/20 backdrop-blur-md shadow-lg ${wrapperClass} ${positionClass}`}
                        id="slideshow_realtime_clock"
                      >
                        <div className={`text-[9.5px] tracking-widest font-black text-rose-500 uppercase flex items-center gap-1 mb-1.5 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                          METADATA_SYNC
                        </div>
                        <div className={`font-mono text-rose-450 leading-none font-semibold ${titleSizeClass}`}>
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                        <div className={`font-mono text-gray-400 uppercase tracking-widest mt-2 border-t border-rose-900/10 pt-1.5 ${subtitleSizeClass}`}>
                          LAT_OK // {currentTime.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </div>
                        {weatherData && (
                          <div className="font-mono text-[9px] uppercase tracking-wider text-rose-400 font-black mt-2 border-t border-rose-900/20 pt-1.5">
                            OUTDOOR_STAT // T={weatherData.temp}F LOC={weatherData.city.replace(/[^a-zA-Z]/g, '').toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  case 'minimal':
                  default:
                    return (
                      <div 
                        className={`pointer-events-auto flex flex-col ${alignClass} select-text ${clockSize === 'small' ? 'm-2' : clockSize === 'medium' ? 'm-4' : 'm-6'} ${positionClass}`}
                        id="slideshow_realtime_clock"
                      >
                        <div className={`font-mono font-extralight text-neutral-100 tracking-wider leading-none ${titleSizeClass}`}>
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                        <div className={`font-sans uppercase tracking-widest font-semibold text-neutral-400 ${subtitleSizeClass}`}>
                          {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                        {weatherData && (
                          <div className="font-sans text-[10px] md:text-[11px] font-bold text-neutral-400 mt-2 border-t border-neutral-800/40 pt-1.5 flex items-center gap-1">
                            <span>{weatherData.city}</span>
                            <span className="text-neutral-600 font-mono">•</span>
                            <span>{weatherData.temp}°F</span>
                            <span className="text-neutral-600 font-mono">•</span>
                            <span className="capitalize">{weatherData.description}</span>
                          </div>
                        )}
                      </div>
                    );
                }
              })()}
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
