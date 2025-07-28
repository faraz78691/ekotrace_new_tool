import { Injectable, signal } from '@angular/core';

import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs/internal/Observable';
import { Facility } from '@/models/Facility';
import { Location } from '@/models/Location';
import { ManageDataPoint } from '@/models/ManageDataPoint';
import { savedDataPoint } from '@/models/savedDataPoint';
import { FacilityGroupList } from '@/models/FacilityGroupList';
import { facilities } from '@/models/facilities';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FacilityService {
    facilitiesSignal = signal<facilities[]>([]);
    selectedfacilitiesSignal = signal<number>(0);
    dashboardfacilitiesSignal = signal<any>(null);
    selectedGroupSignal = signal<number | null>(null);
    groupsCountrySignal = signal<string | null>('');
    countryCodeSignal = signal<string | null>(null);
    headerTracking = signal<boolean>(false);
    targetAllowed = signal<boolean>(false);
    categoryId = signal<number>(0);
    subCategoryId = signal<number>(0);
    yearSignal = signal<string>('');
    monthSignal = signal<string>('');
    localapiURL = 'http://192.168.1.31:4003';
    totalAngularPackages;
    errorMessage;
    constructor(
        private http: HttpClient,
        private notification: NotificationService,
        private router: Router
    ) {
        this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
            this.checkRoute(event.urlAfterRedirects);
        });
    }
    // Function to check the current route and update the boolean variable
    private checkRoute(currentRoute: string): void {

        if (currentRoute.includes('/tracking') || currentRoute.includes('/tracking-view-requests') || currentRoute.includes('/finance_emissions')) {
            this.headerTracking.set(true)
            // If the route is to the facility, set the boolean variable to true
            //   this.isRouteToFacilitySubject.next(true);
        } else {
            this.headerTracking.set(false)
            // Otherwise, set it to false
            //   this.isRouteToFacilitySubject.next(false);
        }
    }

    options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe?: 'body' | 'events' | 'response';
        params?:
        | HttpParams
        | {
            [param: string]:
            | string
            | number
            | boolean
            | ReadonlyArray<string | number | boolean>;
        };
        reportProgress?: boolean;
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
        withCredentials?: boolean;
    };

    public newGetFacilityByTenant(tenantId): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl + '/getFacilityByTenantId/' + tenantId
        );
    };
    public getSubGroupsByTenantId(tenantId): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl + '/getdashboardfacilitiessubgroup' , tenantId 
        );
    };
    public getActualSubGroups(tenantId): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl + '/getSubGroups' , tenantId 
        );
    };
    public getMainSubGroupByTenantId(tenantId): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl + '/getFacilityByTenantIdMainGroup/' + tenantId 
        );
    };
    public getGroupsForAdmin(tenantId): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl + '/getFacilityGroupsByTenantIdAdmin/' + tenantId 
        );
    };

    AddFacilites(facilities: facilities[]) {
        this.facilitiesSignal.set(facilities)
    };

    facilitySelected(id: number) {
        this.selectedfacilitiesSignal.set(id)
    };
    setDashboardFacility(id: number) {
        this.dashboardfacilitiesSignal.set(id)
    };
    setGroupId(id: number | null) {
        this.selectedGroupSignal.set(id)
    };
    setGroupsCountry(country: string | null) {
        this.groupsCountrySignal.set(country)
    };

    setFacilityCountryCode(code: string | null) {
        this.countryCodeSignal.set(code)
    };

    public gerReport(url, data): Observable<any> {
        return this.http.post(environment.baseUrl + `/report/${url}`, data);
    }
    public FacilityDataPost(data): Observable<any> {
        return this.http.post(environment.baseUrl + 'Facilities/addFacility', data);
    }
    public newFacilityDataPost(data): Observable<any> {
        return this.http.post(environment.baseUrl + '/Addfacilities', data);
    }
    public FacilityDataPut(id, data): Observable<any> {
        return this.http.put(environment.baseUrl + 'Facilities/' + id, data);
    };
    public FacilityDataUpdate(data): Observable<any> {
        return this.http.post(environment.baseUrl + '/Updatefacilities', data);
    };
    public AssignCountrySubGroup(data): Observable<any> {
        return this.http.post(environment.baseUrl + '/Updatecountry', data);
    };
    public getDataProgress(data:any): Observable<any> {
        return this.http.post(environment.baseUrl + '/getDataProgressForFacilities', data);
    };

    public FacilityDataGet(tenantId): Observable<Facility[]> {
        return this.http.get<Facility[]>(
            environment.baseUrl + 'Group/facility/GroupByData/' + tenantId
        );
    };
    public nFacilityDataGet(tenantId): Observable<Facility[]> {
        return this.http.get<Facility[]>(
            environment.baseUrl + '/allfacilitiesbyRole/' + tenantId
        );
    };
    
    public newFacilityDataGet(tenantId): Observable<Facility[]> {
        return this.http.get<Facility[]>(
            environment.baseUrl + 'Group/facility/GroupByData/' + tenantId
        );
    };
    public FacilityDelete(id): Observable<any> {
        return this.http.delete(environment.baseUrl + 'Facilities/' + id);
    }
    public GetCountry(): Observable<Location[]> {
        return this.http.get<Location[]>(
            environment.baseUrl + '/getcountries'
        );
    }
    public GetState(id): Observable<Location[]> {
        return this.http.get<Location[]>(
            environment.baseUrl + 'Facilities/State/' + id
        );
    }
    public newGetState(data): Observable<Location[]> {
        return this.http.post<Location[]>(
            environment.baseUrl + '/getstateByCountries', data
        );
    }
    public GetCity(id): Observable<Location[]> {
        return this.http.get<Location[]>(
            environment.baseUrl + 'Facilities/City/' + id
        );
    };
    public newGetCity(id): Observable<Location[]> {
        return this.http.post<Location[]>(
            environment.baseUrl + '/getcityBystate', id
        );
    };
    public getVendorDashboard(data): Observable<Location[]> {
        return this.http.post<Location[]>(
            environment.baseUrl + '/report/vendorDashboardReport', data
        );
    };
    public getVendorLocation(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/report/getEmisionByLocation', data
        );
    };
    public getEmissionProducts(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/report/getVendorProductDashboard', data
        );
    };

    public getSeedData(): Observable<ManageDataPoint[]> {
        return this.http.get<ManageDataPoint[]>(
            environment.baseUrl + 'Facilities/facility/getSeedData'
        );
    }
    public getNewSeedData(): Observable<ManageDataPoint[]> {
        return this.http.get<ManageDataPoint[]>(
            environment.baseUrl + '/GetcategoryByScope'
        );
    }

    public ManageDataPointSave(data: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Facilities/facility/SaveManageDataPoint',
            data
        );
    }
    public getScopeDonutsER(admininfo) {
        return this.http.post( environment.baseUrl + '/dashboardScope', admininfo);
    };
    public newManageDataPointSave(data: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/AddassignedDataPointbyfacility',
            data
        );
    }
    public getSavedDataPoint(facilityID: any): Observable<any> {
        return this.http.get(
            environment.baseUrl +
            '/getAssignedDataPointbyfacility/' +
            facilityID
        );
    }

    public GetFacilityGroupList(tenantId) {
        return this.http.get<FacilityGroupList[]>(
            environment.baseUrl + 'Facilities/GetFacilityGroups/' + tenantId
        );
    }
    public newGetFacilityGroupList(tenantId): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl + '/GetFacilityGroups/' + tenantId
        );
    }

    public GetFacilityByID(Id) {
        return this.http.get<Facility>(
            environment.baseUrl + 'Facilities/' + Id
        );
    };
    public newUsersByFacilityID(Id) {
        return this.http.post<Facility>(
            environment.baseUrl + '/allfacilitiesbyId', Id
        );
    };
}
