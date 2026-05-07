import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { configureApiApp } from "./api.setup";
import { AppModule } from "./app.module";
import { AiService } from "./ai.service";
import { BookingService } from "./booking.service";
import { DestinationsService } from "./destinations.service";

describe("api services", () => {
  it("searches destinations without requiring Vietnamese diacritics", () => {
    const service = new DestinationsService();
    expect(service.search("Da Nang")[0]?.slug).toBe("da-nang");
  });

  it("creates mock-only payments", () => {
    const booking = new BookingService().create({ itemName: "Demo tour", amount: 1000000, method: "MOCK_MOMO" });
    expect(booking.isDemo).toBe(true);
    expect(booking.warning).toContain("không phát sinh giao dịch thật");
  });

  it("returns hallucination guard for realtime queries", async () => {
    const answer = await new AiService().chat("current weather and flight price to Paris");
    expect(answer.answer).toContain("do not have live");
    expect(answer.provider.requiresOpenAiApiKey).toBe(false);
    expect(answer.quickActions.map((action) => action.id)).toContain("convert_to_itinerary");
  });

  it("runs personality, budget and compare intelligence", () => {
    const service = new AiService();
    expect(service.personality("street food and local markets").style).toBe("Food Hunter");
    expect(
      service.simulateBudget({
        destinationSlug: "da-nang",
        travelers: 2,
        days: 4,
        hotelLevel: "comfort",
        foodLevel: "balanced",
        transportLevel: "mixed",
        activityLevel: "balanced"
      }).total
    ).toBeGreaterThan(0);
    expect(service.compare(["da-nang", "paris"], "Culture Seeker")).toHaveLength(2);
  });
});

describe("api http hardening", () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    configureApiApp(app);
    await app.listen(0);
    const address = app.getHttpServer().address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}/api`;
  });

  afterAll(async () => {
    await app.close();
  });

  it("wraps successful responses in the global envelope shape", async () => {
    const response = await api("GET", "/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "OK",
      data: { status: "ok", paymentMode: "mock", aiRuntime: "local-first" },
      meta: {}
    });
  });

  it("logs in demo users and enforces admin RBAC", async () => {
    const userLogin = await api("POST", "/auth/login", { email: "user@vietwander.ai", password: "User123!" });
    const adminLogin = await api("POST", "/auth/login", { email: "admin@vietwander.ai", password: "Admin123!" });

    expect(userLogin.status).toBe(201);
    expect(userLogin.body.data.user.role).toBe("USER");
    expect(adminLogin.body.data.user.role).toBe("ADMIN");

    const withoutToken = await api("GET", "/admin/analytics");
    const userRestricted = await api("GET", "/admin/analytics", undefined, userLogin.body.data.accessToken);
    const adminAllowed = await api("GET", "/admin/analytics", undefined, adminLogin.body.data.accessToken);

    expect(withoutToken.status).toBe(401);
    expect(withoutToken.body).toMatchObject({ success: false, message: "Bearer token required" });
    expect(userRestricted.status).toBe(403);
    expect(userRestricted.body).toMatchObject({ success: false, message: "Insufficient role" });
    expect(adminAllowed.status).toBe(200);
    expect(adminAllowed.body.data.topSearchedDestinations).toHaveLength(5);
  });

  it("resolves auth/me from the bearer token", async () => {
    const login = await api("POST", "/auth/login", { email: "guide@vietwander.ai", password: "Guide123!" });
    const me = await api("GET", "/auth/me", undefined, login.body.data.accessToken);

    expect(me.status).toBe(200);
    expect(me.body.data).toMatchObject({ email: "guide@vietwander.ai", role: "GUIDE" });
  });

  it("filters and searches destinations with validated query DTOs", async () => {
    const filtered = await api("GET", "/destinations?q=Da%20Nang&style=food&sort=popular");
    const search = await api("GET", "/search?q=nha%20trang");

    expect(filtered.status).toBe(200);
    expect(filtered.body.meta.total).toBeGreaterThan(0);
    expect(filtered.body.data[0].slug).toBe("da-nang");
    expect(search.status).toBe(200);
    expect(search.body.data[0].slug).toBe("nha-trang");
  });

  it("keeps booking and payment mocks deterministic and local-only", async () => {
    const booking = await api("POST", "/bookings", { itemName: "Demo tour", amount: 1000000, method: "MOCK_MOMO" });
    const payment = await api("POST", "/payments/mock", { itemName: "Demo tour", amount: 1000000, method: "MOCK_CARD" });
    const confirm = await api("POST", "/payments/mock/confirm", { bookingCode: booking.body.data.bookingCode });

    expect(booking.status).toBe(201);
    expect(booking.body.data).toMatchObject({
      id: "book_000001",
      bookingCode: "CT-000001",
      paymentStatus: "confirmed_mock",
      isDemo: true
    });
    expect(payment.body.data).toMatchObject({ id: "book_000002", bookingCode: "CT-000002" });
    expect(confirm.body.data).toMatchObject({ bookingCode: "CT-000001", status: "confirmed_mock" });
    expect(confirm.body.data.warning).toContain("không phát sinh giao dịch thật");
  });

  it("serves local AI endpoints without an OpenAI key", async () => {
    const chat = await api("POST", "/ai/chat", { message: "current weather in Hanoi" });
    const budget = await api("POST", "/ai/budget/simulate", {
      destinationSlug: "da-nang",
      travelers: 2,
      days: 4,
      hotelLevel: "comfort",
      foodLevel: "balanced",
      transportLevel: "mixed",
      activityLevel: "balanced"
    });
    const mood = await api("POST", "/ai/mood-search", { query: "quiet beaches and seafood" });

    expect(chat.status).toBe(201);
    expect(chat.body.data.answer).toContain("do not have live");
    expect(chat.body.data.provider.requiresOpenAiApiKey).toBe(false);
    expect(chat.body.data.quickActions.some((action: { id: string }) => action.id === "estimate_budget")).toBe(true);
    expect(budget.status).toBe(201);
    expect(budget.body.data.total).toBeGreaterThan(0);
    expect(mood.status).toBe(201);
    expect(mood.body.data.inferredFilters.tags).toContain("beach");
  });

  it("returns local AI reindex status with sample fallback when the service is offline", async () => {
    const reindex = await api("POST", "/ai/reindex", { force: true });

    expect(reindex.status).toBe(201);
    expect(reindex.body.data).toMatchObject({
      vectorDb: "qdrant",
      retrievalBackend: "sample",
      requiresOpenAiApiKey: false
    });
  });

  it("returns the standardized exception envelope for validation failures", async () => {
    const badDestinationQuery = await api("GET", "/destinations?sort=latest");
    const badPayment = await api("POST", "/payments/mock", { itemName: "Demo tour", amount: -5, method: "LIVE_CARD" });
    const badAi = await api("POST", "/ai/compare", { slugs: [], style: "Unknown" });

    expect(badDestinationQuery.status).toBe(400);
    expect(badPayment.status).toBe(400);
    expect(badAi.status).toBe(400);
    expect(badPayment.body).toMatchObject({
      success: false,
      data: null,
      message: "Validation failed",
      error: { statusCode: 400 }
    });
    expect(badPayment.body.error.details).toEqual(expect.arrayContaining([expect.stringContaining("method must be one of the following values")]));
  });

  async function api(method: string, path: string, body?: unknown, token?: string) {
    const headers: Record<string, string> = {};
    if (body !== undefined) {
      headers["content-type"] = "application/json";
    }
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    const response = await fetch(baseUrl + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, body: await response.json() };
  }
});
