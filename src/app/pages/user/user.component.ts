import { UserInfo } from '@/models/UserInfo';
import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { UserService } from '@services/user.service';
import { NotificationService } from '@services/notification.service';
import { userInfo } from 'os';
import { Facility } from '@/models/Facility';
import { FacilityService } from '@services/facility.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { RoleModel, newRoleModel } from '@/models/Roles';
import { ThemeService } from '@services/theme.service';
import { CompanyDetails } from '@/shared/company-details';
import { CompanyService } from '@services/company.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
    isHowtoUse = false;
    @ViewChild('UserForm', { static: false }) UserForm: NgForm;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    public loginInfo: LoginInfo;
    public admininfo: UserInfo;
    public userdetails: UserInfo;
    public admininfoList: UserInfo[] = [];
    facilityList: any[] = [];
    RolesList: newRoleModel[] = [];
    inputText: any = ''
    display = 'none';
    visible: boolean;
    unlock: any;
    selectedRole = '';
    Alert: boolean = false;
    RoleIcon: string = '';
    FormEdit: boolean = false;
    usernameIsExist: boolean = false;
    emailIstExist: boolean = false;
    Roleaccess = environment.adminRoleId;
    searchData: '';
    isloading: boolean = false;
    maxCharacters: number = 15;
    facilitydata: boolean = false;
    updatedtheme: string;
    rootUrl: string;
    uploadedImageUrl: string;
    groupId: any;
    payloadFacilityIds: any;
    selectedFacilityID: any
    constructor(
        private companyService: CompanyService,
        private UserService: UserService,
        private notification: NotificationService,
        public facilityService: FacilityService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private themeservice: ThemeService
    ) {
        this.admininfo = new UserInfo();
        this.userdetails = new UserInfo();
        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';
    }
    ngOnInit() {
        // Check if login information exists in local storage
        if (localStorage.getItem('LoginInfo') != null) {
            // Retrieve login information from local storage
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            this.loginInfo = jsonObj as LoginInfo;
        }
        // this.getTenantsDetailById(Number(this.loginInfo.tenantID));
        // this.GetAllFacility();
        this.GetAllUsers();
        this.GetAllRoles();
        this.updatedtheme = this.themeservice.getValue('theme');

    }
    // updates the updatedtheme variable with the current value of the 'theme'.
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }

    /* 
  The getTenantsDetailById function retrieves the tenant detail by ID,
 also sets the uploadedImageUrl based on the logoName property in the response. 
  If the logoName is empty or null, it uses a default image URL.
  */
    getTenantsDetailById(id: number) {
        this.companyService.getTenantsDataById(id).subscribe((response) => {
            this.companyDetails = response;
            this.uploadedImageUrl =
                this.rootUrl +
                (response.logoName === '' || response.logoName === null
                    ? 'defaultimg.png'
                    : response.logoName);
        });
    };

    //Checks the facility ID and calls the GetAssignedDataPoint function with the provided ID.
    onChangeFacilityId() {
     
        if (this.selectedRole == '525debfd-cd64-4936-ae57-346d57de3585') {
            const facilityIDs = this.facilityList.filter((item) => item.id == this.admininfo.group_id).map((item) => item.ID);

            this.groupId = this.admininfo.group_id;
            const stringfyIDs = JSON.stringify(facilityIDs[0]);
            this.payloadFacilityIds = stringfyIDs;
            
        } else {
            const stringfyIDs = JSON.stringify([this.admininfo.facilityID.toString()]);
            this.payloadFacilityIds = stringfyIDs;

        }

        // this.GetAssignedDataPoint(id);
    };
    //The onSubmit function handles form submission, including validation, user addition, and user update, with success/error notifications.
    onSubmit(x: any) {

        if (this.loginInfo.role == 'Auditor') {
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        if (!this.payloadFacilityIds) {
            this.notification.showInfo('Please select group or facility', '');
            return
        }
        if (!this.FormEdit) {
            if (
                (!this.admininfo.username || this.admininfo.username == '') ||
                (!this.admininfo.firstname || this.admininfo.firstname == '') ||
                (!this.admininfo.lastname || this.admininfo.lastname == '') ||
                (!this.admininfo.email || this.admininfo.email == '') || (!this.admininfo.password || this.admininfo.password == '')
            ) {
                return
            }

        } else {
            if (
                (!this.admininfo.username || this.admininfo.username == '') ||
                (!this.admininfo.firstname || this.admininfo.firstname == '') ||
                (!this.admininfo.lastname || this.admininfo.lastname == '') ||
                (!this.admininfo.email || this.admininfo.email == '')
            ) {
                return
            }
        }
        if (this.FormEdit === false) {
            if (
                this.loginInfo.package_info.users <= this.admininfoList.length
            ) {
                this.notification.showWarning(
                    'You have reached the maximum limit, and you will need to either upgrade your plan or delete your user account.',
                    'Warning'
                );
                this.isloading = false;
            } else {
                if (this.loginInfo.role == 'Manager') {
                    this.admininfo.facilityID = this.loginInfo.facilityID;
                }
                if (this.selectedRole == '') {
                    this.notification.showWarning(
                        'Please select role',
                        'Warning'
                    );
                    return
                };


                const formData = new URLSearchParams();
                formData.set('email', this.admininfo.email.trim().toLocaleLowerCase())
                formData.set('username', this.admininfo.username)
                formData.set('password', this.admininfo.password.trim())
                formData.set('firstname', this.admininfo.firstname.trim())
                formData.set('lastname', this.admininfo.lastname)
                formData.set('roleID', this.selectedRole)
                formData.set('tenantId', this.loginInfo.super_admin_id.toString())
                formData.set('facilityID', this.payloadFacilityIds)
                formData.set('package_id', this.loginInfo.package_id.toString())
                formData.set('group_id', this.groupId?.toString())

                this.UserService.newSaveUsers(formData).subscribe({
                    next: (response: any) => {
                        if (response) {
                            if (response.success == true) {
                                this.notification.showSuccess(
                                    'User Added successfully',
                                    'Success'
                                );
                                this.GetAllUsers();
                                this.visible = false;
                                this.selectedRole = ''
                                this.isloading = false;
                                this.payloadFacilityIds = null;

                            } else {
                                this.notification.showError(
                                    response.message,
                                    ''
                                );

                                this.isloading = false;
                            }
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'User added failed.',
                            'Error'
                        );
                        console.error(err);
                        this.isloading = false;
                    },
                    complete: () => console.info('User Added')
                });
            }
        }
        if (this.FormEdit === true) {
            if (
                this.loginInfo.package_info.users < this.admininfoList.length
            ) {
                this.notification.showWarning(
                    'You have reached the maximum limit, and you will need to either upgrade your plan or delete your user account.',
                    'Warning'
                );
                return
            } else {
                const isValidGroupID = this.admininfo.group_id !== null && this.admininfo.group_id !== undefined && this.admininfo.group_id !== '';
                const groupID = isValidGroupID ? this.admininfo.group_id : 0;
                const formData = new URLSearchParams();
                formData.set('email', this.admininfo.email)
                formData.set('username', this.admininfo.username)
                // formData.set('password', this.admininfo.password)
                formData.set('firstname', this.admininfo.firstname)
                formData.set('lastname', this.admininfo.lastname)
                formData.set('roleID', this.selectedRole)
                formData.set('facilityID', this.payloadFacilityIds)
                formData.set('group_id', groupID)
                formData.set('user_id', this.admininfo.user_id.toString())


                this.UserService.NUpdateUsers(formData.toString()).subscribe({
                    next: (response) => {
                        this.notification.showSuccess(
                            'User Update successfully',
                            'Success'
                        );
                        this.visible = false;
                        this.isloading = false;
                        this.GetAllUsers();
                    },
                    error: (err) => {
                        console.log(err);
                        this.notification.showError(
                            'Update User failed.',
                            'Error'
                        );
                        this.isloading = false;
                    },
                    complete: () => console.info('User Updated')
                });
            }
        }
    };

    // ----Get all users method ---
    GetAllUsers() {
        let tenantId = this.loginInfo.super_admin_id;
        const formData = new URLSearchParams();
        formData.set('tenantId', tenantId.toString())
        formData.set('search', this.inputText)
        this.UserService.newgetUsers(formData.toString()).subscribe((result) => {

            if (result.success) {

                this.admininfoList = result.data;
                this.userdetails = this.admininfoList.find((x) => x.tenant_id == this.loginInfo.Id);

                this.userdetails.isDisabledDelete = true;
                this.userdetails.isDisabledEdit = true;
                if (this.loginInfo.role == 'Super Admin') {
                    if (this.userdetails.role == 'Super Admin') {
                        this.userdetails.isDisabledDelete = true;
                    }
                }
                if (this.loginInfo.role == 'Manager') {
                    if (
                        this.userdetails.role == 'Admin' ||
                        this.userdetails.role == 'Super Admin' || this.userdetails.role == 'Manager'
                    ) {
                        this.userdetails.isDisabledDelete = true;
                        this.userdetails.isDisabledEdit = true;
                    }
                    if (this.userdetails.role == 'Approver' && this.userdetails.facilityID == this.loginInfo.facilityID) {

                        this.userdetails.isDisabledDelete = true;
                        this.userdetails.isDisabledEdit = true;
                    }
                    if (this.userdetails.role == 'Preparer' && this.userdetails.facilityID == this.loginInfo.facilityID) {

                        this.userdetails.isDisabledDelete = true;
                        this.userdetails.isDisabledEdit = true;
                    }
                }
                if (this.loginInfo.role == 'Admin') {
                    if (
                        this.userdetails.role == 'Admin' ||
                        this.userdetails.role == 'Super Admin'
                    ) {
                        this.userdetails.isDisabledDelete = true;
                        this.userdetails.isDisabledEdit = true;
                    }
                    if (this.userdetails.role == 'Approver' && this.userdetails.facilityID == this.loginInfo.facilityID) {

                        this.userdetails.isDisabledDelete = true;
                        this.userdetails.isDisabledEdit = true;
                    }
                    if (this.userdetails.role == 'Preparer' && this.userdetails.facilityID == this.loginInfo.facilityID) {

                        this.userdetails.isDisabledDelete = false;
                        this.userdetails.isDisabledEdit = false;
                    }
                    if (this.userdetails.role == 'Manager' && this.userdetails.facilityID == this.loginInfo.facilityID) {

                        this.userdetails.isDisabledDelete = false;
                        this.userdetails.isDisabledEdit = false;
                    }
                }
                this.unlock = this.userdetails.user_id;

            } else {
                this.notification.showWarning(
                    'Users not found',
                    ''
                );
                this.admininfoList = [];
            }
        });
    };


    // ----Get all Roles of user in dropdown method ---

    GetAllRoles() {
        this.UserService.newGetAllRoles().subscribe({
            next: (response: any) => {


                if (response.success == true) {
                    this.RolesList = response.categories;
                }
            },
            error: (err) => {
                this.notification.showError(
                    'Entries sent for approval Failed.',
                    'Error'
                );
                console.error('errrrrrr>>>>>>', err);
            }
        })
    };


    GetAllFacility() {
        let tenantId = this.loginInfo.tenantID;
        this.facilitydata = false;
        this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
            this.facilityList = response;
          
            const stringfyIDs = JSON.stringify([this.admininfo.facilityID.toString()]);
            this.payloadFacilityIds = stringfyIDs;
         
            if (this.facilityList.length === 0) {
                this.facilitydata = true;
            }
        })
    };
    GetGroups() {
        let tenantId = this.loginInfo.tenantID;
        this.facilitydata = false;
        const formData = new URLSearchParams();
        formData.set('tenantID', tenantId.toString())
        this.facilityService.getMainSubGroupByTenantId(tenantId).subscribe((response) => {
            this.facilityList = response.categories;
           
            if (this.facilityList.length === 0) {
                this.facilitydata = true;
            };
            const facilityIDs = this.facilityList.filter((item) => item.id == this.admininfo.group_id).map((item) => item.ID)[0];

            this.groupId = this.admininfo.group_id;
            const stringfyIDs = JSON.stringify(facilityIDs);
            this.payloadFacilityIds = stringfyIDs;
            if (this.selectedRole == 'a34d0ecf-4730-4521-82ee-5e3eg28bdfb0') {
                const filterMainGroup = this.facilityList.find(item => item.is_main_group == 1);
                this.groupId = filterMainGroup['id'];
                const stringfyIDs = JSON.stringify(filterMainGroup['ID']);
                this.payloadFacilityIds = stringfyIDs;
            }
        });
    };

    GetGroupsForAdmin() {
        let tenantId = this.loginInfo.tenantID;
        this.facilitydata = false;
        this.facilityService.getGroupsForAdmin(tenantId).subscribe((response) => {
            this.facilityList = response;
            const facilityID = this.facilityList.find((item) => item.id == this.admininfo.group_id && item.ID);
            
            this.groupId = this.admininfo.group_id;
            const stringfyIDs = JSON.stringify(facilityID);
            this.payloadFacilityIds = stringfyIDs;
            if (this.facilityList.length === 0) {
                this.facilitydata = true;
            }
        });
    };

    // ----Edit user Method ---
    EditUser(userdetails) {
        if (this.loginInfo.role == 'Auditor') {
            this.notification.showWarning('You are not Authorized', 'Warning');
            return
        }
        if (
            this.loginInfo.role === 'Super Admin' ||
            this.loginInfo.role === 'Manager' ||
            this.loginInfo.role === 'Admin'
        ) {
            this.FormEdit = true;
            this.showDialog();
        }

        this.admininfo = userdetails;


        this.onEditSelected(this.admininfo.role, this.admininfo.roleId);
    }

    // ----Delete user Method ---

    deleteUser(event: Event, userid) {
     
        if (this.loginInfo.role == 'Auditor') {
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const urlId = new URLSearchParams();
                urlId.set('user_id', userid)
                this.UserService.newdeleteUsers(urlId.toString()).subscribe((result: any) => {

                    if (result.success == true) {
                        this.GetAllUsers();
                        this.notification.showSuccess(
                            'User deleted successfully',
                            'Success'
                        );
                    } else {
                        this.notification.showError(
                            'Failed to delete',
                            ''
                        );
                    }
                });


            },
            reject: () => {
                this.GetAllUsers();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'User not Deleted'
                });
            }
        });
    }

    // ----Method for check UserName and Email is exist or not  ---
    CheckUserExist(username, Userkey) {
        this.UserService.CheckUserExist(username).subscribe((result) => {
            if (Userkey == 'username') {
                this.usernameIsExist = result;
            } else {
                this.emailIstExist = result;
            }
        });
    }

    //---method for get selected role for user model Radio button ---
    onEditSelected(value: string, roldId: any): void {

        const EditRole = value;
        this.selectedRole = roldId;

        this.admininfo.roleID = roldId;

        if (EditRole == 'Super Admin') {
            return

        } else if (EditRole == 'Admin') {
            if (this.loginInfo.role == 'Admin') {
                this.GetGroupsForAdmin()
            } else {
                this.GetGroups()
            }



        } else if (EditRole == 'Manager') {
            this.GetAllFacility()

        } else if (EditRole == 'Preparer') {
            this.GetAllFacility()

        } else {
            this.notification.showInfo('You are not Authorized', 'Warning');
        }


    };



    onSelected(value: string): void {
       

        this.selectedRole = value;
      
        if (this.loginInfo.role == 'Admin') {
            if (this.selectedRole == '525debfd-cd64-4936-ae57-346d57de3585') {
                this.GetGroupsForAdmin()
            } else {
                this.groupId = 0;
                this.GetAllFacility()
            }
        } else if (this.loginInfo.role == 'Super Admin') {
            if (this.selectedRole == '525debfd-cd64-4936-ae57-346d57de3585') {
               
                //  for admin role
                this.GetGroups()
            } else if (this.selectedRole == 'a34d0ecf-4730-4521-82ee-5e3eg28bdfb0') {
                this.GetGroups();
                // auditor role
            }
            else {
                this.groupId = 0;
                this.admininfo.group_id = 0;

                this.GetAllFacility()
            }
        }

        else {
            if (this.selectedRole == '525debfd-cd64-4936-ae57-346d57de3585') {
                this.GetGroups()
            } else {
                this.GetAllFacility()
            }

        }
console.log(this.admininfo)
    }

    // ---Method for open user dialog or model---
    showDialog() {
        document.body.style.position = 'fixed';
        document.body.style.overflow = 'hidden';
        if (
            this.loginInfo.role === 'Super Admin' ||
            this.loginInfo.role === 'Manager' ||
            this.loginInfo.role === 'Admin'
        ) {
            this.visible = true;
            // this.selectedRole = this.Roleaccess;
        } else {
            this.notification.showInfo(
                'You are not Authorized',
                ''
            );
        }

    }

    // ---Method for close user dialog or model---
    onCloseHandled() {
        this.visible = false;
        this.isloading = false;
        this.selectedRole = ''
        this.GetAllUsers();
    }

    // ---Method for get selected user details ---
    selectUser(user: UserInfo) {

        if (this.loginInfo.role == 'Manager') {
            if (user.role == 'Admin' || user.role == 'Super Admin' || user.role == 'Manager' || user.role == 'Auditor') {
                user.isDisabledDelete = true;
                user.isDisabledEdit = true;
                this.userdetails = user;
            }
            if (user.role == 'Approver' && user.facilityID != this.loginInfo.facilityID) {
                user.isDisabledDelete = true;
                user.isDisabledEdit = true;
            }
            if (user.role == 'Preparer' && user.facilityID != this.loginInfo.facilityID) {
                user.isDisabledDelete = false;
                user.isDisabledEdit = false;
                this.userdetails = user;
            }
            else {
                this.userdetails = user;
            }
        }
        if (this.loginInfo.role == 'Preparer') {
            if (user.role == 'Admin' || user.role == 'Super Admin' || user.role == 'Manager' || user.role == 'Auditor') {
                user.isDisabledDelete = true;
                user.isDisabledEdit = true;
                this.userdetails = user;
            }
            if (user.role == 'Approver' && user.facilityID != this.loginInfo.facilityID) {
                user.isDisabledDelete = true;
                user.isDisabledEdit = true;
            }
            if (user.role == 'Preparer' && user.facilityID != this.loginInfo.facilityID) {
                user.isDisabledDelete = true;
                user.isDisabledEdit = true;
                this.userdetails = user;
            }
            else {
                this.userdetails = user;
            }
        }
        // else {
        //     this.userdetails = user;
        // }
        if (this.loginInfo.role == 'Super Admin') {
            if (user.role == 'Super Admin') {
                user.isDisabledDelete = true;

                this.userdetails = user;
            } else {
                this.userdetails = user;
            }
        }
        if (this.loginInfo.role == 'Admin') {
            if (user.role == 'Super Admin') {
                user.isDisabledDelete = true;
                user.isDisabledEdit = true;

                this.userdetails = user;
            }
            if (user.role == 'Admin') {
                user.isDisabledDelete = true;
                this.userdetails = user;
            } else {
                this.userdetails = user;
            }
        }
    }
    UnlockComplete(userId) {
        this.unlock = userId;
    }
    removeCss() {
        document.body.style.position = '';
        document.body.style.overflow = '';
    }
    AddUser() {
        this.admininfo = new UserInfo();
        this.FormEdit = false;
        this.emailIstExist = false;
        this.usernameIsExist = false;
        this.resetForm();
    }

    //The hideloader function hides the loader element on the page.
    hideloader() {
        document.getElementById('loading').style.display = 'none';
    }
    //method for reset form
    resetForm() {
        this.UserForm.resetForm();
    }

    handleDropdownShow(): void {
        window.addEventListener('scroll', this.preventScroll, true);
    }

    handleDropdownHide(): void {
        window.removeEventListener('scroll', this.preventScroll, true);
    }

    preventScroll(event: Event): void {
        const dropdown = document.querySelector('.p-dropdown-panel');
        if (dropdown) {
            // console.log('Preventing scroll');
            event.stopPropagation();
        }
    };

    onSearch(value) {
        this.GetAllUsers()
    }
}
