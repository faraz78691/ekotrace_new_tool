import { Facility } from '@/models/Facility';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { Group } from '@/models/group';
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
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexMarkers, ApexYAxis, ApexGrid, ApexLegend, ApexTitleSubtitle, ApexAnnotations } from 'ng-apexcharts';

interface groupby {
  name: string;
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  annotations: ApexAnnotations;
};


@Component({
  selector: 'app-target-setting',
  templateUrl: './target-setting.component.html',
  styleUrls: ['./target-setting.component.scss']
})
export class TargetSettingComponent {
  isHowtoUse = false;
  // @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
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
  public groupsList: any[] = [];
  public scope1_data: any[] = [];
  public scope2_data: any[] = [];
  public scope3_data: any[] = [];
  public forecast1_data: any[] = [];
  public forecast2_data: any[] = [];
  public forecast3_data: any[] = [];
  public dashed1_data: any[] = [];
  public dashed2_data: any[] = [];
  public dashed3_data: any[] = [];
  public x_axis_years: any[] = [];
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
  editBindedCountry: any[] = [];
  target_type: any[] = [];
  targetKPI: any[] = [];
  responseGraph: any[] = [];
  facilitysubgrouplist: any[] = [];
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
  superAdminTenentID: any;
  carbon_credit_value: string;
  downloadExcelUrl: string;
  type: string;
  date3: string;
  standard: string;
  selectedFile: File;
  allowedUser  = false;

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
    this.emission_activity = [
      {
        e_act: 'Scope 1'
      },
      {
        e_act: 'Scope 1 & 2'
      },
      {
        e_act: 'Scope 3'
      }

    ];
    this.target_type = [
      {
        e_act: 'Emission Reduction'
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
    this.getTenantsDetailById(Number(this.loginInfo.tenantID));
    // this.GetAllFacility();
    let tenantID = this.loginInfo.tenantID;
    this.superAdminTenentID = this.loginInfo.super_admin_id;
    this.GetTarget();
    this.GetSubGroupList(tenantID);
    this.updatedtheme = this.themeservice.getValue('theme');
  }
  //checks upadated theme
  ngDoCheck() {
    this.updatedtheme = this.themeservice.getValue('theme');
  }

  getTenantsDetailById(id: number) { };


  GetTarget() {
    //   let formData = new URLSearchParams();

    //   formData.set('tenant_id', tenantID.toString());

    this.GroupService.getTargetSetting(this.superAdminTenentID).subscribe({
      next: (response) => {
     
        if (response.success == true) {
          this.groupsList = response.orders;
          // group.target_emission_change,group.base_year,group.target_year,group.target_type, group.emission_activity
          this.ViewGraph(this.groupsList[0].target_emission_change, this.groupsList[0].base_year, this.groupsList[0].target_year, this.groupsList[0].target_type, this.groupsList[0].emission_activity)
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
  GetTargetGraph(data: any) {
    var dateYear = (data.base_year).getFullYear().toString();
    let formData = new URLSearchParams();

    formData.set('percentage', data.reduction.toString());
    formData.set('base_year', dateYear.toString());

    this.GroupService.getTargetGraphsPoints(formData.toString()).subscribe({
      next: (response) => {

        if (response.success == true) {
          this.responseGraph = response;
          this.scope1_data = response.scope1Xcordinate;
          this.scope2_data = response.scope2Xcordinate;
          this.scope3_data = response.scope3Xcordinate;
          this.x_axis_years = response.forecastYcordinate;
          this.graphMethod(response.scope1Xcordinate, response.forecastScope1Xcordinate, response.dottedScope1Xcordinate, response.yCordinate, response.forecastYcordinate)
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
    if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
      this.notification.showInfo('You are not authrised to submit form', '')
      return
  }
    if ( this.allowedUser  == false) {
      this.notification.showInfo('You are not authorised to submit form', '')
      return
  }


    const formData = new URLSearchParams();

    formData.append('target_name', data.value.target_name);
    formData.append('emission_activity', data.value.emission_activity);
    formData.append('target_type', data.value.target_type);
    formData.append('base_year', (data.value.base_year).getFullYear().toString());
    formData.append('target_year', (data.value.target_year).getFullYear().toString());
    formData.append('target_emission_change', data.value.target_emission_change);
    formData.append('other_target_kpichange', data.value.other_target_kpichange);
    formData.append('other_target_kpi', data.value.other_target_kpi);
    formData.append('tenantId', this.superAdminTenentID);

    this.GroupService.addTargetSetting(formData).subscribe({
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


  ViewGraph(percentage, base_year, target_year, intensity, scope) {

    var baseYear: any;
    if (base_year.length == 4) {
      baseYear = base_year;
    } else {
      var date = new Date(base_year);
      baseYear = date.getFullYear();

    }
    const formData = new URLSearchParams();

    formData.append('percentage', percentage);
    formData.append('base_year', baseYear);
    formData.append('target_year', target_year);
    if (intensity == 'Emission Reduction') {
      formData.append('intensity', 'A');
    } else {
      formData.append('intensity', 'P');
    }


    this.GroupService.getGraphsTarget(formData.toString()).subscribe({
      next: (response) => {
        if (response.success == true) {
        
          const Data = response;
          let getBaseYear = response.yCordinate[0];
          let getYcoridnate = response.yCordinate;

          let getscope1Xcordinate = response.scope1Xcordinate;

          const currentYear = new Date().getFullYear();

          const years = [];
          const newScope1Xcordinate = [];
          for (let year = getBaseYear; year <= currentYear; year++) {
            years.push(year);
          }
          for (let i = 0; i < years.length; i++) {

            let resultIndex = getYcoridnate.indexOf(years[i]);

            if (resultIndex != -1) {
              newScope1Xcordinate.push(getscope1Xcordinate[resultIndex])
            } else {
              newScope1Xcordinate.push(0)
            }
          }


          // if(years[i] == getYcoridnate[i]){
          //   newScope1Xcordinate.push(getscope1Xcordinate[i])
          // }else{
          //   newScope1Xcordinate.push(null)
          // }



          if (scope == 'Scope 1') {
            this.graphMethod(newScope1Xcordinate, response.targetScope1Xcordinate, response.forecastScope1Xcordinate, response.targetYcordinate, response.forecastYcordinate)
          } else if (scope == 'Scope 1 & 2') {
            let actualCordinate = Data.scope1Xcordinate.map((item, index) => {
              return parseFloat(item) + parseFloat(Data.scope2Xcordinate[index])
            })
            let targetCordinate = Data.targetScope1Xcordinate.map((item, index) => {
              return parseFloat(item) + parseFloat(Data.targetScope2Xcordinate[index])
            })
            let forecastCordinate = Data.forecastScope1Xcordinate.map((item, index) => {
              return parseFloat(item) + parseFloat(Data.forecastScope2Xcordinate[index])
            })
            const years = [];
            const newScope12Xcordinate = [];
            for (let year = getBaseYear; year <= currentYear; year++) {
              years.push(year);
            }
            for (let i = 0; i < years.length; i++) {

              let resultIndex = getYcoridnate.indexOf(years[i]);

              if (resultIndex != -1) {
                newScope12Xcordinate.push(actualCordinate[resultIndex])
              } else {
                newScope12Xcordinate.push(0)
              }
            }
            this.graphMethod(newScope12Xcordinate, targetCordinate, forecastCordinate, response.targetYcordinate, response.forecastYcordinate)

          } else {
            this.graphMethod(response.scope3Xcordinate, response.targetScope3Xcordinate, response.forecastScope3Xcordinate, response.targetYcordinate, response.forecastYcordinate)
          }


          this.visible = false;

          this.GroupForm.reset();
        } else {
          this.chartOptions = undefined;
          this.notification.showInfo('Enter base year and current year emissions', '')
        }
      },
      error: (err) => {
        this.notification.showError(err.error.message, 'Error');
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Group Added')
    });
  }

  graphMethod(normalData, targetData, forecastedData, normalYears, Dashedyears) {

    var index = 0;
    const normalsLine: number[] = normalData.map(str => parseFloat(str));
    const dashedLine: number[] = forecastedData.map(str => parseFloat(str));
    const normalYear: number[] = normalYears.map(str => parseFloat(str));
    const mergedYears = [...normalYear, ...Dashedyears];
    let uniqueYears = [...new Set(mergedYears)];


    // for (let i = 0; i < cars.length; i++) {
    //   text += cars[i] + "<br>";
    // }
    for (index = 0; index < normalsLine.length - 1; index++) {
      dashedLine.unshift(null);
    };
   


    const parallelLine: number[] = targetData.map(str => parseFloat(str));


    this.chartOptions = {
      series: [
        {
          name: "Actual Emissions",
          data: normalsLine,
        },
        {
          name: "Target",
          data: parallelLine,
        },
        {
          name: "Forecasted",
          data: dashedLine,
        },
      ],
      chart: {
        height: 350,
        type: "line",
      },
      annotations: {
        xaxis: [
          {
          x: new Date().getFullYear(),
          strokeDashArray: 1,
          borderColor: '#7755D0',
          label: {
            borderColor: '#7755D0',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: 'Current year',
          }
        },
          {
          x: normalYear[normalYear.length -1],
          strokeDashArray: 1,
          borderColor: '#7755D0',
          label: {
            borderColor: '#7755D0',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: 'Target year',
          }
        }

        ],
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 0, 5],
      },
      title: {
        text: "Page Statistics",
        align: "left",
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        labels: {
          trim: false,
        },
        categories: normalYear, // Make sure this matches the year format as numbers
      },
      yaxis: {
        min: 0, // Ensure y-axis starts from zero
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        ],
      },
      grid: {
        borderColor: "#f1f1f1",
      },
      
    };


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
    if (data.value.base_year.length == 4) {
      var dateYear = data.value.base_year;
    } else {
      var dateYear = (data.value.base_year).getFullYear().toString();
    }
    if (data.value.target_year.length == 4) {
      var targetYear = data.value.target_year;
    } else {
      var targetYear = (data.value.target_year).getFullYear().toString();
    }
    const formData = new URLSearchParams();

    formData.append('target_name', data.value.target_name);
    formData.append('emission_activity', data.value.emission_activity);
    formData.append('target_type', data.value.target_type);
    formData.append('base_year', dateYear.toString());
    formData.append('target_year', targetYear.toString());
    formData.append('target_emission_change', data.value.target_emission_change);
    formData.append('other_target_kpichange', data.value.other_target_kpichange);
    formData.append('other_target_kpi', data.value.other_target_kpi);
    formData.append('id', id);

    this.GroupService.updateTargetSetting(formData.toString()).subscribe({
      next: (response) => {
      
        this.GetTarget();

        this.visible = false;
        this.notification.showSuccess(
          'Target Setting updated successfully',
          'Success'
        );
      },
      error: (err) => {
        this.notification.showError('Target edited failed.', 'Error');
        console.error(err);
      },
      complete: () => console.info('Group edited')
    });
  };

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

  viewDetails(details: any) {
   
    this.visible = true;
    // this.relationId = id;
    this.FormEdit = true;
    const formData = new URLSearchParams();

    let obj = {
      target_name: details.target_name,
      emission_activity: details.emission_activity,
      e_act: details.target_type,
      base_year: details.base_year,
      target_year: details.target_year,
      target_emission_change: details.target_emission_change,
      other_target_kpichange: details.other_target_kpichange,
      target_type:details.target_type,
      other_target_kpi :details.other_target_kpi

    };
    this.GroupForm.control.patchValue(obj);


  };

  GetSubGroupList(tenantID) {
    this.facilitysubgrouplist = []
   
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantID)
    this.facilityService
        .getActualSubGroups(formData.toString())
        .subscribe((res) => {
        
            if(res.success == true){
                this.facilitysubgrouplist = res.categories;
               const isMainGroup =    this.facilitysubgrouplist.filter(items=> items.is_main_group ==1)
      if(isMainGroup.length > 0 ){
        this.allowedUser = true
      }else{
        this.allowedUser = false
      }
      console.log(  this.allowedUser);
              
            }
        });
};
}
