-- CreateEnum
CREATE TYPE "govtIdType" AS ENUM ('cnic', 'nicop', 'poc');

-- CreateEnum
CREATE TYPE "customerType" AS ENUM ('individual', 'company');

-- CreateEnum
CREATE TYPE "agreementStatus" AS ENUM ('draft', 'review', 'active', 'transferred', 'terminated');

-- CreateEnum
CREATE TYPE "agreementDocumentType" AS ENUM ('agreement', 'booking_form', 'payment_plan', 'floor_plan', 'other');

-- CreateEnum
CREATE TYPE "nomineeAttachmentType" AS ENUM ('id_front', 'id_back', 'profile_picture', 'other');

-- CreateEnum
CREATE TYPE "relationType" AS ENUM ('father', 'husband');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "customerDocumentType" AS ENUM ('id_front', 'id_back', 'profile_picture', 'other');

-- CreateEnum
CREATE TYPE "expectedPaymentType" AS ENUM ('down_payment', 'installment', 'advance', 'posession');

-- CreateEnum
CREATE TYPE "expectedPaymentStatus" AS ENUM ('paid', 'pending');

-- CreateEnum
CREATE TYPE "unitType" AS ENUM ('residential', 'commercial');

-- CreateEnum
CREATE TYPE "unitStatus" AS ENUM ('booked', 'sold', 'available');

-- CreateTable
CREATE TABLE "agreements" (
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "agreement_number" TEXT NOT NULL,
    "published_price" INTEGER NOT NULL,
    "booking_price" INTEGER NOT NULL,
    "discount_value" INTEGER,
    "posession_value" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "status" "agreementStatus" NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "notarised_date" TIMESTAMP(3) NOT NULL,
    "agreement_date" TIMESTAMP(3) NOT NULL,
    "installment_start_date" TIMESTAMP(3) NOT NULL,
    "installment_end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_agreements" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "agreement_number" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_persons" (
    "id" SERIAL NOT NULL,
    "designation" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "govt_id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "sort_level" INTEGER NOT NULL,
    "agreement_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreement_customers" (
    "id" SERIAL NOT NULL,
    "customer_type" "customerType" NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "agreement_id" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "meta" JSONB,
    "email" TEXT NOT NULL,
    "primary_phone_number" TEXT NOT NULL,
    "secondary_phone_number" TEXT,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreement_companies" (
    "id" SERIAL NOT NULL,
    "agreement_customer_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ntn" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nominees" (
    "id" SERIAL NOT NULL,
    "govt_id" TEXT NOT NULL,
    "govt_id_card" "govtIdType" NOT NULL,
    "nominee_for" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "agreement_id" INTEGER NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreement_attachments" (
    "id" SERIAL NOT NULL,
    "agreement_id" INTEGER NOT NULL,
    "attachmentId" INTEGER NOT NULL,
    "type" "agreementDocumentType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nominee_attachment" (
    "id" SERIAL NOT NULL,
    "nominee_id" INTEGER NOT NULL,
    "attachmentId" INTEGER NOT NULL,
    "type" "nomineeAttachmentType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "govt_id" TEXT NOT NULL,
    "govt_id_type" "govtIdType" NOT NULL,
    "relation_type" "relationType" NOT NULL,
    "guardian_name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "passport_number" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_attachments" (
    "id" SERIAL NOT NULL,
    "attachmentId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expected_payments" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "percentage" INTEGER,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "type" "expectedPaymentType" NOT NULL,
    "agreement_id" INTEGER NOT NULL,
    "meta" JSONB,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "expectedPaymentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "completion_date" TIMESTAMP(3),
    "logo" TEXT NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_bank_details" (
    "id" SERIAL NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_title" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "swift_code" TEXT NOT NULL,
    "branch_address" TEXT NOT NULL,
    "branch_code" TEXT NOT NULL,
    "meta" JSONB,
    "projectId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "unit_number" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" "unitType" NOT NULL,
    "bed" INTEGER NOT NULL,
    "base_price" INTEGER NOT NULL,
    "published_price" INTEGER NOT NULL,
    "net_area" INTEGER NOT NULL,
    "gross_area" INTEGER NOT NULL,
    "meta" JSONB,
    "status" "unitStatus" NOT NULL,
    "project_id" INTEGER NOT NULL,
    "completion_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agreements.agreement_number_unique" ON "agreements"("agreement_number");

-- CreateIndex
CREATE UNIQUE INDEX "draft_agreements.agreement_number_unique" ON "draft_agreements"("agreement_number");

-- CreateIndex
CREATE UNIQUE INDEX "agreement_companies.registration_number_unique" ON "agreement_companies"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_govtId_govtIdType_unique_constraint" ON "customers"("govt_id", "govt_id_type");

-- CreateIndex
CREATE UNIQUE INDEX "units.unit_number_unique" ON "units"("unit_number");

-- AddForeignKey
ALTER TABLE "agreements" ADD FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_persons" ADD FOREIGN KEY ("agreement_id") REFERENCES "agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreement_customers" ADD FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreement_customers" ADD FOREIGN KEY ("agreement_id") REFERENCES "agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreement_companies" ADD FOREIGN KEY ("agreement_customer_id") REFERENCES "agreement_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominees" ADD FOREIGN KEY ("agreement_id") REFERENCES "agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreement_attachments" ADD FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominee_attachment" ADD FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_attachments" ADD FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_attachments" ADD FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expected_payments" ADD FOREIGN KEY ("agreement_id") REFERENCES "agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_bank_details" ADD FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
