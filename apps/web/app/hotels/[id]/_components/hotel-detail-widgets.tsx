import { type RoomOffer } from '@vietwander/shared';
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Car,
  Dumbbell,
  MapPin,
  Sparkles,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback, useEffect, useRef } from 'react';
import { CommerceSurface, StatusPill, TrustBanner } from '@/components/commerce-primitives';
import { getDestinationImage } from '@/lib/destination-images';
import { useLocale } from '@/lib/i18n';
import { formatVnd } from '@/lib/utils';

// ─── Mock Data Generators ────────────────────────────────────────────────────

export function generateGalleryImages(destinationSlug: string, count: number): string[] {
  const base = 'https://images.unsplash.com';
  const q = 'auto=format&fit=crop&w=1200&q=80';
  const photoIds = [
    'photo-1566073771259-6a8506099945',
    'photo-1582719508461-905c673771fd',
    'photo-1571896349842-33c89424de2d',
    'photo-1520250497591-112f2f40a3f4',
    'photo-1551882547-ff40c63fe5fa',
    'photo-1564501049412-61c2a3083791',
    'photo-1542314831-068cd1dbfeeb',
    'photo-1445019980597-93fa8acb246c',
    'photo-1584132967334-10e028bd69f7',
    'photo-1578683010236-d716f9a3f461',
    'photo-1563911302283-d2bc129e7570',
    'photo-1568084680786-a84f91d1153c',
    'photo-1596394516093-501ba68a0ba6',
    'photo-1611892440504-42a792e24d32',
    'photo-1590490360182-c33d57733427',
    'photo-1618773928121-c32f3e5e0e0f',
    'photo-1585409677983-0f6c41ca9c3b',
    'photo-1600596542815-ffad4c1539a9',
    'photo-1512918728675-ed5a9ecdebfd',
    'photo-1578774204375-826dc5d996ed',
    'photo-1560448204-e02f11c3d0e2',
    'photo-1522798514-97ceb8c4f1c8',
    'photo-1551016043-7a7a8e0e3c3e',
    'photo-1600585154340-be6161a56a0c',
    'photo-1587381420270-3e1a5b9e6904',
    'photo-1540541338287-41700207dee6',
    'photo-1580587771525-78b9dba3b914',
    'photo-1613490493576-7fde63acd811',
    'photo-1602002418816-5c0aeef426aa',
    'photo-1615460549969-36fa19521a4f',
  ];

  const images = [getDestinationImage(destinationSlug)];
  for (let i = 0; i < Math.min(count - 1, photoIds.length); i++) {
    images.push(`${base}/${photoIds[i]}?${q}`);
  }
  return images.slice(0, count);
}

export interface MockReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export function generateMockReviews(hotelName: string, count: number): MockReview[] {
  const authors = [
    'Nguyễn Văn A',
    'Trần Thị B',
    'Lê Minh C',
    'Phạm Hồng D',
    'Hoàng Anh E',
    'Vũ Thị F',
    'Đặng Quốc G',
    'Bùi Thanh H',
    'Ngô Thị I',
    'Dương Văn K',
    'Lý Thị L',
    'Trịnh Minh M',
    'Hà Văn N',
    'Đinh Thị O',
    'Phan Quốc P',
    'Mai Thị Q',
    'Tạ Văn R',
    'Chu Thị S',
    'Đỗ Minh T',
    'Lương Thị U',
    'Cao Văn V',
    'Tô Thị W',
    'Huỳnh Văn X',
    'Võ Thị Y',
    'Trương Văn Z',
    'Nguyễn Thị AA',
    'Trần Văn BB',
    'Lê Thị CC',
    'Phạm Văn DD',
    'Hoàng Thị EE',
  ];
  const comments = [
    `Phòng sạch sẽ, nhân viên thân thiện. ${hotelName} rất đáng để quay lại.`,
    'Vị trí thuận tiện, gần trung tâm. Giá cả hợp lý cho chất lượng nhận được.',
    'Bữa sáng ngon, view đẹp. Sẽ giới thiệu cho bạn bè.',
    'Dịch vụ tốt, phòng rộng rãi. Hơi ồn vào buổi tối nhưng chấp nhận được.',
    'Tuyệt vời! Mọi thứ đều hoàn hảo từ check-in đến check-out.',
    'Khách sạn đẹp, tiện nghi đầy đủ. Hồ bơi rất thoải mái.',
    'Nhân viên nhiệt tình, hỗ trợ nhanh chóng. Phòng tắm sạch sẽ.',
    'Giá hơi cao so với kỳ vọng nhưng chất lượng ổn.',
    'Rất hài lòng với trải nghiệm. Đặc biệt thích khu vực spa.',
    'Phòng có mùi hơi ẩm nhưng nhân viên đã xử lý nhanh.',
    'Đồ ăn ngon, đa dạng. Phòng gym đầy đủ thiết bị.',
    'Check-in nhanh, phòng đúng như mô tả. Sẽ đặt lại lần sau.',
    'Vị trí tuyệt vời để khám phá thành phố. Gần các điểm tham quan.',
    'Phòng nhỏ hơn mong đợi nhưng sạch sẽ và tiện nghi.',
    'Trải nghiệm tuyệt vời cho gia đình. Trẻ em rất thích hồ bơi.',
  ];

