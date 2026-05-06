import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AiController } from "./ai.controller";
import { AuthController } from "./auth.controller";
import { BookingController } from "./booking.controller";
import { DestinationsController } from "./destinations.controller";
import { HealthController } from "./health.controller";
import { TripsController } from "./trips.controller";
import { AiService } from "./ai.service";
import { AuthService } from "./auth.service";
import { BookingService } from "./booking.service";
import { DestinationsService } from "./destinations.service";
import { TripsService } from "./trips.service";
import { JwtAuthGuard, RolesGuard } from "./security";

@Module({
  controllers: [HealthController, AuthController, DestinationsController, AiController, BookingController, TripsController, AdminController],
  providers: [AuthService, DestinationsService, AiService, BookingService, TripsService, JwtAuthGuard, RolesGuard]
})
export class AppModule {}
