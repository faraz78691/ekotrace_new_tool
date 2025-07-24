import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { LoginInfo } from '@/models/loginInfo';
import { Component} from '@angular/core';
import { environment } from 'environments/environment';
import { Calendar } from 'primeng/calendar';
import { CustomReportModel } from '@/models/CustomReportModel';
import { ThemeService } from '@services/theme.service';
import { BRSR_Table14 } from '@/models/BrsrReport';
import { ReportService } from '@services/report.service';
import { NotificationService } from '@services/notification.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QAdata from './brsrQA.json';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { brsR_Q_As } from '@/models/brsrQA';
import { BRSR_Doc, BRSR_Questions } from '@/models/brsrDOc';
import { SendNotification } from '@/models/SendNotification';
import { ConfirmationService } from 'primeng/api';
import { brsrPrinciples } from '@/models/brsrPrinciples';
import { TrackingService } from '@services/tracking.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-brsr-report',
    templateUrl: './brsr-report.component.html',
    styleUrls: ['./brsr-report.component.scss']
})
export class BrsrReportComponent {
  
    public loginInfo: LoginInfo;
    updatedtheme: any;
    sendNotificationData: SendNotification;
    public brsrdata: BRSR_Doc;
    public brsrQuestions: BRSR_Doc;
    public brsrPrinciplesandQA: brsrPrinciples[];
    sendbrsrScreen = 'none';
    nobrsrSaved = false;
    AcceptDoc = false;
    islock = false;
    defaultTabIndex: number = 0;
    showUnansweredFields = false;
    focusedFieldIndex: number | null = null;
    public brsrTable14List: BRSR_Table14[] = [];
    fileNameHR: string = '';
    fileNameCS: string = '';
    fileNameFD: string = '';
    fileNameFDM: string = '';
    file:File;
    constructor(
        private themeservice: ThemeService,
        private router: Router,
        private reportService: ReportService,
        private notification: NotificationService,//private brsrdata:BRSR_Doc
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
        private trackingService:TrackingService,
        private toastr: ToastrService,
    ) {
        this.brsrQuestions = new BRSR_Doc;
        this.brsrdata = new BRSR_Doc();
        // this.brsrdata.brsR_Q_As = [];
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.defaultTab !== undefined) {
                this.defaultTabIndex = +params.defaultTab; // Convert to a number
            }
        });
        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
          
        }
        this.updatedtheme = this.themeservice.getValue('theme');
        // this.getQuestions();
        // this.checkbrsrdata(this.loginInfo.tenantID);
    }
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    };



    onFileSelected(event: any, id:any): void {
    this.file = event.target.files[0];
      if (this.file && id == 1) {
        this.fileNameHR = this.file.name;
      }
      else if (this.file && id == 2) {
        this.fileNameFD = this.file.name;
      }
      else if (this.file && id == 3) {
        this.fileNameCS = this.file.name;
      }
     else if (this.file && id == 4) {
        this.fileNameFDM = this.file.name;
      }
    };

    uploadFiles(name:string) {

        if(name =='CS'){
            const formData: FormData = new FormData();
            formData.append('file', this.file, this.fileNameCS);
            formData.append('type', '1');
       
            this.trackingService.uploadBRSRCS(formData).subscribe({
                next: (response) => {
                    if (response) {
                        this.toastr.success('Doc uploaded successfully');
                     
                    } else {
                        // Handle the case when the file upload was not successful
                        this.toastr.error('Doc uploaded failed');
                    }
                },
                error: (err) => {
                    if (
                        err.error.message ===
                        'File size exceeds the allowed limit'
                    ) {
                        this.notification.showError(
                            'File is too large to upload',
                            ''
                        );
                    } else if (
                        err.error.message ===
                        'Only PNG, JPG and PDF files are allowed'
                    ) {
                        this.notification.showError(
                            'Only PNG and JPG files are allowed',
                            ''
                        );
                    } else {
                        // Handle other errors
                        console.error('errrrr', err);
                    }
                    this.toastr.error('Doc upload failed');
                    // Handle the error
                  
                }
            });
        }else if(name == 'HR'){
            const formData: FormData = new FormData();
            formData.append('file', this.file, this.fileNameHR);
            formData.append('type', '2');
       
            this.trackingService.uploadBRSRCS(formData).subscribe({
                next: (response) => {
                    if (response) {
                        this.toastr.success('Doc uploaded successfully');
                     
                    } else {
                        // Handle the case when the file upload was not successful
                        this.toastr.error('Doc uploaded failed');
                    }
                },
                error: (err) => {
                    if (
                        err.error.message ===
                        'File size exceeds the allowed limit'
                    ) {
                        this.notification.showError(
                            'File is too large to upload',
                            ''
                        );
                    } else if (
                        err.error.message ===
                        'Only PNG, JPG and PDF files are allowed'
                    ) {
                        this.notification.showError(
                            'Only PNG and JPG files are allowed',
                            ''
                        );
                    } else {
                        // Handle other errors
                        console.error('errrrr', err);
                    }
                    this.toastr.error('Doc upload failed');
                    // Handle the error
                    // console.log('Error-->>: ', JSON.stringify(err));
                }
            });
        }else if(name =='FD'){
            const formData: FormData = new FormData();
            formData.append('file', this.file, this.fileNameFD);
            formData.append('type', '3');
       
            this.trackingService.uploadBRSRCS(formData).subscribe({
                next: (response) => {
                    if (response) {
                        this.toastr.success('Doc uploaded successfully');
                     
                    } else {
                        // Handle the case when the file upload was not successful
                        this.toastr.error('Doc uploaded failed');
                    }
                },
                error: (err) => {
                    if (
                        err.error.message ===
                        'File size exceeds the allowed limit'
                    ) {
                        this.notification.showError(
                            'File is too large to upload',
                            ''
                        );
                    } else if (
                        err.error.message ===
                        'Only PNG, JPG and PDF files are allowed'
                    ) {
                        this.notification.showError(
                            'Only PNG and JPG files are allowed',
                            ''
                        );
                    } else {
                        // Handle other errors
                        console.error('errrrr', err);
                    }
                    this.toastr.error('Doc upload failed');
                    // Handle the error
                    // console.log('Error-->>: ', JSON.stringify(err));
                }
            });
        }else if(name == 'FCD'){
            const formData: FormData = new FormData();
            formData.append('file', this.file, this.fileNameFDM);
            formData.append('type', '4');
       
            this.trackingService.uploadBRSRCS(formData).subscribe({
                next: (response) => {
                    if (response) {
                        this.toastr.success('Doc uploaded successfully');
                     
                    } else {
                        // Handle the case when the file upload was not successful
                        this.toastr.error('Doc uploaded failed');
                    }
                },
                error: (err) => {
                    if (
                        err.error.message ===
                        'File size exceeds the allowed limit'
                    ) {
                        this.notification.showError(
                            'File is too large to upload',
                            ''
                        );
                    } else if (
                        err.error.message ===
                        'Only PNG, JPG and PDF files are allowed'
                    ) {
                        this.notification.showError(
                            'Only PNG and JPG files are allowed',
                            ''
                        );
                    } else {
                        // Handle other errors
                        console.error('errrrr', err);
                    }
                    this.toastr.error('Doc upload failed');
                    // Handle the error
                    // console.log('Error-->>: ', JSON.stringify(err));
                }
            });
        }
      

          
        
    }



 
   
   

    answeredQuestionsCount(principle: any): string {
        const answeredCount = principle.brsR_Q_As.filter(question => question.answer).length;
        const totalCount = principle.brsR_Q_As.length;
        return `${answeredCount}/${totalCount}`;
    }

    parseAnsweredCount(answeredCountString: string): number {
        const parts = answeredCountString.split('/');
        return parseInt(parts[0], 10);
    }

    parseTotalCount(answeredCountString: string): number {
        const parts = answeredCountString.split('/');
        return parseInt(parts[1], 10);
    }
    
      
    
    
  
    
    
      
    
    // Adding new rows
    addRow() {
        this.brsrTable14List.push({
            id: 0,
            clientId: 0,
            tenantId: this.loginInfo.tenantID,
            percentageOfTurnoverOfTheEntity: 0,
            descriptionOfMainActivity: '',
            descriptionOfBusinessActivity: ''
        });
    }

    // remove row that we selected
    removeRow(index: number) {
        this.brsrTable14List.splice(index, 1);
    }
    saveReport() {
        this.brsrdata = new BRSR_Doc();
        this.brsrdata.tenantID = this.loginInfo.tenantID;
        this.brsrdata.isLock = false;
        this.brsrdata.brsR_Q_As = [];
        //this.brsrdata = this.brsrQuestions;
        var answered: number = 0;
        var totalQue: number = 0;
        this.brsrPrinciplesandQA.forEach(principles => {
            for (let i = 0; i < principles.brsR_Q_As.length; i++) {
                totalQue += 1;
                const qa = { ...principles.brsR_Q_As[i] }; // Create a shallow copy of the question object
                const obj = new brsR_Q_As();
                obj.question = qa.question;
                if (qa.answer != null && qa.answer != undefined && qa.answer != "") {
                    obj.answer = qa.answer;
                    answered += 1;
                }
                obj.tenantId = this.loginInfo.tenantID;
                obj.questionId = qa.id;
                obj.principleID = qa.principleID;
                this.brsrdata.brsR_Q_As.push(obj);
            }
        })

        var mess = "Total Question- " + totalQue + " And Answered question- " + answered;

        this.confirmationService.confirm({
            target: event.target,
            message: mess,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.reportService.SavebrsrQA(this.brsrdata).subscribe((response) => {
                    if (response === true) {
                        this.notification.showSuccess('QA saved', 'Success');
                        this.checkbrsrdata(this.loginInfo.tenantID);
                    }
                });
            }
        });

    }
    sendReportToPA() {
        this.brsrdata = new BRSR_Doc();
        this.brsrdata.tenantID = this.loginInfo.tenantID;
        this.brsrdata.isLock = true;
        this.brsrdata.brsR_Q_As = [];
        //this.brsrdata = this.brsrQuestions;
        var answered: number = 0;
        var totalQue: number = 0;
        this.brsrPrinciplesandQA.forEach(principles => {
            for (let i = 0; i < principles.brsR_Q_As.length; i++) {
                totalQue += 1;
                const qa = { ...principles.brsR_Q_As[i] }; // Create a shallow copy of the question object
                const obj = new brsR_Q_As();
                obj.question = qa.question;
                if (qa.answer != null && qa.answer != undefined && qa.answer != "") {
                    obj.answer = qa.answer;
                    answered += 1;
                }
                obj.tenantId = this.loginInfo.tenantID;
                obj.questionId = qa.id;
                obj.principleID = qa.principleID;
                //obj.questionId = 0;
                this.brsrdata.brsR_Q_As.push(obj);
            }
        })

        var mess = "Total Question- " + totalQue + " And Answered question- " + answered;

        this.confirmationService.confirm({
            target: event.target,
            message: mess,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.reportService.SavebrsrQA(this.brsrdata).subscribe((response) => {
                    if (response === true) {
                        this.notification.showSuccess('QA sended to PA admin', 'Success');
                        var recipient = environment.PAadmin;
                        var message =
                            'BRSR QA Entry recieved for tenant ' +
                            this.loginInfo.companyName;
                        this.SendNotification(recipient, message);
                        this.checkbrsrdata(this.loginInfo.tenantID);
                    }
                });
            }
        });

    }
    updateReport() {
        this.brsrdata = new BRSR_Doc();
        this.brsrdata.brsR_Q_As = [];
        this.brsrdata = this.brsrQuestions;
        this.brsrdata.isAccept = null;
        var answered: number = 0;
        var totalQue: number = 0;
        // console.log('QA2', this.brsrdata);
        this.brsrPrinciplesandQA.forEach(principles => {
            for (let i = 0; i < principles.brsR_Q_As.length; i++) {
                totalQue += 1;
                const qa = { ...principles.brsR_Q_As[i] };
                this.brsrdata.brsR_Q_As.forEach(updated => {
                    if (qa.answer != null && qa.answer != undefined && qa.answer != "") {
                        if (updated.question === qa.question) {
                            updated.answer = qa.answer;
                            answered += 1;
                        }
                    }
                })
            }
        })
        var mess = "Total Question- " + totalQue + " And Answered question- " + answered;

        this.confirmationService.confirm({
            target: event.target,
            message: mess,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.reportService.SavebrsrQA(this.brsrdata).subscribe((response) => {
                    if (response === true) {
                        this.notification.showSuccess('QA updated', 'Success');
                        this.checkbrsrdata(this.loginInfo.tenantID);
                    }
                });
            }
        });


    }
    SendupdatedReporttoPA() {
        this.brsrdata = new BRSR_Doc();
        this.brsrdata.brsR_Q_As = [];
        this.brsrdata = this.brsrQuestions;
        this.brsrdata.isAccept = null;
        this.brsrdata.isLock = true;
        var answered: number = 0;
        var totalQue: number = 0;
        // console.log('QA2', this.brsrdata);
        this.brsrPrinciplesandQA.forEach(principles => {
            for (let i = 0; i < principles.brsR_Q_As.length; i++) {
                totalQue += 1;
                const qa = { ...principles.brsR_Q_As[i] };
                this.brsrdata.brsR_Q_As.forEach(updated => {
                    if (qa.answer != null && qa.answer != undefined && qa.answer != "") {
                        if (updated.question === qa.question) {
                            updated.answer = qa.answer;
                            answered += 1;
                        }
                    }
                })
            }
        })
        var mess = "Total Question- " + totalQue + " And Answered question- " + answered;

        this.confirmationService.confirm({
            target: event.target,
            message: mess,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.reportService.SavebrsrQA(this.brsrdata).subscribe((response) => {
                    if (response === true) {
                        this.notification.showSuccess('Updated QA sended to PA admin', 'Success');
                        var recipient = environment.PAadmin;
                        var message =
                            'BRSR QA Entry updated for tenant ' +
                            this.loginInfo.companyName;
                        this.SendNotification(recipient, message);
                        this.checkbrsrdata(this.loginInfo.tenantID);
                    }
                });
            }
        });

    }

  
    isAnyFieldAnswered(): boolean {
        for (let brsr of this.brsrPrinciplesandQA) {
            for (let brsrq of brsr.brsR_Q_As) {
                if (brsrq.answer && brsrq.answer.trim().length > 0) {
                    return true; // At least one field is answered
                }
            }
        }
        return false; // No field is answered
    }

    SendNotification(recipient, message) {
        var currentDate = new Date();
        this.sendNotificationData = new SendNotification();
        (this.sendNotificationData.tenantID = this.loginInfo.tenantID),
            (this.sendNotificationData.message = message);
        this.sendNotificationData.isRead = false;
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
    //     // console.log("QA", this.Questions);
    //     this.brsrdata = new BRSR_Doc;

    //     // Set the tenantID property of 'brsrdata' from 'loginInfo'
    //     this.brsrdata.tenantID = this.loginInfo.tenantID;

    //     // Iterate through each question-answer object in 'Questions'
    //     this.Questions.forEach(qa => {
    //         // Find the corresponding question-answer document in 'brsrQA'
    //         const correspondingQADoc = this.brsrdata.brsrQA.find(qadoc => qadoc.question === qa.question);

    //         if (correspondingQADoc) {
    //             // Update the corresponding question-answer document's properties
    //             correspondingQADoc.question = qa.question;

    //             // Update 'answer' only if 'qa.answer' is not null or undefined
    //             if (qa.answer != null && qa.answer !== undefined) {
    //                 correspondingQADoc.answer = qa.answer;
    //             }

    //             // Set the tenantID property of the question-answer document
    //             correspondingQADoc.tenantID = this.loginInfo.tenantID;
    //         }
    //     });

    //     // console.log("QA2", this.brsrdata);
    // }

    // Method to generate and download the PDF
    // To generated report in PDF formate
    generateCustomizedPDF() {
        const doc = new jsPDF();
        let y = 10; // Initial y position for the content

        doc.setFontSize(12); // Adjust font size of the report

        const reportTypes = [
            '14. Details of business activities (accounting for 90% of the turnover):'
        ];

        reportTypes.forEach((reportType) => {
            const filteredReport = this.brsrTable14List;

            if (filteredReport.length > 0) {
                this.addSectionHeader(doc, reportType, y);
                y += 15; // Adjust the y position for the table

                // Customize the headers based on the report type
                let headers: string[] = [];
                if (
                    reportType ===
                    '14. Details of business activities (accounting for 90% of the turnover):'
                ) {
                    headers = [
                        'Client ID',
                        'Description Of Business Activity',
                        'Description Of Main Activity',
                        'Percentage Of Turnover Of The Entity'
                    ];
                }

                let tableData: (string | number)[][] = [headers];

                // Format the table rows
                filteredReport.forEach((item) => {
                    let row: (string | number)[] = [];

                    // Customize the values based on the report type
                    if (
                        reportType ===
                        '14. Details of business activities (accounting for 90% of the turnover):'
                    ) {
                        row = [
                            item.clientId,
                            item.descriptionOfBusinessActivity,
                            item.descriptionOfMainActivity,
                            item.percentageOfTurnoverOfTheEntity
                        ];
                    }

                    tableData.push(row);
                });

                // Set the column widths for the table
                const columnWidths = [40, 40, 40, 40];

                // Add the table to the PDF document
                (doc as any).autoTable({
                    startY: y,
                    head: tableData.slice(0, 1),
                    body: tableData.slice(1),
                    columns: columnWidths,
                    theme: 'grid',
                    styles: {
                        fontSize: 10,
                        cellPadding: 5
                    },
                    didParseCell: function (data) {
                        if (data.section === 'head') {
                            data.cell.styles.fillColor = [255, 255, 255]; // Black color for header fill
                            data.cell.styles.textColor = [0, 0, 0]; // White color for header text
                            data.cell.styles.lineWidth = 0.3;
                            data.cell.styles.lineColor = [0, 0, 0];
                        } else {
                            // Add border to body cells
                            data.cell.styles.lineWidth = 0.3; // Customize the border width
                            data.cell.styles.lineColor = [0, 0, 0]; // Black color for the border
                        }
                    }
                });

                y = (doc as any).autoTable.previous.finalY + 10; // Update the y position after the table
            }
        });

        doc.save('report.pdf');
    }

    addSectionHeader(doc: jsPDF, section: string, y: number) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(section + ' Report', 10, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
    }
    isFormEmpty(): boolean {
        for (const brsr of this.brsrTable14List) {
            if (
                brsr.clientId ||
                brsr.percentageOfTurnoverOfTheEntity ||
                brsr.descriptionOfMainActivity ||
                brsr.descriptionOfBusinessActivity
            ) {
                return false;
            }
        }
        return true;
    }
    checkbrsrdata(tenantID) {
        this.brsrdata = new BRSR_Doc();
        this.brsrdata.brsR_Q_As = [];


        this.reportService.getBRSRdata(tenantID).subscribe((response) => {
            if (response != null) {
              
                this.brsrdata = response;
                this.brsrQuestions = response;
                this.brsrPrinciplesandQA.forEach(principle => {
                    response.brsR_Q_As.forEach(resp => {
                        const matchingQuestion = principle.brsR_Q_As.find(repQues =>
                            resp.question === repQues.question && resp.principleID === repQues.principleID
                        );

                        if (matchingQuestion) {
                            matchingQuestion.id = resp.id;
                            matchingQuestion.principleID = resp.principleID;
                            matchingQuestion.brsR_DocId = resp.brsR_DocId;
                            matchingQuestion.answer = resp.answer;
                            matchingQuestion.question = resp.question;
                            matchingQuestion.questionId = resp.questionId;
                            matchingQuestion.tenantId = resp.tenantId;
                        }
                    });
                });
                // console.log("checkque>", this.brsrPrinciplesandQA)
                //this.brsrQuestions.brsR_Q_As = this.brsrdata.brsR_Q_As;
                this.nobrsrSaved = false;
                if (this.brsrdata.docPath != null || this.brsrdata.docPath != undefined) {
                    if (this.brsrdata.isAccept != false && this.brsrdata.isLock == false) {
                        //this.AcceptDoc = false;
                        this.islock = false;
                    }
                    else if (this.brsrdata.isAccept != false && this.brsrdata.isLock == true) {
                        this.islock = true;
                    }
                    else if (this.brsrdata.isAccept == true) {
                        this.AcceptDoc = true;
                        this.islock = true;
                    }
                    else {
                        this.AcceptDoc = false;
                        this.islock = false;
                    }
                }
                else {
                    if (this.brsrdata.isLock == true) {
                        this.islock = true;
                    }
                    else {
                        this.islock = false;
                    }
                }
            } else {
                this.nobrsrSaved = true;
            }
        });
    }

    getQuestions() {
        this.reportService.getQuestions().subscribe((response) => {
            if (response != null) {
              
                this.brsrPrinciplesandQA = response;

                this.brsrPrinciplesandQA.forEach(principle => {
                    const matchingRepPrinciple = response.find(repPrinciple => repPrinciple.id === principle.id);
                    if (matchingRepPrinciple) {
                        // Initialize brsR_Q_As as an empty array if not already initialized
                        principle.brsR_Q_As = principle.brsR_Q_As || [];

                        matchingRepPrinciple.brsrQuestions.forEach(repQues => {
                            const obj = new brsR_Q_As();
                            obj.id = repQues.id;
                            obj.principleID = repQues.principleID;
                            obj.question = repQues.question;

                            principle.brsR_Q_As.push(obj); // Push the new question to brsR_Q_As array
                        });
                    }
                });



            }
        });
    }
    navigateToTab(path: string, queryParams: any) {
        this.router.navigate([path], { queryParams, relativeTo: this.route, queryParamsHandling: 'merge' });
    }
    getTabHeader(brsr: any, index: number): string {
        return `
          <a href="javascript:void(0);" (click)="navigateToTab('/brsr-report', { defaultTab: ${index} })">
            ${brsr.principleName}
          </a>
        `;
    }


}
