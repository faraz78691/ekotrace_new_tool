import { Group } from '@/models/group';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { UserInfo } from '@/models/UserInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';

import { environment } from 'environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-data-progress',
  templateUrl: './data-progress.component.html',
  styleUrls: ['./data-progress.component.scss']
})
export class DataProgressComponent {
  // @ViewChild("chart") chart: ChartComponent;

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
  dataProgress: any[] = [];
  facilityData: any[] = [];
  savedData: any[] = [];
  selectedScope1: any[] = [];
  selectedScope2: any[] = [];
  selectedScope3: any[] = [];
  facilities: any;
  merrgeProgress: any[] = [];
  dataPreparerCustom: any;
  dataPreparer: any;
  defaultScope = false
  scope3OrderCategories= [
    {index:0,name:'Purchased goods and services'},
    {index:1,name:'Fuel and Energy-related Activities'},
    {index:2,name:'Upstream Transportation and Distribution'},
    {index:3,name:'Water Supply and Treatment'},
    {index:4,name:'Waste generated in operations'},
    {index:5,name:'Business Travel'},
    {index:6,name:'Employee Commuting'},
    {index:7,name:'Home Office'},
    {index:8,name:'Upstream Leased Assets'},
    {index:9,name:'Downstream Transportation and Distribution'},
    {index:10,name:'Processing of Sold Products'},
    {index:11,name:'Use of Sold Products'},
    {index:12,name:'End-of-Life Treatment of Sold Products'},
    {index:13,name:'Downstream Leased Assets'},
    {index:14,name:'Franchises'}
    
        ]


  transformedData: any[] = [];

