import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Truy cập demo"
      title="Đăng nhập"
      summary="Dùng tài khoản demo cho quản trị viên, du khách, chủ nhà và hướng dẫn viên trong khi toàn bộ luồng xác thực vẫn chạy local và an toàn cho portfolio."
      details={[
        "admin@vietwander.ai / Admin123!",
        "user@vietwander.ai / User123!",
        "guide@vietwander.ai / Guide123!",
        "host@vietwander.ai / Host123!"
      ]}
      destinationOffset={0}
    />
  );
}
