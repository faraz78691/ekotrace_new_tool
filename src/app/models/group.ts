import { GroupMapping } from "./group-mapping";

export class Group {
    id: number;
    groupname: string;
    groupBy: string;
    tenantID: number;
    CreatedDate = new Date();
    modifiedDate = new Date();
    active = true;
    groupMappings: GroupMapping[];
    facilities: any[];
    package_name: any;
}
export class Actions {
    id: number;
    name: string;
    scope_category: string;
    co2_savings_tcoe:string ;
    time_period: string;
    owner :string;
    user_id : string;
    status : string;
    
}


