import {ManageDataPointCategories} from './TrackingDataPointCategories';

export class TrackingDataPoint {
    [x: string]: any;
    id: number;
    facilityId: number;
    scopeID: number;
    scopeName: string;
    manageDataPointCategories: ManageDataPointCategories[];
}
