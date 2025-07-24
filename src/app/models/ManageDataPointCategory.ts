import { ManageDataPointSubCategory } from './ManageDataPointSubCategory';

export class ManageDataPointCategory {
    id: number;
    catName: string;
    manageScopeId: number;
    scopeId: number;
    manageDataPointCategorySeedID: number
    datapointCatID: number;
    subCategorySeedDatas: ManageDataPointSubCategory[];
}
