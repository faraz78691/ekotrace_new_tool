import { Facility } from '@/models/Facility';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { Group } from '@/models/group';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
import { GroupService } from '@services/group.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '@services/user.service';

interface groupby {
    name: string;
};

@Component({
    selector: 'app-carbon-offsetting',
    templateUrl: './carbon-offsetting.component.html',
    styleUrls: ['./carbon-offsetting.component.scss']
})
export class CarbonOffsettingComponent {


    showDialog() {
        this.visible = true;
    };
    // GroupForm:FormGroup

    @ViewChild('GroupForm', { static: false }) GroupForm: NgForm;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    public loginInfo: LoginInfo;
    public admininfo: UserInfo;
    public userdetails: UserInfo;
    public groupdetails: any;
    public groupMappingDetails: GroupMapping;
    public admininfoList: UserInfo[] = [];
    facilityList: Facility[] = [];
    RolesList: RoleModel[] = [];
    public groupsList: Group[] = [];
    display = 'none';
    visible: boolean;
    selectedRole = '';
    Alert: boolean = false;
    RoleIcon: string = '';
    FormEdit: boolean = false;
    usernameIsExist: boolean = false;
    emailIstExist: boolean = false;
    Roleaccess = environment.adminRoleId;
    searchData: '';
    isloading: boolean = false;
    maxCharacters: number = 8;
    facilitydata: boolean = false;
    updatedtheme: string;
    groupdata: boolean;
    rootUrl: string;
    uploadedImageUrl: string;
    Groupby: groupby[];
    countryData: Location[] = [];
    stateData: Location[] = [];
    selectedValue: string;
    selectedCountry: any[] = [];
    scopeList: any[] = [];
    editBindedCountry: any[] = [];
    standardList: any[] = [];
    id: any;
    isgroupExist: boolean = false;
    selectedFaciltiy: any;
    selectedState: any;
    GroupByValue: string;
    project_type: string;
    countryUnique: string[];
    stateUnique: string[];
    unlock: string = '';
    ischecked = true;
    selectedRowIndex = 0;
    filledgroup: any;
    project_details = '';
    carbon_offset = '';
    selectedScope: any;
    carbon_credit_value: string;
    type: string;
    date3: any;
    vintage: any;
    standard: string;
    selectedFile: File
    project_name: string;
    scope_1:string;
    scope_2:string;
    scope_3:string;
    carbonID:string;
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
        this.groupdetails = new Array();
        this.groupMappingDetails = new GroupMapping();
        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';
        this.selectedValue = '';

        this.Groupby = [
            {
                name: 'Renewable Energy'
            },
            {
                name: 'Nature Based'
            },
            {
                name: 'Energy Efficiency'
            },
            {
                name: 'Community Project'
            },
            {
                name: 'Carbon Sequestration'
            },
            {
                name: 'Others'
            }
        ];
        this.standardList = [
            {
                name: 'Verra'
            },
            {
                name: 'Gold Standard (GS)'
            },
            {
                name: 'Clean Development Mechanism (CDM)'
            },
            {
                name: 'American Carbon Standard (ACR)'
            },
            {
                name: 'Climate Action Reserve (CAR)'
            },
            {
                name: 'Others'
            }
        ];


