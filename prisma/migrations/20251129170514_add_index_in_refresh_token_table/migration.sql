-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'RECRUITER', 'CANDIDATE');

-- CreateEnum
CREATE TYPE "public"."AuthType" AS ENUM ('EMAIL', 'OAUTH');

-- CreateEnum
CREATE TYPE "public"."OTPFor" AS ENUM ('VERIFICATION', 'FORGOT_PASSWORD');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Level" AS ENUM ('NATIVE', 'FLUENT', 'BASIC');

-- CreateEnum
CREATE TYPE "public"."Degree" AS ENUM ('BACHELOR', 'MASTER', 'PHD');

-- CreateEnum
CREATE TYPE "public"."WorkPlace" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."TeamSizeRange" AS ENUM ('ZERO_TO_ONE', 'TWO_TO_TEN', 'ELEVEN_TO_FIFTY', 'FIFTY_ONE_TO_TWO_HUNDRED', 'TWO_HUNDRED_ONE_TO_FIVE_HUNDRED', 'FIVE_HUNDRED_ONE_TO_ONE_THOUSAND', 'OVER_ONE_THOUSAND');

-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ApplyStatus" AS ENUM ('PENDING', 'VIEWED', 'SELECTED', 'NOTSELECT', 'INTOUCH');

-- CreateEnum
CREATE TYPE "public"."RecruiterPackageStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('CREATED', 'ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED', 'HALTED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('SUCCESSFUL', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'CANDIDATE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "authType" "public"."AuthType" NOT NULL DEFAULT 'EMAIL',
    "ProviderAuthId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuthOTP" (
    "id" SERIAL NOT NULL,
    "otpCode" INTEGER,
    "expiresAt" TIMESTAMP(3),
    "lastOtpSentAt" TIMESTAMP(3),
    "resendCount" INTEGER NOT NULL DEFAULT 0,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockUntil" TIMESTAMP(3),
    "otpFor" "public"."OTPFor" NOT NULL DEFAULT 'VERIFICATION',
    "resetToken" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuthOTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandidateProfile" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "phone" TEXT NOT NULL,
    "cv" TEXT NOT NULL,
    "birthDate" DATE NOT NULL,
    "address" TEXT NOT NULL,
    "openToWork" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Language" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."CandidateLanguage" (
    "level" "public"."Level" NOT NULL DEFAULT 'BASIC',
    "candidateProfileId" INTEGER NOT NULL,
    "languageName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Education" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "map" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandidateEducation" (
    "major" TEXT NOT NULL,
    "degree" "public"."Degree" NOT NULL DEFAULT 'BACHELOR',
    "yearStart" INTEGER NOT NULL,
    "yearEnd" INTEGER NOT NULL,
    "candidateProfileId" INTEGER NOT NULL,
    "educationId" INTEGER NOT NULL,

    CONSTRAINT "CandidateEducation_pkey" PRIMARY KEY ("candidateProfileId","educationId")
);

-- CreateTable
CREATE TABLE "public"."Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandidateSkill" (
    "id" SERIAL NOT NULL,
    "candidateProfileId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "CandidateSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandidateExperience" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currentlyWorking" BOOLEAN NOT NULL DEFAULT false,
    "workPlace" "public"."WorkPlace" NOT NULL DEFAULT 'ONSITE',
    "location" TEXT NOT NULL,
    "candidateProfileId" INTEGER NOT NULL,

    CONSTRAINT "CandidateExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "mapLink" TEXT,
    "websiteUrl" TEXT,
    "teamSizeLabel" "public"."TeamSizeRange",
    "totalEmployees" INTEGER NOT NULL,
    "establishedDate" TIMESTAMP(3) NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "CompanyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Industry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyIndustry" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "industryId" INTEGER NOT NULL,

    CONSTRAINT "CompanyIndustry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "workplace" "public"."WorkPlace" NOT NULL,
    "status" "public"."JobStatus" NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "postedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationDeadline" DATE NOT NULL,
    "updateAt" TIMESTAMP(3),
    "totalview" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "companyId" INTEGER NOT NULL,
    "postById" INTEGER NOT NULL,
    "jobRoleId" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobSkill" (
    "jobId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "JobSkill_pkey" PRIMARY KEY ("jobId","skillId")
);

-- CreateTable
CREATE TABLE "public"."Benefit" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Benefit_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."JobBenefit" (
    "jobId" INTEGER NOT NULL,
    "benefitName" TEXT NOT NULL,

    CONSTRAINT "JobBenefit_pkey" PRIMARY KEY ("jobId","benefitName")
);

