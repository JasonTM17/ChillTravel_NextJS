import { destinations } from '@vietwander/shared';
import { getDestinationCopy } from './destination-copy';

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function getFeaturedDestinations() {
  return destinations.filter((destination) => destination.isFeatured).slice(0, 8);
}

export function getDestinationBySlug(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function filterDestinations(query: string) {
  const normalized = normalizeSearch(query);
  return destinations.filter((destination) => {
    const copy = getDestinationCopy(destination);
    return normalizeSearch(
      [
        copy.name,
        copy.country,
        copy.city,
        copy.summary,
        destination.slug,
        destination.tags.join(' '),
      ].join(' '),
    ).includes(normalized);
  });
}