  public loginInfo: LoginInfo;
  constructor(
    private companyService: CompanyService,
    private notification: NotificationService,
    private facilityService: FacilityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private themeservice: ThemeService
  ) {




  }
  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
      // this.facilityGet(this.loginInfo.tenantID);
    }
    this.getTenantsDetailById(Number(this.loginInfo.tenantID));
    let tenantID = this.loginInfo.tenantID;
    this.superAdminId = this.loginInfo.super_admin_id;
    this.GetFacilityList(tenantID);


  }
  //checks upadated theme


  getTenantsDetailById(id: number) { };


  getDataProgress() {
    let formData = new URLSearchParams();

    formData.set('facilities', this.facilities.toString());

    this.facilityService.getDataProgress(formData).subscribe({
      next: (response) => {

        if (response.success == true) {
          this.dataProgress = response.FinalProgress;
          
          this.transformedData = this.mergeData(
            this.transformData(this.dataProgress),
            this.facilityData
          );
        
        
          this.onFacilityClick(this.transformedData[0].facilityId, 0, this.transformedData[0].facilityName);
      
        }
      },
      error: (err) => {
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Group Added')
    });
  };

  transformData(data: any[]) {
    return data.map((facility, index) => {
      const fetchIds = Object.keys(facility)

      const facilityId = fetchIds[0];
      // Assuming IDs are sequential
      const facilityKey = `${facilityId}`;
      const facilityScopes = facility[facilityKey].reduce((scopes: any, item: any) => {
        const scopeKey = item.scope;
        if (!scopes[scopeKey]) {
          scopes[scopeKey] = [];
        }
        scopes[scopeKey].push(item);
        return scopes;
      }, {});

      return {
        facilityId: facilityId,
        [facilityKey]: facilityScopes,
        scope1: facility.scope1,
        scope2: facility.scope2,
        scope3: facility.scope3,
        sum: facility.scope3Sum,
        count: facility.scope3Count
      };
    });
  }
  // transformData(data: any[]) {
  //   const tableData = [];

  //   data.forEach((facility, facilityIndex) => {
  //     const facilityId = Object.keys(facility).find((key) => !key.startsWith('scope')) || '';
  //     const facilityEntries = facility[facilityId] || [];
  //     const { scope1, scope2, scope3 } = facility;

  //     facilityEntries.forEach((entry: any) => {
  //       tableData.push({
  //         Facility: `Facility ${facilityId}`,
  //         Category: entry.category,
  //         Scope: entry.scope,
  //         Percentage: entry.percentage,
  //         Data: entry.data,
  //         Scope1: scope1,
  //         Scope2: scope2,
  //         Scope3: scope3,
  //       });
  //     });
  //   });

  //   return tableData;
  // }



  mergeData(facilityData: any[], assetTypeData: any[]) {

    return facilityData.map((facility) => {
      const asset = assetTypeData.find((a) => a.id == facility.facilityId);
      return {
        ...facility,
        facilityName: asset ? asset.AssestType : `Facility ${facility.facilityId}`,
        assetName: asset ? asset.name : null
      };
    });
  };


  onFacilityClick(id: any, index: any, fName: any) {
    this.dataPreparerCustom = [];
    let scope3Array = [];
    this.selectedFaciltiy = fName;
    this.selectedRowIndex = index;

    const filtered = this.transformedData.filter(items =>
      Object.keys(items)[0] == id
    );
   console.log(filtered);


    this.dataPreparerCustom = [filtered[0][id]];
    console.log(this.dataPreparerCustom);

    const filterStationary = this.dataPreparerCustom[0].scope_1?.find(items => items.category == 'Stationary Combustion');

    const FuelObject = {
      category: 'Fuel and Energy-related Activities',
      data: filterStationary.data,
      scope: 'scope_3',
      percentage: filterStationary.percentage
    };

    scope3Array = this.dataPreparerCustom[0].scope_3;
    if(scope3Array){
      // Check if 'Fuel and Energy-related Activities' already exists
      const existingIndex = scope3Array.findIndex(
        (obj) => obj.category === 'Fuel and Energy-related Activities'
      );
  
      if (existingIndex === -1 ) {
        // Find the index of 'Purchase Goods'
        const index2 = scope3Array.findIndex(
          (obj) => obj.category === 'Purchased goods and services'
        );
  
        // Insert the new object after 'Purchase Goods'
        if (index2 !== -1) {
          scope3Array.splice(index2 + 1, 0, FuelObject);
        }
      }
      
    }
    this.GetsavedDataPoint(id);

  };


  GetFacilityList(tenantID: any) {


    this.facilityService
      .newGetFacilityByTenant(tenantID)
      .subscribe((res) => {
        if (res.length > 0) {
          const facility = res.map(items => items.id)
          // this.GetsavedDataPoint(res[0].id);
          const facilityName = res.map(items => items.AssestType)
          this.facilities = facility;
          this.facilityData = res;
          this.getDataProgress();

        }
      });
  };

  GetsavedDataPoint(facilityID: any) {
    this.dataPreparer = []
    this.selectedScope1 = []
    this.selectedScope2 = []
    this.selectedScope3 = []
    this.facilityService.getSavedDataPoint(facilityID).subscribe({
      next: (response: any) => {
        if (response.success == true) {
          this.defaultScope = false;

          this.savedData = response.categories;
          const scope1 = this.savedData.filter(items => items.ScopeID == 1);
          if (scope1.length > 0) {
            this.selectedScope1 = scope1[0].manageDataPointCategories.map(item => item.catName);
          }

          const scope2 = this.savedData.filter(items => items.ScopeID == 2);
          if (scope2.length > 0) {
            this.selectedScope2 = scope2[0].manageDataPointCategories.map(item => item.catName);
          }

          const scope3 = this.savedData.filter(items => items.ScopeID == 3);
          if (scope3.length > 0) {
            this.selectedScope3 = scope3[0].manageDataPointCategories.map(item => item.catName);
          };

          const tempArr = []
          for (let index = 0; index < this.scope3OrderCategories.length; index++) {
             
              
             const findCategory = this.selectedScope3.find(items=> items == this.scope3OrderCategories[index].name )
               if(findCategory){
                  tempArr.push(findCategory)
               }
          }
        
          this.selectedScope3 = [...tempArr];
    
         
          const updatedScope1 = this.dataPreparerCustom[0].scope_1
            .filter(item => this.selectedScope1.includes(item.category))
            .sort((a, b) => this.selectedScope1.indexOf(a.category) - this.selectedScope1.indexOf(b.category));
          this.dataPreparer = [{ ...this.dataPreparer[0], scope_1: updatedScope1 }];

          setTimeout(() => {
            if(this.dataPreparerCustom[0].scope_2){
            this.dataPreparer[0]['scope_2'] = this.dataPreparerCustom[0].scope_2
              .filter(item => this.selectedScope2.includes(item.category))
              .sort((a, b) => this.selectedScope2.indexOf(a.category) - this.selectedScope2.indexOf(b.category));
            }
              
              if(this.dataPreparerCustom[0].scope_3){
                this.dataPreparer[0]['scope_3'] = this.dataPreparerCustom[0].scope_3
                  .filter(item => this.selectedScope3.includes(item.category))
                  .sort((a, b) => this.selectedScope3.indexOf(a.category) - this.selectedScope3.indexOf(b.category));
                
              }
            
              this.transformedData = this.transformedData.map((item) => {
                const scope3Categories = item[item.facilityId]?.scope_3 || [];
              
                const fuel3 = scope3Categories.filter((cat) => cat.category === 'Fuel and Energy-related Activities');
              
                if (fuel3.length > 0) {
                  
                  const newScope3 = (item.sum + Number(fuel3[0].percentage)) / (item.count + 1);
                  
                  return {
                    ...item,
                    scope3: newScope3
                  };
                }
              
                return item;
              });
          }, 100)
        } else {
          this.defaultScope = true;
        }


        return
        if (this.savedData != null) {
          this.savedData.forEach(items => {

            if (items.ScopeID == 1) {
              const newScope1 = [];
              items.manageDataPointCategories.forEach((categories: any) => {
                categories.manageDataPointSubCategories.forEach((subcategory: any) => {
                  newScope1.push(subcategory.ManageDataPointSubCategorySeedID)
                })
              })

              this.selectedScope1 = [...newScope1];

            } else if (items.ScopeID == 2) {
              const newScope2 = [];
              items.manageDataPointCategories.forEach((categories: any) => {
                categories.manageDataPointSubCategories.forEach((subcategory: any) => {
                  newScope2.push(subcategory.ManageDataPointSubCategorySeedID)
                })
              })
              this.selectedScope2 = [...newScope2];
            } else if (items.ScopeID == 3) {
              const newScope3 = [];
              items.manageDataPointCategories.forEach((categories: any) => {
                categories.manageDataPointSubCategories.forEach((subcategory: any) => {
                  newScope3.push(subcategory.ManageDataPointSubCategorySeedID)
                })
              })
              this.selectedScope3 = [...newScope3];
            }
          })

        }
      }
    });
  }
}
