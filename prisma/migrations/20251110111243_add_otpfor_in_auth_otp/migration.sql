-- CreateEnum
CREATE TYPE "public"."OTPFor" AS ENUM ('VERIFICATION', 'FORGOT_PASSWORD');

-- AlterTable
ALTER TABLE "public"."AuthOTP" ADD COLUMN     "otpFor" "public"."OTPFor" NOT NULL DEFAULT 'VERIFICATION';
