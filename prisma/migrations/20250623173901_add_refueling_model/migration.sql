-- CreateTable
CREATE TABLE "Refueling" (
    "id" TEXT NOT NULL,
    "refuelDatetime" TIMESTAMP(3) NOT NULL,
    "odometer" INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "isFull" BOOLEAN NOT NULL,
    "gasStand" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refueling_pkey" PRIMARY KEY ("id")
);
