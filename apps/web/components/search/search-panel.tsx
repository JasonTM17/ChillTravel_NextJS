'use client';

import { Hotel, Plane, Map, Sparkles, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '@/lib/i18n';
import { FlightSearchForm } from './flight-search-form';
import { HotelSearchForm } from './hotel-search-form';
import { MobileSearchOverlay } from './mobile-search-overlay';

// ─── Types ───────────────────────────────────────────────────────────────────

type SearchTab = 'hotels' | 'flights' | 'tours' | 'experiences';

interface RecentSearch {
  id: string;
  type: SearchTab;
  destination: string;
  dateFrom: string;
  dateTo: string;
  timestamp: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const RECENT_SEARCHES_KEY = 'wanderviet-recent-searches';
const MAX_RECENT_SEARCHES = 5;

// ─── Tab Configuration ───────────────────────────────────────────────────────

const TAB_CONFIG = [
  { id: 'hotels' as const, icon: Hotel, labelKey: 'hotels' as const },
  { id: 'flights' as const, icon: Plane, labelKey: 'flights' as const },
  { id: 'tours' as const, icon: Map, labelKey: 'tours' as const },
  { id: 'experiences' as const, icon: Sparkles, labelKey: 'experiences' as const },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

function removeRecentSearch(id: string): RecentSearch[] {
  const searches = getRecentSearches().filter((s) => s.id !== id);
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
    // Silently fail
  }
  return searches;
}

function getTabIcon(type: SearchTab) {
  const config = TAB_CONFIG.find((t) => t.id === type);
  return config?.icon ?? Hotel;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SearchPanel() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<SearchTab>('hotels');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleRemoveRecent = useCallback((id: string) => {
    const updated = removeRecentSearch(id);
    setRecentSearches(updated);
  }, []);

  const router = useRouter();

  const handleSearch = useCallback(() => {
    if (activeTab === 'tours') {
      router.push('/tours');
    } else if (activeTab === 'experiences') {
      router.push('/experiences');
    }
  }, [activeTab, router]);

  // ─── Shared search panel content ──────────────────────────────────────────

  const searchPanelContent = (
    <>
      {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
      <div
        className="flex border-b border-border overflow-x-auto"
        role="tablist"
        aria-label={t.common.search}
      >
        {TAB_CONFIG.map(({ id, icon: Icon, labelKey }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${id}`}
              id={`tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={`
                relative flex flex-1 items-center justify-center gap-2
                px-3 py-3 text-sm font-semibold transition-colors
                md:flex-none md:px-5 md:py-4 md:text-tv-base
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-booking-blue focus-visible:ring-offset-2
                ${isActive ? 'text-booking-blue' : 'text-muted-ink hover:text-ink'}
              `}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{t.nav[labelKey]}</span>
              {/* Active underline indicator */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t bg-booking-blue"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="p-4 md:p-6"
      >
        {/* Search form placeholder — actual forms will be implemented in next tasks */}
        <div className="flex flex-col gap-4">
          {activeTab === 'hotels' && <HotelSearchForm />}
          {activeTab === 'flights' && <FlightSearchForm />}
          {activeTab === 'tours' && <TourSearchPlaceholder t={t} />}
          {activeTab === 'experiences' && <ExperienceSearchPlaceholder t={t} />}

          {/* ── Orange CTA Button (only for non-form tabs) ───────────── */}
          {activeTab !== 'hotels' && activeTab !== 'flights' && (
            <button
              onClick={handleSearch}
              className="
                w-full rounded-tv-lg bg-orange-cta px-6 py-3
                text-sm font-bold text-white
                transition-colors hover:brightness-110 active:brightness-95
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-cta focus-visible:ring-offset-2
                md:ml-auto md:w-auto md:min-w-[120px] md:self-end
              "
            >
              {t.common.search}
            </button>
          )}
        </div>
      </div>

      {/* ── Recent Searches ─────────────────────────────────────────────── */}
      {recentSearches.length > 0 && (
        <div className="border-t border-border px-4 py-3 md:px-6 md:py-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-ink">
            {t.search.recentSearches}
          </h3>
          <ul className="flex flex-col gap-2" aria-label={t.search.recentSearches}>
            {recentSearches.map((search) => {
              const TypeIcon = getTabIcon(search.type);
              return (
                <li
                  key={search.id}
                  className="
                    group flex items-center gap-3 rounded-tv px-3 py-2
                    transition-colors hover:bg-sky-surface
                  "
                >
                  <TypeIcon size={16} className="shrink-0 text-booking-blue" aria-hidden="true" />
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate text-sm font-medium text-ink">
                      {search.destination}
                    </span>
                    <span className="hidden shrink-0 text-xs text-muted-ink sm:inline">
                      {search.dateFrom} — {search.dateTo}
                    </span>
                  </div>
                  <Clock size={12} className="shrink-0 text-muted-ink" aria-hidden="true" />
                  <button
                    onClick={() => handleRemoveRecent(search.id)}
                    className="
                      ml-1 shrink-0 rounded p-1 text-muted-ink opacity-0
                      transition-opacity hover:bg-border hover:text-ink
                      group-hover:opacity-100
                      focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-booking-blue
                    "
                    aria-label={`${t.common.delete} ${search.destination}`}
                  >
                    <X size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* ── Mobile: Collapsed bar + full-screen overlay (<768px) ─────────── */}
      <div className="md:hidden">
        <MobileSearchOverlay summary={t.search.destination}>
          {searchPanelContent}
        </MobileSearchOverlay>
      </div>

      {/* ── Desktop: Full search panel (≥768px) ─────────────────────────── */}
      <section
        className="hidden w-full rounded-[12px] bg-white shadow-card md:block md:rounded-[16px]"
        aria-label={t.common.search}
      >
        {searchPanelContent}
      </section>
    </>
  );
}

// ─── Search Form Placeholders ────────────────────────────────────────────────
// These will be replaced with full form implementations in subsequent tasks.

interface PlaceholderProps {
  t: ReturnType<typeof useLocale>['t'];
}

function TourSearchPlaceholder({ t }: PlaceholderProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <PlaceholderField label={t.search.destination} />
      <PlaceholderField label={t.search.departureDate} />
      <PlaceholderField label={t.search.guestsCount} />
    </div>
  );
}

function ExperienceSearchPlaceholder({ t }: PlaceholderProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <PlaceholderField label={t.search.destination} />
      <PlaceholderField label={t.search.departureDate} />
      <PlaceholderField label={t.search.guestsCount} />
    </div>
  );
}

function PlaceholderField({ label }: { label: string }) {
  return (
    <div className="rounded-tv border border-border bg-sky-surface/40 px-3 py-3">
      <span className="text-xs font-medium text-muted-ink">{label}</span>
      <div className="mt-1 h-5 w-3/4 animate-pulse rounded bg-border/60" />
    </div>
  );
}
