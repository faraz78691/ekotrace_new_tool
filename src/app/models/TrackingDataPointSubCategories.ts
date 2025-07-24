import { DataEntry } from "./DataEntry";
import { DataEntrySetting } from "./DataEntrySettings";

export class ManageDataPointSubCategories {
  id: number = 0;
  subCatName: string;
  SubCatType: string;
  unit: string;
  isMandatory: boolean;
  active: boolean;
  subCatsavedID: number;
  manageDataPointSubCategorySeedID: number;
  manageDataPointCategoriesId: number;
  categorySeedDataId: number;
  approvedEntries: number;
  dataEntries: DataEntry[];
  dataEntrySettings: DataEntrySetting[];

}