import { DashboardModel, TopCarbonConsumingByMonthModel, TopCarbonConsumingModel } from '@/models/Dashboard';
import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-heatand-steam',
  templateUrl: './heatand-steam.component.html',
  styleUrls: ['./heatand-steam.component.scss']
})
export class HeatandSteamComponent {
  public EnvironmentDataPoints: DashboardModel[];
  public TopCarbonConsumingList: TopCarbonConsumingModel[];
  public TopCarbonConsumingByMonthList: TopCarbonConsumingByMonthModel[];
  public loginInfo: LoginInfo;
  display = 'none';
  IsPAdmin = true;
  updatedtheme: string;
  activetab: number = 0;
  getfacilitystring: string;
  facilitylist: string;
  activecombustiontab: number = 0;
  defaultParam: string;
  dataPointName: string;
  globalFilterID: any;
  flag: string;
  constructor(
    private themeservice: ThemeService,
    private facilityService: FacilityService,
    private dashboardService: DashboardService
  ) { }
  ngOnInit() {
    this.loginInfo = new LoginInfo();
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
      if (this.loginInfo.role != 'Platform Admin') {
        this.IsPAdmin = false;
      }
      this.GetAllFacility();
      this.getDataforHeatnSteam(
        this.loginInfo.tenantID,
        this.globalFilterID
      );
      this.getTopCarbonConsumingForHeatnSteam(
        this.loginInfo.tenantID,
        this.defaultParam,
        this.globalFilterID
      );
      this.getTopCarbonConsumingByMonthForHeatnSteam(
        this.loginInfo.tenantID,
        this.defaultParam,
        this.globalFilterID
      );
    }
  }
  ngDoCheck() {
    this.updatedtheme = this.themeservice.getValue('theme');
    let fId = sessionStorage.getItem('SelectedfacilityID');
    this.flag = localStorage.getItem('Flag');
    if (this.globalFilterID != fId) {
      this.globalFilterID = fId;
      this.getDataforHeatnSteam(
        this.loginInfo.tenantID,
        this.globalFilterID
      );
      this.getTopCarbonConsumingForHeatnSteam(
        this.loginInfo.tenantID,
        this.defaultParam,
        this.globalFilterID
      );
      this.getTopCarbonConsumingByMonthForHeatnSteam(
        this.loginInfo.tenantID,
        this.defaultParam,
        this.globalFilterID
      );
      //  }
    }
  }
  openModal() {
    this.display = 'block';
  }
  onCloseHandled() {
    this.display = 'none';
  }
  changecombustiontabs(item) {
    this.dataPointName = item.dataPointName;
    this.activecombustiontab = item.id;
    this.getTopCarbonConsumingForHeatnSteam(
      this.loginInfo.tenantID,
      item.dataPointName,
      this.globalFilterID
    );
    this.getTopCarbonConsumingByMonthForHeatnSteam(
      this.loginInfo.tenantID,
      item.dataPointName,
      this.globalFilterID
    );
  }
  changeheadtabs(e) {
    this.dataPointName = '';
    this.activetab = e;
  }
  GetAllFacility() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.FacilityDataGet(tenantId).subscribe((response) => {
      this.getfacilitystring = JSON.stringify(response);
      localStorage.setItem('AllFacility', this.getfacilitystring);
    });
  }
  // Refrigerants

  getDataforHeatnSteam(tenantID, globalFilterID) {
    this.dashboardService
      .GetDataForHeatnSteam(tenantID, globalFilterID)
      .subscribe((response) => {
        this.EnvironmentDataPoints = response;
      });
  }
  getTopCarbonConsumingForHeatnSteam(
    tenantID,
    dataPointName,
    globalFilterID
  ) {
    this.dashboardService
      .GetTopCarbonConsumingForHeatnSteam(
        tenantID,
        dataPointName,
        globalFilterID
      )
      .subscribe((response) => {
        this.TopCarbonConsumingList = response;
      });
  }
  getTopCarbonConsumingByMonthForHeatnSteam(
    tenantID,
    dataPointName,
    globalFilterID
  ) {
    this.dashboardService
      .GetTopCarbonConsumingByMonthForHeatnSteam(
        tenantID,
        dataPointName,
        globalFilterID
      )
      .subscribe((response) => {
        this.TopCarbonConsumingByMonthList = response;
      });
  }
}
