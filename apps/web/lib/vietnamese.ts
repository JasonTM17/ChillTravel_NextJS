import type { Destination, TravelStyle, TripPlan } from "@vietwander/shared";
import { getDestinationCopy } from "./destination-copy";

export const demoPaymentWarning = "Thanh toán demo — không phát sinh giao dịch thật";

const safetyLabels: Record<Destination["safetyLevel"], string> = {
  high: "An toàn cao",
  medium: "Cần lưu ý cơ bản",
  low: "Cần chuẩn bị kỹ"
};

const tagLabels: Record<string, string> = {
  "AI recommended": "Gợi ý phù hợp",
  Vietnam: "Việt Nam",
  World: "Quốc tế",
  beach: "Biển",
  culture: "Văn hóa",
  food: "Ẩm thực",
  family: "Gia đình",
  mountain: "Núi",
  luxury: "Nghỉ dưỡng",
  nature: "Thiên nhiên",
  couple: "Cặp đôi"
};

export function safetyLabel(level: Destination["safetyLevel"]) {
  return safetyLabels[level];
}

export function tagLabel(tag: string) {
  return tagLabels[tag] ?? tag;
}

const travelStyleLabels: Record<TravelStyle, string> = {
  "Food Hunter": "Thợ săn ẩm thực",
  "Culture Seeker": "Người mê văn hóa",
  "Beach Lover": "Tín đồ biển",
  "Mountain Adventurer": "Người thích núi và cung đường",
  "Luxury Escaper": "Nghỉ dưỡng cao cấp",
  "Budget Backpacker": "Du lịch tiết kiệm",
  "Family Planner": "Người lập kế hoạch gia đình",
  "World Wanderer": "Người mê khám phá thế giới"
};

const travelStyleDescriptions: Record<TravelStyle, string> = {
  "Food Hunter": "Bạn thường chọn điểm đến theo món ăn, chợ địa phương, quán cà phê và nhịp sống khu phố.",
  "Culture Seeker": "Bạn thích câu chuyện, di sản, kiến trúc, bảo tàng và cách một nơi vận hành trong đời sống hằng ngày.",
  "Beach Lover": "Bạn cần biển, hoàng hôn, hải sản và khoảng nghỉ đủ mềm giữa các hoạt động.",
  "Mountain Adventurer": "Bạn tìm độ cao, cung đường đẹp, buổi sáng mát và những hành trình đáng công chuẩn bị.",
  "Luxury Escaper": "Bạn ưu tiên ít di chuyển, nơi ở tốt, xe riêng và trải nghiệm được chọn lọc.",
  "Budget Backpacker": "Bạn tối ưu chi phí bằng phương tiện địa phương, nơi ở hợp lý và hoạt động giá trị cao.",
  "Family Planner": "Bạn cần nhịp đi an toàn, chỗ ở đáng tin, đồ ăn gần và kế hoạch có thể dùng offline.",
  "World Wanderer": "Bạn thích các biểu tượng toàn cầu, cảm hứng xuyên biên giới và lịch trình nhiều tương phản."
};

const traitLabels: Record<string, string> = {
  "Street food curiosity": "Tò mò ẩm thực đường phố",
  "Neighborhood-first routes": "Ưu tiên khám phá theo khu phố",
  "Flexible mealtimes": "Giờ ăn linh hoạt",
  "Context-rich days": "Ngày đi giàu bối cảnh",
  "Local etiquette": "Quan tâm phép lịch sự địa phương",
  "Slow discovery": "Khám phá chậm",
  "Coastal stays": "Ưu tiên lưu trú ven biển",
  "Sunset windows": "Dành thời gian cho hoàng hôn",
  "Light packing": "Hành lý gọn",
  "Early starts": "Thích khởi hành sớm",
  "Weather checks": "Kiểm tra thời tiết kỹ",
  "Route discipline": "Kỷ luật với cung đường",
  "Comfort margin": "Chừa biên độ thoải mái",
  "Private transfers": "Ưu tiên xe riêng",
  "Premium dining": "Bữa ăn chọn lọc",
  "Cost control": "Kiểm soát chi phí",
  "Public transport": "Dùng phương tiện công cộng",
  "Flexible lodging": "Lưu trú linh hoạt",
  "Safety-first": "An toàn trước tiên",
  "Offline checklist": "Checklist offline",
  "Shorter transfers": "Chặng di chuyển ngắn",
  "Bucket list energy": "Năng lượng bucket list",
  "City contrasts": "Thích tương phản đô thị",
  "Global context": "Quan tâm bối cảnh quốc tế"
};

