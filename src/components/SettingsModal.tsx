import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Plus, 
  Link as LinkIcon, 
  Check, 
  Trash2, 
  Sparkles, 
  Globe, 
  Sliders,
  Compass,
  Zap,
  BookOpen,
  Terminal,
  Activity,
  Tv,
  Monitor,
  Cpu,
  CloudSun,
  Video,
  VideoOff,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GooglePhotoItem, RegisteredDevice } from '../types';

export type ClockStyleType = 'minimal' | 'neon' | 'vintage' | 'terminal' | 'tech';

export interface SharedAlbum {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  photos: GooglePhotoItem[];
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clockStyle: ClockStyleType;
  onChangeClockStyle: (style: ClockStyleType) => void;
  clockSize: 'small' | 'medium' | 'large';
  onChangeClockSize: (size: 'small' | 'medium' | 'large') => void;
  clockPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onChangeClockPosition: (position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => void;
  slideshowInterval: number;
  onChangeSlideshowInterval: (interval: number) => void;
  photoFilter: 'hdr' | 'vivid' | 'bw' | 'natural' | 'iphone' | 'samsung';
  onChangePhotoFilter: (filter: 'hdr' | 'vivid' | 'bw' | 'natural' | 'iphone' | 'samsung') => void;
  sharedAlbums: SharedAlbum[];
  onAddSharedAlbum: (name: string, url: string) => void;
  onDeleteSharedAlbum: (id: string) => void;
  onToggleSharedAlbum: (id: string) => void;
  registeredDevices: RegisteredDevice[];
  onRegisterDevice: (name: string, mac: string) => void;
  onDeleteDevice: (macAddress: string) => void;
  onUpdateDeviceAlbums: (macAddress: string, albumIds: string[]) => void;
  
  // Weather Integration Props
  weatherZip: string;
  onChangeWeatherZip: (zip: string) => void;
  isWeatherLoading: boolean;
  weatherError: string | null;
  weatherData: any;

  // Calendar Theme Props
  calendarTheme: 'normal' | 'grey' | 'pink' | 'dark';
  onChangeCalendarTheme: (theme: 'normal' | 'grey' | 'pink' | 'dark') => void;

  // Top-left Single-pixel loop video Props
  onePixelVideoEnabled: boolean;
  onChangeOnePixelVideoEnabled: (enabled: boolean) => void;
  onePixelVideoPlaying: boolean;
  onToggleOnePixelVideoPlaying: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  clockStyle,
  onChangeClockStyle,
  clockSize,
  onChangeClockSize,
  clockPosition,
  onChangeClockPosition,
  slideshowInterval,
  onChangeSlideshowInterval,
  photoFilter,
  onChangePhotoFilter,
  sharedAlbums,
  onAddSharedAlbum,
  onDeleteSharedAlbum,
  onToggleSharedAlbum,
  registeredDevices,
  onRegisterDevice,
  onDeleteDevice,
  onUpdateDeviceAlbums,
  
  weatherZip,
  onChangeWeatherZip,
  isWeatherLoading,
  weatherError,
  weatherData,
  calendarTheme,
  onChangeCalendarTheme,
  onePixelVideoEnabled,
  onChangeOnePixelVideoEnabled,
  onePixelVideoPlaying,
  onToggleOnePixelVideoPlaying
}: SettingsModalProps) {
  const [albumName, setAlbumName] = useState('');
  const [albumUrl, setAlbumUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Custom Display Devices registration state
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceMac, setNewDeviceMac] = useState('');
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    setDeviceError(null);

    if (!newDeviceName.trim()) {
      setDeviceError('Friendly Name is strictly required. Please assign a descriptive label to register a device.');
      return;
    }

    const cleanedMac = newDeviceMac.trim().toUpperCase();
    if (!cleanedMac) {
      setDeviceError('Hardware MAC Address is required.');
      return;
    }

    // Support XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX formats
    const macRegex = /^([0-9A-F]{2}[:-]?){5}[0-9A-F]{2}$/i;
    // Support pure 12 hex characters
    const simpleHexRegex = /^[0-9A-F]{12}$/i;
    
    if (!macRegex.test(cleanedMac) && !simpleHexRegex.test(cleanedMac)) {
      setDeviceError('Invalid MAC format. Please try standard formats like AA:BB:CC:DD:EE:FF.');
      return;
    }

    // Standardize to colon dividers
    let formattedMac = cleanedMac.replace(/[-]/g, ':');
    if (simpleHexRegex.test(cleanedMac)) {
      formattedMac = cleanedMac.match(/.{1,2}/g)!.join(':');
    }

    // Check duplicates
    if (registeredDevices.some(d => d.macAddress === formattedMac)) {
      setDeviceError(`A device with MAC Address ${formattedMac} is already registered under "${registeredDevices.find(d => d.macAddress === formattedMac)?.name}".`);
      return;
    }

    onRegisterDevice(newDeviceName.trim(), formattedMac);
    setNewDeviceName('');
    setNewDeviceMac('');
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const clockStylesList = [
    {
      id: 'minimal' as ClockStyleType,
      name: 'Minimal Stark',
      desc: 'Elegant light sans-serif with spacious tracking',
      icon: Clock,
      color: 'text-neutral-400'
    },
    {
      id: 'neon' as ClockStyleType,
      name: 'Digital Neon',
      desc: 'Glowing sci-fi index with deep ambient shadows',
      icon: Zap,
      color: 'text-indigo-400'
    },
    {
      id: 'vintage' as ClockStyleType,
      name: 'Vintage Editorial',
      desc: 'Warm classic serif typography with italic dates',
      icon: BookOpen,
      color: 'text-amber-500'
    },
    {
      id: 'terminal' as ClockStyleType,
      name: 'Retro Terminal',
      desc: 'Phosphor-green matrix monospace grid layout',
      icon: Terminal,
      color: 'text-emerald-400'
    },
    {
      id: 'tech' as ClockStyleType,
      name: 'Chronos Space',
      desc: 'Highly detailed dashboard with military precision',
      icon: Activity,
      color: 'text-rose-400'
    }
  ];

  const handleAddAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!albumName.trim()) {
      setErrorMessage('Please provide a descriptive name for your album.');
      return;
    }

    if (!albumUrl.trim() || !albumUrl.startsWith('http')) {
      setErrorMessage('Please provide a valid URL starting with http:// or https://');
      return;
    }

    // Success
    onAddSharedAlbum(albumName.trim(), albumUrl.trim());
    setAlbumName('');
    setAlbumUrl('');
  };

  const handleQuickAdd = (name: string, url: string) => {
    onAddSharedAlbum(name, url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="settings_modal_backbone">
      {/* Container Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-[#0F0F0F] border border-[#2A2A2A] rounded-3xl overflow-hidden mx-auto shadow-2xl flex flex-col max-h-[85vh] text-[#E5E7EB]"
        id="settings_modal_card"
      >
        {/* Header bar */}
        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#141414] shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-950/50 border border-indigo-900/30 text-indigo-400 rounded-lg">
              <Sliders size={16} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white tracking-tight">
                Workspace Preferences
              </h3>
              <p className="font-sans text-[10px] text-gray-500 font-semibold mt-0.5">
                Customize premium interactive and visual behaviors
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#2A2A2A] rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
            id="btn_close_settings"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal body scroll container */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 bg-[#0A0A0A]" id="settings_modal_content_body">
          
          {/* Section 1: Premium Slideshow Clock Styles */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-300">
                Slideshow clock styles & settings
              </h4>
            </div>

            {/* Live Interactive Canvas Clock Preview */}
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4 space-y-3 flex flex-col sm:flex-row items-center justify-between gap-4" id="premium_clock_live_preview">
              <div className="space-y-1 sm:max-w-xs text-left">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Active Canvas Preview</span>
                <h5 className="font-semibold text-xs text-[#E5E7EB]">Visual Studio Render</h5>
                <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                  Real-time viewport modeling your active font <strong className="text-neutral-300">{clockStylesList.find(s => s.id === clockStyle)?.name}</strong> rendered with physical size coefficient <strong className="text-neutral-300">{clockSize}</strong>.
                </p>
              </div>
              
              {/* Mini Slideshow screen with high fidelity mock wallpaper */}
              <div className="relative w-full sm:w-60 h-28 rounded-xl bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.75)),url('https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center border border-[#2E2E2E] overflow-hidden flex items-end justify-end p-2.5">
                <div className="p-1 px-1.5 rounded bg-black/50 text-[8px] uppercase tracking-wider font-bold text-white/55 absolute top-2 left-2 pointer-events-none select-none">
                  Slideshow Screen Preview
                </div>
                {/* Clock on top of background */}
                {(() => {
                  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: clockStyle !== 'terminal' && clockStyle !== 'tech' });
                  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
                  
                  // Compute scale classes based on size
                  let titleSizeClass = '';
                  let subtitleSizeClass = '';
                  
                  if (clockSize === 'small') {
                    titleSizeClass = 'text-xs sm:text-sm';
                    subtitleSizeClass = 'text-[7px] mt-0.5';
                  } else if (clockSize === 'medium') {
                    titleSizeClass = 'text-lg sm:text-xl';
                    subtitleSizeClass = 'text-[8.5px] mt-1';
                  } else {
                    titleSizeClass = 'text-2xl sm:text-3xl font-black';
                    subtitleSizeClass = 'text-[10px] mt-1.5';
                  }

                  switch (clockStyle) {
                    case 'neon':
                      return (
                        <div className="flex flex-col items-end text-right p-2 rounded bg-black/80 border border-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                          <div className={`font-mono ${titleSizeClass} font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-widest leading-none drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]`}>
                            {formattedTime}
                          </div>
                          <div className={`font-mono ${subtitleSizeClass} uppercase tracking-widest font-black text-indigo-400 flex items-center gap-1`}>
                            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></span>
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      );
                    case 'vintage':
                      return (
                        <div className="flex flex-col items-end text-right font-serif">
                          <div className={`${titleSizeClass} font-light text-amber-100 italic leading-none tracking-tight`}>
                            {formattedTime.toLowerCase()}
                          </div>
                          <div className={`${subtitleSizeClass} text-amber-200/60 font-medium italic border-t border-amber-500/15 pt-0.5 tracking-wide`}>
                            {formattedDate}
                          </div>
                        </div>
                      );
                    case 'terminal':
                      return (
                        <div className="flex flex-col items-end text-right p-2 rounded-lg bg-black/90 border border-emerald-500/30 text-emerald-400 font-mono shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                          <div className={`${titleSizeClass} font-bold tracking-widest leading-none text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]`}>
                            &gt; {formattedTime}
                          </div>
                          <div className={`${subtitleSizeClass} uppercase tracking-wider text-emerald-500/80 font-bold select-none`}>
                            SYS_CLOCK // {currentTime.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' })}
                          </div>
                        </div>
                      );
                    case 'tech':
                      return (
                        <div className="flex flex-col items-end text-right p-2 rounded bg-[#0F0F1A]/80 border border-rose-500/20 font-sans shadow-md">
                          <div className="text-[7px] tracking-widest font-black text-rose-500 uppercase flex items-center gap-0.5 mb-1">
                            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
                            METADATA_SYNC
                          </div>
                          <div className={`font-mono ${titleSizeClass} text-rose-450 leading-none font-semibold`}>
                            {formattedTime}
                          </div>
                          <div className={`font-mono ${subtitleSizeClass} text-zinc-400 uppercase tracking-widest border-t border-rose-900/10 pt-1`}>
                            LAT_OK // {currentTime.toLocaleDateString([], { month: '2-digit', day: '2-digit' })}
                          </div>
                        </div>
                      );
                    case 'minimal':
                    default:
                      return (
                        <div className="flex flex-col items-end text-right">
                          <div className={`font-mono ${titleSizeClass} font-extralight text-neutral-100 tracking-wider leading-none`}>
                            {formattedTime}
                          </div>
                          <div className={`font-sans ${subtitleSizeClass} uppercase tracking-widest font-semibold text-neutral-450`}>
                            {formattedDate}
                          </div>
                        </div>
                      );
                  }
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="premium_clock_grid">
              {clockStylesList.map((style) => {
                const isSelected = clockStyle === style.id;
                const IconComponent = style.icon;

                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onChangeClockStyle(style.id)}
                    className={`group flex items-start gap-3 p-3 rounded-2xl cursor-pointer border text-left transition-all ${
                      isSelected 
                        ? 'bg-indigo-950/25 border-indigo-500 text-white shadow-tiny shadow-indigo-500/10' 
                        : 'bg-[#121212] border-[#222222] text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 hover:bg-[#181818]'
                    }`}
                    id={`btn_clock_style_${style.id}`}
                  >
                    <div className={`p-2 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 ${isSelected ? style.color : 'text-neutral-500 group-hover:text-neutral-300'} transition-colors`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-semibold text-xs tracking-tight text-neutral-200 group-hover:text-white transition-colors">
                          {style.name}
                        </span>
                        {isSelected && (
                          <span className="p-0.5 bg-indigo-500 text-white rounded-full shrink-0">
                            <Check size={8} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[10.5px] text-zinc-500 mt-0.5 leading-tight group-hover:text-zinc-400 transition-colors">
                        {style.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Sizing, Rotation and Filter Controls Section */}
            <div className="bg-[#101010]/40 border border-[#222222] rounded-2xl p-4 space-y-4" id="premium_clock_sliders_and_filters_section">
              {/* Clock Font Size Pill Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-neutral-400 tracking-wider block">
                  Slideshow Clock Font Size
                </label>
                <div className="grid grid-cols-3 gap-2 bg-[#141414] p-1 border border-[#2A2A2A] rounded-xl" id="preset_clock_sizes">
                  {(['small', 'medium', 'large'] as const).map((size) => {
                    const isSelected = clockSize === size;
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => onChangeClockSize(size)}
                        className={`py-1.5 px-3 rounded-lg font-sans text-xs font-bold cursor-pointer transition-all capitalize ${
                          isSelected 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1C1C1C]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Multi-Control Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Interval Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans font-bold uppercase text-neutral-400 tracking-wider block">
                    SLIDESHOW SPEED
                  </label>
                  <div className="relative">
                    <select
                      value={slideshowInterval}
                      onChange={(e) => onChangeSlideshowInterval(Number(e.target.value))}
                      className="w-full pl-3 pr-10 py-2.5 font-sans text-xs bg-[#141414] border border-[#2A2A2A] hover:border-[#3A3A3A] text-gray-200 focus:text-white rounded-xl focus:outline-hidden cursor-pointer appearance-none font-semibold transition-all shadow-inner"
                      id="select_slideshow_interval"
                    >
                      <option value="5000">⏱️ Fast (5 sec)</option>
                      <option value="15000">⏱️ Standard (15 sec)</option>
                      <option value="30000">⏱️ Balanced (30 seconds)</option>
                      <option value="60000">⏱️ Slow (1 minute)</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                      <Sliders size={12} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Clock position selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans font-bold uppercase text-neutral-400 tracking-wider block">
                    CLOCK POSITION
                  </label>
                  <div className="relative">
                    <select
                      value={clockPosition}
                      onChange={(e) => onChangeClockPosition(e.target.value as any)}
                      className="w-full pl-3 pr-10 py-2.5 font-sans text-xs bg-[#141414] border border-[#2A2A2A] hover:border-[#3A3A3A] text-gray-200 focus:text-white rounded-xl focus:outline-hidden cursor-pointer appearance-none font-semibold transition-all shadow-inner"
                      id="select_slideshow_clock_position"
                    >
                      <option value="top-left">↖️ Top Left Corner</option>
                      <option value="top-right">↗️ Top Right Corner</option>
                      <option value="bottom-left">↙️ Bottom Left Corner</option>
                      <option value="bottom-right">↘️ Bottom Right Corner</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                      <Sliders size={12} className="rotate-180" />
                    </div>
                  </div>
                </div>

                {/* HDR Color Palette Preset Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans font-bold uppercase text-neutral-400 tracking-wider block">
                    SLIDESHOW COLOR
                  </label>
                  <div className="relative">
                    <select
                      value={photoFilter}
                      onChange={(e) => onChangePhotoFilter(e.target.value as any)}
                      className="w-full pl-3 pr-10 py-2.5 font-sans text-xs bg-[#141414] border border-[#2A2A2A] hover:border-[#3A3A3A] text-gray-200 focus:text-white rounded-xl focus:outline-hidden cursor-pointer appearance-none font-semibold transition-all shadow-inner"
                      id="select_slideshow_photo_filter"
                    >
                      <option value="natural">📷 Natural (Unmodified)</option>
                      <option value="hdr">✨ Hyper HDR (Intense Dynamic Range)</option>
                      <option value="vivid">🎨 Vivid Cine (Highly Saturated)</option>
                      <option value="bw">🌑 Classic Noir (Dramatic Black & White)</option>
                      <option value="iphone">📱 Apple iPhone (Warm Gold Cinematic)</option>
                      <option value="samsung">🌌 Samsung Galaxy (Vibrant Sky High Contrast)</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                      <Sparkles size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[#2A2A2A]" />

          {/* Section 2: Shared Albums Manager */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-indigo-400" />
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Shared Google Photo Albums
                </h4>
              </div>
              <span className="text-[10px] font-sans font-semibold text-neutral-500 bg-neutral-950 px-2 py-0.5 border border-neutral-900 rounded-md">
                {sharedAlbums.length} connected albums
              </span>
            </div>

            <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
              Display private backup directories, family folders, or personal shared libraries right within your Google Photos Workspace. Paste your shared album URL to generate corresponding layout streams.
            </p>

            {/* Form to Add Album */}
            <form onSubmit={handleAddAlbum} className="bg-[#141414] p-4 border border-[#2A2A2A] rounded-2xl space-y-3" id="add_album_form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-bold uppercase text-gray-500">Album Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Beach Trip"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    className="w-full px-3 py-2 font-sans text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-gray-200 rounded-xl placeholder:text-gray-650 focus:outline-hidden focus:border-[#4A4A4A] transition-all font-medium"
                    id="album_name_input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-bold uppercase text-gray-500">Google Photos Shared Link</label>
                  <div className="relative flex items-center">
                    <LinkIcon size={12} className="absolute left-3.5 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. https://photos.app.goo.gl/..."
                      value={albumUrl}
                      onChange={(e) => setAlbumUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 font-sans text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-gray-200 rounded-xl placeholder:text-gray-650 focus:outline-hidden focus:border-[#4A4A4A] transition-all font-medium"
                      id="album_link_input"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="text-[10px] font-semibold text-rose-450 bg-rose-950/20 px-3 py-1.5 border border-rose-900/40 rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="pt-1.5 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer shadow-tiny"
                  id="btn_submit_album"
                >
                  <Plus size={13} />
                  <span>Connect Shared Album</span>
                </button>
              </div>
            </form>

            {/* List of Connected Albums */}
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold uppercase text-gray-500">Connected Shared Inventories</span>
              
              {sharedAlbums.length === 0 ? (
                <div className="bg-[#141414]/40 border border-dashed border-[#222222] rounded-2xl p-6 text-center text-gray-500 font-sans text-xs">
                  <Compass size={24} className="mx-auto mb-2 text-neutral-600 animate-pulse" />
                  <p className="font-semibold text-neutral-400">No external shared albums registered yet</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Connect your photo links above, or click below for instant premium trial templates:</p>
                  
                  {/* Quick templates presets */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('🌴 Tropical Beachside 2026', 'https://photos.app.goo.gl/beach-pack')}
                      className="text-[10px] font-semibold py-1 px-2.5 bg-indigo-950/30 text-indigo-300 border border-indigo-900/30 rounded-lg hover:bg-indigo-900/40 cursor-pointer transition-all"
                    >
                      + Tropical Beachside
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('🏔️ Pine Ridge Camping', 'https://photos.app.goo.gl/nature-hike')}
                      className="text-[10px] font-semibold py-1 px-2.5 bg-emerald-950/30 text-emerald-300 border border-emerald-900/30 rounded-lg hover:bg-emerald-900/40 cursor-pointer transition-all"
                    >
                      + Pine Ridge Camping
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd('🎡 Euro Trip Scrapbook', 'https://photos.app.goo.gl/paris-trip')}
                      className="text-[10px] font-semibold py-1 px-2.5 bg-amber-950/30 text-amber-300 border border-amber-900/30 rounded-lg hover:bg-amber-900/40 cursor-pointer transition-all"
                    >
                      + Euro Trip Portfolio
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1" id="custom_albums_scroller">
                  {sharedAlbums.map((album) => (
                    <div 
                      key={album.id}
                      className={`flex items-center justify-between p-3 rounded-2xl bg-[#141414] border transition-all ${
                        album.isActive 
                          ? 'border-[#2A2CD1]/40 shadow-tiny bg-[#141424]/20' 
                          : 'border-[#222222] hover:border-[#333333]'
                      }`}
                      id={`album_item_${album.id}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onToggleSharedAlbum(album.id)}
                          className={`w-4 h-4 rounded-full flex items-center justify-center border cursor-pointer transition-all shrink-0 ${
                            album.isActive 
                              ? 'bg-indigo-500 border-indigo-400 text-white' 
                              : 'border-[#333333] hover:border-gray-500'
                          }`}
                          title={album.isActive ? "Deactivate album streams" : "Activate album streams"}
                          id={`btn_toggle_active_${album.id}`}
                        >
                          {album.isActive && <Check size={10} strokeWidth={3} />}
                        </button>
                        
                        <div className="min-w-0 pr-3">
                          <span className={`font-sans text-xs font-semibold block truncate leading-tight ${album.isActive ? 'text-white' : 'text-neutral-400'}`}>
                            {album.name}
                          </span>
                          <span className="font-mono text-[9px] text-[#4F4F4F] truncate block mt-0.5">
                            {album.url}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded-md text-indigo-300">
                          {album.photos.length} elements
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => onDeleteSharedAlbum(album.id)}
                          className="p-1.5 hover:bg-red-950/40 text-neutral-500 hover:text-red-400 rounded-lg cursor-pointer transition-all"
                          title="Disconnect Album"
                          id={`btn_delete_album_${album.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="border-[#2A2A2A]" />

          {/* Section 3: Registered Display Devices Management */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor size={14} className="text-indigo-400" />
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Registered Display Devices (MAC Routing)
                </h4>
              </div>
              <span className="text-[10px] font-sans font-semibold text-neutral-500 bg-neutral-950 px-2 py-0.5 border border-neutral-900 rounded-md">
                {registeredDevices.length} active nodes
              </span>
            </div>

            <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
              Register physical wall-mounted frames, smart mirrors, or ambient console displays by their hardware MAC address to handle content syndication. <strong className="text-neutral-200">You must assign a friendly identifier name</strong> for each hardware node.
            </p>

            {/* Form to Register Frame */}
            <form onSubmit={handleAddDevice} className="bg-[#141414] p-4 border border-[#2A2A2A] rounded-2xl space-y-3" id="register_device_form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-bold uppercase text-gray-500">Device Name (Strictly Required)</label>
                  <input
                    type="text"
                    placeholder="e.g. Grandma's Living Room Frame"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="w-full px-3 py-2 font-sans text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-gray-200 rounded-xl placeholder:text-gray-650 focus:outline-hidden focus:border-[#4A4A4A] transition-all font-medium"
                    id="new_device_name_input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-sans font-bold uppercase text-gray-500">Hardware MAC Address</label>
                  <div className="relative flex items-center">
                    <Cpu size={12} className="absolute left-3.5 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. AA:BB:CC:11:22:33"
                      value={newDeviceMac}
                      onChange={(e) => setNewDeviceMac(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 font-sans text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-gray-200 rounded-xl placeholder:text-gray-650 focus:outline-hidden focus:border-[#4A4A4A] transition-all font-medium"
                      id="new_device_mac_input"
                    />
                  </div>
                </div>
              </div>

              {deviceError && (
                <div className="text-[10px] font-semibold text-rose-400 bg-rose-950/20 px-3 py-1.5 border border-rose-900/40 rounded-xl">
                  ⚠️ {deviceError}
                </div>
              )}

              <div className="pt-1.5 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-505 text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer shadow-tiny"
                  id="btn_submit_device"
                >
                  <Plus size={13} />
                  <span>Register Display Frame</span>
                </button>
              </div>
            </form>

            {/* List and Management area of registered Additional Devices */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-sans font-bold uppercase text-gray-500 block">Manage Active Hardware Nodes & Registry Toggles</span>
              
              {registeredDevices.length === 0 ? (
                <div className="bg-[#141414]/40 border border-dashed border-[#222222] rounded-2xl p-6 text-center text-gray-500 font-sans text-xs">
                  <Tv size={24} className="mx-auto mb-2 text-neutral-600 animate-pulse" />
                  <p className="font-semibold text-neutral-400">No display devices registered</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Register hardware terminals using their MAC Addresses to direct album streams.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1" id="registered_devices_scroller">
                  {registeredDevices.map((device) => (
                    <div 
                      key={device.macAddress}
                      className="p-4 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#2D2D2D] transition-all flex flex-col gap-3"
                      id={`device_item_${device.macAddress.replace(/:/g, '')}`}
                    >
                      {/* Top Row: Device Identity Detail & Disconnect action */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-xl bg-indigo-950/20 text-indigo-400 border border-indigo-900/10 shrink-0">
                            <Tv size={15} />
                          </div>
                          <div className="min-w-0">
                            <span className="font-sans text-xs font-bold text-white block leading-tight">
                              {device.name}
                            </span>
                            <span className="font-mono text-[9px] text-neutral-400 block mt-1 tracking-wider uppercase bg-[#181818] border border-[#252525] rounded px-1.5 py-0.5 w-max">
                              MAC: {device.macAddress}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteDevice(device.macAddress)}
                          className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 rounded-lg cursor-pointer transition-all shrink-0"
                          title="Unregister Display Terminal"
                          id={`btn_delete_device_${device.macAddress.replace(/:/g, '')}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Bottom Row: Album selection routing matrix */}
                      <div className="border-t border-[#1C1C1C] pt-2.5 space-y-1.5">
                        <span className="text-[9px] font-sans font-extrabold uppercase text-gray-400 tracking-wider">
                          Registered Shared Photo Albums
                        </span>

                        {sharedAlbums.length === 0 ? (
                          <p className="text-[10px] text-amber-500/80 font-sans italic">
                            ⚠️ Connect and configure Shared Albums above first to allocate them to this frame unit.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5" id={`albums_routing_${device.macAddress.replace(/:/g, '')}`}>
                            {sharedAlbums.map((album) => {
                              const isAssociated = device.associatedAlbumIds.includes(album.id);
                              
                              const handleToggleAssociated = () => {
                                let updatedIds;
                                if (isAssociated) {
                                  updatedIds = device.associatedAlbumIds.filter(id => id !== album.id);
                                } else {
                                  updatedIds = [...device.associatedAlbumIds, album.id];
                                }
                                onUpdateDeviceAlbums(device.macAddress, updatedIds);
                              };

                              return (
                                <button
                                  type="button"
                                  key={album.id}
                                  onClick={handleToggleAssociated}
                                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-[10px] font-sans font-bold cursor-pointer transition-all ${
                                    isAssociated 
                                      ? 'bg-indigo-950/30 text-indigo-300 border-indigo-500/40 shadow-tiny' 
                                      : 'bg-neutral-900/40 text-neutral-400 border-neutral-850 hover:border-neutral-700'
                                  }`}
                                  id={`btn_toggle_routing_${device.macAddress.replace(/:/g, '')}_${album.id}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isAssociated ? 'bg-indigo-400 animate-pulse' : 'bg-neutral-600'}`}></span>
                                  <span>{album.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="border-[#2A2A2A]" />

          {/* Section 4: Weather Sync Configuration */}
          <div className="space-y-4 text-left font-sans" id="settings_weather_section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun size={14} className="text-indigo-400" />
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Global Weather sync (Free open-meteo)
                </h4>
              </div>
              <span className="text-[10px] font-sans font-semibold text-neutral-500 bg-neutral-950 px-2 py-0.5 border border-neutral-900 rounded-md">
                Geo & Forecast Enabled
              </span>
            </div>

            <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
              Input a five-digit US ZIP Code to geocode coordinate mappings. This synchronizes instant current meteorological statistics to both slideshow overlays and calendar status headers automatically.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#141414] p-4 border border-[#2A2A2A] rounded-2xl">
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase text-gray-550">US ZIP Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="Enter ZIP e.g. 90210"
                    defaultValue={weatherZip || ''}
                    onBlur={(e) => {
                      if (e.target.value !== weatherZip) {
                        onChangeWeatherZip(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onChangeWeatherZip((e.target as HTMLInputElement).value);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 font-sans text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-gray-255 rounded-xl focus:outline-hidden focus:border-[#4A4A4A] transition-all font-semibold text-gray-200"
                    id="weather_zip_input_field"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('weather_zip_input_field') as HTMLInputElement;
                      if (input) {
                        onChangeWeatherZip(input.value);
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-505 font-sans text-xs font-bold text-white rounded-xl transition-all cursor-pointer shadow-tiny shrink-0"
                  >
                    Set Location
                  </button>
                </div>
                {weatherError && (
                  <p className="text-[10px] text-rose-455 font-semibold font-sans mt-1">
                    ⚠️ {weatherError}
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-center bg-[#0C0C0C] border border-[#202020] rounded-xl p-3 font-sans">
                <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest block mb-1">CURRENTLY LOADED</span>
                {isWeatherLoading ? (
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-3.5 h-3.5 border-2 border-neutral-700 border-t-indigo-500 rounded-full animate-spin"></div>
                    <span className="text-[11px] text-neutral-400 font-semibold animate-pulse">Syncing coordinates...</span>
                  </div>
                ) : weatherData ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-200 block">{weatherData.city}</span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">{weatherData.description} (Updated {weatherData.lastUpdated})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-md font-mono font-extrabold text-[#E5E7EB]">{weatherData.temp}°F</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-[11px] text-neutral-500 italic">No coordinates synced. Please submit a valid 5-digit ZIP.</span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-[#2A2A2A]" />

          {/* Section 5: Calendar Option Styling Theme */}
          <div className="space-y-4 text-left font-sans" id="settings_calendar_theme_section">
            <div className="flex items-center gap-2">
              <Palette size={14} className="text-indigo-400" />
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-300">
                Interactive Calendar Theme Setting
              </h4>
            </div>

            <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
              Configure the background and ambient layout tones for the main interactive schedule canvas. Select between classical charcoal colors, sleek cool grays, elegant sakura pinks, or intense pitch-black OLED views.
            </p>

            <div className="grid grid-cols-4 gap-2 bg-[#141414] p-1.5 border border-[#2A2A2A] rounded-2xl" id="calendar_theme_selectors">
              {(['normal', 'grey', 'pink', 'dark'] as const).map((t) => {
                const isSelected = calendarTheme === t;
                let bgBtnClass = '';
                let labelStyle = '';
                if (t === 'normal') { bgBtnClass = 'bg-[#0F0F0F] text-indigo-444 border-[#2A2A2A]'; labelStyle = 'Indigo Accent'; }
                if (t === 'grey') { bgBtnClass = 'bg-[#1E1E1E] text-neutral-300 border-[#333333]'; labelStyle = 'Charcoal'; }
                if (t === 'pink') { bgBtnClass = 'bg-[#130E14] text-pink-400 border-[#2C1F2E]'; labelStyle = 'Sakura Pink'; }
                if (t === 'dark') { bgBtnClass = 'bg-black text-white border-[#151515]'; labelStyle = 'OLED Black'; }

                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => onChangeCalendarTheme(t)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${bgBtnClass} ${
                      isSelected ? 'ring-2 ring-indigo-500 bg-opacity-100 scale-102 font-bold border-indigo-500' : 'opacity-65 hover:opacity-100'
                    }`}
                  >
                    <span className="text-xs font-sans font-bold capitalize">{t}</span>
                    <span className="text-[9px] font-mono text-neutral-500">{labelStyle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-[#2A2A2A]" />

          {/* Section 6: Top-Left Single Pixel Looping Video */}
          <div className="space-y-4 text-left font-sans" id="settings_single_pixel_video_section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video size={14} className="text-indigo-400" />
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Single-Pixel Looping Website Video
                </h4>
              </div>
              <span className="text-[10px] font-sans font-semibold text-neutral-500 bg-neutral-950 px-2 py-0.5 border border-neutral-900 rounded-md">
                1px Micro-Display
              </span>
            </div>

            <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
              Inject an ambient single-pixel (1x1) looping video stream at the top-leftmost pixel of the viewport layout. This runs dynamically with muted, hardware-accelerated playback for testing device displays.
            </p>

            <div className="bg-[#141414] p-4 border border-[#2A2A2A] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 w-full sm:w-auto">
                <label className="text-[10px] font-sans font-bold uppercase text-gray-500 block">Enable Top-Left Video Element</label>
                <select
                  value={onePixelVideoEnabled ? 'enabled' : 'disabled'}
                  onChange={(e) => onChangeOnePixelVideoEnabled(e.target.value === 'enabled')}
                  className="w-full sm:w-44 px-3 py-2 font-sans text-xs bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#3A3A3A] text-gray-200 focus:text-white rounded-xl focus:outline-hidden cursor-pointer appearance-none font-semibold transition-all"
                  id="one_pixel_video_toggle_dropdown"
                >
                  <option value="disabled">🚫 Disabled (No Video Node)</option>
                  <option value="enabled">✅ Enabled (Play 1px Video)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:justify-start">
                <div className="text-[10px] font-sans text-neutral-400 font-semibold block text-right sm:text-left">
                  Playback controls:<br/>
                  <strong className={onePixelVideoPlaying ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}>
                    {onePixelVideoPlaying ? '● Active stream playing' : '○ Stream paused'}
                  </strong>
                </div>

                <button
                  type="button"
                  disabled={!onePixelVideoEnabled}
                  onClick={onToggleOnePixelVideoPlaying}
                  className={`flex items-center gap-1.5 py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all ${
                    !onePixelVideoEnabled 
                      ? 'bg-neutral-800 text-neutral-650 border border-neutral-900 cursor-not-allowed opacity-40'
                      : onePixelVideoPlaying
                        ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-tiny'
                        : 'bg-emerald-605 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-tiny'
                  }`}
                  id="btn_toggle_video_play"
                >
                  {onePixelVideoPlaying ? <VideoOff size={13} /> : <Video size={13} />}
                  <span>{onePixelVideoPlaying ? 'Pause Pixel Stream' : 'Play Pixel Stream'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#2A2A2A] bg-[#141414] flex justify-between items-center shrink-0">
          <div className="text-[10px] text-gray-500 font-sans tracking-tight">
            Settings persist automatically in local app data.
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-neutral-800 hover:bg-neutral-700 font-sans text-xs font-semibold text-white rounded-xl cursor-pointer transition-all"
            id="btn_settings_apply"
          >
            Apply Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
}
