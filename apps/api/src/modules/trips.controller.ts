import { Controller, Get, Patch, Post } from "@nestjs/common";
import { envelope } from "@vietwander/shared";
import { TripsService } from "./trips.service";

@Controller("me")
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get("profile")
  profile() {
    return envelope({ displayName: "VietWander Demo User", travelStyle: "Culture Seeker", language: "vi" });
  }

  @Patch("profile")
  updateProfile() {
    return envelope({ updated: true }, "Profile updated in local demo");
  }

  @Get("wishlist")
  wishlist() {
    return envelope(this.tripsService.wishlist(), "Wishlist loaded");
  }

  @Post("wishlist")
  saveWishlist() {
    return envelope({ saved: true }, "Wishlist item saved");
  }

  @Get("trips")
  trips() {
    return envelope(this.tripsService.trips(), "Trips loaded");
  }

  @Post("trips")
  createTrip() {
    return envelope({ id: "trip_new", shareUrl: "/trips/public/trip_new" }, "Trip saved");
  }

  @Get("bookings")
  bookings() {
    return envelope([{ bookingCode: "VW-DEMO1", status: "confirmed", isDemo: true }], "User bookings loaded");
  }
}
