-- CreateTable
CREATE TABLE "PromoBanner" (
    "id" TEXT NOT NULL,
    "titleVi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleJa" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashSaleItem" (
    "id" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "maxQuantity" INTEGER NOT NULL DEFAULT 10,
    "soldCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FlashSaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromoBanner_isActive_startDate_endDate_idx" ON "PromoBanner"("isActive", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "FlashSaleItem_isActive_endTime_idx" ON "FlashSaleItem"("isActive", "endTime");

-- CreateIndex
CREATE INDEX "FlashSaleItem_itemType_itemId_idx" ON "FlashSaleItem"("itemType", "itemId");
