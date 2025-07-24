import {ReportStatus} from '@/models/ReportStatus';
import {ViewrequestTable} from '@/models/ViewrequestTable';
import {LoginInfo} from '@/models/loginInfo';
import {Component} from '@angular/core';
import {ReportService} from '@services/report.service';

@Component({
    selector: 'app-report-status',
    templateUrl: './report-status.component.html',
    styleUrls: ['./report-status.component.scss']
})
export class ReportStatusComponent {
    reportstatus: ReportStatus[];
    display: string;
    public loginInfo: LoginInfo;

    constructor(private reportservice: ReportService) {}
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
        }
        let tenantID = this.loginInfo.tenantID;
        this.getReportStatus(tenantID);
        
    }
   //Retrieves the report status for the specified tenant ID
    getReportStatus(tenantID) {
        this.reportservice.getReportStatus(tenantID).subscribe((response) => {
            this.reportstatus = response;
           
        });
    }
}
