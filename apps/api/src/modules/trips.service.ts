import { Injectable } from '@nestjs/common';
import { buildDemoItinerary, destinations } from '@vietwander/shared';

@Injectable()
export class TripsService {
  wishlist() {
    return destinations.filter((destination) => destination.isFeatured).slice(0, 6);
  }

  trips() {
    return [
      {
        id: 'trip_da_nang_food',
        title: 'Đà Nẵng food and beach weekend',
        plan: buildDemoItinerary(destinations[5]!, 4),
      },
      {
        id: 'trip_world_bucket',
        title: 'Tokyo and Seoul city lights',
        plan: buildDemoItinerary(destinations[12]!, 5),
      },
    ];
  }
}
