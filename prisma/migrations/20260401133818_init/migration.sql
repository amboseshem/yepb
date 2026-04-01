-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'active', 'suspended', 'blocked', 'archived');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('pending', 'active', 'inactive', 'suspended', 'exited');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "MaritalStatusType" AS ENUM ('single', 'married', 'engaged', 'widowed', 'separated');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'declined', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('cash', 'mpesa', 'bank', 'wallet', 'card', 'other');

-- CreateEnum
CREATE TYPE "ContributionFrequency" AS ENUM ('once', 'weekly', 'monthly', 'quarterly', 'yearly');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('pending', 'confirmed', 'rejected', 'refunded');

-- CreateEnum
CREATE TYPE "AllocationType" AS ENUM ('savings', 'welfare', 'project_fund', 'rotational_support', 'training', 'other');

-- CreateEnum
CREATE TYPE "WelfareRequestType" AS ENUM ('medical', 'bereavement', 'emergency', 'school_support', 'family_crisis', 'other');

-- CreateEnum
CREATE TYPE "WelfareStatus" AS ENUM ('pending', 'under_review', 'approved', 'declined', 'disbursed', 'closed');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'pending_approval', 'active', 'paused', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProjectTransactionType" AS ENUM ('capital', 'expense', 'income', 'profit_share', 'maintenance', 'adjustment');

-- CreateEnum
CREATE TYPE "AudienceType" AS ENUM ('all_members', 'leaders', 'branch_members', 'project_team', 'custom_group', 'public');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('physical', 'online', 'hybrid');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'excused', 'late');

-- CreateEnum
CREATE TYPE "ContentTypeEnum" AS ENUM ('video', 'pdf', 'audio', 'article', 'live_session', 'image', 'link');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "CompletionStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "WalletTypeEnum" AS ENUM ('contribution_wallet', 'earnings_wallet', 'savings_wallet', 'project_wallet');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('active', 'frozen', 'closed');

-- CreateEnum
CREATE TYPE "WalletTxnType" AS ENUM ('contribution', 'commission', 'withdrawal', 'transfer', 'welfare_disbursement', 'project_profit', 'adjustment', 'deposit', 'purchase', 'refund');

-- CreateEnum
CREATE TYPE "TxnDirection" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('pending', 'approved', 'declined', 'paid', 'cancelled');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('pending', 'active', 'cancelled', 'inactive');

-- CreateEnum
CREATE TYPE "CommissionTriggerType" AS ENUM ('signup', 'product_purchase', 'subscription', 'renewal', 'manual_bonus');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('pending', 'approved', 'paid', 'rejected', 'reversed');

-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('pending', 'contacted', 'approved', 'declined', 'converted');

-- CreateEnum
CREATE TYPE "TestimonialStatus" AS ENUM ('pending', 'approved', 'rejected', 'published', 'archived');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "OrderPaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('draft', 'placed', 'processing', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('in_app', 'sms', 'email', 'whatsapp_manual');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('pending', 'sent', 'failed', 'read');

-- CreateEnum
CREATE TYPE "AppAccessEnum" AS ENUM ('website', 'member_portal', 'admin_panel', 'training_center', 'finance', 'projects', 'referrals');

