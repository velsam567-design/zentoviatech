-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'CLOSED');

-- CreateEnum
CREATE TYPE "EnquiryPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "EnquirySource" AS ENUM ('WEBSITE', 'CONTACT_FORM', 'PROJECT_BUILDER', 'WHATSAPP', 'INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'YOUTUBE', 'REFERRAL', 'DIRECT', 'OTHER');

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "service" TEXT,
    "solution" TEXT,
    "budget" TEXT,
    "message" TEXT,
    "source" "EnquirySource" NOT NULL DEFAULT 'WEBSITE',
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "priority" "EnquiryPriority" NOT NULL DEFAULT 'MEDIUM',
    "assignedToId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnquiryActivity" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnquiryActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");

-- CreateIndex
CREATE INDEX "Enquiry_priority_idx" ON "Enquiry"("priority");

-- CreateIndex
CREATE INDEX "Enquiry_source_idx" ON "Enquiry"("source");

-- CreateIndex
CREATE INDEX "Enquiry_assignedToId_idx" ON "Enquiry"("assignedToId");

-- CreateIndex
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_email_idx" ON "Enquiry"("email");

-- CreateIndex
CREATE INDEX "EnquiryActivity_enquiryId_idx" ON "EnquiryActivity"("enquiryId");

-- CreateIndex
CREATE INDEX "EnquiryActivity_userId_idx" ON "EnquiryActivity"("userId");

-- CreateIndex
CREATE INDEX "EnquiryActivity_type_idx" ON "EnquiryActivity"("type");

-- CreateIndex
CREATE INDEX "EnquiryActivity_createdAt_idx" ON "EnquiryActivity"("createdAt");

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryActivity" ADD CONSTRAINT "EnquiryActivity_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryActivity" ADD CONSTRAINT "EnquiryActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
