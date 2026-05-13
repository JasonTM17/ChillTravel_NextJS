/**
 * Sovereignty GeoData Constants
 *
 * Static geographic data for Vietnam's Hoang Sa (Paracel) and Truong Sa (Spratly)
 * archipelagos. Includes island markers with multilingual names and archipelago
 * configuration for map rendering.
 *
 * Requirements: 4.1, 4.5, 5.1, 5.5
 */

export interface IslandMarker {
  id: string;
  nameVi: string;
  nameEn: string;
  nameJa: string;
  coordinates: [number, number]; // [lat, lng]
  archipelago: 'hoang-sa' | 'truong-sa';
}

export interface ArchipelagoConfig {
  center: [number, number];
  radiusKm: number;
  labelVisibleZoomRange: [number, number];
  islandVisibleMinZoom: number;
  islands: IslandMarker[];
}

// ─── Hoang Sa (Paracel Islands) ──────────────────────────────────────────────

export const HOANG_SA_ISLANDS: IslandMarker[] = [
  {
    id: 'phu-lam',
    nameVi: 'Đảo Phú Lâm',
    nameEn: 'Woody Island',
    nameJa: 'ウッディー島',
    coordinates: [16.8361, 112.3383],
    archipelago: 'hoang-sa',
  },
  {
    id: 'linh-con',
    nameVi: 'Đảo Linh Côn',
    nameEn: 'Lincoln Island',
    nameJa: 'リンカーン島',
    coordinates: [16.67, 112.73],
    archipelago: 'hoang-sa',
  },
  {
    id: 'tri-ton',
    nameVi: 'Đảo Tri Tôn',
    nameEn: 'Triton Island',
    nameJa: 'トリトン島',
    coordinates: [15.7833, 111.2],
    archipelago: 'hoang-sa',
  },
  {
    id: 'hoang-sa',
    nameVi: 'Đảo Hoàng Sa',
    nameEn: 'Pattle Island',
    nameJa: 'パトル島',
    coordinates: [16.53, 111.59],
    archipelago: 'hoang-sa',
  },
  {
    id: 'quang-anh',
    nameVi: 'Đảo Quang Ảnh',
    nameEn: 'Money Island',
    nameJa: 'マネー島',
    coordinates: [16.45, 111.51],
    archipelago: 'hoang-sa',
  },
];

// ─── Truong Sa (Spratly Islands) ─────────────────────────────────────────────

export const TRUONG_SA_ISLANDS: IslandMarker[] = [
  {
    id: 'truong-sa-lon',
    nameVi: 'Đảo Trường Sa Lớn',
    nameEn: 'Spratly Island',
    nameJa: 'スプラトリー島',
    coordinates: [8.6433, 111.9183],
    archipelago: 'truong-sa',
  },
  {
    id: 'song-tu-tay',
    nameVi: 'Đảo Song Tử Tây',
    nameEn: 'Southwest Cay',
    nameJa: 'サウスウェスト・ケイ',
    coordinates: [11.43, 114.33],
    archipelago: 'truong-sa',
  },
  {
    id: 'sinh-ton',
    nameVi: 'Đảo Sinh Tồn',
    nameEn: 'Sin Cowe Island',
    nameJa: 'シンコウ島',
    coordinates: [9.8833, 114.3333],
    archipelago: 'truong-sa',
  },
  {
    id: 'nam-yet',
    nameVi: 'Đảo Nam Yết',
    nameEn: 'Namyit Island',
    nameJa: 'ナムイット島',
    coordinates: [10.1833, 114.3667],
    archipelago: 'truong-sa',
  },
  {
    id: 'son-ca',
    nameVi: 'Đảo Sơn Ca',
    nameEn: 'Sand Cay',
    nameJa: 'サンドケイ',
    coordinates: [10.3833, 114.4833],
    archipelago: 'truong-sa',
  },
  {
    id: 'phan-vinh',
    nameVi: 'Đảo Phan Vinh',
    nameEn: 'Pearson Reef',
    nameJa: 'ピアソン礁',
    coordinates: [8.95, 113.6833],
    archipelago: 'truong-sa',
  },
  {
    id: 'da-lat',
    nameVi: 'Đá Lát',
    nameEn: 'Ladd Reef',
    nameJa: 'ラッド礁',
    coordinates: [8.6667, 111.6667],
    archipelago: 'truong-sa',
  },
  {
    id: 'an-bang',
    nameVi: 'Đảo An Bang',
    nameEn: 'Amboyna Cay',
    nameJa: 'アンボイナ・ケイ',
    coordinates: [7.8833, 112.9167],
    archipelago: 'truong-sa',
  },
];

// ─── Archipelago Configurations ──────────────────────────────────────────────

export const HOANG_SA_CONFIG: ArchipelagoConfig = {
  center: [16.5, 112.0],
  radiusKm: 80,
  labelVisibleZoomRange: [5, 10],
  islandVisibleMinZoom: 7,
  islands: HOANG_SA_ISLANDS,
};

export const TRUONG_SA_CONFIG: ArchipelagoConfig = {
  center: [8.65, 111.92],
  radiusKm: 120,
  labelVisibleZoomRange: [4, 10],
  islandVisibleMinZoom: 6,
  islands: TRUONG_SA_ISLANDS,
};
