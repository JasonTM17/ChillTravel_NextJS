-- CreateTable
CREATE TABLE "AirlineMock" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameVi" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameJa" TEXT NOT NULL,
    "logoUrl" TEXT,

    CONSTRAINT "AirlineMock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightMock" (
    "id" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "stops" INTEGER NOT NULL DEFAULT 0,
    "layoverCity" TEXT,
    "layoverMin" INTEGER,
    "cabinClass" TEXT NOT NULL DEFAULT 'economy',
    "basePrice" INTEGER NOT NULL,
    "taxAmount" INTEGER NOT NULL,
    "seatsAvailable" INTEGER NOT NULL DEFAULT 180,

    CONSTRAINT "FlightMock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AirlineMock_code_key" ON "AirlineMock"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FlightMock_flightNumber_key" ON "FlightMock"("flightNumber");

-- CreateIndex
CREATE INDEX "FlightMock_origin_destination_departureTime_idx" ON "FlightMock"("origin", "destination", "departureTime");

-- CreateIndex
CREATE INDEX "FlightMock_cabinClass_idx" ON "FlightMock"("cabinClass");

-- AddForeignKey
ALTER TABLE "FlightMock" ADD CONSTRAINT "FlightMock_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "AirlineMock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
