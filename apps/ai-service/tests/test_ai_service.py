import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.rag import reindex_summary
from app.travel_tools import (
    answer_from_knowledge_base,
    build_itinerary,
    compare_destinations,
    estimate_budget,
    mood_search,
    suggest_destination,
    travel_personality,
)


class TravelToolsTest(unittest.TestCase):
    def test_da_nang_three_day_food_plan(self):
        answer = answer_from_knowledge_base("Da Nang 3 days food")

        self.assertEqual(answer["destination"], suggest_destination("da-nang").name)
        self.assertEqual(answer["itinerary"]["duration_days"], 3)
        self.assertEqual(answer["itinerary"]["style"], "Food Hunter")
        self.assertGreaterEqual(len(answer["itinerary"]["days"][0]["food"]), 3)

    def test_paris_budget_five_days(self):
        destination = suggest_destination("Paris budget 5 days")
        budget = estimate_budget(destination, days=5, travelers=1)

        self.assertEqual(destination.slug, "paris")
        self.assertEqual(budget["days"], 5)
        self.assertEqual(budget["low"], 15000000)
        self.assertEqual(budget["high"], 47500000)
        self.assertIn("cannot verify real-time", budget["note"])

    def test_family_phu_quoc_plan(self):
        destination = suggest_destination("family phu-quoc trip with kids")
        plan = build_itinerary(destination, 4, "Family Planner")

        self.assertEqual(destination.slug, "phu-quoc")
        self.assertEqual(plan["style"], "Family Planner")
        self.assertEqual(len(plan["days"]), 4)
        self.assertIn("Swimwear", plan["packing_list"])

    def test_realtime_guardrails_for_flights_visa_and_weather(self):
        answer = answer_from_knowledge_base("live visa rules, weather today, and flight prices to Paris")

        self.assertIn("cannot verify real-time flight prices", answer["answer"])
        self.assertIn("will not invent", answer["answer"])
        self.assertIn("official government sources", answer["answer"])
        self.assertFalse(answer["safety"]["grounded"])
        self.assertEqual(answer["safety"]["confidence"], "medium")

    def test_structured_itinerary_shape(self):
        destination = suggest_destination("family trip Phu Quoc")
        plan = build_itinerary(destination, 3, "Family Planner")

        self.assertEqual(plan["duration_days"], 3)
        self.assertEqual(len(plan["days"]), 3)
        self.assertIn("budget_breakdown", plan)
        self.assertEqual({"hotel", "food", "transport", "activities"}, set(plan["budget_breakdown"].keys()))
        for day in plan["days"]:
            self.assertEqual({"day", "title", "morning", "afternoon", "evening", "food", "estimated_cost"}, set(day.keys()))

    def test_reindex_payload_shape_uses_sample_fallback_by_default(self):
        payload = reindex_summary()

        self.assertEqual(payload["status"], "ready")
        self.assertEqual(payload["vector_db"], "qdrant")
        self.assertEqual(payload["retrieval_backend"], "sample")
        self.assertEqual(payload["collection"], "vietwander_travel")
        self.assertEqual(payload["embedding_model"], "nomic-embed-text")
        self.assertGreaterEqual(payload["documents"], 3)
        self.assertEqual(payload["indexed_documents"], 0)
        self.assertEqual(payload["fallback_documents"], payload["documents"])

    def test_personality_compare_and_mood_search(self):
        personality = travel_personality("street food markets and local cafes")
        self.assertEqual(personality["style"], "Food Hunter")
        comparison = compare_destinations(["da-nang", "paris"])
        self.assertEqual(len(comparison), 2)
        mood = mood_search("yen binh co bien an ngon")
        self.assertIn("inferred_filters", mood)


if __name__ == "__main__":
    unittest.main()
