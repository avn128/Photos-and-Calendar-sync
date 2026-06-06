import { GooglePhotoItem } from '../types';

export const generatePhotosForAlbum = (albumName: string, date: Date = new Date()): GooglePhotoItem[] => {
  const query = albumName.toLowerCase();
  
  // High quality premium Unsplash URLs based on matches
  let urls = [
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600', // aesthetic leaves
    'https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&q=80&w=600', // ocean
    'https://images.unsplash.com/photo-1470240971209-62ee5b52a12d?auto=format&fit=crop&q=80&w=600', // warm forest sunset
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600', // dynamic creative abstract
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'  // clean red sneaker layout
  ];

  if (query.includes('beach') || query.includes('sea') || query.includes('ocean') || query.includes('summer') || query.includes('water') || query.includes('surf')) {
    urls = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600', // majestic sandy beach sunset
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600', // scenic coastal beach retreat
      'https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&q=80&w=600', // turquoise clear ocean wave
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600', // warm tropical lagoon
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600'  // palm trees silhouettes
    ];
  } else if (query.includes('mountain') || query.includes('hike') || query.includes('trail') || query.includes('trek') || query.includes('nature') || query.includes('forest') || query.includes('camp') || query.includes('sky')) {
    urls = [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600', // epic snow capped mountains
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600', // sunny deep green forest trail
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=600', // scenic hiking overlooking ranges
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&q=80&w=600', // meadows valley landscape
      'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&q=80&w=600'  // wilderness forest campfire logs
    ];
  } else if (query.includes('paris') || query.includes('europe') || query.includes('vacation') || query.includes('travel') || query.includes('trip') || query.includes('city') || query.includes('culture')) {
    urls = [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600', // classic eiffel tower street scene
      'https://images.unsplash.com/photo-1499856126468-b515f855be71?auto=format&fit=crop&q=80&w=600', // french gothic architecture bridge
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=600', // gleaming central manhattan skyscrapers
      'https://images.unsplash.com/photo-1522083165195-3427ec02927a?auto=format&fit=crop&q=80&w=600', // historic cobbled roman streets
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600'  // romantic london street red telephone booth
    ];
  } else if (query.includes('family') || query.includes('friends') || query.includes('party') || query.includes('love') || query.includes('wedding') || query.includes('dinner') || query.includes('meet') || query.includes('people')) {
    urls = [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600', // diverse friends enjoying dinner party
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600', // cozy family reunion outdoors
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600', // warm campfire marshmallows laughter
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600', // joyful wedding celebration toasts
      'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?auto=format&fit=crop&q=80&w=600'  // happy groups exploring city park
    ];
  }

  return urls.map((url, index) => {
    const photoDate = new Date(date);
    photoDate.setDate(photoDate.getDate() - (index % 5)); // Spread dates within past week automatically
    photoDate.setHours(9 + index * 2, 12 * index, 0, 0);

    return {
      id: `shared-album-${albumName.replace(/\s+/g, '-').toLowerCase()}-${index}-${Date.now().toString().slice(-4)}`,
      filename: `${albumName.replace(/\s+/g, '_').toLowerCase()}_0${index + 1}.jpg`,
      description: `Synced memories from your connected "${albumName}" shared album URL stream.`,
      productUrl: 'https://photos.google.com',
      baseUrl: url,
      mimeType: 'image/jpeg',
      mediaMetadata: {
        creationTime: photoDate.toISOString(),
        width: '1200',
        height: '900',
        photo: {
          cameraMake: index % 2 === 0 ? 'Canon' : 'Sony',
          cameraModel: index % 2 === 0 ? 'EOS R5' : 'Alpha 7R V',
          focalLength: 24 + index * 10,
          apertureFNumber: 1.8,
          isoEquivalent: 100,
          exposureTime: '1/160'
        }
      }
    };
  });
};
