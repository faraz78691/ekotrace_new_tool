import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {CompanyDetails} from '@/shared/company-details';
import {Observable} from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    constructor(private http: HttpClient) {}

    registerCompany(companyData: CompanyDetails) {
        // Replace this URL with your API endpoint
        return this.http.post(environment.baseUrl + 'Tenants', companyData);
    }

    // public updateCompany(companyData: CompanyDetails): Observable<any> {
    //     return this.http.put(
    //         environment.baseUrl + 'Tenants/' + companyData.id,
    //         companyData
    //     );
    // };
    public updateCompany(companyData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/AddComapnyDetail',
            companyData
        );
    };

    public addCompany(companyData: CompanyDetails): Observable<any> {
        return this.http.put(
            environment.baseUrl + '/AddComapnyDetail/' + companyData.id,
            companyData
        );
    };
}
