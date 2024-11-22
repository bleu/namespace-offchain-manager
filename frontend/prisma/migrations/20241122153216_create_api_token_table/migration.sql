-- CreateTable
CREATE TABLE "ApiToken" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKeyDigest" TEXT NOT NULL,
    "ensOwner" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiToken_apiKeyDigest_key" ON "ApiToken"("apiKeyDigest");

-- CreateIndex
CREATE INDEX "ApiToken_ensOwner_idx" ON "ApiToken"("ensOwner");
