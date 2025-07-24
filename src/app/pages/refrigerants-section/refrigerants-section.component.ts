import {LoginInfo} from '@/models/loginInfo';
import {Component} from '@angular/core';
import {FacilityService} from '@services/facility.service';
import {ThemeService} from '@services/theme.service';
import {DashboardService} from '@services/dashboard.service';
import {
    DashboardModel,
    TopCarbonConsumingByMonthModel,
    TopCarbonConsumingModel
} from '@/models/Dashboard';
@Component({
    selector: 'app-refrigerants-section',
    templateUrl: './refrigerants-section.component.html',
    styleUrls: ['./refrigerants-section.component.scss']
})
export class EnergySectionComponent {
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
    ) {}
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
            this.getDataforRefrigerants(
                this.loginInfo.tenantID,
                this.globalFilterID
            );
            this.getTopCarbonConsumingForRefrigerants(
                this.loginInfo.tenantID,
                this.defaultParam,
                this.globalFilterID
            );
            this.getTopCarbonConsumingByMonthForRefrigerants(
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
            this.getDataforRefrigerants(
                this.loginInfo.tenantID,
                this.globalFilterID
            );
            this.getTopCarbonConsumingForRefrigerants(
                this.loginInfo.tenantID,
                this.defaultParam,
                this.globalFilterID
            );
            this.getTopCarbonConsumingByMonthForRefrigerants(
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
        this.getTopCarbonConsumingForRefrigerants(
            this.loginInfo.tenantID,
            item.dataPointName,
            this.globalFilterID
        );
        this.getTopCarbonConsumingByMonthForRefrigerants(
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

    getDataforRefrigerants(tenantID, globalFilterID) {
        this.dashboardService
            .GetDataForRefrigerants(tenantID, globalFilterID)
            .subscribe((response) => {
                this.EnvironmentDataPoints = response;
            });
    }
    getTopCarbonConsumingForRefrigerants(
        tenantID,
        dataPointName,
        globalFilterID
    ) {
        this.dashboardService
            .GetTopCarbonConsumingForRefrigerants(
                tenantID,
                dataPointName,
                globalFilterID
            )
            .subscribe((response) => {
                this.TopCarbonConsumingList = response;
            });
    }
    getTopCarbonConsumingByMonthForRefrigerants(
        tenantID,
        dataPointName,
        globalFilterID
    ) {
        this.dashboardService
            .GetTopCarbonConsumingByMonthForRefrigerants(
                tenantID,
                dataPointName,
                globalFilterID
            )
            .subscribe((response) => {
                this.TopCarbonConsumingByMonthList = response;
            });
    }
}
