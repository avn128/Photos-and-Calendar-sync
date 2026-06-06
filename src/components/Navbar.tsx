import React from 'react';
import { 
  Calendar, 
  Image as ImageIcon,
  LogOut, 
  User as UserIcon,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from 'firebase/auth';

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  showPhotos: boolean;
  onTogglePhotos: () => void;
  isLoggingIn: boolean;
  onOpenSettings: () => void;
}

export default function Navbar({
  user,
  onLogin,
  onLogout,
  showPhotos,
  onTogglePhotos,
  isLoggingIn,
  onOpenSettings
}: NavbarProps) {
  return (
    <header className="bg-[#0F0F0F] border-b border-[#2A2A2A] py-3.5 px-6 shrink-0 z-10 shadow-xs" id="app_navbar_header">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-1.5" id="brand_icon_combo">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-tiny border border-[#2A2A2A]">
              <Calendar size={14} className="stroke-[2.5]" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-tiny border border-[#2A2A2A]">
              <ImageIcon size={14} className="stroke-[2.5]" />
            </div>
          </div>
          <div>
            <span className="font-sans font-bold text-[#E5E7EB] text-sm tracking-tight block">
              Google Calendar & Photos
            </span>
            <span className="font-sans text-[10px] text-gray-500 font-semibold tracking-wider uppercase block">
              Workspace Dash
            </span>
          </div>
        </div>

        {/* User profile details, toggle & auth trigger buttons */}
        <div className="flex items-center gap-4">
          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] hover:border-[#3A3A3A] text-gray-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0 shadow-tiny"
            title="Configure Styles & Albums"
            id="btn_navbar_settings"
          >
            <Settings size={13} className="text-indigo-400" />
            <span>Settings</span>
          </button>

          {user && (
            <div className="flex items-center bg-[#1A1A1A] py-1 pl-3 pr-1 rounded-2xl border border-[#2A2A2A] gap-3" id="navbar_photo_toggle_box">
              {/* Photo Display Option Toggle */}
              <button 
                onClick={onTogglePhotos}
                className="flex items-center gap-1.5 hover:bg-[#2A2A2A] px-2.5 py-1 rounded-xl transition-all font-sans text-xs font-semibold cursor-pointer text-[#E5E7EB]"
                id="btn_toggle_photos_sidebar"
              >
                <ImageIcon size={13} className={showPhotos ? 'text-indigo-400' : 'text-gray-400'} />
                <span className="hidden sm:inline">Photos Panel</span>
                {showPhotos ? (
                  <ToggleRight size={20} className="text-indigo-500 stroke-[2.5]" />
                ) : (
                  <ToggleLeft size={20} className="text-gray-600 stroke-[2.5]" />
                )}
              </button>

              <div className="h-4 w-px bg-[#2A2A2A] hidden sm:block"></div>

              {/* User Profile Card */}
              <div className="flex items-center gap-2 pr-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full border border-gray-700"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-200 flex items-center justify-center text-xs font-bold uppercase">
                    {user.displayName?.[0] || user.email?.[0]}
                  </div>
                )}
                <div className="hidden md:block leading-none text-left">
                  <span className="font-sans font-semibold text-xs text-gray-300 block">
                    {user.displayName || 'Google User'}
                  </span>
                  <span className="font-sans text-[9px] text-gray-500 block mt-0.5">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={onLogout}
                className="p-1.5 hover:bg-red-950/40 text-gray-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                title="Sign Out"
                id="btn_google_logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {!user && (
            <button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="gsi-material-button hover:translate-y-[-1px] transition-transform shadow-tiny inline-flex items-center justify-center border border-gray-700 rounded-xl bg-white px-4 py-2 cursor-pointer"
              id="google_signin_trigger"
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper flex items-center gap-2">
                <div className="gsi-material-button-icon flex items-center justify-center w-5 h-5">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-sans font-semibold text-xs text-gray-700">
                  {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
