# Dead Code Report

> Generated: 2026-05-13T02:41:06.715Z
> Tool: ts-prune v0.10.3
> Scope: All TypeScript workspaces

## Summary

| Workspace         | Unused Exports |
| ----------------- | -------------- |
| `apps/api`        | 11             |
| `apps/web`        | 143            |
| `packages/shared` | 113            |
| `packages/config` | 5              |
| **Total**         | **272**        |

---

## How to Use This Report

1. Review each unused export below
2. Verify it is truly unused (ts-prune may have false positives for dynamic imports or framework-consumed exports)
3. Remove confirmed dead code using the suggested approach
4. Run `pnpm build` after removal to verify no breakage

### Exclusions Applied

- Exports marked `(used in module)` by ts-prune
- Next.js generated files (`.next/`, route types)
- Prisma generated client files (`packages/db/generated/`)
- Build output (`dist/`)
- Next.js page/layout/route `default` exports (consumed by framework)
- Next.js API route HTTP method exports (`POST`, `GET`, etc.)
- Next.js `metadata` exports (consumed by framework)
- Tool config file `default` exports (`next.config.ts`, `tailwind.config.ts`, etc.)

---

## apps/api

| File                                                    | Line | Export                 | Suggested Action              |
| ------------------------------------------------------- | ---- | ---------------------- | ----------------------------- |
| `apps/api/src/config/currency.config.ts`                | 22   | `convertFromVnd`       | Remove export or verify usage |
| `apps/api/src/config/currency.config.ts`                | 34   | `convertToVnd`         | Remove export or verify usage |
| `apps/api/src/config/currency.config.ts`                | 16   | `SUPPORTED_CURRENCIES` | Remove export or verify usage |
| `apps/api/src/config/env.validation.ts`                 | 18   | `WanderViewerEnv`      | Remove export or verify usage |
| `apps/api/src/modules/security.ts`                      | 25   | `CurrentUser`          | Remove export or verify usage |
| `apps/api/src/common/dto/paginated-response.dto.ts`     | 17   | `PaginatedResponseDto` | Remove export or verify usage |
| `apps/api/src/common/interceptors/audit.interceptor.ts` | 28   | `AuditInterceptor`     | Remove export or verify usage |
| `apps/api/src/modules/flights/flights.module.ts`        | 12   | `FlightsModule`        | Remove export or verify usage |
| `apps/api/src/modules/hotels/hotels.module.ts`          | 11   | `HotelsModule`         | Remove export or verify usage |
| `apps/api/src/modules/promotions/promotions.module.ts`  | 12   | `PromotionsModule`     | Remove export or verify usage |
| `apps/api/src/modules/search/search.module.ts`          | 11   | `SearchModule`         | Remove export or verify usage |

## apps/web