-- CreateTable
CREATE TABLE "Role" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" BIGSERIAL NOT NULL,
    "roleId" BIGINT NOT NULL,
    "permissionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "fullName" VARCHAR(200) NOT NULL,
    "username" VARCHAR(100),
    "email" VARCHAR(200),
    "phone" VARCHAR(30) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roleId" BIGINT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAppAccess" (
    "id" BIGSERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "appName" "AppAccessEnum" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAppAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(50),
    "location" VARCHAR(200),
    "leaderName" VARCHAR(200),
    "contactPhone" VARCHAR(30),
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberProfile" (
    "id" BIGSERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "memberNumber" VARCHAR(50) NOT NULL,
    "gender" "GenderType",
    "dateOfBirth" TIMESTAMP(3),
    "nationalId" VARCHAR(50),
    "churchBranchId" BIGINT,
    "occupation" VARCHAR(150),
    "maritalStatus" "MaritalStatusType",
    "nextOfKinName" VARCHAR(200),
    "nextOfKinPhone" VARCHAR(30),
    "address" TEXT,
    "avatarUrl" TEXT,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'pending',
    "sponsorMemberId" BIGINT,
    "approvedByUserId" UUID,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberGroup" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "branchId" BIGINT,
    "createdByUserId" UUID,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberGroupMember" (
    "id" BIGSERIAL NOT NULL,
    "groupId" BIGINT NOT NULL,
    "memberId" BIGINT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',

    CONSTRAINT "MemberGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionCategory" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionPlan" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "categoryId" BIGINT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "frequency" "ContributionFrequency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "appliesToGroupId" BIGINT,
    "appliesToBranchId" BIGINT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" BIGSERIAL NOT NULL,
    "memberId" BIGINT NOT NULL,
    "contributionPlanId" BIGINT,
    "categoryId" BIGINT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "paymentMethod" "PaymentMethodType" NOT NULL,
    "transactionReference" VARCHAR(150),
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordedByUserId" UUID,
    "status" "ContributionStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "receiptNumber" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionAllocation" (
    "id" BIGSERIAL NOT NULL,
    "contributionId" BIGINT NOT NULL,
    "allocationType" "AllocationType" NOT NULL,
    "percentage" DECIMAL(5,2),
    "amount" DECIMAL(14,2) NOT NULL,
    "destinationReference" VARCHAR(150),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributionAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" BIGSERIAL NOT NULL,
    "receiptNumber" VARCHAR(100) NOT NULL,
    "memberId" BIGINT NOT NULL,
    "contributionId" BIGINT,
    "amount" DECIMAL(14,2) NOT NULL,
    "issuedByUserId" UUID,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WelfareRequest" (
    "id" BIGSERIAL NOT NULL,
    "memberId" BIGINT NOT NULL,
    "requestType" "WelfareRequestType" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "amountRequested" DECIMAL(14,2),
    "supportingDocumentUrl" TEXT,
    "status" "WelfareStatus" NOT NULL DEFAULT 'pending',
    "reviewedByUserId" UUID,
    "reviewedAt" TIMESTAMP(3),
    "decisionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WelfareRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WelfareDisbursement" (
    "id" BIGSERIAL NOT NULL,
    "welfareRequestId" BIGINT NOT NULL,
    "memberId" BIGINT NOT NULL,
    "amountApproved" DECIMAL(14,2) NOT NULL,
    "paymentMethod" "PaymentMethodType" NOT NULL,
    "transactionReference" VARCHAR(150),
    "approvedByUserId" UUID,
    "disbursedByUserId" UUID,
    "disbursedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WelfareDisbursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(100),
    "description" TEXT,
    "projectType" VARCHAR(100),
    "startDate" TIMESTAMP(3),
    "expectedEndDate" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
    "createdByUserId" UUID,
    "approvedByUserId" UUID,
    "budgetAmount" DECIMAL(14,2),
    "capitalAmount" DECIMAL(14,2),
    "location" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "memberId" BIGINT NOT NULL,
    "role" VARCHAR(100),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTransaction" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "transactionType" "ProjectTransactionType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "description" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" "PaymentMethodType",
    "referenceNo" VARCHAR(150),
    "recordedByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectReport" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "summary" TEXT,
    "reportPeriodStart" TIMESTAMP(3),
    "reportPeriodEnd" TIMESTAMP(3),
    "totalIncome" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "netProfit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "preparedByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "audience" "AudienceType" NOT NULL DEFAULT 'all_members',
    "branchId" BIGINT,
    "groupId" BIGINT,
    "createdByUserId" UUID,
    "publishedAt" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "status" "PageStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "meetingMode" "MeetingType" NOT NULL,
    "meetingDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "location" VARCHAR(200),
    "meetingLink" TEXT,
    "branchId" BIGINT,
    "groupId" BIGINT,
    "createdByUserId" UUID,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingAttendance" (
    "id" BIGSERIAL NOT NULL,
    "meetingId" BIGINT NOT NULL,
    "memberId" BIGINT NOT NULL,
    "attendanceStatus" "AttendanceStatus" NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "remarks" TEXT,

    CONSTRAINT "MeetingAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingCategory" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" BIGSERIAL NOT NULL,
    "categoryId" BIGINT,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "trainerUserId" UUID,
    "contentType" "ContentTypeEnum" NOT NULL,
    "contentUrl" TEXT,
    "durationMinutes" INTEGER,
    "status" "TrainingStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingEnrollment" (
    "id" BIGSERIAL NOT NULL,
    "trainingId" BIGINT NOT NULL,
    "memberId" BIGINT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionStatus" "CompletionStatus" NOT NULL DEFAULT 'not_started',
    "completedAt" TIMESTAMP(3),
    "score" DECIMAL(5,2),

    CONSTRAINT "TrainingEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" BIGSERIAL NOT NULL,
    "memberId" BIGINT NOT NULL,
    "walletType" "WalletTypeEnum" NOT NULL,
    "balance" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'KES',
    "status" "WalletStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" BIGSERIAL NOT NULL,
    "walletId" BIGINT NOT NULL,
    "transactionType" "WalletTxnType" NOT NULL,
    "amount" DECIMAL(16,2) NOT NULL,
    "direction" "TxnDirection" NOT NULL,
    "referenceType" VARCHAR(100),
    "referenceId" VARCHAR(100),
    "description" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedByUserId" UUID,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" BIGSERIAL NOT NULL,
    "memberId" BIGINT NOT NULL,
    "walletId" BIGINT NOT NULL,
    "amount" DECIMAL(16,2) NOT NULL,
    "paymentMethod" "PaymentMethodType" NOT NULL,
    "accountDetails" JSONB,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedByUserId" UUID,
    "reviewedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" BIGSERIAL NOT NULL,
    "memberId" BIGINT NOT NULL,
    "referralCode" VARCHAR(100) NOT NULL,
    "referralLink" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" BIGSERIAL NOT NULL,
    "sponsorMemberId" BIGINT NOT NULL,
    "referredMemberId" BIGINT NOT NULL,
    "referralCodeId" BIGINT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "status" "ReferralStatus" NOT NULL DEFAULT 'pending',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionPlan" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "triggerType" "CommissionTriggerType" NOT NULL,
    "level" INTEGER,
    "percentage" DECIMAL(7,4),
    "fixedAmount" DECIMAL(14,2),
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" BIGSERIAL NOT NULL,
    "memberId" BIGINT NOT NULL,
    "sourceMemberId" BIGINT,
    "commissionPlanId" BIGINT NOT NULL,
    "referenceType" VARCHAR(100),
    "referenceId" VARCHAR(100),
    "level" INTEGER,
    "amount" DECIMAL(16,2) NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'pending',
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "paidWalletTransactionId" BIGINT,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MlmTreeCache" (
    "id" BIGSERIAL NOT NULL,
    "ancestorMemberId" BIGINT NOT NULL,
    "descendantMemberId" BIGINT NOT NULL,
    "depth" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MlmTreeCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200),
    "phone" VARCHAR(30),
    "subject" VARCHAR(200),
    "message" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" BIGSERIAL NOT NULL,
    "fullName" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "email" VARCHAR(200),
    "gender" "GenderType",
    "branchInterest" VARCHAR(150),
    "referralCode" VARCHAR(100),
    "notes" TEXT,
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'pending',
    "reviewedByUserId" UUID,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" BIGSERIAL NOT NULL,
    "memberId" BIGINT,
    "title" VARCHAR(200),
    "message" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "TestimonialStatus" NOT NULL DEFAULT 'pending',
    "approvedByUserId" UUID,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsitePage" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT,
    "metaTitle" VARCHAR(255),
    "metaDescription" TEXT,
    "status" "PageStatus" NOT NULL DEFAULT 'draft',
    "updatedByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsitePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(100),
    "description" TEXT,
    "category" VARCHAR(100),
    "price" DECIMAL(14,2) NOT NULL,
    "commissionable" BOOLEAN NOT NULL DEFAULT false,
    "commissionPlanId" BIGINT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" BIGSERIAL NOT NULL,
    "memberId" BIGINT,
    "orderNumber" VARCHAR(100) NOT NULL,
    "totalAmount" DECIMAL(14,2) NOT NULL,
    "paymentStatus" "OrderPaymentStatus" NOT NULL DEFAULT 'pending',
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'draft',
    "paymentReference" VARCHAR(150),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" BIGSERIAL NOT NULL,
    "orderId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(14,2) NOT NULL,
    "totalPrice" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" BIGSERIAL NOT NULL,
    "settingKey" VARCHAR(150) NOT NULL,
    "settingValue" TEXT,
    "description" TEXT,
    "updatedByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" BIGSERIAL NOT NULL,
    "userId" UUID,
    "action" VARCHAR(150) NOT NULL,
    "module" VARCHAR(100) NOT NULL,
    "referenceType" VARCHAR(100),
    "referenceId" VARCHAR(100),
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "userId" UUID,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'in_app',
    "status" "NotificationStatus" NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "UserAppAccess_userId_appName_key" ON "UserAppAccess"("userId", "appName");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MemberProfile_userId_key" ON "MemberProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberProfile_memberNumber_key" ON "MemberProfile"("memberNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MemberGroup_name_branchId_key" ON "MemberGroup"("name", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberGroupMember_groupId_memberId_key" ON "MemberGroupMember"("groupId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "ContributionCategory_name_key" ON "ContributionCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContributionCategory_code_key" ON "ContributionCategory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_receiptNumber_key" ON "Contribution"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON "Receipt"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_contributionId_key" ON "Receipt"("contributionId");

-- CreateIndex
CREATE UNIQUE INDEX "WelfareDisbursement_welfareRequestId_key" ON "WelfareDisbursement"("welfareRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_projectId_memberId_key" ON "ProjectMember"("projectId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingAttendance_meetingId_memberId_key" ON "MeetingAttendance"("meetingId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingCategory_name_key" ON "TrainingCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingEnrollment_trainingId_memberId_key" ON "TrainingEnrollment"("trainingId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_memberId_walletType_key" ON "Wallet"("memberId", "walletType");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_memberId_key" ON "ReferralCode"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_referralCode_key" ON "ReferralCode"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredMemberId_key" ON "Referral"("referredMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_sponsorMemberId_referredMemberId_key" ON "Referral"("sponsorMemberId", "referredMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "MlmTreeCache_ancestorMemberId_descendantMemberId_depth_key" ON "MlmTreeCache"("ancestorMemberId", "descendantMemberId", "depth");

-- CreateIndex
CREATE UNIQUE INDEX "WebsitePage_slug_key" ON "WebsitePage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_settingKey_key" ON "SystemSetting"("settingKey");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAppAccess" ADD CONSTRAINT "UserAppAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_churchBranchId_fkey" FOREIGN KEY ("churchBranchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_sponsorMemberId_fkey" FOREIGN KEY ("sponsorMemberId") REFERENCES "MemberProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberGroup" ADD CONSTRAINT "MemberGroup_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberGroup" ADD CONSTRAINT "MemberGroup_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberGroupMember" ADD CONSTRAINT "MemberGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MemberGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberGroupMember" ADD CONSTRAINT "MemberGroupMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionPlan" ADD CONSTRAINT "ContributionPlan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ContributionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionPlan" ADD CONSTRAINT "ContributionPlan_appliesToGroupId_fkey" FOREIGN KEY ("appliesToGroupId") REFERENCES "MemberGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionPlan" ADD CONSTRAINT "ContributionPlan_appliesToBranchId_fkey" FOREIGN KEY ("appliesToBranchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionPlan" ADD CONSTRAINT "ContributionPlan_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_contributionPlanId_fkey" FOREIGN KEY ("contributionPlanId") REFERENCES "ContributionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ContributionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionAllocation" ADD CONSTRAINT "ContributionAllocation_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelfareRequest" ADD CONSTRAINT "WelfareRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelfareRequest" ADD CONSTRAINT "WelfareRequest_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelfareDisbursement" ADD CONSTRAINT "WelfareDisbursement_welfareRequestId_fkey" FOREIGN KEY ("welfareRequestId") REFERENCES "WelfareRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelfareDisbursement" ADD CONSTRAINT "WelfareDisbursement_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelfareDisbursement" ADD CONSTRAINT "WelfareDisbursement_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelfareDisbursement" ADD CONSTRAINT "WelfareDisbursement_disbursedByUserId_fkey" FOREIGN KEY ("disbursedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTransaction" ADD CONSTRAINT "ProjectTransaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTransaction" ADD CONSTRAINT "ProjectTransaction_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_preparedByUserId_fkey" FOREIGN KEY ("preparedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MemberGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MemberGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendance" ADD CONSTRAINT "MeetingAttendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendance" ADD CONSTRAINT "MeetingAttendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TrainingCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_trainerUserId_fkey" FOREIGN KEY ("trainerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEnrollment" ADD CONSTRAINT "TrainingEnrollment_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEnrollment" ADD CONSTRAINT "TrainingEnrollment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_sponsorMemberId_fkey" FOREIGN KEY ("sponsorMemberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredMemberId_fkey" FOREIGN KEY ("referredMemberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "ReferralCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_sourceMemberId_fkey" FOREIGN KEY ("sourceMemberId") REFERENCES "MemberProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_commissionPlanId_fkey" FOREIGN KEY ("commissionPlanId") REFERENCES "CommissionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_paidWalletTransactionId_fkey" FOREIGN KEY ("paidWalletTransactionId") REFERENCES "WalletTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MlmTreeCache" ADD CONSTRAINT "MlmTreeCache_ancestorMemberId_fkey" FOREIGN KEY ("ancestorMemberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MlmTreeCache" ADD CONSTRAINT "MlmTreeCache_descendantMemberId_fkey" FOREIGN KEY ("descendantMemberId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsitePage" ADD CONSTRAINT "WebsitePage_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_commissionPlanId_fkey" FOREIGN KEY ("commissionPlanId") REFERENCES "CommissionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemSetting" ADD CONSTRAINT "SystemSetting_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
