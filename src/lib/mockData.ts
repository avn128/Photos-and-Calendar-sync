import { GoogleCalendarEvent, GooglePhotoItem } from '../types';

// Helper to construct dynamic dates relative to the current local time
export const getRelativeDateString = (dayOffset: number, hour: number = 10, minute: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const getRelativeAllDayString = (dayOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${date}`;
};

export const getMockEvents = (): GoogleCalendarEvent[] => [
  {
    id: 'mock-1',
    summary: '💼 Project Horizon: Sprint Planning',
    description: 'Bi-weekly retrospective and planning sync with the development team. Reviewing progress on the calendar widgets and drag-drop functionality.',
    location: 'Google Meet (Virtual Link)',
    start: { dateTime: getRelativeDateString(-2, 9, 30) },
    end: { dateTime: getRelativeDateString(-2, 11, 0) },
    colorId: '1',
    creator: { email: 'lead-dev@horizon.com', displayName: 'Elena Rostova' }
  },
  {
    id: 'mock-2',
    summary: '☕ Coffee Chat: Mentor catchup',
    description: 'Casual mentorship catchup with David in the downtown cafe to discuss career trajectory and tech stacks.',
    location: 'Capital Coffee Roast, 5th Ave',
    start: { dateTime: getRelativeDateString(-1, 14, 0) },
    end: { dateTime: getRelativeDateString(-1, 15, 0) },
    colorId: '5',
    creator: { email: 'david.mentor@google.com', displayName: 'David Sterling' }
  },
  {
    id: 'mock-3',
    summary: '📅 Weekly Design Review with Clients',
    description: 'Sharing wireframes, color mockups, and interaction plans with stakeholders for final signoff.',
    location: 'Design Studio Boardroom & Zoom',
    start: { dateTime: getRelativeDateString(0, 10, 0) },
    end: { dateTime: getRelativeDateString(0, 11, 30) },
    colorId: '1',
    creator: { email: 'client-rep@partner.com', displayName: 'Marcus Aurel' }
  },
  {
    id: 'mock-4',
    summary: '🏡 Weekend Hiking & Trail Exploration',
    description: 'Taking the family out to explore the newly opened state park routes. Pack lots of water and cameras!',
    location: 'Pinewood Ridge National Park Entrance',
    start: { date: getRelativeAllDayString(1) },
    end: { date: getRelativeAllDayString(2) },
    colorId: '5',
    creator: { email: 'myankimnguyen@gmail.com', displayName: 'Me' }
  },
  {
    id: 'mock-5',
    summary: '🦷 Dentist Appointment: Annual Checkup',
    description: 'Routine scaling and medical checkup appointment with Dr. Samantha. Do not forget medical documents.',
    location: 'Smiles General Dentistry Room 402',
    start: { dateTime: getRelativeDateString(2, 9, 0) },
    end: { dateTime: getRelativeDateString(2, 10, 0) },
    colorId: '5',
    creator: { email: 'dental.sched@smiles.com', displayName: 'Samantha Vance' }
  },
  {
    id: 'mock-6',
    summary: '💼 Sync with Product Marketing Lead',
    description: 'Syncing on Q3 launching deliverables and social media graphic assets distribution timeline.',
    location: 'Google Meet',
    start: { dateTime: getRelativeDateString(3, 11, 30) },
    end: { dateTime: getRelativeDateString(3, 12, 15) },
    colorId: '1',
    creator: { email: 'lead-marketing@horizon.com', displayName: 'Tanya Gomez' }
  },
  {
    id: 'mock-7',
    summary: '🍕 Dinner with College Friends',
    description: 'Long overdue reunion with the college roommates! Ordering thin-crust wood-fired pizza.',
    location: 'Gino’s Pizzeria & Lounge, West Street',
    start: { dateTime: getRelativeDateString(3, 19, 0) },
    end: { dateTime: getRelativeDateString(3, 22, 0) },
    colorId: '2',
    creator: { email: 'f.smith@gmail.com', displayName: 'Frankie Smith' }
  },
  {
    id: 'mock-8',
    summary: '📅 Technical Architecture Kickoff',
    description: 'Brainstorm session regarding server-less databases, migrations schema, and OAuth secure integrations.',
    location: 'Conference Room Alpha',
    start: { dateTime: getRelativeDateString(5, 14, 0) },
    end: { dateTime: getRelativeDateString(5, 15, 30) },
    colorId: '1',
    creator: { email: 'tech-arch@horizon.com', displayName: 'Niles Cooper' }
  }
];

export const getMockPhotos = (): GooglePhotoItem[] => [
  {
    id: 'video-today-2526',
    filename: 'active_slideshow_preview.mp4',
    description: 'Dynamic scenic landscape live video preview playing in your interactive photo slideshow.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    mimeType: 'video/mp4',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    mediaMetadata: {
      creationTime: getRelativeDateString(0, 14, 30),
      width: '1920',
      height: '1080'
    }
  },
  {
    id: 'video-june6-2026',
    filename: 'june_6_2026_scenic_drive.mp4',
    description: 'Splendid highway drive through the rolling canyon hills on a sunny June 6, 2026 afternoon.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600',
    mimeType: 'video/mp4',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    mediaMetadata: {
      creationTime: '2026-06-06T14:30:00Z',
      width: '1920',
      height: '1080'
    }
  },
  {
    id: 'photo-1',
    filename: 'design_studio_wires.jpg',
    description: 'Reviewing UI sketches during client kickoff design review session.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
    mimeType: 'image/jpeg',
    mediaMetadata: {
      creationTime: getRelativeDateString(0, 10, 15),
      width: '1200',
      height: '800',
      photo: {
        cameraMake: 'Fujifilm',
        cameraModel: 'X-T4',
        focalLength: 35,
        apertureFNumber: 1.4,
        isoEquivalent: 400,
        exposureTime: '1/120'
      }
    }
  },
  {
    id: 'photo-2',
    filename: 'misty_morning_hike.jpg',
    description: 'Exploring the trails of Pinewood Ridge during our Saturday morning hike.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
    mimeType: 'image/jpeg',
    mediaMetadata: {
      creationTime: getRelativeDateString(1, 8, 45),
      width: '1200',
      height: '900',
      photo: {
        cameraMake: 'Sony',
        cameraModel: 'Alpha 7R III',
        focalLength: 24,
        apertureFNumber: 4.0,
        isoEquivalent: 100,
        exposureTime: '1/250'
      }
    }
  },
  {
    id: 'photo-3',
    filename: 'forest_trail_sunlight.jpg',
    description: 'Glimpse of sunlight cutting through towering pine trees.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
    mimeType: 'image/jpeg',
    mediaMetadata: {
      creationTime: getRelativeDateString(1, 10, 30),
      width: '1400',
      height: '1000',
      photo: {
        cameraMake: 'Sony',
        cameraModel: 'Alpha 7R III',
        focalLength: 50,
        apertureFNumber: 2.8,
        isoEquivalent: 200,
        exposureTime: '1/320'
      }
    }
  },
  {
    id: 'photo-4',
    filename: 'latte_art_mentor_sync.jpg',
    description: 'Delicious hot vanilla latte at Capital Coffee during our discussions.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    mimeType: 'image/jpeg',
    mediaMetadata: {
      creationTime: getRelativeDateString(-1, 14, 15),
      width: '1000',
      height: '1000',
      photo: {
        cameraMake: 'Apple',
        cameraModel: 'iPhone 15 Pro Max',
        focalLength: 6,
        apertureFNumber: 1.78,
        isoEquivalent: 80,
        exposureTime: '1/50'
      }
    }
  },
  {
    id: 'photo-5',
    filename: 'office_ideation_board.jpg',
    description: 'Brainstorm session on user flows and full-stack container integrations.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    mimeType: 'image/jpeg',
    mediaMetadata: {
      creationTime: getRelativeDateString(-2, 10, 0),
      width: '1200',
      height: '800',
      photo: {
        cameraMake: 'Fujifilm',
        cameraModel: 'X-T4',
        focalLength: 18,
        apertureFNumber: 2.8,
        isoEquivalent: 800,
        exposureTime: '1/60'
      }
    }
  },
  {
    id: 'photo-6',
    filename: 'woodfire_brick_pizzas.jpg',
    description: 'Amazing hot pizzas served at Gino’s with college friends.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    mimeType: 'image/jpeg',
    mediaMetadata: {
      creationTime: getRelativeDateString(3, 19, 45),
      width: '1200',
      height: '900',
      photo: {
        cameraMake: 'Apple',
        cameraModel: 'iPhone 15 Pro Max',
        focalLength: 2,
        apertureFNumber: 2.2,
        isoEquivalent: 125,
        exposureTime: '1/33'
      }
    }
  },
  {
    id: 'photo-7',
    filename: 'cozy_coding_workspace.jpg',
    description: 'Desk setup for building custom apps in AI Studio with side panels.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
    mimeType: 'image/jpeg',
    mediaMetadata: {
      creationTime: getRelativeDateString(-4, 22, 15),
      width: '1200',
      height: '800',
      photo: {
        cameraMake: 'Sony',
        cameraModel: 'Alpha 7R III',
        focalLength: 35,
        apertureFNumber: 1.8,
        isoEquivalent: 400,
        exposureTime: '1/80'
      }
    }
  },
  {
    id: 'photo-8',
    filename: 'sunset_over_city_skyline.jpg',
    description: 'What an beautiful end to a busy production release day.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=600',
    mimeType: 'image/jpeg',
    mediaMetadata: {
      creationTime: getRelativeDateString(2, 18, 50),
      width: '1400',
      height: '900',
      photo: {
        cameraMake: 'Fujifilm',
        cameraModel: 'X-T4',
        focalLength: 50,
        apertureFNumber: 5.6,
        isoEquivalent: 160,
        exposureTime: '1/160'
      }
    }
  },
  {
    id: 'video-1',
    filename: 'scenic_ocean_cliffs.mp4',
    description: 'Breathtaking drone view of rugged ocean coast cliffs and dynamic turquoise rolling waves.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    mimeType: 'video/mp4',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    mediaMetadata: {
      creationTime: getRelativeDateString(0, 11, 0),
      width: '1920',
      height: '1080'
    }
  },
  {
    id: 'video-2',
    filename: 'forest_mist_aerial.mp4',
    description: 'Dynamic scenery of fog moving slowly through mountain forest peaks.',
    productUrl: 'https://unsplash.com',
    baseUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
    mimeType: 'video/mp4',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    mediaMetadata: {
      creationTime: getRelativeDateString(1, 14, 20),
      width: '1920',
      height: '1080'
    }
  }
];
