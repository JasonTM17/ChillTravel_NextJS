import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { IsArray, IsOptional, IsString, MaxLength } from "class-validator";
import { envelope } from "@vietwander/shared";
import { Public } from "../common/decorators/public.decorator";
import { TripsService } from "./trips.service";

class ProfileUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  travelStyle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  language?: string;
}

class WishlistSaveDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  destinationSlug?: string;
}

class TripCreateDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  destinationSlug?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dayNotes?: string[];
}

@Controller("me")
@Public()
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get("profile")
  profile() {
    return envelope({ displayName: "ChillTravel Demo User", travelStyle: "Culture Seeker", language: "vi" });
  }

  @Patch("profile")
  updateProfile(@Body() body: ProfileUpdateDto = {}) {
    return envelope({ updated: true, profile: body }, "Profile updated in local demo");
  }

  @Get("wishlist")
  wishlist() {
    return envelope(this.tripsService.wishlist(), "Wishlist loaded");
  }

  @Post("wishlist")
  saveWishlist(@Body() body: WishlistSaveDto = {}) {
    return envelope({ saved: true, destinationSlug: body.destinationSlug ?? "da-nang" }, "Wishlist item saved");
  }

  @Get("trips")
  trips() {
    return envelope(this.tripsService.trips(), "Trips loaded");
  }

  @Post("trips")
  createTrip(@Body() body: TripCreateDto = {}) {
    return envelope({ id: "trip_new", title: body.title ?? "Vietnam demo trip", shareUrl: "/trips/public/trip_new" }, "Trip saved");
  }

  @Get("bookings")
  bookings() {
    return envelope([{ bookingCode: "VW-DEMO1", status: "confirmed", isDemo: true }], "User bookings loaded");
  }
}