export function travelStyleLabel(style: TravelStyle) {
  return travelStyleLabels[style];
}

export function travelStyleDescription(style: TravelStyle, fallback: string) {
  return travelStyleDescriptions[style] ?? fallback;
}

export function traitLabel(trait: string) {
  return traitLabels[trait] ?? trait;
}

export function paceLabel(pace: string) {
  return (
    {
      chill: "Thong thả",
      balanced: "Cân bằng",
      packed: "Dày lịch"
    }[pace] ?? pace
  );
}

export function budgetLevelLabel(level: string) {
  return (
    {
      budget: "Tiết kiệm",
      "mid-range": "Tầm trung",
      luxury: "Cao cấp"
    }[level] ?? level
  );
}

export function comparisonVerdictLabel(verdict: string) {
  return (
    {
      "Best fit": "Rất phù hợp",
      "Strong fit": "Phù hợp mạnh",
      "Good with tradeoffs": "Tốt nhưng cần đánh đổi"
    }[verdict] ?? verdict
  );
}

export function routeHref(path: string, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `${path}?${search.toString()}`;
}

export function formatDateVi(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function buildVietnameseDemoItinerary(destination: Destination, durationDays = 4): TripPlan {
  const copy = getDestinationCopy(destination);
  const food = copy.foodHighlights[0] ?? "ẩm thực địa phương";
  const secondFood = copy.foodHighlights[1] ?? "quán địa phương";
  const notes = copy.cultureNotes;

  return {
    destination: copy.name,
    durationDays,
    style: "nghỉ dưỡng cân bằng, ẩm thực, văn hóa địa phương",
    budgetLevel: "mid-range",
    days: Array.from({ length: durationDays }, (_, index) => {
      const day = index + 1;
      return {
        day,
        title: day === 1 ? `Đến ${copy.name} và làm quen nhịp địa phương` : `Ngày ${day} khám phá ${copy.name} theo nhịp cân bằng`,
        morning: day === 1 ? ["Đến nơi, gửi hành lý và kiểm tra khu lưu trú mock", `Đi bộ nhẹ quanh ${copy.city}`] : [`Chọn một điểm nổi bật ở ${copy.city}`, "Giữ lịch buổi sáng thoáng để tránh quá tải"],
        afternoon: day === durationDays ? ["Mua quà địa phương và chuẩn bị rời đi", "Kiểm tra lại hành lý, giấy tờ và phương tiện"] : ["Thêm một trải nghiệm văn hóa hoặc thiên nhiên", "Nghỉ giữa buổi để giữ sức"],
        evening: day === 1 ? [`Ăn ${food}`, "Dạo khu trung tâm hoặc bờ biển/phố chính"] : [`Thử ${secondFood}`, "Tổng kết chi phí và cập nhật lịch trình ngày sau"],
        food: copy.foodHighlights.slice(0, 3),
        estimatedCost: destination.budgetMin + index * 180000
      };
    }),
    budgetBreakdown: {
      hotel: destination.budgetMin * durationDays,
      food: 450000 * durationDays,
      transport: 320000 * durationDays,
      activities: 520000 * durationDays
    },
    safetyNotes: notes,
    packingList: ["Giấy tờ tùy thân", "Pin dự phòng", "Giày đi bộ", "Áo khoác nhẹ", "Kem chống nắng"]
  };
}
