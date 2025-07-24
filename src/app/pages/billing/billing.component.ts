import { CountryCode } from '@/models/CountryCode';
import { Facility } from '@/models/Facility';
import { UserInfo } from '@/models/UserInfo';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@services/company.service';
import { ThemeService } from '@services/theme.service';
import { UserService } from '@services/user.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Message } from 'primeng/api';
@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent {
    searchData;
    public loginInfo: LoginInfo;
    public companyDetails: any;
    companyName: string;
    expirationDate: Date;
    oneDayBefore: Date;
    updatedtheme: string;
    rootUrl: string;
    showLoader = false;
    uploadedImageUrl: string;
    isExpired: boolean = false;
    countryCodes: CountryCode[];
    messages: Message[] | undefined;
    visible: boolean;
    facilityDetails: Facility = new Facility();
    isEdit: boolean;
    Add_Editdisplay = 'none';
    deleteDialog = 'none';
    AddManageDataPoint = 'none';
    FacilityData = 'none';
    FacilityFullData = 'none';
    NoData = 'none';
    // companyDetails: any[] = [];
    id_var: any;
    public userdetails: UserInfo;
    constructor(
        private companyService: CompanyService,
        private toastr: ToastrService,
        private themeservice: ThemeService,
        private userService: UserService
    ) {
        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';
        this.countryCodes = [];
    }
    //runs when component initialize
    ngOnInit() {
        //Retrieves the user login information from local storage
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            this.loginInfo = jsonObj as LoginInfo;
        }
        // this.getTenantsById(Number(this.loginInfo.tenantID));

        this.updatedtheme = this.themeservice.getValue('theme');
        this.getpackagesByusers()
    };
    //runs when any updation detects
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }
    // method for get tenant details by id
    // getTenantsById(id: number) {
    //     this.companyService.getTenantsDataById(id).subscribe((response) => {
    //         this.companyDetails = response;
    //         this.uploadedImageUrl =
    //             this.rootUrl +
    //             (response.logoName === '' || response.logoName === null
    //                 ? 'defaultimg.png'
    //                 : response.logoName);
    //         this.expirationDate = new Date(this.companyDetails.licenseExpired);
    //         this.expirationDate.setDate(this.expirationDate.getDate() - 1);
    //         const currentDate = new Date();
    //         const licenseExpiredDate = new Date(this.loginInfo.licenseExpired);
    //         this.isExpired = licenseExpiredDate < currentDate;

    //         // Calculate the difference in days
    //         const timeDifference =
    //             this.expirationDate.getTime() - currentDate.getTime();
    //         let leftDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    //         if (leftDays <= 7) {
    //             this.messages = [
    //                 {
    //                     severity: 'warn',
    //                     summary: 'Warning',
    //                     detail: 'Your plan is about to expire. Please renew it. Contact the platform admin for more information.'
    //                 }
    //             ];
    //         }
    //     });
    // };

    //method for send plan renewal mail
    onClick() {
        this.showLoader = true;
        this.companyService.sendmailForPlanRenewal().subscribe({
            next: (response) => {
                if (response) {
                    this.toastr.success(
                        'Request for renewal has been sent to Platform Admin'
                    );
                    this.showLoader = false;
                } else {
                    this.toastr.error('Request failed');
                }
            },
            error: (err) => {
                this.showLoader = false;
                if (err.error.message === 'Not Found') {
                    this.toastr.error('Record not found', '');
                } else {
                    // Handle other errors
                    console.error('errrrr', err);
                }
            }
        });
    }
    //method for get all the country code
 

    //Retrieves facility data for the specified tenant ID and updates the UI based on the data availability.
    // facilityGet(tenantId) {
    //     this.userService.getPackageDetails().subscribe({
    //         next: (response: any) => {

    //             this.companyDetails = response.categories;
    //             if (this.companyDetails.length == 0) {

    //                 this.NoData = 'block';
    //                 this.FacilityData = 'none';
    //                 this.FacilityFullData = 'none';
    //             } else {

    //                 this.FacilityData = 'block';ata
    //                 this.FacilityFullData = 'flex';
    //                 this.NoData = 'none';
    //             }
    //             // if (this.facilityrefresh == true) this.defaultData();
    //             // localStorage.setItem('FacilityCount', String(this.companyDetails.length));
    //         }, error: err => {
    //             console.log(err)
    //         }
    //     })
    //     // console.log(this.companyDetails);

    // };


    getpackagesByusers() {
        const formData = new URLSearchParams();
        formData.set('tenant_id', this.loginInfo.super_admin_id.toString())
        this.userService.getNewPackageDetails(formData.toString()).subscribe({
            next: (response: any) => {
              
                this.companyDetails = response.userinfo[0];
                this.expirationDate = new Date(this.companyDetails.expiration);
                this.expirationDate.setDate(this.expirationDate.getDate() - 1);
                const currentDate = new Date();
                const licenseExpiredDate = new Date(this.loginInfo.licenseExpired);
                this.isExpired = licenseExpiredDate < currentDate;

                // Calculate the difference in days
                const timeDifference =
                    licenseExpiredDate.getTime() - currentDate.getTime();
                let leftDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
                if (leftDays <= 7) {
                    this.messages = [
                        {
                            severity: 'warn',
                            summary: 'Warning',
                            detail: 'Your plan is about to expire. Please renew it. Contact the platform admin for more information.'
                        }
                    ];
                }
                if (this.companyDetails) {

                    this.NoData = 'block';
                    this.FacilityData = 'none';
                    this.FacilityFullData = 'none';
                } else {

                    this.FacilityData = 'block';
                    this.FacilityFullData = 'flex';
                    this.NoData = 'none';
                }
                // if (this.facilityrefresh == true) this.defaultData();
                // localStorage.setItem('FacilityCount', String(this.companyDetails.length));
            }, error: err => {
                console.log(err)
            }
        })
       

    };

    // getUsers() {
    //     this.userService.getNewPackageDetails().subscribe({
    //         next: (response: any) => {

    //             this.companyDetails = response.categories;
    //             if (this.companyDetails.length == 0) {

    //                 this.NoData = 'block';
    //                 this.FacilityData = 'none';
    //                 this.FacilityFullData = 'none';
    //             } else {

    //                 this.FacilityData = 'block';
    //                 this.FacilityFullData = 'flex';
    //                 this.NoData = 'none';
    //             }
    //             // if (this.facilityrefresh == true) this.defaultData();
    //             // localStorage.setItem('FacilityCount', String(this.companyDetails.length));
    //         }, error: err => {
    //             console.log(err)
    //         }
    //     })
    //     // console.log(this.companyDetails);

    // };
    showAddFacilityDialog() {
        this.visible = true;
        this.facilityDetails = new Facility();
        this.isEdit = false;
        // this.resetForm();
    };

    tableData(id: any) {
        // console.log("tbakee", id);
        this.id_var = id;
        // this.getUserofFacility(id);
    };

    //display a dialog for editing a facility
    showEditFacilityDialog() {
        this.visible = true;
        this.isEdit = true;

        // this.searchState();
    };


    //delete a facility by id
    deleteFacility(event: Event, ID: any) {
        let tenantId = this.loginInfo.tenantID;
        // this.confirmationService.confirm({
        //     target: event.target,
        //     message: 'Are you sure that you want to delete this facility?',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        //         this.facilityService.FacilityDelete(ID).subscribe({
        //             next: (response) => {
        //                 this.facilityGet(tenantId);
        //                 if (
        //                     localStorage.getItem('FacilityGroupCount') != null
        //                 ) {
        //                     let fgcount =
        //                         localStorage.getItem('FacilityGroupCount');
        //                     let newcount = Number(fgcount) - 1;
        //                     localStorage.setItem(
        //                         'FacilityGroupCount',
        //                         String(newcount)
        //                     );
        //                 }
        //                 this.notification.showSuccess(
        //                     'Facility deleted successfully',
        //                     'success'
        //                 );
        //             },
        //             error: (err) => {
        //                 this.notification.showError(
        //                     'Facility deleted failed.',
        //                     'Error'
        //                 );
        //                 console.log(err);
        //             },
        //             complete: () => console.info('Facility deleted')
        //         });
        //     }
        // });
    }

    //method for add new facility
    saveFacility(data: any) {

    }
    //method for update a facility by id
    editfacility(id: any, data: any) {

    };

}
