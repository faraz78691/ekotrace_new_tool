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
import {UserService} from '@services/user.service';
import {GroupService} from '@services/group.service';
// import { UserInfo } from 'os';
import { ConfirmationService, MessageService } from 'primeng/api';

interface groupby {
  name: string;
}

@Component({
  selector: 'app-new-billing',
  templateUrl: './new-billing.component.html',
  styleUrls: ['./new-billing.component.scss']
})
export class NewBillingComponent {
  @ViewChild('GroupForm', {static: false}) GroupForm: NgForm;
  public companyDetails: CompanyDetails;
  companyData: CompanyDetails = new CompanyDetails();
  public loginInfo: LoginInfo;
  public admininfo: UserInfo;
  public userdetails: UserInfo;
  public groupdetails: any;
  public packagedetails: any;
  public groupMappingDetails: GroupMapping;
  public admininfoList: UserInfo[] = [];
  facilityList: Facility[] = [];
  RolesList: RoleModel[] = [];
  public groupsList: Group[] = [];
  public packageList: any[] = [];
  public usersList: any[] = [];
  
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
  id: any;
  selectedUsers: any[]=[];
  selectedFacility: any;
  isgroupExist: boolean = false;
  selectedFaciltiy: any;
  selectedState: any;
  packageID: any;
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
              name: 'Country'
          },
          {
              name: 'State'
          },
          {
              name: 'Facility'
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
      this.GetAllFacility();
      this.GetAllPackages();
      let tenantID = this.loginInfo.tenantID;
   
     
   
        //
      this.updatedtheme = this.themeservice.getValue('theme');
  }
  //checks upadated theme
  ngDoCheck() {
      this.updatedtheme = this.themeservice.getValue('theme');
  }

  getTenantsDetailById(id: number) {}

  //method to get list of All groups
  // async GetAllGroups(tenantID:any) {
  //     try {
  //         const response = await this.GroupService.newGetGroups(
  //             tenantID
  //         ).toPromise();
  //         this.groupsList = response;
  //         if (this.groupsList.length > 0) {
  //             this.groupdetails = this.groupsList[0];
  //             this.groupdata = true;
  //         } else {
  //             this.groupdata = false;
  //         }
  //     } catch (error) {
  //         // Handle any errors that occurred during the request
  //         console.error('Error fetching groups:', error);
  //     }
  //     localStorage.setItem('GroupCount', String(this.groupsList.length));
  //     this.unlock = this.groupdetails.id.toString();
  // }
 

  //method to add new group
  saveGroup(data: NgForm) {

     const billingForm = new URLSearchParams();
     billingForm.set('package_id', this.packageID)
     billingForm.set('facility_id', [this.selectedFacility].toString())
      

      this.UserService.newSavepackages(billingForm.toString()).subscribe({
          next: (response) => {
          
              if(response.success == true)
              {
                  this.visible = false;
                  this.notification.showSuccess(
                      'Package Assigned successfully',
                      'Success'
                  );
                
                  this.GetAllPackages();
              }
              this.GetAllPackages()
            
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
  
  //method for update group detail by id
  updateGroup(id: any, data: NgForm) {
   
      let tenantID = this.loginInfo.tenantID;
      const billingForm = new URLSearchParams();
      billingForm.set('package_id', this.packageID)
      billingForm.set('facility_id', [this.selectedFacility].toString())
      // formData.set('tenantID',  this.groupdetails.tenantID.toString());
   
      this.UserService.newSavepackages(billingForm.toString()).subscribe({
          next: (response) => {
              
            //   this.newGetAllGroups(tenantID);

              this.visible = false;
              this.notification.showSuccess(
                  'Package Assigned successfully',
                  'Success'
              );
              this.GetAllPackages()
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
      this.facilityService.nFacilityDataGet(tenantId).subscribe((response:any) => {

          this.facilityList = response.categories;
          if (this.facilityList.length === 0) {
              this.facilitydata = true;
          }
      });
  };

  GetAllPackages() {
      let tenantId = this.loginInfo.tenantID;
      this.facilitydata = false;
      this.UserService.getAdminPackageDetails().subscribe((response:any) => {
          this.packageList = response.categories;
          this.groupdata = true;
           this.groupdetails = this.packageList[0]
     
          if (this.packageList.length === 0) {
              this.facilitydata = true;
          }
      });
  };

  GetAllUsersPack() {
      let tenantId = this.loginInfo.tenantID;
      const formdata = new URLSearchParams();
      formdata.set('tenantId',tenantId.toString());
      this.facilitydata = false;
      this.UserService.getBillingUsers(formdata.toString()).subscribe((response:any) => {
          this.usersList = response;
         
      });
  };
  //handles the closing of a dialog
  onCloseHandled() {
      this.visible = false;
      this.isloading = false;
      let tenantID = this.loginInfo.tenantID;
    //   this.newGetAllGroups(tenantID);
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
      this.GetAllFacility();
      this.resetForm();
  }
  //sets the selected group details
  selectGroup(group: any,index: number) {
   
   const IDS = group.packageusers.map(items => items.ID);
  
   this.selectedFacility = IDS;
      this.selectedRowIndex = index;
      this.packageID = group.id;
    
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
                //   this.newGetAllGroups(tenantID);
              });

              this.messageService.add({
                  severity: 'success',
                  summary: 'Confirmed',
                  detail: 'Group Deleted Succesfully'
              });
          },
          reject: () => {
            //   this.newGetAllGroups(tenantID);
              this.messageService.add({
                  severity: 'error',
                  summary: 'Rejected',
                  detail: 'Group not Deleted'
              });
          }
      });
  };
  //method for get facility by id
  // facilityGet(tenantId) {
  //     this.facilityService.FacilityDataGet(tenantId).subscribe((response) => {
  //         this.facilityList = response;
  //         // console.log(
  //             '🚀 ~ file: group.component.ts:370 ~ GroupComponent ~ this.facilityService.FacilityDataGet ~ this.facilityList:',
  //             this.facilityList
  //         );
  //         const uniqueCountries = new Set(
  //             this.facilityList.map((item) => item.countryName)
  //         );
  //         this.countryData = Array.from(uniqueCountries).map((country) => {
  //             return {
  //                 name: country,
  //                 shortName: '', // Provide the appropriate value for shortName
  //                 id: this.facilityList.find(
  //                     (item) => item.countryName === country
  //                 ).countryID
  //             };
  //         });

  //         const uniqueStates = new Set(
  //             this.facilityList.map((item) => item.stateName)
  //         );
  //         this.stateData = Array.from(uniqueStates).map((state) => {
  //             return {
  //                 name: state,
  //                 shortName: '', // Provide the appropriate value for shortName
  //                 id: this.facilityList.find(
  //                     (item) => item.stateName === state
  //                 ).stateID
  //             };
  //         });
  //     });
  // }
}