  const reviews: MockReview[] = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: `review-${i}`,
      author: authors[i % authors.length]!,
      rating: 7 + Math.round((Math.sin(i * 1.5) + 1) * 1.5 * 10) / 10,
      date: `${String(Math.max(1, (i * 3 + 5) % 28)).padStart(2, '0')}/0${(i % 9) + 1}/2024`,
      comment: comments[i % comments.length]!,
    });
  }
  return reviews;
}

// ─── Amenity Icon Map ────────────────────────────────────────────────────────

const AMENITY_ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  'Hồ bơi': Waves,
  Wifi: Wifi,
  'Wi-Fi': Wifi,
  'Bãi đỗ xe': Car,
  'Nhà hàng': UtensilsCrossed,
  'Phòng gym': Dumbbell,
  Spa: Sparkles,
  'Ăn sáng mẫu': Coffee,
  'Bữa sáng địa phương': Coffee,
  'Gần biển': Waves,
  'Xe đạp mẫu': Car,
};

function getAmenityIcon(amenity: string) {
  return AMENITY_ICON_MAP[amenity] ?? Sparkles;
}

// ─── Photo Gallery Carousel ──────────────────────────────────────────────────

export function PhotoGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const { t } = useLocale();

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  return (
    <>
      <div className="relative overflow-hidden rounded-tv-lg">
        <div
          className="relative aspect-[16/9] w-full cursor-pointer bg-cover bg-center md:aspect-[2.2/1]"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
          onClick={() => setShowFullscreen(true)}
          role="button"
          tabIndex={0}
          aria-label={`${t.hotel.photoGallery} - ${currentIndex + 1}/${images.length}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setShowFullscreen(true);
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-tv-card transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-tv-card transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {images.slice(0, 8).map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-16 w-24 shrink-0 rounded-tv-sm bg-cover bg-center transition-all ${
              idx === currentIndex
                ? 'ring-2 ring-booking-blue ring-offset-2'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundImage: `url(${img})` }}
            aria-label={`View image ${idx + 1}`}
          />
        ))}
        {images.length > 8 && (
          <button
            onClick={() => setShowFullscreen(true)}
            className="flex h-16 w-24 shrink-0 items-center justify-center rounded-tv-sm bg-gray-100 text-xs font-bold text-muted-ink"
          >
            +{images.length - 8} ảnh
          </button>
        )}
      </div>

      {showFullscreen && (
        <GalleryFullscreen
          images={images}
          currentIndex={currentIndex}
          onPrev={goToPrev}
          onNext={goToNext}
          onClose={() => setShowFullscreen(false)}
        />
      )}
    </>
  );
}

// ─── Amenity Grid ────────────────────────────────────────────────────────────

export function AmenityGrid({ amenities }: { amenities: string[] }) {
  const { t } = useLocale();

  return (
    <CommerceSurface>
      <h2 className="text-xl font-bold">{t.hotel.amenities}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {amenities.map((amenity) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <div
              key={amenity}
              className="flex items-center gap-2 rounded-tv bg-sky-surface p-3 text-sm font-medium text-ink"
            >
              <Icon size={18} className="shrink-0 text-booking-blue" aria-hidden="true" />
              <span className="line-clamp-1">{amenity}</span>
            </div>
          );
        })}
      </div>
    </CommerceSurface>
  );
}

// ─── Gallery Fullscreen with scroll lock + focus trap ────────────────────────

function GalleryFullscreen({
  images,
  currentIndex,
  onPrev,
  onNext,
  onClose,
}: {
  images: string[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'Tab') {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          'button, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      tabIndex={-1}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
        aria-label="Previous image"
      >
        <ChevronLeft size={28} />
      </button>
      <div
        className="mx-16 aspect-[16/9] w-full max-w-5xl bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      />
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
        aria-label="Next image"
      >
        <ChevronRight size={28} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// ─── Location Map ────────────────────────────────────────────────────────────

export function LocationMap({ address, hotelName }: { address: string; hotelName: string }) {
  return (
    <CommerceSurface>
      <h2 className="text-xl font-bold">Vị trí</h2>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted-ink">
        <MapPin size={16} className="shrink-0 text-booking-blue" aria-hidden="true" />
        {address}
      </p>
      <div className="mt-4 overflow-hidden rounded-tv-lg">
        <div
          className="flex h-48 items-center justify-center bg-sky-surface text-sm text-muted-ink md:h-64"
          aria-label={`Map showing location of ${hotelName}`}
        >
          <div className="text-center">
            <MapPin size={32} className="mx-auto text-booking-blue" aria-hidden="true" />
            <p className="mt-2 font-medium">{hotelName}</p>
            <p className="mt-1 text-xs text-muted-ink">{address}</p>
          </div>
        </div>
      </div>
    </CommerceSurface>
  );
}

// ─── Guest Reviews ───────────────────────────────────────────────────────────

const REVIEWS_PER_PAGE = 10;

export function GuestReviews({ reviews }: { reviews: MockReview[] }) {
  const [page, setPage] = useState(1);
  const { t } = useLocale();

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  return (
    <CommerceSurface>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.hotel.guestReviews}</h2>
        <span className="text-sm text-muted-ink">
          {reviews.length} {t.hotel.reviews}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {paginatedReviews.map((review) => (
          <article
            key={review.id}
            className="rounded-tv border border-border bg-sky-surface/30 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-booking-blue text-sm font-bold text-white">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{review.author}</p>
                  <p className="text-xs text-muted-ink">{review.date}</p>
                </div>
              </div>
              <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md bg-booking-blue px-2 text-xs font-bold text-white">
                {review.rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-ink">{review.comment}</p>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-tv-sm border border-border px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-sky-surface disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-tv-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-booking-blue text-white'
                  : 'border border-border text-ink hover:bg-sky-surface'
              }`}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-tv-sm border border-border px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-sky-surface disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </CommerceSurface>
  );
}

