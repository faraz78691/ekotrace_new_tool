import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import {Gatekeeper} from 'gatekeeper-client-sdk';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginInfo } from '@/models/loginInfo';
import { Observable } from 'rxjs';
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
        this.user = null;
        this.facilityService.facilitiesSignal.set([]);
        this.facilityService.selectedfacilitiesSignal.set(0);
        this.facilityService.selectedGroupSignal.set(0);
        this.facilityService.headerTracking.set(false);
        this.facilityService.selectedGroupSignal.set(null);
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
    }
}
