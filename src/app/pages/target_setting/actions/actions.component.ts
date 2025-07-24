import { Facility } from '@/models/Facility';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { Actions, Group } from '@/models/group';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, computed, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
    isHowtoUse = false;
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
    public groupsList: Actions[] = [];
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
    emission_activity: any[] = [];
    status: any[] = [];
    plannedActions: any[] = [];
    progressActions: any[] = [];
    archiveActions: any[] = [];
    editBindedCountry: any[] = [];
    target_type: any[] = [];
    targetKPI: any[] = [];
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
    date3: string;
    standard: string;
    selectedFile: File;
    name: string;
    owner_name: string;
    time_period: string;
    co2_savings: string;
    scope_category: string;
    status_action: string;
    actionId: string;
    superAdminTenentID: any
    targetAllowed = computed(() => this.facilityService.targetAllowed());
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
        this.status = [
            {
                e_act: 'Planned'
            },
            {
                e_act: 'Progress'
            },
            {
                e_act: 'Achieved'
            }
        ];
        this.target_type = [
            {
                e_act: 'Economic Intensity Convergence'
            },
            {
                e_act: 'Physical Intensity Convergence'
            },
            {
                e_act: 'Economic Intensity Convergence'
            }
        ];
        this.targetKPI = [
            {
                e_act: 'Supplier Engagement'
            },
            {
                e_act: 'Renewable energy'
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
        //   this.getTenantsDetailById(Number(this.loginInfo.tenantID));
        // this.GetAllFacility();
        let tenantID = this.loginInfo.tenantID;
        this.superAdminTenentID = this.loginInfo.super_admin_id;
        this.GetTarget();
        this.updatedtheme = this.themeservice.getValue('theme');
    }
    //checks upadated theme
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }




    GetTarget() {
        //   let formData = new URLSearchParams();

        //   formData.set('tenant_id', tenantID.toString());

        this.GroupService.getActions(this.superAdminTenentID).subscribe({
            next: (response: any) => {

                if (response.success == true) {
                    this.groupsList = response.orders;
                    this.plannedActions = this.groupsList.filter((items) => items.status == 'Planned');
                    this.progressActions = this.groupsList.filter((items) => items.status == 'Progress');
                  
                    this.archiveActions = this.groupsList.filter((items) => items.status == 'Achieved');
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
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authorised to submit form', '')
            return
        }
        const formData = new URLSearchParams();

        formData.append('name', data.value.name);
        formData.append('scope_category', data.value.scope_category);
        formData.append('co2_savings_tcoe', data.value.co2_savings_tcoe);
        formData.append('time_period', data.value.time_period);
        formData.append('owner', data.value.owner);
        formData.append('status', data.value.status);
        formData.append('tenantId',this.superAdminTenentID);


        this.GroupService.addTargetActions(formData).subscribe({
            next: (response) => {
                if (response.success == true) {
                    this.visible = false;
                    this.notification.showSuccess(
                        ' Offset Added successfully',
                        'Success'
                    );
                    this.GetTarget();
                    this.GroupForm.reset();
                }
                // return
                //   this.getOffset(this.loginInfo.tenantID);
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

    current_status_action: any;

    onEditAction(data) {
        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authrised to submit form', '')
            return
        }
        this.FormEdit = true;
        this.actionId = data.id;
        //this.current_status_action = data.status;
        this.status_action = data.status;
        this.owner_name = data.owner;
        this.scope_category = data.scope_category
        this.co2_savings = data.co2_savings_tcoe
        this.name = data.name;
        this.time_period = data.time_period;
    }

    onStatusChange(id: number, status: string) {
        const payload = {
          id: id,
          status: status
        };
    
        this.GroupService.updateActions(payload).subscribe(
          response => {
          
            this.GetTarget();
          },
          error => {
            console.error('Error updating status', error);
          }
        );
      }

    //method for update group detail by id
    updateGroup(id: any, data: NgForm) {
        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authrised to submit form', '')
            return
        }
        const formData = new URLSearchParams();

        formData.append('id', this.actionId);
        formData.append('name', data.value.name);
        formData.append('name', data.value.name);
        formData.append('scope_category', data.value.scope_category);
        formData.append('co2_savings_tcoe', data.value.co2_savings_tcoe);
        formData.append('time_period', data.value.time_period);
        formData.append('owner', data.value.owner);
        formData.append('status', data.value.status);
        this.GroupService.updateAction(formData.toString()).subscribe({
            next: (response) => {
               
                this.GetTarget();

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
    }

    //retrieves all facilities for a given tenant

    //handles the closing of a dialog
    onCloseHandled() {
        this.visible = false;
        this.isloading = false;
        let tenantID = this.loginInfo.tenantID;

        this.GetTarget();
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
        this.GroupForm.resetForm();
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
        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authrised to submit form', '')
            return
        }
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

                    this.GetTarget();
                });

                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'Group Deleted Succesfully'
                });
            },
            reject: () => {

                this.GetTarget();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Group not Deleted'
                });
            }
        });
    };

}
