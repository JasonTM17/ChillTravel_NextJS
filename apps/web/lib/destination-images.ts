/**
 * Real Unsplash photos mapped to destination slugs.
 * All images are free to use under the Unsplash License.
 * Source: https://unsplash.com
 */

const BASE = 'https://images.unsplash.com';
const Q = 'auto=format&fit=crop&w=1400&q=80';

const fallbackImage = `${BASE}/photo-1528127269322-539801943592?${Q}`;

// ─── Destination images (keyed by slug from DB) ──────────────────────────────
const destinationImages: Record<string, string> = {
  // ── Vietnam ──────────────────────────────────────────────────────────────
  'ha-noi': `${BASE}/photo-1509030450996-dd1a26dda07a?${Q}`, // Hoan Kiem Lake, Hanoi
  'ha-long-bay': `${BASE}/photo-1528127269322-539801943592?${Q}`, // Ha Long Bay limestone karsts
  'ha-long': `${BASE}/photo-1528127269322-539801943592?${Q}`, // alias
  sapa: `${BASE}/photo-1573408301185-9519f94f4e8e?${Q}`, // Sapa rice terraces
  'ninh-binh': `${BASE}/photo-1596422846543-75c6fc197f07?${Q}`, // Trang An, Ninh Binh
  hue: `${BASE}/photo-1583417319070-4a69db38a482?${Q}`, // Hue Imperial City
  'da-nang': `${BASE}/photo-1559592413-7cec4d0cae2b?${Q}`, // Da Nang beach & bridge
  'hoi-an': `${BASE}/photo-1555400038-63f5ba517a47?${Q}`, // Hoi An lantern street
  'nha-trang': `${BASE}/photo-1507525428034-b723cf961d3e?${Q}`, // Nha Trang beach
  'da-lat': `${BASE}/photo-1558618666-fcd25c85cd64?${Q}`, // Da Lat flower valley
  'phu-quoc': `${BASE}/photo-1540202404-a2f29564651f?${Q}`, // Phu Quoc turquoise water
  'can-tho': `${BASE}/photo-1583417319070-4a69db38a482?${Q}`, // Mekong Delta floating market
  'ha-giang': `${BASE}/photo-1573408301185-9519f94f4e8e?${Q}`, // Ha Giang mountain pass

  // ── Asia ─────────────────────────────────────────────────────────────────
  tokyo: `${BASE}/photo-1540959733332-eab4deabeeaf?${Q}`, // Tokyo skyline at night
  seoul: `${BASE}/photo-1538485399081-7c8edcb4a11e?${Q}`, // Seoul Gyeongbokgung Palace
  bangkok: `${BASE}/photo-1508009603885-50cf7c579365?${Q}`, // Bangkok Wat Arun temple
  singapore: `${BASE}/photo-1525625293386-3f8f99389edd?${Q}`, // Singapore Marina Bay Sands
  bali: `${BASE}/photo-1537996194471-e657df975ab4?${Q}`, // Bali rice terraces Tegallalang
  kyoto: `${BASE}/photo-1493976040374-85c8e12f0c0e?${Q}`, // Kyoto bamboo grove
  osaka: `${BASE}/photo-1590559899731-a382839e5549?${Q}`, // Osaka Dotonbori
  'hong-kong': `${BASE}/photo-1536599018102-9f803c140fc1?${Q}`, // Hong Kong skyline

  // ── Europe ───────────────────────────────────────────────────────────────
  paris: `${BASE}/photo-1502602898657-3e91760cbb34?${Q}`, // Paris Eiffel Tower
  rome: `${BASE}/photo-1525874684015-58379d421a52?${Q}`, // Rome Colosseum
  barcelona: `${BASE}/photo-1539037116277-4db20889f2d4?${Q}`, // Barcelona Sagrada Familia
  london: `${BASE}/photo-1513635269975-59663e0ac1ad?${Q}`, // London Tower Bridge
  amsterdam: `${BASE}/photo-1534351590666-13e3e96b5017?${Q}`, // Amsterdam canals
  santorini: `${BASE}/photo-1570077188670-e3a8d69ac5ff?${Q}`, // Santorini blue domes
  'swiss-alps': `${BASE}/photo-1506905925346-21bda4d32df4?${Q}`, // Swiss Alps Matterhorn
  prague: `${BASE}/photo-1541849546-216549ae216d?${Q}`, // Prague Old Town

  // ── Americas & Oceania ───────────────────────────────────────────────────
  'new-york': `${BASE}/photo-1485871981521-5b1fd3805eee?${Q}`, // New York Manhattan skyline
  sydney: `${BASE}/photo-1506973035872-a4ec16b8e8d9?${Q}`, // Sydney Opera House
  dubai: `${BASE}/photo-1512453979798-5ea266f8880c?${Q}`, // Dubai Burj Khalifa
};

// ─── Tour images (keyed by tour slug) ────────────────────────────────────────
const tourImages: Record<string, string> = {
  'northern-vietnam-adventure': `${BASE}/photo-1573408301185-9519f94f4e8e?${Q}`, // Sapa rice terraces trekking
  'central-vietnam-heritage-tour': `${BASE}/photo-1555400038-63f5ba517a47?${Q}`, // Hoi An ancient town
  'phu-quoc-beach-escape': `${BASE}/photo-1540202404-a2f29564651f?${Q}`, // Phu Quoc crystal water
  'ha-giang-motorbike-adventure': `${BASE}/photo-1596422846543-75c6fc197f07?${Q}`, // Mountain road adventure
  'bali-luxury-retreat': `${BASE}/photo-1537996194471-e657df975ab4?${Q}`, // Bali rice terraces
  'japan-spring-discovery': `${BASE}/photo-1493976040374-85c8e12f0c0e?${Q}`, // Japan cherry blossom
  'thailand-city-island-tour': `${BASE}/photo-1508009603885-50cf7c579365?${Q}`, // Bangkok temple
  'europe-romantic-journey': `${BASE}/photo-1502602898657-3e91760cbb34?${Q}`, // Paris Eiffel Tower
  'nha-trang-diving-adventure': `${BASE}/photo-1507525428034-b723cf961d3e?${Q}`, // Nha Trang diving beach
  'hue-imperial-heritage': `${BASE}/photo-1583417319070-4a69db38a482?${Q}`, // Hue Imperial City
  'mekong-delta-discovery': `${BASE}/photo-1583417319070-4a69db38a482?${Q}`, // Mekong Delta floating market
  'seoul-k-culture-tour': `${BASE}/photo-1538485399081-7c8edcb4a11e?${Q}`, // Seoul Gyeongbokgung
  'singapore-city-explorer': `${BASE}/photo-1525625293386-3f8f99389edd?${Q}`, // Singapore Marina Bay
  'london-classic-tour': `${BASE}/photo-1513635269975-59663e0ac1ad?${Q}`, // London Tower Bridge
};

export function getDestinationImage(slug: string): string {
  return destinationImages[slug] ?? fallbackImage;
}

export function getTourImage(slug: string): string {
  return tourImages[slug] ?? fallbackImage;
}

export function getEditorialHeroImage(): string {
  return `${BASE}/photo-1528127269322-539801943592?${Q}`;
}

export function getStayDealImage(): string {
  return `${BASE}/photo-1566073771259-6a8506099945?${Q}`; // luxury resort pool
}

export function getExperienceDealImage(): string {
  return `${BASE}/photo-1555400038-63f5ba517a47?${Q}`; // Hoi An lanterns experience
}
