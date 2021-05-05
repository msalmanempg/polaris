-- AddForeignKey
ALTER TABLE "draft_agreements" ADD FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
