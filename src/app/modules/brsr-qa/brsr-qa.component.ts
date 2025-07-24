import { SendNotification } from '@/models/SendNotification';
import { BRSR_Doc } from '@/models/brsrDOc';
import { brsrPrinciples } from '@/models/brsrPrinciples';
import { brsR_Q_As } from '@/models/brsrQA';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '@services/company.service';
import { NotificationService } from '@services/notification.service';
import { ReportService } from '@services/report.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-brsr-qa',
    templateUrl: './brsr-qa.component.html',
    styleUrls: ['./brsr-qa.component.scss']
})
export class BrsrQaComponent {
    selectedFile: File | null = null;
    tenantId;
    public loginInfo: LoginInfo;
    public brsrdoc: BRSR_Doc;
    sendNotificationData: SendNotification;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    brsrdata: BRSR_Doc = new BRSR_Doc();
    public brsrPrinciplesandQA: brsrPrinciples[];
    qadata = 'block';
    noqa = 'none';
    currentPage = 1;
    itemsPerPage = 6;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private companyService: CompanyService,
        private toastr: ToastrService,
        private reportService: ReportService,
        private notification: NotificationService
    ) {
        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();
        this.brsrdoc = new BRSR_Doc();
        this.brsrdata = new BRSR_Doc();
        this.brsrdata.brsR_Q_As = [];
    }
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.route.queryParams.subscribe((params) => {
                this.tenantId = params['data']; // Access the passed data parameter
            });
            this.getQuestions();
            this.checkbrsrdata(this.tenantId);
        }
    }
    qaList = [
        {
            question:
                'Total number of permanent male workers who have left the organization?',
            answer: '20'
        },
        {
            question:
                'Total number of permanent female workers who have left the organization?',
            answer: '10'
        },
        {
            question: 'Total number of male permanent workers?',
            answer: '100'
        },
        {
            question: 'Total number of female permanent workers?',
            answer: '70'
        },
        {
            question:
                'Percentage of workers that have received training on skill upgradation?',
            answer: '50'
        }
    ];

    selectedQuestion: any; // To store the currently selected question
    selectedQuestionAnswer: string = ''; // To store the user's answer

    selectQuestion(qa: any) {
        this.selectedQuestion = qa;
        this.selectedQuestionAnswer = '';
    }

    saveAnswer() {
        if (this.selectedQuestion) {
            this.selectedQuestion.answer = this.selectedQuestionAnswer;
        }
        // You can add additional logic here to save the answer to a backend/server
    }

    //method for upload report document
    uploadDoc(files: FileList | null) {
        if (files && files.length > 0) {
            const file = files[0];
            const allowedFormats = ['.docx', '.pdf'];
            const fileExtension = file.name
                .toLowerCase()
                .substr(file.name.lastIndexOf('.'));

            if (!allowedFormats.includes(fileExtension)) {
                // File format is not allowed, display an error message or handle the error
                this.toastr.error(
                    'Invalid file format. Only docx and pdf files are allowed'
                );
                return;
            }
            this.selectedFile = files[0];

            const formData: FormData = new FormData();
            formData.append('file', this.selectedFile, this.selectedFile.name);
            if (formData.has('file')) {
                // File is available in the FormData
           
            } else {
                // File is not available in the FormData
               
            }
            let tenantId = this.loginInfo.tenantID;
            this.reportService.UploadReportDoc(formData, tenantId).subscribe({
                next: (response) => {
                    if (response) {
                        this.brsrdoc.docName = this.selectedFile.name;
                        //this.toastr.success('File uploaded successfully', 'Success', { timeOut: 3000 });
                        this.toastr.success('Document uploaded successfully');
                    } else {
                        // Handle the case when the file upload was not successful
                        this.toastr.error('Document upload failed');
                    }
                },
                error: (err) => {
                    if (
                        err.error.message ===
                        'Only docx and pdf files are allowed'
                    ) {
                        this.notification.showError(
                            'Only docx and pdf files are allowed',
                            ''
                        );
                    } else {
                        // Handle other errors
                        console.error('errrrr', err);
                        this.toastr.error('Image upload failed');
                    }
                    // Handle the error
                    // console.log('Error-->>: ', JSON.stringify(err));
                    //this.toastr.error('Document uploadd failed');
                }
            });
        }
    }
    //triggered when a file is selected from the file input
    onFileSelected(files: FileList) {
        const file = files.item(0);
        if (file) {
            this.uploadDoc(files);
            this.selectedFile = files[0];
        }
    }

    saveDocument() {
      
    
        this.brsrdoc.docName = this.selectedFile?.name;
     
        this.reportService
            .saveReportDocument(this.brsrdoc, this.tenantId)
            .subscribe({
                next: (response) => {
                    // Handle the success response
                    this.toastr.success('Document saved successfully');
                    var recipent = environment.SuperAdmin;
                    var message = environment.brsrdocMessage;
                    this.SendNotification(recipent, message);
                },
                error: (err) => {
                    // Handle the error response
                    console.error('Error saving document', err);
                    this.toastr.error('Failed to save document');
                }
            });
    }
    checkbrsrdata(tenantID) {
        this.reportService.getBRSRdata(tenantID).subscribe((response) => {
            if (response != null && response.isLock === true) {
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
                
                this.qadata = 'block';
                this.noqa = 'none';
            } else {
                this.qadata = 'none';
                this.noqa = 'block';
            }
        });
    }

    SendNotification(recipient, message) {
        this.sendNotificationData = new SendNotification();
        this.sendNotificationData.message = message;
        var currentDate = new Date();
        this.sendNotificationData.isRead = false;
        this.sendNotificationData.recipient = recipient;
        this.sendNotificationData.tenantID = this.tenantId;
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

}
