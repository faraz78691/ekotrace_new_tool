import { SendNotification } from '@/models/SendNotification';
import { BRSR_Doc } from '@/models/brsrDOc';
import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { ReportService } from '@services/report.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-report-doc',
    templateUrl: './report-doc.component.html',
    styleUrls: ['./report-doc.component.scss']
})
export class ReportDocComponent {
    public loginInfo: LoginInfo;
    public brsrdoc: BRSR_Doc;
    sendNotificationData: SendNotification;

    id: number;
    visible: boolean = false;
    brsrdata: BRSR_Doc = new BRSR_Doc();
    AcceptorReject: boolean = false;
    updatedtheme:any;
    constructor(
        private router: Router,
        private toastr: ToastrService,
        private reportService: ReportService,
        private notification: NotificationService
    ) {
        this.brsrdoc = new BRSR_Doc();
    }
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
        }
        let tenantId = this.loginInfo.tenantID;
        this.checkbrsrdata(tenantId);
        this.updatedtheme= localStorage.getItem('theme');
    }
    ngDoCheck(){
        this.updatedtheme= localStorage.getItem('theme');
    }
    
    ViweForm() {
        this.router.navigate(['/brsr-report']);

    }

    checkbrsrdata(tenantID) {
        this.reportService.getBRSRdata(tenantID).subscribe((response) => {
            if (response != null) {
                this.brsrdata = response;
          
                if (this.brsrdata.isAccept != null || this.brsrdata.isAccept != undefined) {
                    this.AcceptorReject = true;
                }
                else {
                    this.AcceptorReject = false;
                }

            }

        })
    }
    //method for download a file
    DownloadFile(fileName: string) {
        if (fileName) {
            this.reportService.downloadFile(fileName).subscribe(
                (response: Blob) => {
                    const url = window.URL.createObjectURL(response);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName; // Specify the desired file name
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    this.toastr.success('Doc downloaded successfully');
                },
                (error) => {
                    console.error('Error downloading the file.', error);
                    this.toastr.error('Error downloading the file.');
                }
            );
        } else {
            this.toastr.warning('File not found!');
        }
    }

    cancelUpdate() {
        this.visible = false;
    }
    // updateDocument(value) {

    //     // console.log(
    //         '🚀 ~ file: brsr-qa.component.ts:172 ~ BrsrQaComponent ~ this.reportService.saveReportDocument ~ this.brsrdoc:',
    //         this.brsrdoc
    //     );
    //     this.brsrdoc.isAccept = value;
    //     this.brsrdoc.tenantID = this.loginInfo.tenantID;

    //     // console.log('brsrsdocname', this.brsrdoc.docName);

    //     this.reportService
    //         .saveReportDocument(this.brsrdoc, this.brsrdoc.tenantID)
    //         .subscribe({
    //             next: (response) => {
    //                 // Handle the success response
    //                 this.toastr.success('Document Updated');

    //                 if (value == true) {
    //                     var recipent = environment.PAadmin;
    //                     var message = environment.brsrAcceptMessage + this.loginInfo.companyName;

    //                     this.SendNotification(recipent, message);

    //                 }
    //                 else {
    //                     var recipent = environment.PAadmin;
    //                     var message = environment.brsrRejectMessage + this.loginInfo.companyName;

    //                     this.SendNotification(recipent, message);
    //                 }
    //                 this.visible = false;

    //             },
    //             error: (err) => {
    //                 // Handle the error response
    //                 console.error('Error saving document', err);
    //                 this.toastr.error('Failed to save document');
    //             }
    //         });
    // }
    updateDocument(value) {
   

        this.brsrdoc.isAccept = value;
        this.brsrdoc.tenantID = this.loginInfo.tenantID;

        this.reportService.saveReportDocument(this.brsrdoc, this.brsrdoc.tenantID).subscribe({
            next: (response) => {
                // Handle the success response
                // this.toastr.success('Document Updated');

                if (value == true) {
                    this.toastr.success('Document Accepted');
                    var recipient = environment.PAadmin;
                    var message = environment.brsrAcceptMessage + this.loginInfo.companyName;
                    this.SendNotification(recipient, message);
                } else {
                    this.toastr.error('Document Rejected');
                    var recipient = environment.PAadmin;
                    var message = environment.brsrRejectMessage + this.loginInfo.companyName;
                    this.SendNotification(recipient, message);

                    // Hide the "Accept" button when the document is rejected
                    const acceptButton = document.querySelector('.acceptButton') as HTMLElement;
                    acceptButton.style.display = 'none';
                    const rejectButton = document.querySelector('.rejectButton') as HTMLElement;
                    rejectButton.style.display = 'none';
                }

                this.visible = false;
            },
            error: (err) => {
                // Handle the error response
                console.error('Error saving document', err);
                this.toastr.error('Failed to save document');
            }
        });
    }


    showDialog() {
        this.visible = true;
    }
    SendNotification(recipient, message) {
        var currentDate = new Date();

        this.sendNotificationData = new SendNotification();
        (this.sendNotificationData.tenantID = this.loginInfo.tenantID),
            (this.sendNotificationData.message = message);
        this.sendNotificationData.isRead = false;
        this.sendNotificationData.tenantID = this.loginInfo.tenantID;
        this.sendNotificationData.recipient = recipient;
        this.sendNotificationData.createdDate = currentDate;

        this.notification
            .SaveNotifications(this.sendNotificationData)
            .subscribe({
                next: (response) => { },
                error: (err) => {
                    console.error(err);
                },
                complete: () => console.info('notification send')
            });
    }
}
