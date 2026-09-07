-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "educationInfo" JSONB,
ADD COLUMN     "highlights" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "stats" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "techTags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "summary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "social_links" ADD COLUMN     "icon" TEXT;

-- CreateTable
CREATE TABLE "profile_skill_categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "colSpan" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "profile_skill_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_skill_category_skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "profile_skill_category_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cvs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_logs" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "download_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "download_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profile_skill_categories_profileId_order_idx" ON "profile_skill_categories"("profileId", "order");

-- CreateIndex
CREATE INDEX "profile_skill_category_skills_categoryId_order_idx" ON "profile_skill_category_skills"("categoryId", "order");

-- CreateIndex
CREATE INDEX "visit_logs_visitorId_idx" ON "visit_logs"("visitorId");

-- CreateIndex
CREATE INDEX "visit_logs_country_idx" ON "visit_logs"("country");

-- AddForeignKey
ALTER TABLE "profile_skill_categories" ADD CONSTRAINT "profile_skill_categories_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_skill_category_skills" ADD CONSTRAINT "profile_skill_category_skills_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "profile_skill_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
