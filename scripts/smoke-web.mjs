import { spawn } from "node:child_process";

const port = Number.parseInt(process.env.WEB_SMOKE_PORT ?? "3000", 10);
const baseUrl = process.env.WEB_SMOKE_BASE_URL ?? `http://127.0.0.1:${port}`;
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const routes = [
  ["/", "ChillTravel"],
  ["/explore?q=Da+Nang", "Đà Nẵng"],
  ["/destinations/da-nang", "Đà Nẵng"],
  ["/hotels", "Khách sạn"],
  ["/experiences", "Hoạt động"],
  ["/ai-planner", "Lập lịch trình"],
  ["/chat", "Trợ lý chuyến đi"],
  ["/booking/demo", "Thanh toán demo"],
  ["/booking/da-nang", "Thanh toán demo"],
  ["/budget", "Ngân sách thông minh"],
  ["/compare", "So sánh thông minh"],
  ["/map", "Bản đồ khám phá"],
  ["/personality", "Phong cách du lịch"],
  ["/wishlist", "Yêu thích"],
  ["/trips", "Chuyến đi"],
  ["/profile", "Hồ sơ du lịch"],
  ["/login", "Đăng nhập"],
  ["/register", "Đăng ký"],
  ["/admin", "Bảng vận hành ChillTravel"],
  ["/admin/ai-knowledge", "Knowledge Studio"]
];

const forbidden = [
  /VietWander AI/i,
  /VIETWANDER AI/i,
  /VietnamWanderAI/i,
  /ChillTravel AI/i,
  /Traveloka/i,
  /Demo payment - no real transaction/i,
  /This route drifted off the itinerary/i,
  /Back home/i,
  /Admin dashboard/i,
  /Search results/i,
  /Traveler profile/i
];

let server;

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "user-agent": "ChillTravel route smoke" }
  });
  return { status: response.status, body: await response.text() };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function isServerReady() {
  try {
    const response = await fetch(`${baseUrl}/`, { signal: AbortSignal.timeout(1500) });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (await isServerReady()) return;
    await sleep(500);
  }
  throw new Error(`Web server did not become ready at ${baseUrl}`);
}

async function ensureServer() {
  if (await isServerReady()) {
    console.log(`Using existing web server at ${baseUrl}`);
    return;
  }

  console.log(`Starting web server at ${baseUrl}`);
  server = spawn(pnpm, ["--filter", "@vietwander/web", "dev"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"]
  });

  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));
  await waitForServer();
}

function assertRoute(path, expected, status, body) {
  if (status !== 200) {
    throw new Error(`${path} returned ${status}, expected 200`);
  }
  if (!body.includes(expected)) {
    throw new Error(`${path} is missing expected text: ${expected}`);
  }
  if (!body.includes("ChillTravel")) {
    throw new Error(`${path} is missing ChillTravel brand text`);
  }
  for (const pattern of forbidden) {
    if (pattern.test(body)) {
      throw new Error(`${path} contains forbidden template/brand phrase: ${pattern}`);
    }
  }
  if (path.startsWith("/booking/") && !body.includes("không phát sinh giao dịch thật")) {
    throw new Error(`${path} must show the demo payment no-transaction warning`);
  }
}

async function main() {
  await ensureServer();

  for (const [path, expected] of routes) {
    const { status, body } = await fetchText(path);
    assertRoute(path, expected, status, body);
    console.log(`ok ${path}`);
  }

  const missing = await fetchText("/tuyen-khong-ton-tai");
  if (missing.status !== 404 || !missing.body.includes("Tuyến này không có trong lịch trình")) {
    throw new Error("404 route is not localized");
  }
  console.log("ok /tuyen-khong-ton-tai");
}

try {
  await main();
  console.log("ChillTravel web smoke passed");
} finally {
  if (server) {
    server.kill();
  }
}
