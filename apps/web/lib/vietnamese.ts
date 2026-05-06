import type { Destination, TripPlan } from "@vietwander/shared";
import { getDestinationCopy } from "@/lib/destination-copy";

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
