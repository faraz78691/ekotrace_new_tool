import { ReportStatus } from '@/models/ReportStatus';
import { BRSR_Doc, BRSR_Questions } from '@/models/brsrDOc';
//import { BRSR_Q_As } from '@/models/brsrQA';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { brsR_Q_As } from '@/models/brsrQA';
//import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { brsrPrinciples } from '@/models/brsrPrinciples';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    rootUrl: string;
    constructor(private http: HttpClient) {
        this.rootUrl = environment.baseUrl + 'Report/UploadDoc';
    }

    public getReportStatus(tenantId) {
        return this.http.get<ReportStatus[]>(
            environment.baseUrl + 'Report/GetReportStatus/' + tenantId
        );
    }

    public SaveReport(groupdetails): Observable<any> {
        return this.http.post(environment.baseUrl + 'Report/', groupdetails);
    }
    public SavebrsrQA(QAdata: BRSR_Doc) {
        return this.http.post(
            environment.baseUrl + 'Report/SaveBRSRQA/',
            QAdata
        );
    }

    UploadReportDoc(formData: FormData, tenantId: number): Observable<any> {
        const url = `${this.rootUrl}`;
        return this.http.post<any>(url, formData);
    }
    public getBRSRdata(tenantId) {
        return this.http.get<BRSR_Doc>(
            environment.baseUrl + 'Report/getQAandDoc/' + tenantId
        );
    }

    downloadFile(fileName: string): Observable<Blob> {
        return this.http.get(
            environment.baseUrl + 'Report/DownloadFile/' + fileName,
            { responseType: 'blob' }
        );
    }

    // public saveReportDocument(file, tenantId: number){
    //     // console.log("file>>>>",file);
    //     // console.log("tenantId>>",tenantId);
    //     return this.http.put(
    //         environment.baseUrl + 'Report/UpdateBRSR_Doc/' +
    //         file,tenantId
    //     );
    // }

    public saveReportDocument(bRSR_Doc, id: number) {
        // // console.log("file>>>>", file);
        // console.log('id>>', id);

        // Create a FormData object and append the file to it
        // const formData: FormData = new FormData();
        // formData.append('file', file, file.name);

        return this.http.put(
            environment.baseUrl + 'Report/UpdateBRSR_Doc/' + id,
            bRSR_Doc
        );
    }

    public getQuestions() {
        return this.http.get<brsrPrinciples[]>(
            environment.baseUrl + 'Report/GetQuestions'
        );
    }
}
