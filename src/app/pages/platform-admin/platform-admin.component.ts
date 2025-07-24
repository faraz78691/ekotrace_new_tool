import { Facility } from '@/models/Facility';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { Group } from '@/models/group';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
// import { UserInfo } from 'os';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GroupService } from '@services/group.service';

import { UserService } from '@services/user.service';
@Component({
    selector: 'app-platform-admin',
    templateUrl: './platform-admin.component.html',
    styleUrls: ['./platform-admin.component.scss']
})
export class PlatformAdminComponent {
    updatedtheme: string;
    @ViewChild('GroupForm', { static: false }) GroupForm: NgForm;
    @ViewChild('projectionForm', { static: false }) projectionForm: NgForm;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    public loginInfo: LoginInfo;
    public admininfo: UserInfo;
    public userdetails: UserInfo;
  
    public groupMappingDetails: GroupMapping;
    public admininfoList: UserInfo[] = [];
    facilityList: Facility[] = [];

    public groupsList: Group[] = [];
    display = 'none';
    company_name = '';
    company_email = '';
    company_lisense = '';
    company_packageId: any;
    visible: boolean;
    visible2: boolean;

    FormEdit: boolean = false;


    isloading: boolean = false;

    superAdmin = {
        company_name: '',
        email: '',
        password: '',
        username:'',
        firstname: '',
        lastname: ''
      };




    superAdminId: any;

    packageDetails: any[] = [];

    constructor(
        private companyService: CompanyService,
        private UserService: UserService,
        private GroupService: GroupService,
        private notification: NotificationService,
        private facilityService: FacilityService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private themeservice: ThemeService
    ) {
        this.admininfo = new UserInfo();
        this.userdetails = new UserInfo();
        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();


    }
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            // this.facilityGet(this.loginInfo.tenantID);
        }

        // this.GetAllFacility();
        let tenantID = this.loginInfo.tenantID;
        this.getSuperAdmin();
        this.updatedtheme = this.themeservice.getValue('theme');
        this.getAllPackages();
    };


    getSuperAdmin() {

        this.GroupService.getSuperAdmins().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.groupsList = response.userinfo;
                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };

    getAllPackages() {

        this.UserService.getAdminPackageDetails().subscribe({
            next: (response: any) => {

                if (response.success == true) {
                    this.packageDetails = response.categories
                 
                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };




  // Method to handle form submission
  onSubmit(form: any) {
    if(this.loginInfo.role == 'Auditor'){
        this.notification.showInfo('You are not Authorized', '');
        return
    }
    if (form.valid) {
      this.isloading = true;
      // Call your API or add the necessary logic for form submission
      this.AddSuperAdmin(form);
    } else {
      // If the form is invalid, mark all fields as touched to display validation errors
      form.form.markAllAsTouched();
    }
  };

    // Your existing method for adding a Super Admin
    AddSuperAdmin(data:any) {
        // Simulate a loading state
        const formData = new URLSearchParams();

        formData.append('companyName', data.value.company_name.trim());
        formData.append('email',data.value.email.trim());
        formData.append('password', data.value.password.trim());
        formData.append('username', data.value.username.trim());
        formData.append('firstname', data.value.firstname.trim());
        formData.append('lastname', data.value.lastname.trim());


        this.GroupService.createSuperAdmin(formData.toString()).subscribe({
            next: (response:any) => {

                // this.GetEmissionInventory();

                this.visible2 = false;
                this.isloading = false
                this.notification.showSuccess(
                   response.message,
                ''
                );
                this.getSuperAdmin()
            },
            error: (err) => {
                this.notification.showError(err.message, 'Error');
                console.error(err);
            },
            complete: () => console.info('Group edited')
        });
      }


    //method for update group detail by id
    updateGroup(data: NgForm) {
        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        const formData = new URLSearchParams();

        formData.append('package_id', data.value.packageId);
        formData.append('tenantID', this.superAdminId);
        formData.append('expired_at', data.value.lisense);


        this.GroupService.updateSuperAdminPakcages(formData.toString()).subscribe({
            next: (response:any) => {

                // this.GetEmissionInventory();

                this.visible = false;
                this.notification.showSuccess(
                   response.message,
                    'Success'
                );
                this.getSuperAdmin()
            },
            error: (err) => {
                this.notification.showError(err.message, 'Error');
                console.error(err);
            },
            complete: () => console.info('Group edited')
        });
    };


    viewDetails(company: any) {
        this.company_lisense = ''
        this.superAdminId = company.Id;
        this.company_name = company.companyName;
        this.company_email = company.companyEmail;
        this.company_lisense = company.licenseExpired;
        this.company_packageId = company.package_id;
        this.FormEdit = false;
        this.visible = true;

    };

    clickAddSuperAdmin(){
        this.visible2 = true;
    }

    //retrieves all facilities for a given tenant

    //handles the closing of a dialog
    onCloseHandled() {
        this.visible = false;
        this.isloading = false;
        this.visible2 = false;
    }

    showAddGroupDialog2() {
        this.visible2 = true;
      
        this.FormEdit = false;

        // this.resetForm();
    };

   

    //display a dialog for add a group.
    showAddGroupDialog() {
        this.visible = true;
    
        this.FormEdit = false;
        this.resetForm();
    }


    //The removeCss function is used to remove CSS styles applied to the body element
    removeCss() {
        document.body.style.position = '';
        document.body.style.overflow = '';
    }

    //method for reset form
    resetForm() {
        this.GroupForm.resetForm();
    }



    //method for delete a group by id

}
