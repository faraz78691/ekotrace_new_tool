import { ManageDataPointCategory } from './ManageDataPointCategory';

export interface ManageDataPoint {
    id: number;
    scopeID: number;
    scopeName: string;
    categorySeedData: ManageDataPointCategory[];
}

export class ManageDataPoint1 {
    id: number;
    scopeID: number;
    facilityId: number;
    fiscalYear: string;
    categorySeedData: ManageDataPointCategory[];
}
