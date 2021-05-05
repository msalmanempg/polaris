import { DraftAgreement } from "@prisma/client";

export const draftAgreements: Partial<DraftAgreement>[] = [
  { agreementNumber: "ABC1234", unitId: 1, data: {} },
  { agreementNumber: "ABC1235", unitId: 2, data: {} },
];
