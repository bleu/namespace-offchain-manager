-- CreateTable
CREATE TABLE "subscription_packs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxSubnames" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subnames" (
    "id" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contenthash" TEXT,
    "subscriptionPackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subnames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subname_texts" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "subnameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subname_texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subname_addresses" (
    "id" TEXT NOT NULL,
    "coin" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "subnameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subname_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subnames_name_idx" ON "subnames"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subnames_parentName_label_key" ON "subnames"("parentName", "label");

-- CreateIndex
CREATE UNIQUE INDEX "subname_texts_subnameId_key_key" ON "subname_texts"("subnameId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "subname_addresses_subnameId_coin_key" ON "subname_addresses"("subnameId", "coin");

-- AddForeignKey
ALTER TABLE "subnames" ADD CONSTRAINT "subnames_subscriptionPackId_fkey" FOREIGN KEY ("subscriptionPackId") REFERENCES "subscription_packs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subname_texts" ADD CONSTRAINT "subname_texts_subnameId_fkey" FOREIGN KEY ("subnameId") REFERENCES "subnames"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subname_addresses" ADD CONSTRAINT "subname_addresses_subnameId_fkey" FOREIGN KEY ("subnameId") REFERENCES "subnames"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
