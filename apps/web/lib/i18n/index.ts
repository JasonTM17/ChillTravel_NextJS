export type Lang = "vi" | "en";

export const translations = {
  vi: {
    nav: {
      home: "Trang chủ",
      explore: "Khám phá",
      tours: "Tour",
      destinations: "Điểm đến",
      blog: "Blog",
      login: "Đăng nhập",
      register: "Đăng ký",
      profile: "Hồ sơ",
      myBookings: "Đặt chỗ của tôi",
      wishlist: "Yêu thích",
      logout: "Đăng xuất",
      admin: "Quản trị",
    },
    common: {
      search: "Tìm kiếm",
      loading: "Đang tải...",
      error: "Có lỗi xảy ra",
      retry: "Thử lại",
      save: "Lưu",
      cancel: "Hủy",
      delete: "Xóa",
      edit: "Sửa",
      add: "Thêm",
      confirm: "Xác nhận",
      back: "Quay lại",
      viewAll: "Xem tất cả",
      viewDetail: "Xem chi tiết",
    },
    booking: {
      book: "Đặt tour",
      guests: "Khách",
      departure: "Ngày khởi hành",
      coupon: "Mã giảm giá",
      total: "Tổng cộng",
      paymentWarning: "Thanh toán demo — không phát sinh giao dịch thật",
    },
    status: {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      completed: "Hoàn thành",
      active: "Hoạt động",
      inactive: "Ẩn",
    },
  },
  en: {
    nav: {
      home: "Home",
      explore: "Explore",
      tours: "Tours",
      destinations: "Destinations",
      blog: "Blog",
      login: "Login",
      register: "Register",
      profile: "Profile",
      myBookings: "My Bookings",
      wishlist: "Wishlist",
      logout: "Logout",
      admin: "Admin",
    },
    common: {
      search: "Search",
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      confirm: "Confirm",
      back: "Back",
      viewAll: "View all",
      viewDetail: "View detail",
    },
    booking: {
      book: "Book tour",
      guests: "Guests",
      departure: "Departure date",
      coupon: "Coupon code",
      total: "Total",
      paymentWarning: "Demo payment — no real transaction",
    },
    status: {
      pending: "Pending",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      completed: "Completed",
      active: "Active",
      inactive: "Hidden",
    },
  },
} as const;

export type Translations = typeof translations.vi;

export function getTranslations(lang: Lang): Translations {
  return translations[lang] as Translations;
}
