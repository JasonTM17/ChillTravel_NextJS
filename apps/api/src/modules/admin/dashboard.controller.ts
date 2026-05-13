import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

/**
 * DashboardController — Admin Dashboard endpoints.
 *
 * All routes require ADMIN role (enforced by global RolesGuard + @Roles).
 *
 * Endpoints:
 *   GET /admin/dashboard/summary           — aggregate counts + total revenue
 *   GET /admin/dashboard/revenue           — revenue by month (last 12 months)
 *   GET /admin/dashboard/bookings          — booking counts by status
 *   GET /admin/dashboard/top-tours         — top 10 tours by booking count
 *   GET /admin/dashboard/recent-activities — recent bookings, contacts, reviews
 *
 * Req 17 / Design §8.
 */
@ApiTags('Admin — Dashboard')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // =========================================================================
  // GET /admin/dashboard/summary
  // =========================================================================

  @Get('summary')
  @ApiOperation({
    summary: 'Dashboard summary (Admin)',
    description:
      'Returns aggregate overview: totalRevenue (confirmed_mock bookings), ' +
      'totalBookings, pendingBookings, totalUsers (ACTIVE), totalTours (ACTIVE), ' +
      'totalDestinations (ACTIVE).',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary statistics',
    schema: {
      example: {
        success: true,
        message: 'Success',
        data: {
          totalRevenue: 125000000,
          totalBookings: 42,
          pendingBookings: 8,
          totalUsers: 150,
          totalTours: 8,
          totalDestinations: 12,
        },
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  // =========================================================================
  // GET /admin/dashboard/revenue
  // =========================================================================

  @Get('revenue')
  @ApiOperation({
    summary: 'Revenue by month (Admin)',
    description:
      'Returns revenue grouped by month for the last 12 months. ' +
      'Revenue = sum of totalAmount for bookings with paymentStatus=confirmed_mock. ' +
      'Months with no revenue are included with revenue=0.',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly revenue for the last 12 months',
    schema: {
      example: {
        success: true,
        message: 'Success',
        data: [
          { month: '2025-02', revenue: 0 },
          { month: '2025-03', revenue: 15000000 },
          { month: '2026-01', revenue: 45000000 },
        ],
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  getRevenue() {
    return this.dashboardService.getRevenue();
  }

  // =========================================================================
  // GET /admin/dashboard/bookings
  // =========================================================================

  @Get('bookings')
  @ApiOperation({
    summary: 'Booking counts by status (Admin)',
    description:
      'Returns the count of bookings for each status: ' +
      'pending, confirmed, cancelled, completed, refunded_mock.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking counts grouped by status',
    schema: {
      example: {
        success: true,
        message: 'Success',
        data: {
          pending: 8,
          confirmed: 15,
          cancelled: 3,
          completed: 14,
          refunded_mock: 2,
        },
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  getBookingsByStatus() {
    return this.dashboardService.getBookingsByStatus();
  }

  // =========================================================================
  // GET /admin/dashboard/top-tours
  // =========================================================================

  @Get('top-tours')
  @ApiOperation({
    summary: 'Top tours by booking count (Admin)',
    description:
      'Returns the top 10 tours ordered by total booking count (descending). ' +
      'Each item includes: id, title, slug, imageUrl, bookingCount.',
  })
  @ApiResponse({
    status: 200,
    description: 'Top 10 tours by booking count',
    schema: {
      example: {
        success: true,
        message: 'Success',
        data: [
          {
            id: 'clxxx',
            title: 'Hạ Long Bay 3N2Đ',
            slug: 'ha-long-bay-3n2d',
            imageUrl: 'https://example.com/halong.jpg',
            bookingCount: 12,
          },
        ],
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  getTopTours() {
    return this.dashboardService.getTopTours(10);
  }

  // =========================================================================
  // GET /admin/dashboard/recent-activities
  // =========================================================================

  @Get('recent-activities')
  @ApiOperation({
    summary: 'Recent activities (Admin)',
    description:
      'Returns merged recent activities: ' +
      'recentBookings (last 10 with user + tour info), ' +
      'recentContacts (last 5 contact requests), ' +
      'pendingReviews (last 5 reviews with status=PENDING).',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activities across bookings, contacts, and reviews',
    schema: {
      example: {
        success: true,
        message: 'Success',
        data: {
          recentBookings: [],
          recentContacts: [],
          pendingReviews: [],
        },
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN role required' })
  getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }
}