| File                                                    | Line | Export                      | Suggested Action              |
| ------------------------------------------------------- | ---- | --------------------------- | ----------------------------- |
| `apps/web/components/breadcrumbs.tsx`                   | 9    | `Breadcrumbs`               | Remove export or verify usage |
| `apps/web/components/dark-mode-toggle.tsx`              | 6    | `DarkModeToggle`            | Remove export or verify usage |
| `apps/web/components/lang-toggle.tsx`                   | 4    | `LangToggle`                | Remove export or verify usage |
| `apps/web/components/notification-bell.tsx`             | 55   | `NotificationBell`          | Remove export or verify usage |
| `apps/web/hooks/use-orientation.ts`                     | 53   | `useOrientation`            | Remove export or verify usage |
| `apps/web/lib/destination-images.ts`                    | 123  | `getTourImage`              | Remove export or verify usage |
| `apps/web/lib/destination-images.ts`                    | 127  | `getEditorialHeroImage`     | Remove export or verify usage |
| `apps/web/lib/travel.ts`                                | 12   | `getDestinationBySlug`      | Remove export or verify usage |
| `apps/web/lib/vietnamese.ts`                            | 125  | `routeHref`                 | Remove export or verify usage |
| `apps/web/components/ai/mood-search-panel.tsx`          | 10   | `MoodSearchPanel`           | Remove export or verify usage |
| `apps/web/components/booking/flight-fare-summary.tsx`   | 15   | `FlightFareSummary`         | Remove export or verify usage |
| `apps/web/components/booking/index.ts`                  | 1    | `BookingStepper`            | Remove export or verify usage |
| `apps/web/components/booking/index.ts`                  | 1    | `BookingStep`               | Remove export or verify usage |
| `apps/web/components/booking/index.ts`                  | 2    | `OrderSummary`              | Remove export or verify usage |
| `apps/web/components/booking/index.ts`                  | 2    | `OrderItem`                 | Remove export or verify usage |
| `apps/web/components/booking/index.ts`                  | 3    | `MockPayment`               | Remove export or verify usage |
| `apps/web/components/booking/index.ts`                  | 4    | `BookingConfirmation`       | Remove export or verify usage |
| `apps/web/components/booking/index.ts`                  | 5    | `BookingFlow`               | Remove export or verify usage |
| `apps/web/components/booking/index.ts`                  | 5    | `BookingFormData`           | Remove export or verify usage |
| `apps/web/components/booking/passenger-form.tsx`        | 55   | `PassengerForm`             | Remove export or verify usage |
| `apps/web/components/layout/responsive-layout.tsx`      | 28   | `ResponsiveLayout`          | Remove export or verify usage |
| `apps/web/components/layout/sticky-header.tsx`          | 42   | `StickyHeader`              | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 1    | `FlightCard`                | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 2    | `Flight`                    | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 3    | `FlightFilterPanel`         | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 4    | `FlightFilters`             | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 6    | `HotelCard`                 | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 7    | `Hotel`                     | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 7    | `AmenityType`               | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 8    | `HotelFilterPanel`          | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 8    | `DEFAULT_FILTERS`           | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 9    | `HotelFilters`              | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 10   | `HotelSortControls`         | Remove export or verify usage |
| `apps/web/components/listing/index.ts`                  | 11   | `SortOption`                | Remove export or verify usage |
| `apps/web/components/listing/mobile-listing-layout.tsx` | 213  | `MobileListingLayout`       | Remove export or verify usage |
| `apps/web/components/promo/index.ts`                    | 1    | `PromoCarousel`             | Remove export or verify usage |
| `apps/web/components/promo/index.ts`                    | 2    | `PromoBanner`               | Remove export or verify usage |
| `apps/web/components/promo/index.ts`                    | 4    | `CouponGrid`                | Remove export or verify usage |
| `apps/web/components/promo/index.ts`                    | 5    | `Coupon`                    | Remove export or verify usage |
| `apps/web/components/promo/index.ts`                    | 7    | `FlashSale`                 | Remove export or verify usage |
| `apps/web/components/promo/index.ts`                    | 8    | `FlashSaleItem`             | Remove export or verify usage |
| `apps/web/components/promo/index.ts`                    | 10   | `DealRecommendations`       | Remove export or verify usage |
| `apps/web/components/promo/index.ts`                    | 11   | `Deal`                      | Remove export or verify usage |
| `apps/web/components/search/flight-search-form.tsx`     | 53   | `FlightSearchForm`          | Remove export or verify usage |
| `apps/web/components/search/hotel-search-form.tsx`      | 56   | `HotelSearchForm`           | Remove export or verify usage |
| `apps/web/components/search/mobile-search-overlay.tsx`  | 18   | `MobileSearchOverlay`       | Remove export or verify usage |
| `apps/web/components/search/search-panel.tsx`           | 73   | `SearchPanel`               | Remove export or verify usage |
| `apps/web/components/ui/badge-pill.tsx`                 | 23   | `BadgePill`                 | Remove export or verify usage |
| `apps/web/components/ui/button.tsx`                     | 8    | `Button`                    | Remove export or verify usage |
| `apps/web/components/ui/skeleton.tsx`                   | 153  | `SkeletonAvatar`            | Remove export or verify usage |
| `apps/web/components/ui/skeleton.tsx`                   | 184  | `SkeletonCard`              | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 8    | `api`                       | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 9    | `apiFetch`                  | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 10   | `getAccessToken`            | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 11   | `getRefreshToken`           | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 12   | `setTokens`                 | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 13   | `clearTokens`               | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 14   | `TOKEN_KEYS`                | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 18   | `authApi`                   | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 19   | `destinationApi`            | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 20   | `tourApi`                   | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 21   | `bookingApi`                | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 22   | `reviewApi`                 | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 23   | `wishlistApi`               | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 24   | `blogApi`                   | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 25   | `contactApi`                | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 26   | `adminApi`                  | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 27   | `paymentApi`                | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 28   | `notificationApi`           | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 32   | `LoginRequest`              | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 33   | `RegisterRequest`           | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 34   | `AuthResponse`              | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 35   | `UserProfile`               | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 40   | `Destination`               | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 41   | `DestinationImage`          | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 42   | `DestinationQuery`          | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 43   | `CreateDestinationRequest`  | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 48   | `Tour`                      | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 49   | `TourImage`                 | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 50   | `TourItinerary`             | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 51   | `TourDeparture`             | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 52   | `TourDestination`           | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 53   | `TourQuery`                 | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 54   | `CreateTourRequest`         | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 59   | `Booking`                   | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 60   | `BookingGuest`              | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 61   | `BookingPayment`            | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 62   | `BookingTour`               | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 63   | `CreateBookingRequest`      | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 64   | `CreateBookingGuestRequest` | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 69   | `Review`                    | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 70   | `ReviewAuthor`              | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 71   | `CreateReviewRequest`       | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 72   | `UpdateReviewRequest`       | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 77   | `WishlistEntry`             | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 78   | `WishlistItemType`          | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 79   | `AddToWishlistRequest`      | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 84   | `BlogPost`                  | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 85   | `BlogAuthor`                | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 86   | `BlogQuery`                 | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 91   | `ContactRequest`            | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 92   | `SubmitContactRequest`      | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 97   | `MockCheckoutResponse`      | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 98   | `MockCallbackRequest`       | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 99   | `MockCallbackResponse`      | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 103  | `Notification`              | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 107  | `DashboardSummary`          | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 108  | `RevenueData`               | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 109  | `BookingStatusCounts`       | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 110  | `TopTour`                   | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 111  | `RecentActivities`          | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 112  | `AdminBookingQuery`         | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 113  | `AdminReviewQuery`          | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 114  | `AdminBlogQuery`            | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 115  | `AdminContactQuery`         | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 116  | `CreateBlogRequest`         | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 117  | `Coupon`                    | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 118  | `CreateCouponRequest`       | Remove export or verify usage |
| `apps/web/lib/api/index.ts`                             | 119  | `AdminUser`                 | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 66   | `parseLocale`               | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 80   | `getTranslations`           | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 106  | `getTranslationsSync`       | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 12   | `NavTranslations`           | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 13   | `CommonTranslations`        | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 14   | `BookingTranslations`       | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 15   | `SearchTranslations`        | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 16   | `HotelTranslations`         | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 17   | `FlightTranslations`        | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 18   | `MapTranslations`           | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 19   | `PromoTranslations`         | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 20   | `StatusTranslations`        | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 21   | `ErrorTranslations`         | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 27   | `getLocalizedContent`       | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 27   | `getLocalizedField`         | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 30   | `LocaleFormatter`           | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 31   | `createFormatter`           | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 34   | `UseLocaleReturn`           | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 34   | `LocaleProviderProps`       | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 36   | `useLocale`                 | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 37   | `LocaleProvider`            | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 38   | `LOCALE_STORAGE_KEY`        | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 39   | `parseStoredLocale`         | Remove export or verify usage |
| `apps/web/lib/i18n/index.ts`                            | 217  | `Translations`              | Remove export or verify usage |

