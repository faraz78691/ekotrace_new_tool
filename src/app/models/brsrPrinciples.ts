import { BRSR_Questions } from "./brsrDOc";
import { brsR_Q_As } from "./brsrQA";

export class brsrPrinciples {
  id: number;
  principleName: string;
  brsR_Q_As: brsR_Q_As[];
  brsrQuestions: BRSR_Questions[];
  queryParams: any;
}