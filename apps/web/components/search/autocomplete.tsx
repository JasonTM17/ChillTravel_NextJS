'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { useLocale } from '@/lib/i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AutocompleteSuggestion {
  id: string;
  label: string;
  sublabel?: string;
}

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AutocompleteSuggestion) => void;
  fetchSuggestions: (query: string) => Promise<AutocompleteSuggestion[]>;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 500;
const MIN_CHARS = 2;
const MAX_SUGGESTIONS = 8;

// ─── Component ───────────────────────────────────────────────────────────────

export function Autocomplete({
  value,
  onChange,
  onSelect,
  fetchSuggestions,
  placeholder,
  label,
  id = 'autocomplete',
  className = '',
}: AutocompleteProps) {
  const { t } = useLocale();
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Debounced Fetch ─────────────────────────────────────────────────

  const debouncedFetch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (query.length < MIN_CHARS) {
        setSuggestions([]);
        setIsOpen(false);
        setHasSearched(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await fetchSuggestions(query);
          const limited = results.slice(0, MAX_SUGGESTIONS);
          setSuggestions(limited);
          setIsOpen(true);
          setHasSearched(true);
          setActiveIndex(-1);
        } catch {
          setSuggestions([]);
          setHasSearched(true);
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_MS);
    },
    [fetchSuggestions],
  );

  // ─── Cleanup debounce on unmount ─────────────────────────────────────

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedFetch(newValue);
  };

  const handleSelect = (suggestion: AutocompleteSuggestion) => {
    onChange(suggestion.label);
    onSelect(suggestion);
    setIsOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          const suggestion = suggestions[activeIndex];
          if (suggestion) handleSelect(suggestion);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // ─── Scroll active item into view ────────────────────────────────────

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      activeItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // ─── Close on outside click ──────────────────────────────────────────

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────

  const listboxId = `${id}-listbox`;
  const showNoResults = isOpen && hasSearched && suggestions.length === 0 && !isLoading;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs font-medium text-muted-ink">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted-ink focus:border-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue/20"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-booking-blue" />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-white shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`cursor-pointer px-3 py-2.5 text-sm transition-colors ${
                index === activeIndex
                  ? 'bg-sky-surface text-booking-blue'
                  : 'text-ink hover:bg-sky-surface/50'
              }`}
            >
              <span className="block font-medium">{suggestion.label}</span>
              {suggestion.sublabel && (
                <span className="block text-xs text-muted-ink">{suggestion.sublabel}</span>
              )}
            </li>
          ))}

          {/* No results message */}
          {showNoResults && (
            <li className="px-3 py-3 text-center text-sm text-muted-ink">{t.common.noResults}</li>
          )}
        </ul>
      )}
    </div>
  );
}
