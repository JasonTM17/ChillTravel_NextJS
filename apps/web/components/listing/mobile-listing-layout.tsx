'use client';

import Image from 'next/image';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ListingImage {
  src: string;
  alt: string;
}

export interface ListingCardData {
  id: string;
  images: ListingImage[];
  content: ReactNode;
}

interface MobileListingLayoutProps {
  listings: ListingCardData[];
  /** Optional bottom sheet content */
  bottomSheet?: ReactNode;
}

interface SwipeableGalleryProps {
  images: ListingImage[];
  listingId: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 30; // minimum px for horizontal swipe
const BOTTOM_SHEET_DRAG_THRESHOLD = 50; // minimum px for vertical drag

// ─── Swipeable Gallery ───────────────────────────────────────────────────────

function SwipeableGallery({ images, listingId }: SwipeableGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: ReactTouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: ReactTouchEvent) => {
    if (!touchStartRef.current || !scrollRef.current) return;

    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > deltaY) {
      if (deltaX < 0 && activeIndex < images.length - 1) {
        // Swipe left → next image
        setActiveIndex((prev) => prev + 1);
      } else if (deltaX > 0 && activeIndex > 0) {
        // Swipe right → previous image
        setActiveIndex((prev) => prev - 1);
      }
    }

    touchStartRef.current = null;
  };

  // Scroll to active image with snap
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const imageWidth = container.offsetWidth;
      container.scrollTo({
        left: activeIndex * imageWidth,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  // Sync activeIndex on manual scroll (snap)
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const imageWidth = container.offsetWidth;
    if (imageWidth === 0) return;
    const newIndex = Math.round(container.scrollLeft / imageWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, images.length]);

  if (images.length === 0) {
    return <div className="aspect-[4/3] w-full bg-sky-surface" aria-hidden="true" />;
  }

  return (
    <div className="relative">
      {/* Scrollable image container */}
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
        role="region"
        aria-label={`Image gallery for listing ${listingId}`}
        aria-roledescription="carousel"
      >
        {images.map((image, index) => (
          <div
            key={`${listingId}-img-${index}`}
            className="aspect-[4/3] w-full flex-shrink-0 snap-center"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${images.length}`}
          >
            <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div
          className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5"
          aria-hidden="true"
        >
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bottom Sheet ────────────────────────────────────────────────────────────

interface BottomSheetProps {
  children: ReactNode;
}

function BottomSheet({ children }: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartRef = useRef<{ y: number } | null>(null);

  const handleTouchStart = (e: ReactTouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { y: touch.clientY };
  };

  const handleTouchEnd = (e: ReactTouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaY = touch.clientY - touchStartRef.current.y;

    if (Math.abs(deltaY) >= BOTTOM_SHEET_DRAG_THRESHOLD) {
      if (deltaY < 0) {
        // Drag up → expand
        setIsExpanded(true);
      } else {
        // Drag down → collapse
        setIsExpanded(false);
      }
    }

    touchStartRef.current = null;
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-white shadow-lg transition-transform duration-300 md:hidden ${
        isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-4rem)]'
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Bottom sheet"
    >
      {/* Drag handle */}
      <div className="flex justify-center py-2" aria-hidden="true">
        <div className="h-1 w-10 rounded-full bg-border" />
      </div>

      {/* Content */}
      <div className="max-h-[70vh] overflow-y-auto px-4 pb-4">{children}</div>
    </div>
  );
}

// ─── Main Layout Component ───────────────────────────────────────────────────

export function MobileListingLayout({ listings, bottomSheet }: MobileListingLayoutProps) {
  return (
    <div className="w-full md:hidden">
      {/* Single-column full-width cards */}
      <div className="flex flex-col gap-4">
        {listings.map((listing) => (
          <article
            key={listing.id}
            className="overflow-hidden rounded-xl border border-border bg-white shadow-card"
          >
            {/* Swipeable image gallery */}
            <div className="relative">
              <SwipeableGallery images={listing.images} listingId={listing.id} />
            </div>

            {/* Card content */}
            <div className="p-4">{listing.content}</div>
          </article>
        ))}
      </div>

      {/* Optional bottom sheet */}
      {bottomSheet && <BottomSheet>{bottomSheet}</BottomSheet>}
    </div>
  );
}
