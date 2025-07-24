import { Facility } from '@/models/Facility';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
import { UserService } from '@services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GroupService } from '@services/group.service';
@Component({
  selector: 'app-cost-centre',
  templateUrl: './cost-centre.component.html',
  styleUrls: ['./cost-centre.component.scss']
})
export class CostCentreComponent {

@ViewChild('GroupForm', { static: false }) GroupForm: NgForm;
public companyDetails: CompanyDetails;
companyData: CompanyDetails = new CompanyDetails();
public loginInfo: LoginInfo;
public admininfo: UserInfo;
public userdetails: UserInfo;
public groupdetails: any;
display = 'none';
visible: boolean;
visible2: boolean;
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
superAdminId: any;
stateData: Location[] = [];
selectedValue: string;
selectedCountry: any[] = [];
scopeList: any[] = [];
emission_activity: any[] = [];
editBindedCountry: any[] = [];
CostList: any[] = [];
selectedRowIndex = 0;
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
  this.loginInfo = new LoginInfo();
  this.companyDetails = new CompanyDetails();
  this.rootUrl = environment.baseUrl + 'uploads/';
  this.selectedValue = '';
};

ngOnInit() {
  if (localStorage.getItem('LoginInfo') != null) {
    let userInfo = localStorage.getItem('LoginInfo');
    let jsonObj = JSON.parse(userInfo); // string to "any" object first
    this.loginInfo = jsonObj as LoginInfo;
    // this.facilityGet(this.loginInfo.tenantID);
  }
  // this.getTenantsDetailById(Number(this.loginInfo.tenantID));
  // this.GetAllFacility();
  let tenantID = this.loginInfo.tenantID;
  this.superAdminId = this.loginInfo.super_admin_id;
  this.GetCostCetnre();
  this.updatedtheme = this.themeservice.getValue('theme');
}


GetCostCetnre() {
  //   let formData = new URLSearchParams();

  //   formData.set('tenant_id', tenantID.toString());

  this.GroupService.getCostCentre(this.superAdminId).subscribe({
    next: (response) => {

      if (response.success == true) {
        this.CostList = response.categories;
        if (this.CostList.length > 0) {
          this.groupdetails = this.CostList[0];
          this.groupdata = true;
        } else {
          this.groupdata = false;
        }

      }
    },
    error: (err) => {
      console.error('errrrrrr>>>>>>', err);
    },
    complete: () => console.info('Group Added')
  });
};

  //method to add new group
  saveCostCentre(data: NgForm) {


    console.log(data.value);

    if(this.loginInfo.role == 'Auditor'){
      this.notification.showInfo('You are not Authorized', '');
      return
  }
    const formData = new URLSearchParams();

    formData.append('cost_center_name', data.value.cost_center_name);
    formData.append('cost_center_refer_id', data.value.cost_center_refer_id);
    formData.append('tenant_id', this.superAdminId);

    this.GroupService.AddCostcenter(formData.toString()).subscribe({
      next: (response) => {
        if (response.success == true) {
          this.visible2 = false;
          this.notification.showSuccess(
            ' Cost Centre Added successfully',
            'Success'
          );
          this.GetCostCetnre();
        
        }
        // return
        //   this.getOffset(this.loginInfo.tenantID);
        this.visible2 = false;

      },
      error: (err) => {
        this.notification.showError('Group added failed.', 'Error');
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Group Added')
    });
  };

  showAddGroupDialog(id: any) {
    if (id == 2) {
      this.visible = false;
      this.visible2 = true;
      // this.groupdetails = new Group();
      this.FormEdit = false;
      this.resetForm();
    } else {
      this.visible2 = false;
      this.visible = true;
      // this.groupdetails = new Group();
      this.FormEdit = false;
      this.resetForm();
    }
  }

  resetForm() {
    this.GroupForm.resetForm();
  };


  selectGroup(group: any, index: number) {
    this.selectedRowIndex = index;
    this.groupdetails = group;

  }

  UnlockComplete(groupId) {
    // this.unlock = groupId;
  }
  updateGroup(data: any) {
    if(this.loginInfo.role == 'Auditor'){
      this.notification.showInfo('You are not Authorized', '');
      return
  }
    let tenantID = this.loginInfo.tenantID;
    let formData = new URLSearchParams();
    formData.set('address', data.address);
    formData.set('name', data.name);
    // formData.set('id', this.vendorId.toString());
    formData.set('refer_id', data.refer_id);
    this.GroupService.updateVendor(formData.toString()).subscribe({
      next: (response) => {

        // this.GetVendors();
        this.FormEdit = false;
        this.visible = false;
        this.notification.showSuccess(
          'Edited successfully',
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

  onCloseHandled() {
    this.visible = false;
    this.isloading = false;
    let tenantID = this.loginInfo.tenantID;

  }
 
}
