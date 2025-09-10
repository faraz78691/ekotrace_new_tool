import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import {Gatekeeper} from 'gatekeeper-client-sdk';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginInfo } from '@/models/loginInfo';
import { BehaviorSubject, Observable } from 'rxjs';
import { FacilityService } from './facility.service';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    getElectricitySource() {
        throw new Error('Method not implemented.');
    }
    public user: any = null;
    public invalidLogin: boolean = false;
    public showLoader: boolean = true;
    public loginInfo: LoginInfo;
    private dataSource = new BehaviorSubject<any>(null);
    data$ = this.dataSource.asObservable();

    sendData(data: any) {
        this.dataSource.next(data);
    }

    constructor(
        private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private facilityService: FacilityService
    ) { }

    public loginByAuth({ email, password }): Observable<LoginInfo> {
        this.loginInfo = new LoginInfo();
        const credentials = {
            username: email,
            password: password
        };
        return this.http.post<LoginInfo>(
            `${environment.baseUrl}authentic/login`,
            credentials
        );
    }
    public newloginByAuth(credentials): Observable<any> {
        ;

        this.loginInfo = new LoginInfo();

        return this.http.post<any>(
            `${environment.baseUrl}/login`,
            credentials
        );

        // return this.http.post<any>(
        //     `http://192.168.1.31:4003/login`,
        //     credentials
        // );
    }

    public refreshToken(tokenModel): Observable<LoginInfo> {
        this.loginInfo = new LoginInfo();
        return this.http.post<LoginInfo>(
            `${environment.baseUrl}authenticate/refresh-token`,
            tokenModel
        );
    }

    postAPI<T, U>(url: string, data: U): Observable<T | any> {
        return this.http.post<T>(environment.baseUrl + url, data)
    };

    getApi<T>(url: string): Observable<T | any> {
        return this.http.get<T>(environment.baseUrl + url);
    };

    getApi2<T>(url: string): Observable<T> {
        return this.http.get<T>(environment.baseUrl2 + url);
    };

    public logout() {
        localStorage.removeItem('LoginInfo');
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('SelectedfacilityID');
        sessionStorage.removeItem('selected_year');
        localStorage.removeItem('assets');

        this.user = null;
        this.facilityService.facilitiesSignal.set([]);
        this.facilityService.selectedfacilitiesSignal.set(0);
        this.facilityService.selectedGroupSignal.set(0);
        this.facilityService.headerTracking.set(false);
        this.facilityService.selectedGroupSignal.set(null);
        this.facilityService.dashboardfacilitiesSignal.set(null);
        this.router.navigate(['/login']);
    }
    public getUserRole(): string {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            this.loginInfo = jsonObj as LoginInfo;
            return this.loginInfo.role;
        }
    }

    getYear(year: Date): string {
        const datePipe = new DatePipe('en-US');
        const selectedDate = new Date(year);
        return datePipe.transform(selectedDate, 'yyyy');
    };

    private readonly roleMap: { [key: string]: string } = {
        'b34c0dbe-4730-4521-82dd-5d3de28bcea0': 'Super Admin',
        '525debfd-cd64-4936-ae57-346d57de3585': 'Admin',
        '8f7e334f-db30-44d6-a3d6-a1d12b29547c': 'Manager',
        '9782f1b1-27ba-4a5c-861c-94174d73d471': 'Preparer',
        'd9be1ec0-7372-44a2-98aa-f46bffd474b9': 'Approver',
        'a34d0ecf-4730-4521-82ee-5e3eg28bdfb0': 'Auditor',
        'ca0f6fe6-2bf1-410a-aff2-d1511dc6937c': 'Platform Admin'
    };

    getRoleName(): string | null {
        const roleUUID = this.getRoleUUID();
        return roleUUID ? this.roleMap[roleUUID] || null : null;
    };

    getRoleUUID(): string | null {
        return localStorage.getItem('role_uuid');
    }

    monthsData: any[] = [
        { name: 'Jan', value: 'Jan' },
        { name: 'Feb', value: 'Feb' },
        { name: 'Mar', value: 'Mar' },
        { name: 'Apr', value: 'Apr' },
        { name: 'May', value: 'May' },
        { name: 'June', value: 'Jun' },
        { name: 'July', value: 'Jul' },
        { name: 'Aug', value: 'Aug' },
        { name: 'Sep', value: 'Sep' },
        { name: 'Oct', value: 'Oct' },
        { name: 'Nov', value: 'Nov' },
        { name: 'Dec', value: 'Dec' }
    ];


}
