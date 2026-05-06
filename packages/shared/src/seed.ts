import type { Destination, TravelStyle } from "./types";

export const travelStyles: TravelStyle[] = [
  "Food Hunter",
  "Culture Seeker",
  "Beach Lover",
  "Mountain Adventurer",
  "Luxury Escaper",
  "Budget Backpacker",
  "Family Planner",
  "World Wanderer"
];

export const destinations: Destination[] = [
  {
    "id": "dst_ha-noi",
    "slug": "ha-noi",
    "name": "Hà Nội",
    "country": "Việt Nam",
    "city": "Hà Nội",
    "summary": "Hà Nội is curated for culture travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Hà Nội blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "October to April",
    "budgetMin": 650000,
    "budgetMax": 2200000,
    "currency": "VND",
    "travelStyles": [
      "culture",
      "culture",
      "family"
    ],
    "tags": [
      "culture",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 10,
    "longitude": 105,
    "safetyLevel": "medium",
    "cultureNotes": [
      "Respect local customs in Hà Nội.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Phở",
      "bún chả",
      "cà phê trứng"
    ],
    "ratingAvg": 4.5,
    "reviewCount": 120,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Hà Nội, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Hà Nội local food walk",
      "Hà Nội sunrise viewpoint route",
      "Hà Nội culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Hà Nội Boutique Stay",
        "nightlyPrice": 1000000,
        "rating": 4.5
      },
      {
        "name": "Hà Nội Smart Comfort Hotel",
        "nightlyPrice": 800000,
        "rating": 4.3
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Hà Nội felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_ha-long",
    "slug": "ha-long",
    "name": "Hạ Long",
    "country": "Việt Nam",
    "city": "Quảng Ninh",
    "summary": "Hạ Long is curated for beach travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Hạ Long blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "October to May",
    "budgetMin": 900000,
    "budgetMax": 3200000,
    "currency": "VND",
    "travelStyles": [
      "beach",
      "food",
      "couple"
    ],
    "tags": [
      "beach",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 11.2,
    "longitude": 105.7,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Quảng Ninh.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Chả mực",
      "hải sản vịnh"
    ],
    "ratingAvg": 4.5,
    "reviewCount": 157,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Hạ Long, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Hạ Long local food walk",
      "Hạ Long sunrise viewpoint route",
      "Hạ Long culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Hạ Long Boutique Stay",
        "nightlyPrice": 1250000,
        "rating": 4.5
      },
      {
        "name": "Hạ Long Smart Comfort Hotel",
        "nightlyPrice": 1050000,
        "rating": 4.3
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Hạ Long felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_sapa",
    "slug": "sapa",
    "name": "Sapa",
    "country": "Việt Nam",
    "city": "Lào Cai",
    "summary": "Sapa is curated for mountain travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Sapa blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "September to November",
    "budgetMin": 700000,
    "budgetMax": 2600000,
    "currency": "VND",
    "travelStyles": [
      "mountain",
      "culture",
      "couple"
    ],
    "tags": [
      "mountain",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 12.4,
    "longitude": 106.4,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Lào Cai.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Thắng cố",
      "cá suối",
      "rau bản"
    ],
    "ratingAvg": 4.6,
    "reviewCount": 194,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Sapa, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Sapa local food walk",
      "Sapa sunrise viewpoint route",
      "Sapa culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Sapa Boutique Stay",
        "nightlyPrice": 1050000,
        "rating": 4.6
      },
      {
        "name": "Sapa Smart Comfort Hotel",
        "nightlyPrice": 850000,
        "rating": 4.3999999999999995
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Sapa felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_ninh-binh",
    "slug": "ninh-binh",
    "name": "Ninh Bình",
    "country": "Việt Nam",
    "city": "Ninh Bình",
    "summary": "Ninh Bình is curated for nature travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Ninh Bình blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "February to May",
    "budgetMin": 550000,
    "budgetMax": 1800000,
    "currency": "VND",
    "travelStyles": [
      "nature",
      "food",
      "family"
    ],
    "tags": [
      "nature",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 13.6,
    "longitude": 107.1,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Ninh Bình.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Cơm cháy",
      "dê núi"
    ],
    "ratingAvg": 4.7,
    "reviewCount": 231,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Ninh Bình, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Ninh Bình local food walk",
      "Ninh Bình sunrise viewpoint route",
      "Ninh Bình culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Ninh Bình Boutique Stay",
        "nightlyPrice": 900000,
        "rating": 4.7
      },
      {
        "name": "Ninh Bình Smart Comfort Hotel",
        "nightlyPrice": 700000,
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Ninh Bình felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_hue",
    "slug": "hue",
    "name": "Huế",
    "country": "Việt Nam",
    "city": "Thừa Thiên Huế",
    "summary": "Huế is curated for culture travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Huế blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "January to April",
    "budgetMin": 600000,
    "budgetMax": 2100000,
    "currency": "VND",
    "travelStyles": [
      "culture",
      "culture",
      "couple"
    ],
    "tags": [
      "culture",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 14.8,
    "longitude": 107.8,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Thừa Thiên Huế.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Bún bò Huế",
      "cơm hến"
    ],
    "ratingAvg": 4.7,
    "reviewCount": 268,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Huế, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Huế local food walk",
      "Huế sunrise viewpoint route",
      "Huế culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Huế Boutique Stay",
        "nightlyPrice": 950000,
        "rating": 4.7
      },
      {
        "name": "Huế Smart Comfort Hotel",
        "nightlyPrice": 750000,
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Huế felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_da-nang",
    "slug": "da-nang",
    "name": "Đà Nẵng",
    "country": "Việt Nam",
    "city": "Đà Nẵng",
    "summary": "Đà Nẵng is curated for beach travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Đà Nẵng blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "February to August",
    "budgetMin": 800000,
    "budgetMax": 3000000,
    "currency": "VND",
    "travelStyles": [
      "beach",
      "food",
      "couple"
    ],
    "tags": [
      "beach",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 16,
    "longitude": 108.5,
    "safetyLevel": "medium",
    "cultureNotes": [
      "Respect local customs in Đà Nẵng.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Mì Quảng",
      "bánh tráng cuốn thịt heo"
    ],
    "ratingAvg": 4.8,
    "reviewCount": 305,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Đà Nẵng, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Đà Nẵng local food walk",
      "Đà Nẵng sunrise viewpoint route",
      "Đà Nẵng culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Đà Nẵng Boutique Stay",
        "nightlyPrice": 1150000,
        "rating": 4.8
      },
      {
        "name": "Đà Nẵng Smart Comfort Hotel",
        "nightlyPrice": 950000,
        "rating": 4.6
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Đà Nẵng felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_hoi-an",
    "slug": "hoi-an",
    "name": "Hội An",
    "country": "Việt Nam",
    "city": "Quảng Nam",
    "summary": "Hội An is curated for culture travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Hội An blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "February to April",
    "budgetMin": 750000,
    "budgetMax": 2800000,
    "currency": "VND",
    "travelStyles": [
      "culture",
      "culture",
      "family"
    ],
    "tags": [
      "culture",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 17.2,
    "longitude": 109.2,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Quảng Nam.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Cao lầu",
      "bánh mì",
      "hoành thánh"
    ],
    "ratingAvg": 4.9,
    "reviewCount": 342,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Hội An, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Hội An local food walk",
      "Hội An sunrise viewpoint route",
      "Hội An culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Hội An Boutique Stay",
        "nightlyPrice": 1100000,
        "rating": 4.9
      },
      {
        "name": "Hội An Smart Comfort Hotel",
        "nightlyPrice": 900000,
        "rating": 4.7
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Hội An felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_nha-trang",
    "slug": "nha-trang",
    "name": "Nha Trang",
    "country": "Việt Nam",
    "city": "Khánh Hòa",
    "summary": "Nha Trang is curated for beach travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Nha Trang blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "January to September",
    "budgetMin": 850000,
    "budgetMax": 3100000,
    "currency": "VND",
    "travelStyles": [
      "beach",
      "food",
      "couple"
    ],
    "tags": [
      "beach",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 18.4,
    "longitude": 109.9,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Khánh Hòa.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Bún cá",
      "nem nướng"
    ],
    "ratingAvg": 4.5,
    "reviewCount": 379,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Nha Trang, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Nha Trang local food walk",
      "Nha Trang sunrise viewpoint route",
      "Nha Trang culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Nha Trang Boutique Stay",
        "nightlyPrice": 1200000,
        "rating": 4.5
      },
      {
        "name": "Nha Trang Smart Comfort Hotel",
        "nightlyPrice": 1000000,
        "rating": 4.3
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Nha Trang felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_da-lat",
    "slug": "da-lat",
    "name": "Đà Lạt",
    "country": "Việt Nam",
    "city": "Lâm Đồng",
    "summary": "Đà Lạt is curated for mountain travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Đà Lạt blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "November to March",
    "budgetMin": 650000,
    "budgetMax": 2400000,
    "currency": "VND",
    "travelStyles": [
      "mountain",
      "culture",
      "couple"
    ],
    "tags": [
      "mountain",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 19.6,
    "longitude": 110.6,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Lâm Đồng.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Lẩu gà lá é",
      "bánh căn"
    ],
    "ratingAvg": 4.5,
    "reviewCount": 416,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Đà Lạt, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Đà Lạt local food walk",
      "Đà Lạt sunrise viewpoint route",
      "Đà Lạt culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Đà Lạt Boutique Stay",
        "nightlyPrice": 1000000,
        "rating": 4.5
      },
      {
        "name": "Đà Lạt Smart Comfort Hotel",
        "nightlyPrice": 800000,
        "rating": 4.3
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Đà Lạt felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_phu-quoc",
    "slug": "phu-quoc",
    "name": "Phú Quốc",
    "country": "Việt Nam",
    "city": "Kiên Giang",
    "summary": "Phú Quốc is curated for island travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Phú Quốc blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "November to April",
    "budgetMin": 1100000,
    "budgetMax": 4200000,
    "currency": "VND",
    "travelStyles": [
      "island",
      "food",
      "family"
    ],
    "tags": [
      "island",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 20.799999999999997,
    "longitude": 111.3,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Kiên Giang.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Gỏi cá trích",
      "hải sản",
      "tiêu"
    ],
    "ratingAvg": 4.6,
    "reviewCount": 453,
    "isFeatured": true,
    "imagePrompt": "Premium cinematic travel poster for Phú Quốc, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Phú Quốc local food walk",
      "Phú Quốc sunrise viewpoint route",
      "Phú Quốc culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Phú Quốc Boutique Stay",
        "nightlyPrice": 1450000,
        "rating": 4.6
      },
      {
        "name": "Phú Quốc Smart Comfort Hotel",
        "nightlyPrice": 1250000,
        "rating": 4.3999999999999995
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Phú Quốc felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_can-tho",
    "slug": "can-tho",
    "name": "Cần Thơ",
    "country": "Việt Nam",
    "city": "Cần Thơ",
    "summary": "Cần Thơ is curated for food travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Cần Thơ blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "December to April",
    "budgetMin": 500000,
    "budgetMax": 1600000,
    "currency": "VND",
    "travelStyles": [
      "food",
      "culture",
      "couple"
    ],
    "tags": [
      "food",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 22,
    "longitude": 112,
    "safetyLevel": "medium",
    "cultureNotes": [
      "Respect local customs in Cần Thơ.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Lẩu mắm",
      "bánh xèo miền Tây"
    ],
    "ratingAvg": 4.7,
    "reviewCount": 490,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Cần Thơ, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Cần Thơ local food walk",
      "Cần Thơ sunrise viewpoint route",
      "Cần Thơ culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Cần Thơ Boutique Stay",
        "nightlyPrice": 850000,
        "rating": 4.7
      },
      {
        "name": "Cần Thơ Smart Comfort Hotel",
        "nightlyPrice": 650000,
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Cần Thơ felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_ha-giang",
    "slug": "ha-giang",
    "name": "Hà Giang",
    "country": "Việt Nam",
    "city": "Hà Giang",
    "summary": "Hà Giang is curated for adventure travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Hà Giang blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "September to November",
    "budgetMin": 700000,
    "budgetMax": 2500000,
    "currency": "VND",
    "travelStyles": [
      "adventure",
      "food",
      "couple"
    ],
    "tags": [
      "adventure",
      "AI recommended",
      "Vietnam"
    ],
    "latitude": 23.2,
    "longitude": 112.7,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Hà Giang.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Thắng dền",
      "cháo ấu tẩu"
    ],
    "ratingAvg": 4.7,
    "reviewCount": 527,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Hà Giang, Việt Nam, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Hà Giang local food walk",
      "Hà Giang sunrise viewpoint route",
      "Hà Giang culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Hà Giang Boutique Stay",
        "nightlyPrice": 1050000,
        "rating": 4.7
      },
      {
        "name": "Hà Giang Smart Comfort Hotel",
        "nightlyPrice": 850000,
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Hà Giang felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_tokyo",
    "slug": "tokyo",
    "name": "Tokyo",
    "country": "Nhật Bản",
    "city": "Tokyo",
    "summary": "Tokyo is curated for city travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Tokyo blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "March to May",
    "budgetMin": 2500000,
    "budgetMax": 8000000,
    "currency": "VND",
    "travelStyles": [
      "city",
      "culture",
      "family"
    ],
    "tags": [
      "city",
      "AI recommended",
      "World"
    ],
    "latitude": 24.4,
    "longitude": 113.4,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Tokyo.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Sushi",
      "ramen",
      "izakaya"
    ],
    "ratingAvg": 4.8,
    "reviewCount": 564,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Tokyo, Nhật Bản, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Tokyo local food walk",
      "Tokyo sunrise viewpoint route",
      "Tokyo culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Tokyo Boutique Stay",
        "nightlyPrice": 2850000,
        "rating": 4.8
      },
      {
        "name": "Tokyo Smart Comfort Hotel",
        "nightlyPrice": 2650000,
        "rating": 4.6
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Tokyo felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_seoul",
    "slug": "seoul",
    "name": "Seoul",
    "country": "Hàn Quốc",
    "city": "Seoul",
    "summary": "Seoul is curated for city travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Seoul blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "April to June",
    "budgetMin": 2200000,
    "budgetMax": 6500000,
    "currency": "VND",
    "travelStyles": [
      "city",
      "food",
      "couple"
    ],
    "tags": [
      "city",
      "AI recommended",
      "World"
    ],
    "latitude": 25.6,
    "longitude": 114.1,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Seoul.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "BBQ",
      "tteokbokki",
      "bibimbap"
    ],
    "ratingAvg": 4.9,
    "reviewCount": 601,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Seoul, Hàn Quốc, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Seoul local food walk",
      "Seoul sunrise viewpoint route",
      "Seoul culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Seoul Boutique Stay",
        "nightlyPrice": 2550000,
        "rating": 4.9
      },
      {
        "name": "Seoul Smart Comfort Hotel",
        "nightlyPrice": 2350000,
        "rating": 4.7
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Seoul felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_bangkok",
    "slug": "bangkok",
    "name": "Bangkok",
    "country": "Thái Lan",
    "city": "Bangkok",
    "summary": "Bangkok is curated for food travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Bangkok blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "November to February",
    "budgetMin": 1200000,
    "budgetMax": 3800000,
    "currency": "VND",
    "travelStyles": [
      "food",
      "culture",
      "couple"
    ],
    "tags": [
      "food",
      "AI recommended",
      "World"
    ],
    "latitude": 26.8,
    "longitude": 114.8,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Bangkok.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Pad Thai",
      "tom yum",
      "mango sticky rice"
    ],
    "ratingAvg": 4.5,
    "reviewCount": 638,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Bangkok, Thái Lan, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Bangkok local food walk",
      "Bangkok sunrise viewpoint route",
      "Bangkok culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Bangkok Boutique Stay",
        "nightlyPrice": 1550000,
        "rating": 4.5
      },
      {
        "name": "Bangkok Smart Comfort Hotel",
        "nightlyPrice": 1350000,
        "rating": 4.3
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Bangkok felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_singapore",
    "slug": "singapore",
    "name": "Singapore",
    "country": "Singapore",
    "city": "Singapore",
    "summary": "Singapore is curated for family travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Singapore blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "February to April",
    "budgetMin": 2500000,
    "budgetMax": 7000000,
    "currency": "VND",
    "travelStyles": [
      "family",
      "food",
      "family"
    ],
    "tags": [
      "family",
      "AI recommended",
      "World"
    ],
    "latitude": 28,
    "longitude": 115.5,
    "safetyLevel": "medium",
    "cultureNotes": [
      "Respect local customs in Singapore.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Laksa",
      "chicken rice",
      "chili crab"
    ],
    "ratingAvg": 4.5,
    "reviewCount": 675,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Singapore, Singapore, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Singapore local food walk",
      "Singapore sunrise viewpoint route",
      "Singapore culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Singapore Boutique Stay",
        "nightlyPrice": 2850000,
        "rating": 4.5
      },
      {
        "name": "Singapore Smart Comfort Hotel",
        "nightlyPrice": 2650000,
        "rating": 4.3
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Singapore felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_bali",
    "slug": "bali",
    "name": "Bali",
    "country": "Indonesia",
    "city": "Bali",
    "summary": "Bali is curated for wellness travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Bali blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "April to October",
    "budgetMin": 1600000,
    "budgetMax": 5200000,
    "currency": "VND",
    "travelStyles": [
      "wellness",
      "culture",
      "couple"
    ],
    "tags": [
      "wellness",
      "AI recommended",
      "World"
    ],
    "latitude": 29.2,
    "longitude": 116.2,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Bali.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Babi guling",
      "nasi campur"
    ],
    "ratingAvg": 4.6,
    "reviewCount": 712,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Bali, Indonesia, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Bali local food walk",
      "Bali sunrise viewpoint route",
      "Bali culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Bali Boutique Stay",
        "nightlyPrice": 1950000,
        "rating": 4.6
      },
      {
        "name": "Bali Smart Comfort Hotel",
        "nightlyPrice": 1750000,
        "rating": 4.3999999999999995
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Bali felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_paris",
    "slug": "paris",
    "name": "Paris",
    "country": "Pháp",
    "city": "Paris",
    "summary": "Paris is curated for romance travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Paris blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "April to June",
    "budgetMin": 3000000,
    "budgetMax": 9500000,
    "currency": "VND",
    "travelStyles": [
      "romance",
      "food",
      "couple"
    ],
    "tags": [
      "romance",
      "AI recommended",
      "World"
    ],
    "latitude": 30.4,
    "longitude": 116.9,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Paris.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Croissant",
      "steak frites",
      "patisserie"
    ],
    "ratingAvg": 4.7,
    "reviewCount": 749,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Paris, Pháp, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Paris local food walk",
      "Paris sunrise viewpoint route",
      "Paris culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Paris Boutique Stay",
        "nightlyPrice": 3350000,
        "rating": 4.7
      },
      {
        "name": "Paris Smart Comfort Hotel",
        "nightlyPrice": 3150000,
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Paris felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_rome",
    "slug": "rome",
    "name": "Rome",
    "country": "Ý",
    "city": "Rome",
    "summary": "Rome is curated for culture travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Rome blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "April to June",
    "budgetMin": 2600000,
    "budgetMax": 8500000,
    "currency": "VND",
    "travelStyles": [
      "culture",
      "culture",
      "family"
    ],
    "tags": [
      "culture",
      "AI recommended",
      "World"
    ],
    "latitude": 31.599999999999998,
    "longitude": 117.6,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Rome.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Carbonara",
      "gelato",
      "espresso"
    ],
    "ratingAvg": 4.7,
    "reviewCount": 786,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Rome, Ý, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Rome local food walk",
      "Rome sunrise viewpoint route",
      "Rome culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Rome Boutique Stay",
        "nightlyPrice": 2950000,
        "rating": 4.7
      },
      {
        "name": "Rome Smart Comfort Hotel",
        "nightlyPrice": 2750000,
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Rome felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_barcelona",
    "slug": "barcelona",
    "name": "Barcelona",
    "country": "Tây Ban Nha",
    "city": "Barcelona",
    "summary": "Barcelona is curated for nightlife travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Barcelona blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "May to June",
    "budgetMin": 2400000,
    "budgetMax": 7800000,
    "currency": "VND",
    "travelStyles": [
      "nightlife",
      "food",
      "couple"
    ],
    "tags": [
      "nightlife",
      "AI recommended",
      "World"
    ],
    "latitude": 32.8,
    "longitude": 118.3,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Barcelona.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Tapas",
      "paella",
      "crema catalana"
    ],
    "ratingAvg": 4.8,
    "reviewCount": 823,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Barcelona, Tây Ban Nha, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Barcelona local food walk",
      "Barcelona sunrise viewpoint route",
      "Barcelona culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Barcelona Boutique Stay",
        "nightlyPrice": 2750000,
        "rating": 4.8
      },
      {
        "name": "Barcelona Smart Comfort Hotel",
        "nightlyPrice": 2550000,
        "rating": 4.6
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Barcelona felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_london",
    "slug": "london",
    "name": "London",
    "country": "Anh",
    "city": "London",
    "summary": "London is curated for culture travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "London blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "May to September",
    "budgetMin": 3200000,
    "budgetMax": 9800000,
    "currency": "VND",
    "travelStyles": [
      "culture",
      "culture",
      "couple"
    ],
    "tags": [
      "culture",
      "AI recommended",
      "World"
    ],
    "latitude": 34,
    "longitude": 119,
    "safetyLevel": "medium",
    "cultureNotes": [
      "Respect local customs in London.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Sunday roast",
      "fish and chips"
    ],
    "ratingAvg": 4.9,
    "reviewCount": 860,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for London, Anh, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "London local food walk",
      "London sunrise viewpoint route",
      "London culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "London Boutique Stay",
        "nightlyPrice": 3550000,
        "rating": 4.9
      },
      {
        "name": "London Smart Comfort Hotel",
        "nightlyPrice": 3350000,
        "rating": 4.7
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "London felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_new-york",
    "slug": "new-york",
    "name": "New York",
    "country": "Mỹ",
    "city": "New York",
    "summary": "New York is curated for city travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "New York blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "April to June",
    "budgetMin": 3500000,
    "budgetMax": 11000000,
    "currency": "VND",
    "travelStyles": [
      "city",
      "food",
      "family"
    ],
    "tags": [
      "city",
      "AI recommended",
      "World"
    ],
    "latitude": 35.2,
    "longitude": 119.7,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in New York.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Pizza",
      "bagel",
      "deli classics"
    ],
    "ratingAvg": 4.5,
    "reviewCount": 897,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for New York, Mỹ, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "New York local food walk",
      "New York sunrise viewpoint route",
      "New York culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "New York Boutique Stay",
        "nightlyPrice": 3850000,
        "rating": 4.5
      },
      {
        "name": "New York Smart Comfort Hotel",
        "nightlyPrice": 3650000,
        "rating": 4.3
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "New York felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_swiss-alps",
    "slug": "swiss-alps",
    "name": "Swiss Alps",
    "country": "Thụy Sĩ",
    "city": "Valais",
    "summary": "Swiss Alps is curated for mountain travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Swiss Alps blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "June to September",
    "budgetMin": 4200000,
    "budgetMax": 14000000,
    "currency": "VND",
    "travelStyles": [
      "mountain",
      "culture",
      "couple"
    ],
    "tags": [
      "mountain",
      "AI recommended",
      "World"
    ],
    "latitude": 36.4,
    "longitude": 120.4,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Valais.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Fondue",
      "rösti",
      "chocolate"
    ],
    "ratingAvg": 4.5,
    "reviewCount": 934,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Swiss Alps, Thụy Sĩ, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Swiss Alps local food walk",
      "Swiss Alps sunrise viewpoint route",
      "Swiss Alps culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Swiss Alps Boutique Stay",
        "nightlyPrice": 4550000,
        "rating": 4.5
      },
      {
        "name": "Swiss Alps Smart Comfort Hotel",
        "nightlyPrice": 4350000,
        "rating": 4.3
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Swiss Alps felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_santorini",
    "slug": "santorini",
    "name": "Santorini",
    "country": "Hy Lạp",
    "city": "Cyclades",
    "summary": "Santorini is curated for island travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Santorini blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "May to October",
    "budgetMin": 3600000,
    "budgetMax": 12000000,
    "currency": "VND",
    "travelStyles": [
      "island",
      "food",
      "couple"
    ],
    "tags": [
      "island",
      "AI recommended",
      "World"
    ],
    "latitude": 37.599999999999994,
    "longitude": 121.1,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in Cyclades.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Fava",
      "seafood",
      "Assyrtiko wine"
    ],
    "ratingAvg": 4.6,
    "reviewCount": 971,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Santorini, Hy Lạp, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Santorini local food walk",
      "Santorini sunrise viewpoint route",
      "Santorini culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Santorini Boutique Stay",
        "nightlyPrice": 3950000,
        "rating": 4.6
      },
      {
        "name": "Santorini Smart Comfort Hotel",
        "nightlyPrice": 3750000,
        "rating": 4.3999999999999995
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Santorini felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_sydney",
    "slug": "sydney",
    "name": "Sydney",
    "country": "Úc",
    "city": "New South Wales",
    "summary": "Sydney is curated for coast travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Sydney blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "September to November",
    "budgetMin": 3200000,
    "budgetMax": 9500000,
    "currency": "VND",
    "travelStyles": [
      "coast",
      "culture",
      "family"
    ],
    "tags": [
      "coast",
      "AI recommended",
      "World"
    ],
    "latitude": 38.8,
    "longitude": 121.8,
    "safetyLevel": "high",
    "cultureNotes": [
      "Respect local customs in New South Wales.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Seafood",
      "meat pie",
      "brunch"
    ],
    "ratingAvg": 4.7,
    "reviewCount": 1008,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Sydney, Úc, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Sydney local food walk",
      "Sydney sunrise viewpoint route",
      "Sydney culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Sydney Boutique Stay",
        "nightlyPrice": 3550000,
        "rating": 4.7
      },
      {
        "name": "Sydney Smart Comfort Hotel",
        "nightlyPrice": 3350000,
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Sydney felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  },
  {
    "id": "dst_dubai",
    "slug": "dubai",
    "name": "Dubai",
    "country": "UAE",
    "city": "Dubai",
    "summary": "Dubai is curated for luxury travelers with local food, seasonal guidance, mock stays, and assistant-ready planning context.",
    "longDescription": "Dubai blends place identity, practical planning, cultural notes, food discovery, and budget-aware experiences for ChillTravel demos.",
    "bestTimeToVisit": "November to March",
    "budgetMin": 2800000,
    "budgetMax": 12500000,
    "currency": "VND",
    "travelStyles": [
      "luxury",
      "food",
      "couple"
    ],
    "tags": [
      "luxury",
      "AI recommended",
      "World"
    ],
    "latitude": 40,
    "longitude": 122.5,
    "safetyLevel": "medium",
    "cultureNotes": [
      "Respect local customs in Dubai.",
      "Dress modestly for temples and sacred sites.",
      "Use locally verified transport where possible."
    ],
    "foodHighlights": [
      "Machboos",
      "mezze",
      "luxury dining"
    ],
    "ratingAvg": 4.7,
    "reviewCount": 1045,
    "isFeatured": false,
    "imagePrompt": "Premium cinematic travel poster for Dubai, UAE, no text, no logo, editorial realistic style, emerald teal and sunset orange grading.",
    "experiences": [
      "Dubai local food walk",
      "Dubai sunrise viewpoint route",
      "Dubai culture and hidden gems experience"
    ],
    "hotelsMock": [
      {
        "name": "Dubai Boutique Stay",
        "nightlyPrice": 3150000,
        "rating": 4.7
      },
      {
        "name": "Dubai Smart Comfort Hotel",
        "nightlyPrice": 2950000,
        "rating": 4.5
      }
    ],
    "reviews": [
      {
        "author": "Mai Anh",
        "rating": 5,
        "text": "Dubai felt easy to plan with the AI itinerary and culture notes."
      },
      {
        "author": "Alex Tran",
        "rating": 4,
        "text": "Good mock data for budget, food, and family-friendly activities."
      }
    ]
  }
];

export const demoAccounts = [
  { email: "admin@vietwander.ai", password: "Admin123!", role: "ADMIN" },
  { email: "user@vietwander.ai", password: "User123!", role: "USER" },
  { email: "guide@vietwander.ai", password: "Guide123!", role: "GUIDE" },
  { email: "host@vietwander.ai", password: "Host123!", role: "HOST" }
] as const;

export const demoPaymentMethods = [
  "MOCK_CARD",
  "MOCK_MOMO",
  "MOCK_VNPAY",
  "MOCK_ZALOPAY",
  "MOCK_PAYPAL",
  "MOCK_BANK_TRANSFER",
  "CASH_ON_ARRIVAL"
] as const;