        this.scopeList = [
            {
                id: 1,
                name: 'Scope 1'
            },
            {
                id: 2,
                name: 'Scope 2'
            },
            {
                id: 3,
                name: 'Scope 3'
            }
        ];
    }
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            // this.facilityGet(this.loginInfo.tenantID);
        }
        this.getTenantsDetailById(Number(this.loginInfo.tenantID));
        // this.GetAllFacility();
        let tenantID = this.loginInfo.tenantID;
        let superAdminId = this.loginInfo.super_admin_id;
        this.getOffset(superAdminId);
        this.updatedtheme = this.themeservice.getValue('theme');
    }
    //checks upadated theme
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }

    getTenantsDetailById(id: number) { };


    getOffset(tenantID: any) {
        let formData = new URLSearchParams();

        formData.set('tenant_id', tenantID.toString());

        this.GroupService.getuser_offseting(formData.toString()).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.groupsList = response.categories;
                    if (this.groupsList.length > 0) {
                        this.groupdetails = this.groupsList[0];
                        this.groupdata = true;
                    } else {
                        this.groupdata = false;
                    }
                    localStorage.setItem('GroupCount', String(this.groupsList.length));
                    this.unlock = this.groupdetails.id.toString();
                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };

    //method to add new group
    saveOffset(data: NgForm) {
        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        if (parseInt(data.value.scope_1) + parseInt(data.value.scope_2) + parseInt(data.value.scope_3) != 100) {
            this.notification.showError(' Sum of scope allocation should be equal to 100%', 'Error');
            return
        }
        if (!data.valid) {
            return
        }

        const formData: FormData = new FormData();
        if (this.selectedFile) {
            formData.append('file', this.selectedFile, this.selectedFile.name);

        }
        formData.append('project_name', data.value.project_details);
        formData.append('type', data.value.project_type);
        formData.append('date_of_purchase', this.date3);
        formData.append('vintage', data.value.vintage);
        formData.append('standard', data.value.standard);
        formData.append('offset', data.value.carbon_offset);
        formData.append('carbon_credit_value', data.value.carbon_credit_value);
        formData.append('scope1', data.value.scope_1);
        formData.append('scope2', data.value.scope_2);
        formData.append('scope3', data.value.scope_3);
        formData.append('tenant_id', this.loginInfo.super_admin_id.toString());
        formData.append('comments', data.value.comments);


        this.GroupService.Adduser_offseting(formData).subscribe({
            next: (response) => {
                if (response.success == true) {
                    this.visible = false;
                    this.notification.showSuccess(
                        ' Offset Added successfully',
                        'Success'
                    );
                    this.getOffset(this.loginInfo.super_admin_id);
                }
                
                this.visible = false;
                if (localStorage.getItem('FacilityGroupCount') != null) {
                    let fgcount = localStorage.getItem('FacilityGroupCount');
                    let newcount = Number(fgcount) + 1;
                    localStorage.setItem(
                        'FacilityGroupCount',
                        String(newcount)
                    );
                }
            },
            error: (err) => {
                this.notification.showError('Group added failed.', 'Error');
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    };

    //method for update group detail by id
    updateGroup(id: any, data: any) {
        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        this.visible = true;
       
        if (parseInt(data.value.scope_1) + parseInt(data.value.scope_2) + parseInt(data.value.scope_3) != 100) {
            this.notification.showError(' Sum of scope allocation should be equal to 100%', 'Error');
            return
        }
        if (!data.valid) {
            return
        }

        const formData: FormData = new FormData();
        if (this.selectedFile) {
            formData.append('file', this.selectedFile, this.selectedFile.name);

        }
        formData.append('id', this.carbonID);
        formData.append('project_name', data.value.project_details);
        formData.append('project_type', data.value.project_type);
        formData.append('type', data.value.project_type);
        formData.append('date_of_purchase', this.date3.toString());
        formData.append('vintage', data.value.vintage);
        formData.append('standard', data.value.standard);
        formData.append('offset', data.value.carbon_offset);
        formData.append('carbon_credit_value', data.value.carbon_credit_value);
        formData.append('scope1', data.value.scope_1);
        formData.append('scope2', data.value.scope_2);
        formData.append('scope3', data.value.scope_3);
        formData.append('tenant_id', this.loginInfo.super_admin_id.toString());
        formData.append('comments', data.value.comments);


        this.GroupService.updateOffset(formData).subscribe({
            next: (response) => {
               
                //   this.getOffset(tenantID);

                this.visible = false;
                this.notification.showSuccess(
                    'Group Edited successfully',
                    'Success'
                );
            },
            error: (err) => {
                this.notification.showError('Group edited failed.', 'Error');
                console.error(err);
            },
            complete: () => console.info('Group edited')
        });
    };

    editButton(data: any) {
       this.carbonID = data.id;
        this.project_name = data.project_name;
        this.standard = data.standard;
        this.carbon_credit_value = data.carbon_credit_value;
        this.carbon_offset = data.offset;
        this.scope_1 = data.scope1;
        this.scope_2 = data.scope2;
        this.scope_3 = data.scope3;
        this.vintage = new Date(data.vintage)
        this.project_type = data.type;
        this.date3 = new Date(data.date_of_purchase)
        this.visible = true;
        this.FormEdit = true;


    }

    //retrieves all facilities for a given tenant

    //handles the closing of a dialog
    onCloseHandled() {
        this.visible = false;
        this.isloading = false;
        let tenantID = this.loginInfo.super_admin_id;
        this.getOffset(tenantID);
    }
    //display a dialog for editing a group
    showEditGroupDialog(groupdetails) {
        this.visible = true;
        this.FormEdit = true;

        this.filledgroup = groupdetails as GroupMapping;

        if (this.filledgroup.groupBy === 'Country') {
            this.selectedCountry = [];
            this.filledgroup.groupMappings.forEach((element) => {
                this.selectedCountry.push(element.countryId);
            });
        } else if (this.filledgroup.groupBy === 'State') {
            this.selectedState = [];
            this.filledgroup.groupMappings.forEach((element) => {
                this.selectedState.push(element.stateId);
            });
        } else if (this.filledgroup.groupBy === 'Facility') {
            this.selectedFaciltiy = [];
            this.filledgroup.groupMappings.forEach((element) => {
                this.selectedFaciltiy.push(element.facilityId);
            });
        }
    }
    //display a dialog for add a group.
    showAddGroupDialog() {
        this.visible = true;
        this.groupdetails = new Group();
        this.FormEdit = false;
        this.resetForm();
    }
    //sets the selected group details
    selectGroup(group: Group, index: number) {
        this.selectedRowIndex = index;
        this.groupdetails = group;
        
    }
    //The removeCss function is used to remove CSS styles applied to the body element
    removeCss() {
        document.body.style.position = '';
        document.body.style.overflow = '';
    }

    //method for reset form
    resetForm() {
          this.GroupForm.reset();
    }
    //sets the value of the unlock variable to the provided groupId
    UnlockComplete(groupId) {
        this.unlock = groupId;
    }
    //method is used to check the existence of a group by its ID
    CheckGroupExist(id) {
        this.GroupService.CheckGroupExist(id).subscribe((result) => {
            this.isgroupExist = result;
        });
    }
    // checks if a country is selected based on its countryId.
    isCountrySelected(countryId: any): boolean {
        return this.selectedCountry.includes(countryId);
    }
    //method for delete a group by id
    deleteGroup(event: Event, id) {
        let tenantID = this.loginInfo.tenantID;
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let formData = new URLSearchParams();
                formData.set('groupId', id);

                this.GroupService.newdeleteGroups(formData.toString()).subscribe((result) => {
                    if (localStorage.getItem('FacilityGroupCount') != null) {
                        let fgcount =
                            localStorage.getItem('FacilityGroupCount');
                        let newcount = Number(fgcount) - 1;
                        localStorage.setItem(
                            'FacilityGroupCount',
                            String(newcount)
                        );
                    }
                    this.getOffset(tenantID);
                });

                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'Group Deleted Succesfully'
                });
            },
            reject: () => {
                this.getOffset(tenantID);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Group not Deleted'
                });
            }
        });
    };
    
}
