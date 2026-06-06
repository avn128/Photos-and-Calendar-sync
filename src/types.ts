export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  status?: string;
  colorId?: string;
  creator?: {
    email?: string;
    displayName?: string;
  };
  htmlLink?: string;
}

export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  selected?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
}

export interface GooglePhotoItem {
  id: string;
  description?: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  videoUrl?: string;
  mediaMetadata?: {
    creationTime: string;
    width: string;
    height: string;
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
      focalLength?: number;
      apertureFNumber?: number;
      isoEquivalent?: number;
      exposureTime?: string;
    };
  };
  filename: string;
}

export type CalendarViewType = 'month' | 'week' | 'day';

export interface AuthState {
  user: any | null;
  accessToken: string | null;
  needsAuth: boolean;
  loading: boolean;
  error: string | null;
}

export interface RegisteredDevice {
  macAddress: string;
  name: string;
  associatedAlbumIds: string[];
}

