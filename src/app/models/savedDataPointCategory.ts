import { SavedDataPointSubCategory } from "./savedDataPointSubcategory";

export class SavedDataPointCategory {
  id: number
  manageDataPointCategorySeedID: number;
  manageDataPointId: number;
  TenantID: number;
  subCategorySeedDatas: SavedDataPointSubCategory[];
}