from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class LocalDestination:
    slug: str
    name: str
    country: str
    best_time: str
    foods: list[str]
    budget_min: int
    budget_max: int
    culture_notes: list[str]


DESTINATIONS: list[LocalDestination] = [
    LocalDestination("da-nang", "Đà Nẵng", "Việt Nam", "February to August", ["Mì Quảng", "Bánh tráng cuốn thịt heo", "Hải sản"], 800000, 3000000, ["Dress modestly in pagodas.", "Use licensed transport after late beach walks."]),
    LocalDestination("phu-quoc", "Phú Quốc", "Việt Nam", "November to April", ["Gỏi cá trích", "Hải sản", "Tiêu Phú Quốc"], 1100000, 4200000, ["Protect reefs.", "Confirm island transfer schedules locally."]),
    LocalDestination("paris", "Paris", "France", "April to June", ["Croissant", "Steak frites", "Patisserie"], 3000000, 9500000, ["Book museum slots early.", "Watch for pickpockets in crowded tourist zones."]),
    LocalDestination("tokyo", "Tokyo", "Japan", "March to May", ["Sushi", "Ramen", "Izakaya"], 2500000, 8000000, ["Keep trains quiet.", "Carry cash for small shops."]),
]


def detect_travel_style(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ["food", "ăn", "cafe", "street"]):
        return "Food Hunter"
    if any(word in lowered for word in ["beach", "biển", "island"]):
        return "Beach Lover"
    if any(word in lowered for word in ["family", "gia đình", "kids"]):
        return "Family Planner"
    if any(word in lowered for word in ["cheap", "budget", "tiết kiệm"]):
        return "Budget Backpacker"
    return "Culture Seeker"


def suggest_destination(text: str) -> LocalDestination:
    lowered = text.lower()
    for destination in DESTINATIONS:
        if destination.slug in lowered or destination.name.lower() in lowered:
            return destination
    if "paris" in lowered:
        return DESTINATIONS[2]
    if "phú quốc" in lowered or "family" in lowered:
        return DESTINATIONS[1]
    return DESTINATIONS[0]


def estimate_budget(destination: LocalDestination, days: int, travelers: int = 2) -> dict[str, Any]:
    low = destination.budget_min * days * travelers
    high = destination.budget_max * days * travelers
    return {
        "destination": destination.name,
        "days": days,
        "travelers": travelers,
        "low": low,
        "high": high,
        "currency": "VND",
        "note": "Mock/local estimate. No real-time flight, hotel, visa, or weather data.",
    }


def build_itinerary(destination: LocalDestination, days: int = 3, style: str = "Culture Seeker") -> dict[str, Any]:
    day_items = []
    for index in range(days):
        day_items.append(
            {
                "day": index + 1,
                "title": f"{destination.name} day {index + 1}",
                "morning": ["Arrival rhythm" if index == 0 else "Signature local route"],
                "afternoon": ["Food and culture stop", "Budget check"],
                "evening": ["Local dinner", "Safety and culture reminder"],
                "food": destination.foods,
                "estimated_cost": round((destination.budget_min + destination.budget_max) / 2),
            }
        )
    budget = estimate_budget(destination, days)
    return {
        "destination": destination.name,
        "duration_days": days,
        "style": style,
        "budget_level": "mid-range",
        "days": day_items,
        "budget_breakdown": {
            "hotel": round(budget["low"] * 0.45),
            "food": round(budget["low"] * 0.22),
            "transport": round(budget["low"] * 0.16),
            "activities": round(budget["low"] * 0.17),
        },
        "safety_notes": destination.culture_notes,
        "packing_list": generate_packing_list(destination),
    }


def find_local_food(destination: LocalDestination) -> list[str]:
    return destination.foods


def find_hotels_mock(destination: LocalDestination) -> list[dict[str, Any]]:
    return [
        {"name": f"{destination.name} Boutique Stay", "nightly_price": destination.budget_min + 350000, "is_demo": True},
        {"name": f"{destination.name} Smart Comfort Hotel", "nightly_price": destination.budget_min + 150000, "is_demo": True},
    ]


def find_experiences_mock(destination: LocalDestination) -> list[str]:
    return [f"{destination.name} local food walk", f"{destination.name} culture route", f"{destination.name} sunrise viewpoint"]


def compare_destinations(slugs: list[str]) -> list[dict[str, Any]]:
    results = []
    for slug in slugs:
        destination = next((item for item in DESTINATIONS if item.slug == slug), DESTINATIONS[0])
        results.append(
            {
                "destination": destination.name,
                "budget": f"{destination.budget_min}-{destination.budget_max} VND/day",
                "best_time": destination.best_time,
                "food": destination.foods,
                "safety": "sample/local",
                "ai_score": 88,
            }
        )
    return results


def generate_packing_list(destination: LocalDestination) -> list[str]:
    base = ["Comfortable walking shoes", "Reusable water bottle", "Offline itinerary pack", "Light rain layer"]
    if destination.slug in {"da-nang", "phu-quoc"}:
        base.extend(["Reef-safe sunscreen", "Swimwear"])
    return base


def answer_from_knowledge_base(query: str) -> dict[str, Any]:
    destination = suggest_destination(query)
    realtime = any(token in query.lower() for token in ["real-time", "current", "today", "flight price", "visa", "weather now", "giá vé bay", "thời tiết hiện tại"])
    style = detect_travel_style(query)
    return {
        "summary": "Local knowledge-base response" if not realtime else "Local KB limitation notice",
        "answer": "I do not have live flight, visa, or current weather data. Please verify official sources." if realtime else f"{destination.name} is a strong fit for {style}.",
        "destination": destination.name,
        "citations": [{"title": destination.name, "source_id": f"destinations/{destination.slug}.md", "chunk_id": f"{destination.slug}-overview"}],
        "itinerary": build_itinerary(destination, 5 if "5" in query else 3, style),
        "safety": {"grounded": not realtime, "confidence": "medium" if realtime else "high"},
    }
