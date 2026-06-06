import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from './lib/firebase';
import { GoogleCalendarEvent, GooglePhotoItem, RegisteredDevice } from './types';
import { getMockEvents, getMockPhotos } from './lib/mockData';
import Navbar from './components/Navbar';
import CalendarView from './components/CalendarView';
import PhotosSidebar from './components/PhotosSidebar';
import SettingsModal, { ClockStyleType, SharedAlbum } from './components/SettingsModal';
import { generatePhotosForAlbum } from './lib/albumPhotos';
import { 
  Calendar as CalendarIcon, 
  Image as ImageIcon, 
  Sparkles, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [events, setEvents] = useState<GoogleCalendarEvent[]>(getMockEvents());
  const [photos, setPhotos] = useState<GooglePhotoItem[]>(getMockPhotos());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Custom sidebar option (requested feature!)
  const [showPhotos, setShowPhotos] = useState(true);

  // Loading & status states
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [isPhotosLoading, setIsPhotosLoading] = useState(false);
  const [useLiveSync, setUseLiveSync] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Persistent Preferences State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [clockStyle, setClockStyle] = useState<ClockStyleType>(() => {
    return (localStorage.getItem('slideshow_clock_style') as ClockStyleType) || 'minimal';
  });
  const [clockSize, setClockSize] = useState<'small' | 'medium' | 'large'>(() => {
    return (localStorage.getItem('slideshow_clock_size') as 'small' | 'medium' | 'large') || 'medium';
  });
  const [clockPosition, setClockPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(() => {
    return (localStorage.getItem('slideshow_clock_position') as any) || 'bottom-right';
  });
  const [slideshowInterval, setSlideshowInterval] = useState<number>(() => {
    return Number(localStorage.getItem('slideshow_interval')) || 15000;
  });
  const [photoFilter, setPhotoFilter] = useState<'hdr' | 'vivid' | 'bw' | 'natural' | 'iphone' | 'samsung'>(() => {
    return (localStorage.getItem('slideshow_photo_filter') as any) || 'natural';
  });
  
  // Weather states
  const [weatherZip, setWeatherZip] = useState<string>(() => {
    return localStorage.getItem('weather_zip_code') || '10001';
  });
  const [weatherData, setWeatherData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('weather_data_cache');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Calendar styling theme ('normal' | 'grey' | 'pink' | 'dark')
  const [calendarTheme, setCalendarTheme] = useState<'normal' | 'grey' | 'pink' | 'dark'>(() => {
    return (localStorage.getItem('calendar_theme') as any) || 'normal';
  });

  // Top-left 1px looping video option
  const [onePixelVideoEnabled, setOnePixelVideoEnabled] = useState<boolean>(() => {
    return localStorage.getItem('one_pixel_video_enabled') === 'true';
  });
  const [onePixelVideoPlaying, setOnePixelVideoPlaying] = useState<boolean>(() => {
    return localStorage.getItem('one_pixel_video_enabled') === 'true'; // play automatically if enabled
  });

  const [sharedAlbums, setSharedAlbums] = useState<SharedAlbum[]>(() => {
    try {
      const saved = localStorage.getItem('google_photos_shared_albums');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [registeredDevices, setRegisteredDevices] = useState<RegisteredDevice[]>(() => {
    try {
      const saved = localStorage.getItem('registered_display_devices');
      return saved ? JSON.parse(saved) : [
        { 
          macAddress: 'BC:A9:E0:41:88:DC', 
          name: 'Living Room Frame S1', 
          associatedAlbumIds: [] 
        },
        { 
          macAddress: '12:F4:A8:B9:02:4E', 
          name: 'Kitchen Hub Console', 
          associatedAlbumIds: [] 
        }
      ];
    } catch {
      return [];
    }
  });

  const handleRegisterDevice = (name: string, mac: string) => {
    const newDevice: RegisteredDevice = {
      macAddress: mac.trim().toUpperCase(),
      name: name.trim(),
      associatedAlbumIds: []
    };
    const updated = [...registeredDevices, newDevice];
    setRegisteredDevices(updated);
    localStorage.setItem('registered_display_devices', JSON.stringify(updated));
  };

  const handleDeleteDevice = (macAddress: string) => {
    const updated = registeredDevices.filter(d => d.macAddress !== macAddress);
    setRegisteredDevices(updated);
    localStorage.setItem('registered_display_devices', JSON.stringify(updated));
  };

  const handleUpdateDeviceAlbums = (macAddress: string, albumIds: string[]) => {
    const updated = registeredDevices.map(d => 
      d.macAddress === macAddress ? { ...d, associatedAlbumIds: albumIds } : d
    );
    setRegisteredDevices(updated);
    localStorage.setItem('registered_display_devices', JSON.stringify(updated));
  };

  const handleClockPositionChange = (position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    setClockPosition(position);
    localStorage.setItem('slideshow_clock_position', position);
  };

  const handleAddSharedAlbum = (name: string, url: string) => {
    const defaultPhotos = generatePhotosForAlbum(name, selectedDate);
    const newAlbum: SharedAlbum = {
      id: `album-${Date.now()}`,
      name,
      url,
      isActive: true,
      photos: defaultPhotos
    };
    const updated = [...sharedAlbums, newAlbum];
    setSharedAlbums(updated);
    localStorage.setItem('google_photos_shared_albums', JSON.stringify(updated));
  };

  const handleDeleteSharedAlbum = (id: string) => {
    const updated = sharedAlbums.filter(a => a.id !== id);
    setSharedAlbums(updated);
    localStorage.setItem('google_photos_shared_albums', JSON.stringify(updated));
  };

  const handleToggleSharedAlbum = (id: string) => {
    const updated = sharedAlbums.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    );
    setSharedAlbums(updated);
    localStorage.setItem('google_photos_shared_albums', JSON.stringify(updated));
  };

  const handleClockStyleChange = (style: ClockStyleType) => {
    setClockStyle(style);
    localStorage.setItem('slideshow_clock_style', style);
  };

  const handleClockSizeChange = (size: 'small' | 'medium' | 'large') => {
    setClockSize(size);
    localStorage.setItem('slideshow_clock_size', size);
  };

  const handleSlideshowIntervalChange = (interval: number) => {
    setSlideshowInterval(interval);
    localStorage.setItem('slideshow_interval', String(interval));
  };

  const handlePhotoFilterChange = (filter: 'hdr' | 'vivid' | 'bw' | 'natural' | 'iphone' | 'samsung') => {
    setPhotoFilter(filter);
    localStorage.setItem('slideshow_photo_filter', filter);
  };

  // Weather fetch service (Uses zippopotam.us + open-meteo.com)
  const fetchWeatherForZip = async (zipCode: string) => {
    const trimmed = zipCode.trim();
    if (!trimmed || trimmed.length !== 5 || isNaN(Number(trimmed))) {
      setWeatherError('Please provide a valid 5-digit numerical US Zip code.');
      return;
    }
    setIsWeatherLoading(true);
    setWeatherError(null);
    try {
      // 1. Coordinates via zippopotam
      const geoRes = await fetch(`https://api.zippopotam.us/us/${trimmed}`);
      if (!geoRes.ok) {
        throw new Error('ZIP code was not found. Please verify the 5-digit code.');
      }
      const geo = await geoRes.json();
      const place = geo.places?.[0];
      if (!place) {
        throw new Error('Could not parse location coordinates.');
      }
      const lat = place.latitude;
      const lon = place.longitude;
      const city = place['place name'];
      const state = place['state abbreviation'];

      // 2. Weather via Open-Meteo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
      );
      if (!weatherRes.ok) {
        throw new Error('Weather forecast API error.');
      }
      const weatherDataRaw = await weatherRes.json();
      const current = weatherDataRaw.current;
      if (!current) {
        throw new Error('Failed to synchronize current weather parameters.');
      }

      const weatherCode = current.weather_code;
      const tempF = current.temperature_2m;
      let description = 'Overcast';
      let iconName = 'Cloud';

      if (weatherCode === 0) {
        description = 'Sunny / Clear';
        iconName = 'Sun';
      } else if ([1, 2, 3].includes(weatherCode)) {
        description = weatherCode === 1 ? 'Mainly Clear' : weatherCode === 2 ? 'Partly Cloudy' : 'Overcast';
        iconName = 'Cloud';
      } else if ([45, 48].includes(weatherCode)) {
        description = 'Foggy';
        iconName = 'CloudFog';
      } else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
        description = 'Drizzle';
        iconName = 'CloudDrizzle';
      } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
        description = 'Rain Showers';
        iconName = 'CloudRain';
      } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
        description = 'Snow Fall';
        iconName = 'Snowflake';
      } else if ([95, 96, 99].includes(weatherCode)) {
        description = 'Thunderstorm';
        iconName = 'CloudLightning';
      }

      const compiledWeather = {
        temp: Math.round(tempF),
        description,
        city: `${city}, ${state}`,
        icon: iconName,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setWeatherData(compiledWeather);
      localStorage.setItem('weather_data_cache', JSON.stringify(compiledWeather));
    } catch (err: any) {
      console.error('Weather sync failure:', err);
      setWeatherError(err.message || 'Error occurred while loading weather.');
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleWeatherZipChange = (zip: string) => {
    setWeatherZip(zip);
    localStorage.setItem('weather_zip_code', zip);
    fetchWeatherForZip(zip);
  };

  const handleCalendarThemeChange = (theme: 'normal' | 'grey' | 'pink' | 'dark') => {
    setCalendarTheme(theme);
    localStorage.setItem('calendar_theme', theme);
  };

  const handleOnePixelVideoEnabledChange = (enabled: boolean) => {
    setOnePixelVideoEnabled(enabled);
    localStorage.setItem('one_pixel_video_enabled', enabled ? 'true' : 'false');
    setOnePixelVideoPlaying(enabled);
  };

  const handleToggleOnePixelVideoPlaying = () => {
    setOnePixelVideoPlaying(prev => !prev);
  };

  // Initial fetch for weather
  useEffect(() => {
    if (weatherZip) {
      fetchWeatherForZip(weatherZip);
    }
  }, []);

  // Initialize auth state listener on app load
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setNeedsAuth(false);
        setUseLiveSync(true);
        // Fetch real Google Workspace data immediately
        fetchWorkspaceData(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
        setUseLiveSync(false);
        // Fall back to pristine mock data when signed out
        setEvents(getMockEvents());
        setPhotos(getMockPhotos());
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch real Google Calendar and Google Photos data
  const fetchWorkspaceData = async (token: string) => {
    setErrorNotice(null);
    let calendarFetchedSuccess = false;
    let photosFetchedSuccess = false;

    // 1. Fetch Google Calendar events
    setIsCalendarLoading(true);
    try {
      const timeMin = new Date();
      timeMin.setMonth(timeMin.getMonth() - 2); // Fetch events starting 2 months ago
      const timeMax = new Date();
      timeMax.setMonth(timeMax.getMonth() + 4); // Fetch events up to 4 months ahead

      const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      url.searchParams.append('timeMin', timeMin.toISOString());
      url.searchParams.append('timeMax', timeMax.toISOString());
      url.searchParams.append('singleEvents', 'true');
      url.searchParams.append('orderBy', 'startTime');
      url.searchParams.append('maxResults', '150');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Calendar API returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      if (data.items) {
        // Map Google Event schemas to standard schema
        const liveEvents: GoogleCalendarEvent[] = data.items.map((item: any) => ({
          id: item.id,
          summary: item.summary || '(Unnamed Event)',
          description: item.description,
          location: item.location,
          start: {
            dateTime: item.start?.dateTime,
            date: item.start?.date,
            timeZone: item.start?.timeZone
          },
          end: {
            dateTime: item.end?.dateTime,
            date: item.end?.date,
            timeZone: item.end?.timeZone
          },
          status: item.status,
          colorId: item.colorId,
          creator: item.creator,
          htmlLink: item.htmlLink
        }));
        setEvents(liveEvents);
        calendarFetchedSuccess = true;
      }
    } catch (err: any) {
      console.warn('Failed to fetch real Google Calendar events:', err);
      // Fallback but notify user
      setErrorNotice('Google Calendar syncing failed or needs activation in your sandbox cloud dashboard. Utilizing beautiful workspace mockups.');
    } finally {
      setIsCalendarLoading(false);
    }

    // 2. Fetch Google Photos
    setIsPhotosLoading(true);
    try {
      // Endpoint for fetching user media items from Google Photos Library
      const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Photos Library API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.mediaItems && data.mediaItems.length > 0) {
        const livePhotos: GooglePhotoItem[] = data.mediaItems.map((item: any) => ({
          id: item.id,
          description: item.description,
          productUrl: item.productUrl,
          baseUrl: item.baseUrl,
          mimeType: item.mimeType,
          mediaMetadata: item.mediaMetadata,
          filename: item.filename
        }));
        setPhotos(livePhotos);
        photosFetchedSuccess = true;
      } else {
        // No photos in user's library
        setPhotos(getMockPhotos());
        setErrorNotice(prev => 
          prev 
            ? `${prev} | Connected to Photos, but found no media items. Displaying elegant design photos.` 
            : 'Your live Google Photos library is currently empty. Showing ambient photography mockups.'
        );
      }
    } catch (err: any) {
      console.warn('Failed to fetch Google Photos stream. Fallback is applied:', err);
      // Photos Library API requires specific project settings that might be restricted for generic clients.
      // We gracefully fallback to mockups, ensuring the beautiful sidebar remains fully functional!
      setPhotos(getMockPhotos());
      setErrorNotice(prev => {
        if (!prev) {
          return 'Google Photos Library API returned restrictions or rate limit. Automatically loaded high-fidelity photography gallery for calendar date syncing.';
        }
        return prev;
      });
    } finally {
      setIsPhotosLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorNotice(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        setUseLiveSync(true);
        // Load target elements
        await fetchWorkspaceData(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google authorization popup failed:', err);
      setErrorNotice('Connection cancelled or credentials rejected in the signup popup. Please check your browser popup blocker.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setErrorNotice(null);
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setUseLiveSync(false);
      // Reset datasets to pristine mock examples
      setEvents(getMockEvents());
      setPhotos(getMockPhotos());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleManualRefresh = () => {
    const token = getAccessToken();
    if (token) {
      fetchWorkspaceData(token);
    } else {
      // Just simulate refresh with mockup date regenerations
      setIsCalendarLoading(true);
      setIsPhotosLoading(true);
      setTimeout(() => {
        setEvents(getMockEvents());
        setPhotos(getMockPhotos());
        setIsCalendarLoading(false);
        setIsPhotosLoading(false);
      }, 700);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans text-[#E5E7EB] antialiased selection:bg-indigo-950/40" id="main_app_layout">
      {/* App Header */}
      <Navbar 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        showPhotos={showPhotos}
        onTogglePhotos={() => setShowPhotos(!showPhotos)}
        isLoggingIn={isLoggingIn}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Core Area Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden flex flex-col md:flex-row gap-5" id="workspace_viewport">
        {/* Left Side: Calendar and Guides */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden" id="calendar_column">
          {/* Status banners */}
          <AnimatePresence>
            {errorNotice && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-amber-950/20 border border-amber-900/60 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-200 font-sans text-xs"
                id="error_warning_banner"
              >
                <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">Sync Advice:</span> {errorNotice}
                </div>
                <button 
                  onClick={() => setErrorNotice(null)}
                  className="font-bold text-amber-400 hover:text-white cursor-pointer text-xs px-1"
                >
                  &times;
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sync indicator */}
          <div className="bg-[#0F0F0F] rounded-2xl border border-[#2A2A2A] p-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-tiny" id="sync_mode_indicator">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${useLiveSync ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`}></span>
              <div>
                <p className="font-sans font-bold text-xs text-white">
                  {useLiveSync ? 'Connected Live with Google Workspace' : 'Preview Sandbox Mode'}
                </p>
                <p className="font-sans text-[10px] text-gray-400 font-semibold mt-0.5">
                  {useLiveSync 
                    ? `Authorized account: ${user?.email}` 
                    : 'Showing beautifully pre-populated mockup calendar logs. Click "Sign in with Google" to sync your own.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase text-gray-400 hover:text-white cursor-default bg-[#1A1A1A] border border-[#2A2A2A] py-1.5 px-3 rounded-xl select-none">
              <Sparkles size={11} className="text-indigo-400 animate-pulse" />
              Interactive Calendar Syncing
            </div>
          </div>

          {/* Interactive Calendar Component */}
          <div className="flex-1 min-h-[500px]" id="calendar_holder">
            <CalendarView 
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              isLoading={isCalendarLoading}
              calendarTheme={calendarTheme}
              weatherData={weatherData}
              isWeatherLoading={isWeatherLoading}
              weatherError={weatherError}
            />
          </div>
        </div>

        {/* Right Side: Google Photos Panel Options (Requested feature) */}
        <AnimatePresence>
          {showPhotos && (
            <motion.div
              initial={{ opacity: 0, x: 25, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: 25, width: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 flex overflow-hidden"
              id="photos_column_wrapper"
            >
              <PhotosSidebar 
                photos={photos}
                selectedDate={selectedDate}
                onRefresh={handleManualRefresh}
                isLoading={isPhotosLoading}
                clockStyle={clockStyle}
                clockSize={clockSize}
                clockPosition={clockPosition}
                slideshowInterval={slideshowInterval}
                photoFilter={photoFilter}
                sharedAlbums={sharedAlbums}
                weatherData={weatherData}
                isWeatherLoading={isWeatherLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Workspace Settings and Configuration Preferences Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            clockStyle={clockStyle}
            onChangeClockStyle={handleClockStyleChange}
            clockSize={clockSize}
            onChangeClockSize={handleClockSizeChange}
            clockPosition={clockPosition}
            onChangeClockPosition={handleClockPositionChange}
            slideshowInterval={slideshowInterval}
            onChangeSlideshowInterval={handleSlideshowIntervalChange}
            photoFilter={photoFilter}
            onChangePhotoFilter={handlePhotoFilterChange}
            sharedAlbums={sharedAlbums}
            onAddSharedAlbum={handleAddSharedAlbum}
            onDeleteSharedAlbum={handleDeleteSharedAlbum}
            onToggleSharedAlbum={handleToggleSharedAlbum}
            registeredDevices={registeredDevices}
            onRegisterDevice={handleRegisterDevice}
            onDeleteDevice={handleDeleteDevice}
            onUpdateDeviceAlbums={handleUpdateDeviceAlbums}
            weatherZip={weatherZip}
            onChangeWeatherZip={handleWeatherZipChange}
            isWeatherLoading={isWeatherLoading}
            weatherError={weatherError}
            weatherData={weatherData}
            calendarTheme={calendarTheme}
            onChangeCalendarTheme={handleCalendarThemeChange}
            onePixelVideoEnabled={onePixelVideoEnabled}
            onChangeOnePixelVideoEnabled={handleOnePixelVideoEnabledChange}
            onePixelVideoPlaying={onePixelVideoPlaying}
            onToggleOnePixelVideoPlaying={handleToggleOnePixelVideoPlaying}
          />
        )}
      </AnimatePresence>

      {/* Footer credits and information */}
      <footer className="py-4 border-t border-[#2A2A2A] bg-[#0F0F0F]" id="container_footer">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-gray-500 gap-3">
          <span className="font-semibold">© 2026 Google Calendar & Photos Connect</span>
          <div className="flex items-center gap-1">
            <HelpCircle size={12} className="text-gray-550" />
            <span>Select days in Month/Week view to instantly filter corresponding photos on the right side.</span>
          </div>
        </div>
      </footer>

      {/* 1 Pixel Website Video Player */}
      {onePixelVideoEnabled && (
        <video
          id="single_pixel_looping_video"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="fixed top-0 left-0 w-[1px] h-[1px] z-[999999] pointer-events-none opacity-100 object-cover bg-black"
          style={{
            clipPath: 'inset(0 0 0 0)',
            display: onePixelVideoPlaying ? 'block' : 'none'
          }}
        />
      )}
    </div>
  );
}
