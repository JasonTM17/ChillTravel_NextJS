import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.travel_tools import answer_from_knowledge_base, build_itinerary, suggest_destination


class TravelToolsTest(unittest.TestCase):
    def test_retrieves_da_nang_food_plan(self):
        answer = answer_from_knowledge_base("Đà Nẵng đi 3 ngày ăn gì?")
        self.assertEqual(answer["destination"], "Đà Nẵng")
        self.assertIn("itinerary", answer)

    def test_paris_budget_five_days(self):
        answer = answer_from_knowledge_base("Paris budget 5 days")
        self.assertEqual(answer["itinerary"]["duration_days"], 5)

    def test_realtime_guard(self):
        answer = answer_from_knowledge_base("current weather and flight price to Paris")
        self.assertIn("do not have live", answer["answer"])
        self.assertFalse(answer["safety"]["grounded"])

    def test_structured_itinerary(self):
        destination = suggest_destination("family trip Phú Quốc")
        plan = build_itinerary(destination, 3, "Family Planner")
        self.assertIn("budget_breakdown", plan)
        self.assertEqual(len(plan["days"]), 3)


if __name__ == "__main__":
    unittest.main()
