import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * DashboardService — aggregated statistics for the Admin Dashboard.
 *
 * Implements Req 17 / Design §8.
 *
 * Revenue definition:
 *   totalRevenue = SUM(totalAmount) WHERE paymentStatus = 'confirmed_mock'
 *   (confirmed_mock is the PAID state in the WanderViet PaymentStatus enum)
 */
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================================
  // GET /admin/dashboard/summary
  // =========================================================================

  /**
   * Returns aggregate counts and total revenue.
   *
   * {
   *   totalRevenue:       number  — sum of totalAmount for confirmed_mock bookings
   *   totalBookings:      number  — count of all bookings
   *   pendingBookings:    number  — count of bookings with status=pending
   *   totalUsers:         number  — count of ACTIVE users
   *   totalTours:         number  — count of ACTIVE tours
   *   totalDestinations:  number  — count of ACTIVE destinations
   * }
   */
  async getSummary() {
    const [
      revenueAgg,
      totalBookings,
      pendingBookings,
      totalUsers,
      totalTours,
      totalDestinations
    ] = await Promise.all([
      // Revenue = sum of totalAmount where paymentStatus = confirmed_mock
      this.prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "confirmed_mock" }
      }),
      // All bookings
      this.prisma.booking.count(),
      // Pending bookings
      this.prisma.booking.count({ where: { status: "pending" } }),
      // Active users
      this.prisma.user.count({ where: { status: "ACTIVE" } }),
      // Active tours
      this.prisma.tour.count({ where: { status: "ACTIVE" } }),
      // Active destinations
      this.prisma.destination.count({ where: { status: "ACTIVE" } })
    ]);

    return {
      totalRevenue: revenueAgg._sum.totalAmount ?? 0,
      totalBookings,
      pendingBookings,
      totalUsers,
      totalTours,
      totalDestinations
    };
  }

  // =========================================================================
  // GET /admin/dashboard/revenue
  // =========================================================================

  /**
   * Returns revenue grouped by month for the last 12 months.
   *
   * Uses a raw SQL query to group by year-month because Prisma groupBy does
   * not support date truncation natively.
   *
   * Returns: Array<{ month: "YYYY-MM", revenue: number }>
   * Months with no revenue are included with revenue = 0.
   */
  async getRevenue(): Promise<Array<{ month: string; revenue: number }>> {
    // Build the last 12 month labels (YYYY-MM) in ascending order
    const months: string[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      months.push(`${yyyy}-${mm}`);
    }

    // Raw query: group confirmed_mock bookings by YYYY-MM
    const rows = await this.prisma.$queryRaw<
      Array<{ month: string; revenue: bigint }>
    >`
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM') AS month,
        SUM("totalAmount")              AS revenue
      FROM "Booking"
      WHERE
        "paymentStatus" = 'confirmed_mock'
        AND "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month ASC
    `;

    // Build a lookup map from the raw results
    const revenueMap = new Map<string, number>();
    for (const row of rows) {
      // BigInt → number (safe for VND amounts in typical ranges)
      revenueMap.set(row.month, Number(row.revenue));
    }

    // Merge with the full 12-month list (fill zeros for missing months)
    return months.map((month) => ({
      month,
      revenue: revenueMap.get(month) ?? 0
    }));
  }

  // =========================================================================
  // GET /admin/dashboard/bookings
  // =========================================================================

  /**
   * Returns booking counts grouped by status.
   *
   * {
   *   pending:       number
   *   confirmed:     number
   *   cancelled:     number
   *   completed:     number
   *   refunded_mock: number
   * }
   */
  async getBookingsByStatus() {
    const statuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "refunded_mock"
    ] as const;

    const counts = await Promise.all(
      statuses.map((status) =>
        this.prisma.booking.count({ where: { status } })
      )
    );

    return {
      pending: counts[0],
      confirmed: counts[1],
      cancelled: counts[2],
      completed: counts[3],
      refunded_mock: counts[4]
    };
  }

  // =========================================================================
  // GET /admin/dashboard/top-tours
  // =========================================================================

  /**
   * Returns the top `limit` tours ordered by booking count (descending).
   *
   * Each item: { id, title, slug, imageUrl, bookingCount }
   */
  async getTopTours(limit = 10) {
    // Use Prisma groupBy on Booking.tourId to count bookings per tour
    const grouped = await this.prisma.booking.groupBy({
      by: ["tourId"],
      _count: { id: true },
      where: { tourId: { not: null } },
      orderBy: { _count: { id: "desc" } },
      take: limit
    });

    if (grouped.length === 0) return [];

    // Fetch tour details for the grouped tour IDs
    const tourIds = grouped
      .map((g) => g.tourId)
      .filter((id): id is string => id !== null);

    const tours = await this.prisma.tour.findMany({
      where: { id: { in: tourIds } },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true
      }
    });

    // Build a lookup map
    const tourMap = new Map(tours.map((t) => [t.id, t]));

    // Merge booking counts with tour details, preserving order
    return grouped
      .filter((g) => g.tourId !== null && tourMap.has(g.tourId as string))
      .map((g) => {
        const tour = tourMap.get(g.tourId as string)!;
        return {
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          imageUrl: tour.imageUrl,
          bookingCount: g._count.id
        };
      });
  }

  // =========================================================================
  // GET /admin/dashboard/recent-activities
  // =========================================================================

  /**
   * Returns merged recent activities:
   *   recentBookings:  last 10 bookings (with user + tour info)
   *   recentContacts:  last 5 contact requests
   *   pendingReviews:  last 5 reviews with status=PENDING
   */
  async getRecentActivities() {
    const [recentBookings, recentContacts, pendingReviews] = await Promise.all([
      this.prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          bookingCode: true,
          status: true,
          paymentStatus: true,
          totalAmount: true,
          numberOfGuests: true,
          contactName: true,
          contactEmail: true,
          createdAt: true,
          user: {
            select: { id: true, email: true, fullName: true }
          },
          tour: {
            select: { id: true, title: true, slug: true, imageUrl: true }
          }
        }
      }),
      this.prisma.contactRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          status: true,
          destinationInterested: true,
          createdAt: true
        }
      }),
      this.prisma.review.findMany({
        take: 5,
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          status: true,
          createdAt: true,
          user: {
            select: { id: true, email: true, fullName: true }
          },
          tour: {
            select: { id: true, title: true, slug: true }
          }
        }
      })
    ]);

    return {
      recentBookings,
      recentContacts,
      pendingReviews
    };
  }

  // =========================================================================
  // GET /admin/users
  // =========================================================================

  /**
   * Returns paginated list of all users (read-only).
   */
  async getUsers(params: { page: number; size: number; keyword?: string }) {
    const { page, size, keyword } = params;
    const skip = page * size;

    const where = keyword
      ? {
          OR: [
            { email: { contains: keyword, mode: "insensitive" as const } },
            { fullName: { contains: keyword, mode: "insensitive" as const } }
          ]
        }
      : {};

    const [items, totalElements] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true
        }
      }),
      this.prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalElements / size);
    return {
      items,
      page,
      size,
      totalElements,
      totalPages,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0
    };
  }
}
