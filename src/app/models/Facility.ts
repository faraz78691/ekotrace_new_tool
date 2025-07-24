import {AssignedUser} from './AssignedUser';
import {ManageDataPoint} from './ManageDataPoint';

export class Facility {
    AssestName: string;
    AssestType: string;
    country_name: string;
    CountryId: number;
    state_name: string;
    StateId: number;
    city_name: string;
    CityId: number;
    EquityPercentage: number;
    Address: string;
    IsWaterStreenArea : any;
    tenantID: number;
    createdDate = new Date();
    modifiedDate = new Date();
    Active = true;
    ID: number;
    id: number;
    UserList: AssignedUser[];
    userInfoModels: AssignedUser[];
    manageDataPoints: ManageDataPoint[];
    total_area:number
    energy_ref_area:number;
    total_revenue:number;
    no_of_employee:number;

}
