import {HttpClient, HttpParams} from '@angular/common/http';
import {UserInfo, newUserInfo} from '@/models/UserInfo';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {userInfo} from 'os';
import {environment} from 'environments/environment';
import {ResetPassword} from '@modules/reset-password/reset-password';
import {ForgotPassword} from '@modules/forgot-password/forgot-password';
import {RoleModel, newRoleModel} from '@/models/Roles';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // apiURL = environment.baseUrl + 'Authenticate/';
    apiURL = environment.baseUrl;
    localapiURL = 'http://192.168.1.31:4003';
    checkuserURL = environment.baseUrl + 'Authenticate/check/';
    constructor(private http: HttpClient) {}

    // forgotPassword(email: string) {
    //     let urlUser = this.apiURL + 'sendmail?EmailId=' + email;
    //     return this.http.post(urlUser, String);
    // }
    public forgotPassword(email:any): Observable<any> {
        return this.http.post(environment.baseUrl + `/forget-password`, email);
     
      }

    reSetPassword(resetData: ResetPassword) {
        let json = {
            userid: resetData.userid,
            newPassword: resetData.newpassword
        };
        // Replace this URL with your API endpoint
        return this.http.put(this.apiURL + 'update-password', json);
    }

    public SaveUsers(admininfo) {
        return this.http.post<UserInfo[]>(this.apiURL + 'register', admininfo);
    };
    public newSaveUsers(admininfo) {
        return this.http.post(this.apiURL + '/register', admininfo);
    };

    public getUsers(tenantId) {
        return this.http.get<UserInfo[]>(this.apiURL + 'user/' + tenantId);
    }
    public newgetUsers(tenantId) {
        return this.http.post<any>(this.apiURL+ '/getAllusers', tenantId);
    };
    public UpdateUsers(admininfo) {
        return this.http.put<UserInfo[]>(this.apiURL + admininfo.id, admininfo);
    }
    public NUpdateUsers(admininfo) {
        return this.http.post<UserInfo[]>(this.apiURL + '/Updateregister', admininfo);
    }
    public deleteUsers(userid) {
        return this.http.delete(this.apiURL + userid);
    }
    public newdeleteUsers(userid) {
        return this.http.post(this.apiURL + '/removeUser', userid);
    }
    public GetAllRoles(): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(this.apiURL + 'role-all');
    }
    public newGetAllRoles(): Observable<any[]> {
        return this.http.get<any[]>(this.apiURL+ '/getAllroles');
    }
    public CheckUserExist(username) {
        return this.http.get<boolean>(this.checkuserURL + username);
    }
    public getPackageDetails() {
        return this.http.get<boolean>(this.apiURL + '/getpackages');
    }
    public getNewPackageDetails(data) {
        return this.http.post(this.apiURL + '/packageById', data);
    }
    public getAdminPackageDetails() {
        return this.http.get(this.apiURL + '/getpackages');
    }
    public getBillingUsers(data) {
        return this.http.post(this.apiURL + '/getAllusers', data);
    }

    public newSavepackages(packagedetails): Observable<any> {
        return this.http.post(this.apiURL + '/addpackage', packagedetails);
    }
}
