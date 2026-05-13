'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Locale } from '@/lib/i18n/types';
import { useLocale } from '@/lib/i18n/use-locale';

// ─── Locale Metadata ─────────────────────────────────────────────────────────

interface LocaleOption {
  code: Locale;
  flag: string;
  nativeName: string;
}

const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'vi', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'en', flag: '🇬🇧', nativeName: 'English' },
  { code: 'ja', flag: '🇯🇵', nativeName: '日本語' },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface LanguageSwitcherProps {
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * LanguageSwitcher — Accessible dropdown for switching between vi/en/ja locales.
 *
 * Features:
 * - Displays current locale as flag + code in the header
 * - Dropdown with native names and flag icons
 * - Full keyboard navigation (Tab, Enter, Space, Arrow Up/Down, Escape)
 * - ARIA role="listbox" with aria-selected on active option
 * - Live region announcement on language change
 * - Closes on Escape or outside click without changing locale
 */
export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const currentOption = LOCALE_OPTIONS.find((opt) => opt.code === locale) ?? LOCALE_OPTIONS[0]!;
  const currentIndex = LOCALE_OPTIONS.findIndex((opt) => opt.code === locale);

  // ─── Open / Close Handlers ───────────────────────────────────────────────

  const openDropdown = useCallback(() => {
    setIsOpen(true);
    setFocusedIndex(currentIndex);
  }, [currentIndex]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    // Return focus to trigger button
    triggerRef.current?.focus();
  }, []);

  const selectLocale = useCallback(
    (newLocale: Locale) => {
      setLocale(newLocale);
      const selected = LOCALE_OPTIONS.find((opt) => opt.code === newLocale);
      if (selected) {
        setAnnouncement(`Language changed to ${selected.nativeName}`);
      }
      closeDropdown();
    },
    [setLocale, closeDropdown],
  );

  // ─── Outside Click ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeDropdown]);

  // ─── Keyboard Navigation ───────────────────────────────────────────────────

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        openDropdown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(LOCALE_OPTIONS.length - 1);
        break;
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev < LOCALE_OPTIONS.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : LOCALE_OPTIONS.length - 1));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < LOCALE_OPTIONS.length) {
          const option = LOCALE_OPTIONS[focusedIndex];
          if (option) selectLocale(option.code);
        }
        break;
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
      case 'Tab':
        // Close dropdown on Tab out
        closeDropdown();
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(LOCALE_OPTIONS.length - 1);
        break;
    }
  };

  // ─── Focus Management ──────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.focus();
    }
  }, [isOpen]);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const optionEl = listRef.current?.children[focusedIndex] as HTMLElement | undefined;
      optionEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, focusedIndex]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Language: ${currentOption.nativeName}. Click to change language.`}
        className="inline-flex items-center gap-1.5 rounded-tv-sm border border-border bg-white px-3 py-1.5 text-tv-sm font-semibold text-ink transition-colors hover:border-booking-blue hover:text-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue focus:ring-offset-1"
      >
        <span aria-hidden="true" className="text-base leading-none">
          {currentOption.flag}
        </span>
        <span className="uppercase">{currentOption.code}</span>
      </button>

      {/* Dropdown Listbox */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Select language"
          aria-activedescendant={
            focusedIndex >= 0
              ? `language-option-${LOCALE_OPTIONS[focusedIndex]?.code ?? ''}`
              : undefined
          }
          tabIndex={0}
          onKeyDown={handleListKeyDown}
          className="absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-tv border border-border bg-white shadow-card focus:outline-none"
        >
          {LOCALE_OPTIONS.map((option, index) => {
            const isSelected = option.code === locale;
            const isFocused = index === focusedIndex;

            return (
              <li
                key={option.code}
                id={`language-option-${option.code}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectLocale(option.code)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-tv-base transition-colors ${
                  isFocused ? 'bg-sky-surface' : ''
                } ${isSelected ? 'font-semibold text-booking-blue' : 'text-ink'}`}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  {option.flag}
                </span>
                <span className="flex-1">{option.nativeName}</span>
                {isSelected && (
                  <svg
                    className="h-4 w-4 text-booking-blue"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Live Region for Screen Reader Announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
