import { DPType } from "./DPType";
import { ManageDataPointSubCategories } from "./TrackingDataPointSubCategories";

export class ManageDataPointCategories {
  id: number;
  catName: string;
  manageScopeId: number;
  scopeId: number;
  manageDataPointCategorySeedID: number
  datapointCatID: number;
  dpType: DPType[];
  manageDataPointSubCategories: ManageDataPointSubCategories[];
}