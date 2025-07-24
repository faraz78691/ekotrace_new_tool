import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginInfo } from '@/models/loginInfo';
import { ThemeService } from '@services/theme.service';
import { FacilityService } from '@services/facility.service';
import { DashboardService } from '@services/dashboard.service';
import {
    DashboardModel,
    TopCarbonConsumingByMonthModel,
    TopCarbonConsumingModel
} from '@/models/Dashboard';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
   
})
export class DashboardComponent {
    public EnvironmentDataPoints: DashboardModel[];
    public TopCarbonConsumingList: TopCarbonConsumingModel[];
    public TopCarbonConsumingByMonthList: TopCarbonConsumingByMonthModel[];
    public loginInfo: LoginInfo;
    display = 'none';
    IsPAdmin = true;
    year: Date;
    updatedtheme: string;
    activetab: number = 0;
    activecombustiontab: number = 0;
    getfacilitystring: string;
    facilitylist: string;
    defaultParam: string;
    dataPointName: string;
    flag: string;
    excludedRole = 'Platform Admin';
    globalFilterID: any;
    isVisited = '';
    dashboardData: any[] = [];
    selectedFacility = ''
    constructor(
        private themeservice: ThemeService,
        private facilityService: FacilityService,
        private dashboardService: DashboardService,
        private router: Router
    ) {
        this.EnvironmentDataPoints = [];
        this.TopCarbonConsumingList = [];
        this.TopCarbonConsumingByMonthList = [];
        this.dataPointName = '';
        this.year = new Date();
    }
    ngOnInit() {
        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            if (this.loginInfo.role == 'Super Admin') {
                this.IsPAdmin = true;
            } else {
                this.IsPAdmin = false
            }

        }
        if (this.router.url.includes('dashboard/ghgEmission')) {

            this.isVisited = 'GHG'

        } else if (this.router.url.includes('dashboard/energyEmission')) {
            this.isVisited = 'energy'
        } else if (this.router.url.includes('dashboard/businessTravel')) {
            this.isVisited = 'business'
        }

        // this.GetAllfacilities();

    };
    ngDoCheck() {

        this.updatedtheme = this.themeservice.getValue('theme');
        let fId = sessionStorage.getItem('SelectedfacilityID');
        this.flag = localStorage.getItem('Flag');
       
    };
    openModal() {
        this.display = 'block';
    }
    onCloseHandled() {
        this.display = 'none';
    }
    //updates the active tab in the UI and fetches carbon consumption data based on the selected tab.
    changeheadtabs(e) {
        this.dataPointName = '';
        this.activetab = e;
        this.activecombustiontab = null;
        this.getTopCarbonConsumingForEnvironment(
            this.loginInfo.tenantID,
            this.defaultParam,
            this.globalFilterID
        );
        this.getTopCarbonConsumingByMonthForEnvironment(
            this.loginInfo.tenantID,
            this.defaultParam,
            this.globalFilterID
        );
    };
    //updates the active combustion tab in the UI and fetches carbon consumption data based on the selected tab.
    changecombustiontabs(item) {
        this.dataPointName = item.dataPointName;
        this.activecombustiontab = item.id;
        this.getTopCarbonConsumingForEnvironment(
            this.loginInfo.tenantID,
            item.dataPointName,
            this.globalFilterID
        );
        this.getTopCarbonConsumingByMonthForEnvironment(
            this.loginInfo.tenantID,
            item.dataPointName,
            this.globalFilterID
        );
    }
    //fetches data for environments based on the provided parameters
    // getDataforEnviroments(tenantID, globalFilterID) {
    //     this.dashboardService
    //         .GetDataForEnvironment(tenantID, globalFilterID)
    //         .subscribe((response) => {
    //             this.EnvironmentDataPoints = response;
    //         });
    // }

    getDataforEnviroments(tenantID, globalFilterID) {
        if (this.loginInfo.role === this.excludedRole) {
            return;
        }
        this.dashboardService
            .GetDataForEnvironment(tenantID, globalFilterID)
            .subscribe((response) => {
                if (response) {
                    this.EnvironmentDataPoints = response;
                }
            });
    }
    //retrieves the top carbon consuming data for a specific environment based on the provided parameters

    getTopCarbonConsumingForEnvironment(tenantID, dataPointName, globalFilterID) {
        if (this.loginInfo.role === this.excludedRole) {
            return;
        }
        this.dashboardService
            .GetTopCarbonConsumingForEnvironment(
                tenantID,
                dataPointName,
                globalFilterID
            )
            .subscribe((response) => {
                if (response) {
                    this.TopCarbonConsumingList = response;
                }
            });

    }
    //retrieves the top carbon consuming data by month for a specific environment based on the provided parameters

    getTopCarbonConsumingByMonthForEnvironment(tenantID, dataPointName, gobalFilterID) {
        if (this.loginInfo.role === this.excludedRole) {
            return;
        }
        this.dashboardService
            .GetTopCarbonConsumingByMonthForEnvironment(
                tenantID,
                dataPointName,
                gobalFilterID
            )
            .subscribe((response) => {
                if (response) {
                    this.TopCarbonConsumingByMonthList = response;
                }
            });

    };

    GetAllfacilities() {
        let tenantId = this.loginInfo.tenantID;
        const formData = new URLSearchParams();
        formData.set('tenantID', tenantId.toString())
        this.dashboardService.getdashboardfacilities(formData.toString()).subscribe((result: any) => {
          
            this.dashboardData = result.categories;
            this.selectedFacility = this.dashboardData[0].ID;
           
            // this.admininfoList = result;


        });
    }
}
