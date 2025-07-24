import { SavedDataPointCategory } from "./savedDataPointCategory";

export class savedDataPoint {
  id: number;
  scopeID: number;
  facilityId: number;
  fiscalYear: string;
  TenantID: number;
  categorySeedData: SavedDataPointCategory[];
}