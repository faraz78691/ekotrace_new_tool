import {UserInfo} from '@/models/UserInfo';
import {LoginInfo} from '@/models/loginInfo';
import {Component, ViewChild} from '@angular/core';
import {UserService} from '@services/user.service';
import {NotificationService} from '@services/notification.service';
import {userInfo} from 'os';
import {Facility} from '@/models/Facility';
import {FacilityService} from '@services/facility.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {environment} from 'environments/environment';
import {RoleModel} from '@/models/Roles';
import {ThemeService} from '@services/theme.service';
import {CompanyDetails} from '@/shared/company-details';
import {CompanyService} from '@services/company.service';
import {Group} from '@/models/group';
import {GroupService} from '@services/group.service';
import {Location} from '@/models/Location';
import {GroupMapping} from '@/models/group-mapping';
import {Country} from '@pages/admin-dashboard/customer';
import { Observable, catchError, observable, of, tap, throwError } from 'rxjs';
interface groupby {
    name: string;
}

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent {
     source$ = of(1, 2, 3);
    @ViewChild('GroupForm', {static: false}) GroupForm: NgForm;
    groupList$ = new Observable();
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
    editBindedCountry: any[] = [];
    subGroupsList: any[] = [];
    id: any;
    isgroupExist: boolean = false;
    selectedFaciltiy: any;
    selectedSubGroup: any;
    selectedState: any;
    GroupByValue: string;
    countryUnique: string[];
    stateUnique: string[];
    unlock: string = '';
    ischecked = true;
    selectedRowIndex = 0;  
    filledgroup: any;
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

        this.source$
  .pipe(
    tap(value =>  console.log(`1: ${value}`))
  )
  .subscribe(value =>  console.log(`Final value: ${value}`));
        this.admininfo = new UserInfo();
        this.userdetails = new UserInfo();
        this.groupdetails = new Group();
        this.groupMappingDetails = new GroupMapping();
        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';
        this.selectedValue = '';
        
        this.Groupby = [
            {
                name: 'Facility'
            },
            {
                name: 'Sub Group'
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
        // this.getTenantsDetailById(Number(this.loginInfo.tenantID));
     
        let tenantID = this.loginInfo.tenantID;
        if(this.loginInfo.role =='Super Admin' || this.loginInfo.role =='Admin' || this.loginInfo.role =='Auditor'){
            this.newGetAllGroups(tenantID);
            this.GetAllFacility();
            this.GetAllSubGroups();
        }else{
      
        }
      
        this.updatedtheme = this.themeservice.getValue('theme');

        // this.groupList$ = this.GroupService.newGetGroups(tenantID).pipe()
    }
    //checks upadated theme
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }

     newGetAllGroups(tenantID:any) {

        let formData = new URLSearchParams();

        formData.set('tenantID', tenantID.toString());

        this.groupList$ = this.GroupService.newGetGroups(formData.toString()).pipe(
            tap(response => {
                if(response.success){
                    this.groupsList = response.categories;
                    this.groupdetails = this.groupsList[0];
                    this.groupdata = true;
                }
              
            }),
            catchError((error: any) => {
                // Log the error
                console.error('An error occurred:', error);
        
                // Rethrow the error or return a new observable with a default value
                return throwError('Something went wrong. Please try again later.');
                // Alternatively, you can return an observable with a default value
                // return of([]);
            })
        );
    
        // this.GroupService.newGetGroups(formData.toString()).subscribe({
        //     next: (response) => {
        //         // console.log(response);
        //         if(response.success == true)
        //         {
        //             this.groupsList = response.categories;
        //             if (this.groupsList.length > 0) {
        //                 this.groupdetails = this.groupsList[0];
        //                 this.groupdata = true;
        //             } else {
        //                 this.groupdata = false;
        //             }
        //             localStorage.setItem('GroupCount', String(this.groupsList.length));
        //             this.unlock = this.groupdetails.id.toString();
        //         }
              
        //     },
        //     error: (err) => {
        //         console.error('errrrrrr>>>>>>', err);
        //     },
        //     complete: () => console.info('Group Added')
        // });
    }

    //method to add new group
    saveGroup(data: NgForm) {
       
        if(this.loginInfo.role == 'Super Admin'){
            this.groupdetails.groupMappings = [];
            if (this.groupdetails.groupBy === 'Country') {
                this.selectedCountry.forEach((val) => {
                    this.groupMappingDetails = new GroupMapping();
                    this.groupMappingDetails.stateId = 0;
                    this.groupMappingDetails.groupId = 0;
                    this.groupMappingDetails.facilityId = 0;
                    this.groupMappingDetails.countryId = val;
                    this.groupdetails.groupMappings.push(this.groupMappingDetails);
                });
            } else if (this.groupdetails.groupBy === 'State') {
                this.selectedState.forEach((val) => {
                    this.groupMappingDetails = new GroupMapping();
                    this.groupMappingDetails.stateId = val;
                    this.groupMappingDetails.countryId = 0;
                    this.groupMappingDetails.groupId = 0;
                    this.groupMappingDetails.facilityId = 0;
                    this.groupdetails.groupMappings.push(this.groupMappingDetails);
                });
            } else {
                this.selectedFaciltiy.forEach((val) => {
                    this.groupMappingDetails = new GroupMapping();
                    this.groupMappingDetails.stateId = 0;
                    this.groupMappingDetails.countryId = 0;
                    this.groupMappingDetails.groupId = 0;
                    this.groupMappingDetails.facilityId = val;
                    this.groupdetails.groupMappings.push(this.groupMappingDetails);
                });
    
            this.groupdetails.tenantID = this.loginInfo.tenantID;
            let formData = new URLSearchParams();
            formData.set('groupname',this.groupdetails.groupname);
            formData.set('tenantID',  this.groupdetails.tenantID.toString());
            formData.set('facility',this.selectedFaciltiy);
            if(this.groupdetails.groupBy === 'Facility'){
                formData.set('group_by', '1');
            }else if (this.groupdetails.groupBy === 'Sub Group'){
                formData.set('group_by', '2');
            }
         
            this.GroupService.newSaveGroups(formData.toString()).subscribe({
                next: (response) => {
                  
                    if(response.success == true)
                    {
                        this.visible = false;
                        this.notification.showSuccess(
                            'Group Added successfully',
                            'Success'
                        );
                        this.newGetAllGroups(this.groupdetails.tenantID);
                    }
                    return
                    this.newGetAllGroups(this.groupdetails.tenantID);
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
        }

        }else{
         
                this.notification.showWarning('You are not allowed to create Groups', '');
                return
            

        }
       
    }
    //method for update group detail by id
    updateGroup(id: any, data: NgForm) {
        
        let tenantID = this.loginInfo.tenantID;
        let formData = new URLSearchParams();
        formData.set('groupId',id);
        formData.set('groupname',this.groupdetails.groupname);
        // formData.set('tenantID',  this.groupdetails.tenantID.toString());
        formData.set('facility',this.selectedFaciltiy);
        this.GroupService.newEditGroup(formData.toString()).subscribe({
            next: (response) => {
               
                this.newGetAllGroups(tenantID);

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
    GetAllFacility() {
        let tenantId = this.loginInfo.tenantID;
        this.facilitydata = false;
        this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
            this.facilityList = response;
            if (this.facilityList.length === 0) {
                this.facilitydata = true;
            }
        });
    }
    GetAllSubGroups() {
        let tenantId = this.loginInfo.tenantID;
        const formData = new URLSearchParams();
        formData.set('tenantID', tenantId.toString())
     
        this.facilityService.getActualSubGroups(formData).subscribe((response) => {
            this.subGroupsList = response.categories;
        });
    }
    //handles the closing of a dialog
    onCloseHandled() {
        this.visible = false;
        this.isloading = false;
        let tenantID = this.loginInfo.tenantID;
        this.newGetAllGroups(tenantID);
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
    selectGroup(group: Group,index: number) {
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
        let tenantID = this.loginInfo.tenantID;
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let formData = new URLSearchParams();
                formData.set('groupId',id);
               
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
                    this.newGetAllGroups(tenantID);
                });

                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'Group Deleted Succesfully'
                });
            },
            reject: () => {
                this.newGetAllGroups(tenantID);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Group not Deleted'
                });
            }
        });
    };
    
}
