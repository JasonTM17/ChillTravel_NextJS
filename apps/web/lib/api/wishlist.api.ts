import { api } from "./client";
import type { ApiSuccess } from "@vietwander/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WishlistItemType = "TOUR" | "DESTINATION";

export interface WishlistEntry {
  id: string;
  userId: string;
  itemId: string;
  itemType: WishlistItemType;
  createdAt: string;
  /** Populated tour or destination data (depends on itemType) */
  item?: Record<string, unknown>;
}

export interface AddToWishlistRequest {
  itemId: string;
  itemType: WishlistItemType;
}

// ---------------------------------------------------------------------------
// Wishlist API
// ---------------------------------------------------------------------------

export const wishlistApi = {
  list: () =>
    api.get<ApiSuccess<WishlistEntry[]>>("/wishlist"),

  add: (data: AddToWishlistRequest) =>
    api.post<ApiSuccess<WishlistEntry>>("/wishlist", data),

  remove: (id: string) =>
    api.delete<ApiSuccess<void>>(`/wishlist/${id}`),
};
