/*
  Warnings:

  - You are about to drop the column `unitId` on the `draft_agreements` table. All the data in the column will be lost.
  - Added the required column `unit_id` to the `draft_agreements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "draft_agreements" DROP COLUMN "unitId",
ADD COLUMN     "unit_id" INTEGER NOT NULL;