## packages/shared

| File                           | Line | Export                         | Suggested Action              |
| ------------------------------ | ---- | ------------------------------ | ----------------------------- |
| `packages/shared/src/index.ts` | 9    | `envelope`                     | Remove export or verify usage |
| `packages/shared/src/index.ts` | 1    | `Role`                         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 3    | `TravelStyle`                  | Remove export or verify usage |
| `packages/shared/src/index.ts` | 13   | `ApiResponse`                  | Remove export or verify usage |
| `packages/shared/src/index.ts` | 20   | `Review`                       | Remove export or verify usage |
| `packages/shared/src/index.ts` | 26   | `HotelMock`                    | Remove export or verify usage |
| `packages/shared/src/index.ts` | 32   | `Destination`                  | Remove export or verify usage |
| `packages/shared/src/index.ts` | 60   | `ItineraryDay`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 70   | `TripPlan`                     | Remove export or verify usage |
| `packages/shared/src/index.ts` | 86   | `AiCitation`                   | Remove export or verify usage |
| `packages/shared/src/index.ts` | 95   | `AiAnswer`                     | Remove export or verify usage |
| `packages/shared/src/index.ts` | 104  | `AiProviderStatus`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 116  | `AiClarifyingQuestion`         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 122  | `AiQuickAction`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 128  | `AiChatStructuredAnswer`       | Remove export or verify usage |
| `packages/shared/src/index.ts` | 149  | `RagKnowledgeChunk`            | Remove export or verify usage |
| `packages/shared/src/index.ts` | 158  | `RagReindexResult`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 172  | `TravelQuizAnswer`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 177  | `TravelPersonalityResult`      | Remove export or verify usage |
| `packages/shared/src/index.ts` | 185  | `BudgetSimulationInput`        | Remove export or verify usage |
| `packages/shared/src/index.ts` | 195  | `BudgetSimulationResult`       | Remove export or verify usage |
| `packages/shared/src/index.ts` | 210  | `DestinationComparison`        | Remove export or verify usage |
| `packages/shared/src/index.ts` | 224  | `MoodSearchResult`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 16   | `PaymentMethod`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 25   | `ApiErrorEnvelope`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 40   | `AuthLoginRequest`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 45   | `AuthRegisterRequest`          | Remove export or verify usage |
| `packages/shared/src/index.ts` | 49   | `AuthSession`                  | Remove export or verify usage |
| `packages/shared/src/index.ts` | 59   | `DestinationListQuery`         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 66   | `BookingCreateRequest`         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 72   | `BookingMock`                  | Remove export or verify usage |
| `packages/shared/src/index.ts` | 85   | `PaymentConfirmRequest`        | Remove export or verify usage |
| `packages/shared/src/index.ts` | 89   | `AiChatRequest`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 94   | `AiItineraryRequest`           | Remove export or verify usage |
| `packages/shared/src/index.ts` | 100  | `AiBudgetEstimateRequest`      | Remove export or verify usage |
| `packages/shared/src/index.ts` | 105  | `AiCompareRequest`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 110  | `AiPersonalityRequest`         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 114  | `AiMoodSearchRequest`          | Remove export or verify usage |
| `packages/shared/src/index.ts` | 118  | `AiReindexRequest`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 122  | `ChillTravelApiContract`       | Remove export or verify usage |
| `packages/shared/src/index.ts` | 147  | `MobileOfflineSnapshot`        | Remove export or verify usage |
| `packages/shared/src/index.ts` | 3    | `travelStyles`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 14   | `destinations`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 1801 | `demoAccounts`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 1808 | `demoPaymentMethods`           | Remove export or verify usage |
| `packages/shared/src/index.ts` | 32   | `normalizeTravelText`          | Remove export or verify usage |
| `packages/shared/src/index.ts` | 41   | `findDestination`              | Remove export or verify usage |
| `packages/shared/src/index.ts` | 92   | `detectTravelStyle`            | Remove export or verify usage |
| `packages/shared/src/index.ts` | 123  | `buildDemoItinerary`           | Remove export or verify usage |
| `packages/shared/src/index.ts` | 151  | `buildStructuredLocalAiAnswer` | Remove export or verify usage |
| `packages/shared/src/index.ts` | 216  | `simulateBudget`               | Remove export or verify usage |
| `packages/shared/src/index.ts` | 245  | `compareDestinations`          | Remove export or verify usage |
| `packages/shared/src/index.ts` | 273  | `moodSearch`                   | Remove export or verify usage |
| `packages/shared/src/index.ts` | 299  | `localAiAnswer`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 17   | `aiToolNames`                  | Remove export or verify usage |
| `packages/shared/src/index.ts` | 30   | `AiToolName`                   | Remove export or verify usage |
| `packages/shared/src/index.ts` | 256  | `getHotelPropertyBySlug`       | Remove export or verify usage |
| `packages/shared/src/index.ts` | 1    | `FlightOffer`                  | Remove export or verify usage |
| `packages/shared/src/index.ts` | 17   | `RoomOffer`                    | Remove export or verify usage |
| `packages/shared/src/index.ts` | 28   | `HotelProperty`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 45   | `SupportArticle`               | Remove export or verify usage |
| `packages/shared/src/index.ts` | 53   | `UserBookingSummary`           | Remove export or verify usage |
| `packages/shared/src/index.ts` | 64   | `LoyaltyTier`                  | Remove export or verify usage |
| `packages/shared/src/index.ts` | 73   | `demoPaymentWarning`           | Remove export or verify usage |
| `packages/shared/src/index.ts` | 75   | `flightOffers`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 123  | `hotelProperties`              | Remove export or verify usage |
| `packages/shared/src/index.ts` | 190  | `supportArticles`              | Remove export or verify usage |
| `packages/shared/src/index.ts` | 214  | `userBookingSummaries`         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 237  | `loyaltyTiers`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 130  | `parseSortQuery`               | Remove export or verify usage |
| `packages/shared/src/index.ts` | 158  | `buildPaginatedResponse`       | Remove export or verify usage |
| `packages/shared/src/index.ts` | 184  | `successResponse`              | Remove export or verify usage |
| `packages/shared/src/index.ts` | 201  | `errorResponse`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 27   | `ApiSuccess`                   | Remove export or verify usage |
| `packages/shared/src/index.ts` | 41   | `ApiFieldError`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 57   | `ApiError`                     | Remove export or verify usage |
| `packages/shared/src/index.ts` | 72   | `ApiPaginated`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 87   | `ApiPaginatedResponse`         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 99   | `PaginationQuery`              | Remove export or verify usage |
| `packages/shared/src/index.ts` | 106  | `SortQuery`                    | Remove export or verify usage |
| `packages/shared/src/index.ts` | 112  | `DEFAULT_PAGE`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 114  | `DEFAULT_PAGE_SIZE`            | Remove export or verify usage |
| `packages/shared/src/index.ts` | 42   | `toCanonicalRoleName`          | Remove export or verify usage |
| `packages/shared/src/index.ts` | 31   | `ROLE_NAMES`                   | Remove export or verify usage |
| `packages/shared/src/index.ts` | 32   | `RoleName`                     | Remove export or verify usage |
| `packages/shared/src/index.ts` | 35   | `CANONICAL_ROLE_NAMES`         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 36   | `CanonicalRoleName`            | Remove export or verify usage |
| `packages/shared/src/index.ts` | 60   | `BOOKING_STATUSES`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 67   | `BookingStatus`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 70   | `BOOKING_STATUS_CANONICAL`     | Remove export or verify usage |
| `packages/shared/src/index.ts` | 77   | `CanonicalBookingStatus`       | Remove export or verify usage |
| `packages/shared/src/index.ts` | 84   | `PAYMENT_STATUSES`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 90   | `PaymentStatus`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 93   | `PAYMENT_STATUS_CANONICAL`     | Remove export or verify usage |
| `packages/shared/src/index.ts` | 99   | `CanonicalPaymentStatus`       | Remove export or verify usage |
| `packages/shared/src/index.ts` | 106  | `USER_STATUSES`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 107  | `UserStatus`                   | Remove export or verify usage |
| `packages/shared/src/index.ts` | 113  | `DESTINATION_STATUSES`         | Remove export or verify usage |
| `packages/shared/src/index.ts` | 114  | `DestinationStatus`            | Remove export or verify usage |
| `packages/shared/src/index.ts` | 120  | `TOUR_STATUSES`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 121  | `TourStatus`                   | Remove export or verify usage |
| `packages/shared/src/index.ts` | 127  | `REVIEW_STATUSES`              | Remove export or verify usage |
| `packages/shared/src/index.ts` | 133  | `ReviewStatus`                 | Remove export or verify usage |
| `packages/shared/src/index.ts` | 139  | `BLOG_STATUSES`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 140  | `BlogStatus`                   | Remove export or verify usage |
| `packages/shared/src/index.ts` | 146  | `CONTACT_STATUSES`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 152  | `ContactStatus`                | Remove export or verify usage |
| `packages/shared/src/index.ts` | 158  | `WISHLIST_ITEM_TYPES`          | Remove export or verify usage |
| `packages/shared/src/index.ts` | 159  | `WishlistItemType`             | Remove export or verify usage |
| `packages/shared/src/index.ts` | 165  | `COUPON_DISCOUNT_TYPES`        | Remove export or verify usage |
| `packages/shared/src/index.ts` | 166  | `CouponDiscountType`           | Remove export or verify usage |
| `packages/shared/src/index.ts` | 172  | `NOTIFICATION_TYPES`           | Remove export or verify usage |
| `packages/shared/src/index.ts` | 180  | `NotificationType`             | Remove export or verify usage |

