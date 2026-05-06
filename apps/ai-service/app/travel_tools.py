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
    LocalDestination(
        "da-nang",
        "Da Nang",
        "Vietnam",
        "February to August",
        ["Mi Quang", "Banh trang cuon thit heo", "Seafood"],
        800000,
        3000000,
        ["Dress modestly in pagodas.", "Use licensed transport after late beach walks."],
    ),
    LocalDestination(
        "phu-quoc",
        "Phu Quoc",
        "Vietnam",
        "November to April",
        ["Goi ca trich", "Seafood", "Phu Quoc pepper"],
        1100000,
        4200000,
        ["Protect reefs.", "Confirm island transfer schedules locally."],
    ),
    LocalDestination(
        "paris",
        "Paris",
        "France",
        "April to June",
        ["Croissant", "Steak frites", "Patisserie"],
        3000000,
        9500000,
        ["Book museum slots early.", "Watch for pickpockets in crowded tourist zones."],
    ),
    LocalDestination(
        "tokyo",
        "Tokyo",
        "Japan",
        "March to May",
        ["Sushi", "Ramen", "Izakaya"],
        2500000,
        8000000,
        ["Keep trains quiet.", "Carry cash for small shops."],
    ),
]


def detect_travel_style(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ["food", "an", "cafe", "street"]):
        return "Food Hunter"
    if any(word in lowered for word in ["beach", "bien", "island"]):
        return "Beach Lover"
    if any(word in lowered for word in ["family", "gia dinh", "kids"]):
        return "Family Planner"
    if any(word in lowered for word in ["cheap", "budget", "tiet kiem"]):
        return "Budget Backpacker"
    return "Culture Seeker"


def travel_personality(text: str) -> dict[str, Any]:
    style = detect_travel_style(text)
    profile = {
        "Food Hunter": {
            "description": "Plans around markets, street food, cafes, and local dishes.",
            "traits": ["Street food curiosity", "Neighborhood-first routes", "Flexible mealtimes"],
        },
        "Beach Lover": {
            "description": "Looks for coast, islands, seafood, and sunset pacing.",
            "traits": ["Coastal stays", "Sunset windows", "Light packing"],
        },
        "Family Planner": {
            "description": "Needs lower-risk pacing, reliable stays, and offline checklists.",
            "traits": ["Safety-first", "Offline checklist", "Shorter transfers"],
        },
        "Budget Backpacker": {
            "description": "Optimizes for local transport, affordable stays, and high-value experiences.",
            "traits": ["Cost control", "Public transport", "Flexible lodging"],
        },
        "Culture Seeker": {
            "description": "Cares about stories, etiquette, heritage, and the deeper rhythm of a place.",
            "traits": ["Context-rich days", "Local etiquette", "Slow discovery"],
        },
    }.get(style, {"description": "Balanced discovery style.", "traits": ["Balanced route", "Local context"]})
    recommended = [destination.slug for destination in DESTINATIONS if destination.name in answer_from_style(style)][:4]
    if not recommended:
        recommended = [destination.slug for destination in DESTINATIONS[:3]]
    return {
        "style": style,
        "score": 88,
        "description": profile["description"],
        "traits": profile["traits"],
        "recommended_destination_slugs": recommended,
    }


def answer_from_style(style: str) -> list[str]:
    if style == "Food Hunter":
        return ["Da Nang", "Tokyo", "Paris"]
    if style == "Beach Lover":
        return ["Da Nang", "Phu Quoc"]
    if style == "Family Planner":
        return ["Phu Quoc", "Da Nang"]
    return ["Da Nang", "Paris", "Tokyo"]


def suggest_destination(text: str) -> LocalDestination:
    lowered = text.lower()
    aliases = {
        "da nang": "da-nang",
        "danang": "da-nang",
        "phu quoc": "phu-quoc",
        "phuquoc": "phu-quoc",
    }
    for alias, slug in aliases.items():
        if alias in lowered:
            return _destination_by_slug(slug)
    for destination in DESTINATIONS:
        if destination.slug in lowered or destination.name.lower() in lowered:
            return destination
    if "family" in lowered:
        return _destination_by_slug("phu-quoc")
    return _destination_by_slug("da-nang")


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
        "note": realtime_guardrail_notice(),
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
        destination = _destination_by_slug(slug)
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


def mood_search(query: str) -> dict[str, Any]:
    lowered = query.lower()
    tags = []
    if "beach" in lowered or "bien" in lowered:
        tags.append("beach")
    if "food" in lowered or "an ngon" in lowered:
        tags.append("food")
    if "quiet" in lowered or "yen binh" in lowered:
        tags.append("quiet")
    style = detect_travel_style(query)
    matched = [
        destination
        for destination in DESTINATIONS
        if not tags
        or any(tag in " ".join([destination.slug, destination.name, destination.country, *destination.foods]).lower() for tag in tags)
    ]
    if not matched:
        matched = DESTINATIONS[:3]
    return {
        "query": query,
        "inferred_filters": {
            "tags": tags,
            "styles": [style],
            "pace": "chill" if "quiet" in tags else "balanced",
            "budget": "mid-range",
        },
        "destinations": [{"slug": item.slug, "name": item.name, "country": item.country, "best_time": item.best_time} for item in matched[:6]],
    }


def generate_packing_list(destination: LocalDestination) -> list[str]:
    base = ["Comfortable walking shoes", "Reusable water bottle", "Offline itinerary pack", "Light rain layer"]
    if destination.slug in {"da-nang", "phu-quoc"}:
        base.extend(["Reef-safe sunscreen", "Swimwear"])
    return base


def answer_from_knowledge_base(query: str) -> dict[str, Any]:
    destination = suggest_destination(query)
    realtime = is_realtime_query(query)
    style = detect_travel_style(query)
    return {
        "summary": "Local knowledge-base response" if not realtime else "Local KB limitation notice",
        "answer": realtime_guardrail_notice() if realtime else f"{destination.name} is a strong fit for {style}.",
        "destination": destination.name,
        "citations": [{"title": destination.name, "source_id": f"destinations/{destination.slug}.md", "chunk_id": f"{destination.slug}-overview"}],
        "itinerary": build_itinerary(destination, 5 if "5" in query else 3, style),
        "safety": {"grounded": not realtime, "confidence": "medium" if realtime else "high"},
    }


def is_realtime_query(query: str) -> bool:
    lowered = query.lower()
    realtime_tokens = [
        "real-time",
        "realtime",
        "live",
        "current",
        "today",
        "tomorrow",
        "flight price",
        "flight prices",
        "airfare",
        "visa",
        "e-visa",
        "weather now",
        "weather today",
        "forecast",
        "gia ve bay",
        "thoi tiet hien tai",
    ]
    return any(token in lowered for token in realtime_tokens)


def realtime_guardrail_notice() -> str:
    return (
        "I cannot verify real-time flight prices, visa rules, or current weather from this local AI service, "
        "so I will not invent those details. Please confirm flights with airlines or booking providers, visa rules "
        "with official government sources, and weather with a live forecast before booking."
    )


def _destination_by_slug(slug: str) -> LocalDestination:
    return next((item for item in DESTINATIONS if item.slug == slug), DESTINATIONS[0])
