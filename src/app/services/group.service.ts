import {Group} from '@/models/group';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {Location} from '@/models/Location';
@Injectable({
    providedIn: 'root'
})
export class GroupService {
    constructor(private http: HttpClient) {}

    public GetGroups(tenantID): Observable<Group[]> {
        return this.http.get<Group[]>(
            environment.baseUrl + 'Group/GetGroups/' + tenantID
        );
    }
    public newGetGroups(tenantID:any): Observable<any> {
     
        return this.http.post(
            environment.baseUrl + '/getGroups',tenantID
        );
    }
    public getuser_offseting(tenantID:any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/getuser_offseting',tenantID
        );
    };
    public getEmissionInventory(superAdminID): Observable<any> {
        return this.http.get(
            environment.baseUrl + `/targetsetting/getTargetEmissionInventory/${superAdminID}`
        );
    };
    public getSuperAdmins(): Observable<any> {
        return this.http.get(
            environment.baseUrl + '/getSuperadmin'
        );
    };
    public getEmissionProjections(): Observable<any> {
        return this.http.get(
            environment.baseUrl + '/targetsetting/getRevenueFactors'
        );
    };
    public get(tenantID:any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/getuser_offseting',tenantID
        );
    };
    public getTargetSetting(superTenantId): Observable<any> {
        return this.http.get(
            environment.baseUrl + `/targetsetting/getTargetSettingDetails/${superTenantId}`
        );
    };
    public getVendors(superId): Observable<any> {
        return this.http.get(
            environment.baseUrl + `/getVendorlist/${superId}`
        );
    };
    public getHSN(): Observable<any> {
        return this.http.get(
            environment.baseUrl + '/getpurchaseproduct_code'
        );
    };
    public uploadJsonData(data:any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/get-purchase-categories-ef', data
        );
    };
    public getStandardType(id): Observable<any> {
        return this.http.get(
            environment.baseUrl + `/getTypesofpurchase/${id}`
            
        );
    };
    public getCostCentre(sID): Observable<any> {
        return this.http.get(
            environment.baseUrl + `/getcostCenter/${sID}`
        );
    };
    public getTargetGraphsPoints(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/targetsetting/getEmissionPoints', data
        );
    };

    public EditGroup( groupdetails): Observable<any> {
        return this.http.post(environment.baseUrl + '/Updategroupmapping' , groupdetails);
    }
    public newEditGroup( groupdetails) {
        return this.http.post(environment.baseUrl + '/Updategroupmapping' , groupdetails);
    };
    public updateVendor( groupdetails) {
        return this.http.post(environment.baseUrl + '/updateVendor' , groupdetails);
    };
    public updateAction( groupdetails) {
        return this.http.post(environment.baseUrl + '/updateActions' , groupdetails);
    };
    public updateOffset( groupdetails) {
        return this.http.post(environment.baseUrl + '/updateuser_offseting' , groupdetails);
    };
    public updateInventory( groupdetails) {
        return this.http.post(environment.baseUrl + '/targetsetting/updateEmissionInventoryID', groupdetails);
    };
    public updateTargetSetting( groupdetails) {
        return this.http.post(environment.baseUrl + '/targetsetting/updateTargetSetting', groupdetails);
    };
    public updateSuperAdminPakcages( groupdetails) {
        return this.http.post(environment.baseUrl + '/addpackageBySuperadmin', groupdetails);
    };
    public createSuperAdmin( groupdetails) {
        return this.http.post(environment.baseUrl + '/AddSuperAdmin', groupdetails);
    };
    public newUpdatePackage( packageDetails) {
        return this.http.post(environment.baseUrl + '/Updategroupmapping' , packageDetails);
    }

    public SaveGroups(groupdetails): Observable<any> {
        return this.http.post(environment.baseUrl + 'Group/', groupdetails);
    };
    public newSaveGroups(groupdetails): Observable<any> {
        return this.http.post(environment.baseUrl + '/Addgroup', groupdetails);
    }
    public Adduser_offseting(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/Adduser_offseting', groupdetails);
    }
    public AddEmissionInventory(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/targetsetting/addEmissionInventory', groupdetails);
    }
    public AddProjections(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/targetsetting/insertRevenueFactors', groupdetails);
    }
    public GetInventoryByID(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/targetsetting/getTargetEmissionInventoryRelation', groupdetails);
    }
    public addTargetSetting(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/targetsetting/addTargetSetting', groupdetails);
    }
    public addVendors(groupdetails): Observable<any> {
        return this.http.post(  environment.baseUrl +  '/AddVendor', groupdetails);
    }
    public AddCostcenter(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl +  '/AddCostcenter', groupdetails);
    }
    public getGraphsTarget(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/targetsetting/getEmissionPoints', groupdetails);
    }
    public addTargetActions(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/targetsetting/addActions', groupdetails);
    }
    public updateActions(groupdetails): Observable<any> {
        return this.http.post( environment.baseUrl + '/updateActions', groupdetails);
    }
    public getActions(superAdminTenentID): Observable<any> {
        return this.http.get( environment.baseUrl + `/targetsetting/getActions/${superAdminTenentID}`);
    }

    public deleteGroups(id) {
        return this.http.delete(environment.baseUrl + 'Group/' + id);
    }
    public newdeleteGroups(id) {
        return this.http.post(environment.baseUrl + '/removeGroup' , id);
    }

    public CheckGroupExist(id) {
        return this.http.get<boolean>(
            environment.baseUrl + 'Group/GroupExists/' + id
        );
    }
    public GetCountry(): Observable<Location[]> {
        return this.http.get<Location[]>(environment.baseUrl + 'Group/Country');
    }
    public GetState(id): Observable<Location[]> {
        return this.http.get<Location[]>(
            environment.baseUrl + 'Group/State/' + id
        );
    }
}
