import { Facility } from '@/models/Facility';
import { GroupMapping } from '@/models/group-mapping';
import { KpiInventoryResponse } from '@/models/kpiInventory';
import { LoginInfo } from '@/models/loginInfo';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent {
 
  // @ViewChild("chart") chart: ChartComponent;
  isHowtoUse =false;
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
  superAdminId: any;
  vendorId: any;
  carbon_credit_value: string;
  type: string;
  date3: string;
  standard: string;
  selectedFile: File;
  attachmentsData: any;
  facilityData: any[] = [];
  facilities: any;

  categories =
  [
      {
          "label": "Stationary Combustion", 
          "value": "stationaryCombustionde"
      },
      {
          "label": "Refrigerants",     
          "value": "refrigerants"
      },
      {
          "label": "Fire Extinguishers",
          "value": "fireExtinguisher"
      },
      {
          "label": "Company Owned Vehicles",
          "value": "companyOwnedVehichle"
      },
      {
          "label": "Electricity",
          "value": "electricity"
      },
      {
          "label": "Heat and Steam",
          "value": "heatAndSteam"
      },
      {
          "label": "Purchased Goods and Services",
          "value": "purchasedGoodsAndServices"
      },
      {
          "label": "Business Travel",
          "value": "bussinessTravel"
      },
     
  ];
  selectedCategory = this.categories.map(category => category.value)
  
  public loginInfo: LoginInfo;
  selectedFacility: any;
  facilityUnit: any;
  constructor(
    private companyService: CompanyService,
    private notification: NotificationService,
    private facilityService: FacilityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private themeservice: ThemeService,
    private appService: AppService,
    private spinner: NgxSpinnerService
  
  ) {




  }
  ngOnInit() {



    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;

    }
    let tenantID = this.loginInfo.tenantID;
    this.superAdminId = this.loginInfo.super_admin_id;
    this.GetFacilityList(tenantID);

 

  }




  getFacilityUnit(facilityId: any) {
    const formData = new URLSearchParams();
    formData.append('facilities', facilityId);
    this.appService.postAPI(`/getcurrencyByfacilities`, formData).subscribe((res: any) => {
      this.facilityUnit = res.categories

    });
  };

  onFacilitySelect(facilityId: any) {
  
    this.appService.getApi(`/getAttahcmentsbyFacilityID?facilityId=${facilityId}`).subscribe((res: any) => {
    this.attachmentsData = res.data;
    
    });
  };
  onCategorySelect(category: any) {
  
   
  };



  



  GetFacilityList(tenantID: any) {
    this.facilityService
      .newGetFacilityByTenant(tenantID)
      .subscribe((res) => {
        if (res.length > 0) {

          this.facilityData = res;
          this.selectedFacility = this.facilityData[0].id;
          this.onFacilitySelect(this.selectedFacility);


        }
      });
  };

}