// ─── Room Type List ──────────────────────────────────────────────────────────

export function RoomTypeList({
  rooms,
  selectedRoomId,
  onSelectRoom,
}: {
  rooms: RoomOffer[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}) {
  const { t } = useLocale();

  return (
    <CommerceSurface id="rooms">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-booking-blue">
            {t.hotel.roomTypes}
          </p>
          <h2 className="mt-2 text-2xl font-bold">Chọn phòng theo nhu cầu</h2>
        </div>
        <StatusPill tone="orange">Dữ liệu demo/local</StatusPill>
      </div>
      <div className="mt-5 space-y-4">
        {rooms.map((room) => (
          <article
            key={room.id}
            className={`grid gap-4 rounded-tv border p-4 transition-all md:grid-cols-[minmax(0,1fr)_210px] ${
              selectedRoomId === room.id
                ? 'border-booking-blue bg-sky-surface shadow-card'
                : 'border-border bg-sky-surface/30 hover:border-booking-blue/50'
            }`}
          >
            <div>
              <div className="flex flex-wrap gap-2">
                {room.badges.map((badge) => (
                  <StatusPill key={badge} tone="teal">
                    {badge}
                  </StatusPill>
                ))}
              </div>
              <h3 className="mt-3 text-xl font-bold">{room.name}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-muted-ink">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
                  <BedDouble size={15} className="text-booking-blue" aria-hidden="true" />
                  {room.bedType}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
                  <Users size={15} className="text-booking-blue" aria-hidden="true" />
                  {room.guests} khách
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
                  <Bath size={15} className="text-booking-blue" aria-hidden="true" />
                  {room.breakfastIncluded ? 'Có ăn sáng' : 'Không ăn sáng'}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-tv bg-white p-4">
              <div>
                <p className="text-xs font-bold text-muted-ink">Giá mẫu mỗi đêm</p>
                <p className="mt-1 text-2xl font-bold text-orange-cta">
                  {formatVnd(room.nightlyPrice)}
                </p>
              </div>
              <button
                onClick={() => onSelectRoom(room.id)}
                className={`mt-4 inline-flex justify-center rounded-tv-sm px-4 py-3 text-sm font-bold transition-colors ${
                  selectedRoomId === room.id
                    ? 'bg-booking-blue text-white'
                    : 'bg-orange-cta text-white hover:bg-orange-cta/90'
                }`}
              >
                {selectedRoomId === room.id ? '✓ Đã chọn' : 'Chọn phòng'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </CommerceSurface>
  );
}

// ─── Sticky Price Summary Panel ──────────────────────────────────────────────

export function StickyPriceSummary({
  rooms,
  selectedRoomId,
  hotelSlug,
  destinationSlug,
}: {
  rooms: RoomOffer[];
  selectedRoomId: string | null;
  hotelSlug: string;
  destinationSlug: string;
}) {
  const { t } = useLocale();

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const lowestPrice = Math.min(...rooms.map((r) => r.nightlyPrice));
  const isRoomSelected = selectedRoomId !== null;

  return (
    <div className="hidden md:block">
      <div className="sticky top-24 space-y-4">
        <CommerceSurface>
          <h3 className="text-lg font-bold">Tóm tắt giá</h3>

          {isRoomSelected && selectedRoom ? (
            <div className="mt-3">
              <p className="text-sm text-muted-ink">{selectedRoom.name}</p>
              <p className="mt-1 text-2xl font-bold text-orange-cta">
                {formatVnd(selectedRoom.nightlyPrice)}
              </p>
              <p className="text-xs text-muted-ink">{t.hotel.perNight}</p>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-muted-ink">{t.hotel.startingFrom}</p>
              <p className="mt-1 text-2xl font-bold text-orange-cta">{formatVnd(lowestPrice)}</p>
              <p className="text-xs text-muted-ink">{t.hotel.perNight}</p>
            </div>
          )}

          {isRoomSelected ? (
            <Link
              href={`/booking/${destinationSlug}?hotel=${hotelSlug}&room=${selectedRoomId}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-tv bg-orange-cta px-5 py-4 font-bold text-white transition-colors hover:bg-orange-cta/90"
            >
              Đặt phòng ngay
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          ) : (
            <button
              disabled
              className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-tv bg-gray-300 px-5 py-4 font-bold text-gray-500"
              aria-label={t.hotel.selectRoomFirst}
            >
              Đặt phòng ngay
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          )}

          {!isRoomSelected && (
            <p className="mt-2 text-center text-xs text-muted-ink">{t.hotel.selectRoomFirst}</p>
          )}
        </CommerceSurface>

        <TrustBanner compact />
      </div>
    </div>
  );
}

// ─── Mobile Sticky Bottom Bar ────────────────────────────────────────────────

export function MobileBottomBar({
  rooms,
  selectedRoomId,
  hotelSlug,
  destinationSlug,
}: {
  rooms: RoomOffer[];
  selectedRoomId: string | null;
  hotelSlug: string;
  destinationSlug: string;
}) {
  const { t } = useLocale();
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const lowestPrice = Math.min(...rooms.map((r) => r.nightlyPrice));

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-white p-3 shadow-tv-header md:hidden">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3">
        <div>
          {selectedRoomId && selectedRoom ? (
            <>
              <p className="text-xs text-muted-ink">{selectedRoom.name}</p>
              <p className="text-lg font-bold text-orange-cta">
                {formatVnd(selectedRoom.nightlyPrice)}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-ink">{t.hotel.startingFrom}</p>
              <p className="text-lg font-bold text-orange-cta">{formatVnd(lowestPrice)}</p>
            </>
          )}
        </div>
        {selectedRoomId ? (
          <Link
            href={`/booking/${destinationSlug}?hotel=${hotelSlug}&room=${selectedRoomId}`}
            className="rounded-tv bg-orange-cta px-6 py-3 text-sm font-bold text-white"
          >
            Đặt phòng ngay
          </Link>
        ) : (
          <button
            disabled
            className="cursor-not-allowed rounded-tv bg-gray-300 px-6 py-3 text-sm font-bold text-gray-500"
          >
            Đặt phòng ngay
          </button>
        )}
      </div>
    </div>
  );
}