-- CreateTable
CREATE TABLE "public"."Apply" (
    "id" SERIAL NOT NULL,
    "applyDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ApplyStatus" NOT NULL DEFAULT 'PENDING',
    "companyId" INTEGER NOT NULL,
    "candidateProfileId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Apply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Package" (
    "id" SERIAL NOT NULL,
    "planId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "jobPostLimit" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CheckLimitForRecruiter" (
    "id" SERIAL NOT NULL,
    "jobCount" INTEGER NOT NULL DEFAULT 0,
    "recruiterId" INTEGER NOT NULL,

    CONSTRAINT "CheckLimitForRecruiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecruiterPackage" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATE,
    "razorpaySubscriptionId" TEXT,
    "status" "public"."RecruiterPackageStatus" NOT NULL,
    "billingCycleCount" INTEGER DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "RecruiterPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" SERIAL NOT NULL,
    "razorpaySubscriptionId" TEXT NOT NULL,
    "razorpayPlanId" TEXT NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "totalCount" INTEGER,
    "paidCount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recruiterId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentHistory" (
    "id" SERIAL NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySubscriptionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "public"."PaymentStatus" NOT NULL,
    "paymentMethod" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" SERIAL NOT NULL,
    "candidateProfileId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "messages" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "public"."RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_token_userId_idx" ON "public"."RefreshToken"("token", "userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "public"."RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthOTP_userId_key" ON "public"."AuthOTP"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_phone_key" ON "public"."CandidateProfile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_userId_key" ON "public"."CandidateProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateLanguage_candidateProfileId_languageName_key" ON "public"."CandidateLanguage"("candidateProfileId", "languageName");

-- CreateIndex
CREATE UNIQUE INDEX "Education_name_key" ON "public"."Education"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "public"."Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSkill_candidateProfileId_skillId_key" ON "public"."CandidateSkill"("candidateProfileId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateExperience_id_candidateProfileId_key" ON "public"."CandidateExperience"("id", "candidateProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "public"."Industry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyIndustry_companyId_industryId_key" ON "public"."CompanyIndustry"("companyId", "industryId");

-- CreateIndex
CREATE UNIQUE INDEX "JobRole_name_key" ON "public"."JobRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Apply_candidateProfileId_jobId_key" ON "public"."Apply"("candidateProfileId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckLimitForRecruiter_recruiterId_key" ON "public"."CheckLimitForRecruiter"("recruiterId");

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterPackage_razorpaySubscriptionId_key" ON "public"."RecruiterPackage"("razorpaySubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterPackage_userId_key" ON "public"."RecruiterPackage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_razorpaySubscriptionId_key" ON "public"."Subscription"("razorpaySubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentHistory_razorpayPaymentId_key" ON "public"."PaymentHistory"("razorpayPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chatRoomId_key" ON "public"."Chat"("chatRoomId");

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthOTP" ADD CONSTRAINT "AuthOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateProfile" ADD CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateLanguage" ADD CONSTRAINT "CandidateLanguage_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateLanguage" ADD CONSTRAINT "CandidateLanguage_languageName_fkey" FOREIGN KEY ("languageName") REFERENCES "public"."Language"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateEducation" ADD CONSTRAINT "CandidateEducation_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateEducation" ADD CONSTRAINT "CandidateEducation_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "public"."Education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateSkill" ADD CONSTRAINT "CandidateSkill_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateSkill" ADD CONSTRAINT "CandidateSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateExperience" ADD CONSTRAINT "CandidateExperience_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyImage" ADD CONSTRAINT "CompanyImage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyIndustry" ADD CONSTRAINT "CompanyIndustry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyIndustry" ADD CONSTRAINT "CompanyIndustry_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "public"."Industry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_postById_fkey" FOREIGN KEY ("postById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "public"."JobRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobSkill" ADD CONSTRAINT "JobSkill_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobSkill" ADD CONSTRAINT "JobSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobBenefit" ADD CONSTRAINT "JobBenefit_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobBenefit" ADD CONSTRAINT "JobBenefit_benefitName_fkey" FOREIGN KEY ("benefitName") REFERENCES "public"."Benefit"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Apply" ADD CONSTRAINT "Apply_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Apply" ADD CONSTRAINT "Apply_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Apply" ADD CONSTRAINT "Apply_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CheckLimitForRecruiter" ADD CONSTRAINT "CheckLimitForRecruiter_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentHistory" ADD CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
