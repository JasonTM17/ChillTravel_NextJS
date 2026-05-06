import { Controller, Get } from "@nestjs/common";
import { envelope } from "@vietwander/shared";

@Controller("health")
export class HealthController {
  @Get()
  health() {
    return envelope({
      status: "ok",
      service: "vietwander-api",
      paymentMode: "mock",
      aiRuntime: "local-first"
    });
  }
}