## packages/config

| File                           | Line | Export          | Suggested Action              |
| ------------------------------ | ---- | --------------- | ----------------------------- |
| `packages/config/src/index.ts` | 1    | `nodeVersion`   | Remove export or verify usage |
| `packages/config/src/index.ts` | 2    | `nextVersion`   | Remove export or verify usage |
| `packages/config/src/index.ts` | 3    | `nestVersion`   | Remove export or verify usage |
| `packages/config/src/index.ts` | 4    | `prismaVersion` | Remove export or verify usage |
| `packages/config/src/index.ts` | 6    | `requiredEnv`   | Remove export or verify usage |

---

## Suggested Removal Commands

```bash
# After verifying each export is truly unused, remove them:
# Option 1: Manual removal (recommended for review)
# Open each file and remove the unused export declaration

# Option 2: Use eslint auto-fix for unused imports
pnpm lint --fix

# Option 3: Re-run ts-prune to verify after cleanup
npx ts-prune --project apps/api/tsconfig.json
npx ts-prune --project apps/web/tsconfig.json
npx ts-prune --project packages/shared/tsconfig.json
npx ts-prune --project packages/config/tsconfig.json
```

## Notes

- Some exports in `packages/shared` may be consumed by the mobile app (Flutter) or future features
- Exports in `packages/config` are intentionally available for all workspaces
- `next.config.ts` and `tailwind.config.ts` default exports are consumed by their respective tools
- Review barrel exports (`index.ts`) carefully — they re-export for external consumers
