import { BRSR_Doc } from '@/models/brsrDOc';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { AppState } from '@/store/state';
import { ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { ReportService } from '@services/report.service';
import { Observable } from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    public loginInfo: LoginInfo;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    isExpired: boolean;
    excludedRole = 'Platform Admin';
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;
    public menu;
    IsPAdmin = true;
    updatedtheme: string;
    multiselectcolor: any;
    selectedTheme: string;
    public brsrdata: BRSR_Doc;
    isBRSRDoc: boolean;
    haveMainGroup = 2;
    dashboardLogoUrl: string = '';


    constructor(
        public appService: AppService,
        public companyService: CompanyService,
        private store: Store<AppState>,
        private elementRef: ElementRef,
        private reportService: ReportService,
        private facilityService: FacilityService,

    ) {
        this.loginInfo = new LoginInfo();
        this.brsrdata = new BRSR_Doc();
        this.companyDetails = new CompanyDetails();
        this.isBRSRDoc = true;

    }

    ngOnInit() {

        if (localStorage.getItem('assets') != null) {
            let userAssets = localStorage.getItem('assets');

            this.dashboardLogoUrl = JSON.parse(userAssets).dashboard_logo

        } else {
            this.appService.getApi('/login_logo').subscribe((res) => {
                this.dashboardLogoUrl = res.data.dashboard_logo
                const jsonAssets = JSON.stringify(res.data[0]);
                localStorage.setItem('assets', jsonAssets);

            })
        }

        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            if (this.loginInfo.role != 'Platform Admin') {
                this.IsPAdmin = false;
            }
            // this.checkbrsrdata(this.loginInfo.tenantID);
            if (this.loginInfo.role == 'Admin') {
                this.GetAllSubGrups();
            }
            // this.getTenantsById(Number(this.loginInfo.tenantID));
            this.getTenantsById(Number(this.loginInfo.tenantID)).then(() => {


                if (this.loginInfo.role === 'Super Admin' && this.isExpired) {
                    this.menu =
                        menu.find((item) => item.role === this.loginInfo.role)
                            ?.items || [];


                } else {
                    if (this.brsrdata.docPath != null || this.brsrdata.docPath != undefined) {
                        this.isBRSRDoc = true;
                        this.menu =
                            menu.find((item) => item.role === this.loginInfo.role)
                                ?.items || [];
                    }
                    else {

                        this.isBRSRDoc = false;
                        if (this.loginInfo.role == 'Platform Admin') {
                            this.menu =
                                menu.find((item) => item.role === this.loginInfo.role && item.haveMainGorup == this.haveMainGroup)
                                    ?.items || [];
                        } else {

                            this.menu =
                                menu.find((item) => item.role === this.loginInfo.role && item.package_name == this.loginInfo.package_name && item.haveMainGorup == this.haveMainGroup)
                                    ?.items || [];
                        }
                    }
                }

            });

        }

        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;


    }

    handleActiveClass() {

    }
    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }

    async getTenantsById(id: number) {
        try {
            if (this.loginInfo.role === this.excludedRole) {
                this.theme2();
                return;
            }


            const response = await this.companyService
                .getTenantsDataById(Number(this.loginInfo.tenantID))
                .toPromise();

            this.companyDetails = response;

            const currentDate = new Date();
            const licenseExpiredDate = new Date(
                this.companyDetails.licenseExpired
            );
            this.isExpired = licenseExpiredDate < currentDate;
        } catch (error) {
            // Handle the error appropriately
        }

        this.user = this.appService.user;

        this.updatedtheme = localStorage.getItem('theme');
        if (this.updatedtheme === 'dark') {
            this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
                '#5E6065';
            // '#E9EDF2';
        }

        if (this.updatedtheme === 'light') {
            this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
                '#E9EDF2';
        }

        if (this.updatedtheme === null) {
            this.theme2();
        }
    };
    GetAllSubGrups() {
        let tenantId = this.loginInfo.tenantID;
        const formData = new URLSearchParams();
        formData.set('tenantID', tenantId.toString())
        this.facilityService.getSubGroupsByTenantId(formData.toString()).subscribe((result: any) => {

            if (result.success == true) {
                if (result.categories.length > 0) {
                    // this.haveMainGroup = result.categories[0].is_subgroup;
                    // console.log(this.haveMainGroup);

                }


            }

        });
    };

    checkbrsrdata(tenantID) {
        this.brsrdata = new BRSR_Doc();
        this.brsrdata.brsR_Q_As = [];

        this.reportService.getBRSRdata(tenantID).subscribe((response) => {
            if (response != null) {

                this.brsrdata = response;

            }
        });
    }

    theme1() {
        localStorage.setItem('theme', 'light');
        this.updatedtheme = localStorage.getItem('theme');
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
            '#E9EDF2';
    }
    // theme2() {
    //     localStorage.setItem('theme', 'dark');
    //     this.updatedtheme = localStorage.getItem('theme');
    //     this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
    //         '#5E6065';
    // }
    theme2() {
        localStorage.setItem('theme', 'light');
        this.updatedtheme = localStorage.getItem('theme');
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
            '#E9EDF2';
    }

    getSelectedValue() {
        if (this.selectedTheme === 'theme1') {
            localStorage.setItem('theme', 'theme1');
        }
        if (this.selectedTheme === 'theme2') {
            localStorage.setItem('theme', 'theme2');
        }
        if (this.selectedTheme === 'theme3') {
            localStorage.setItem('theme', 'theme3');
        }
        if (this.selectedTheme === 'theme4') {
            localStorage.setItem('theme', 'theme4');
        }
    }

    activeDropdownIndex: number = 0
    toggleDropdown(index: number): void {
        this.activeDropdownIndex = this.activeDropdownIndex === index ? -1 : index;

    }
}
export const menu = [
    {
        role: 'Platform Admin',
        haveMainGorup: 2,
        package_name: 'Comprehensive',
        items: [
            {
                head: 'Platform Admin',
                children: [{
                    name: 'Assign package',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/trees.png',
                    path: ['platformAdmin']
                }]
            },

        ]
    },
    {
        role: 'Super Admin',
        haveMainGorup: 2,
        package_name: 'Comprehensive',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        head: undefined,
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        head: undefined,
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    },
                    {
                        name: 'KPI Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['kpiDashboard']
                    },
                    {
                        name: 'Financed E. Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['financeDash']
                    }
                ]
            },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Financed Emissions',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['finance_emissions']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    },
                    {
                        name: 'Emissions Inventory',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['kpi_inventory']
                    },
                    {
                        name: 'Cost Centre',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['cost_centre']
                    }
                ]
            },
            {
                head: 'Vendor',
                children: [
                    {
                        name: 'Vendors',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['vendors']
                    },
                    {
                        name: 'Vendor Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['vendorDashboard']
                    }
                ]
            },
            {
                head: 'Reporting',
                children: [
                    {
                        name: 'Report',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['report']
                    },
                    {
                        name: 'GHG Emissions Report',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['GhgReporting']
                    },
                    {
                        name: 'BRSR',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['brsrReport']
                    }
                ]
            },
            {
                head: 'Target Setting',
                children: [
                    {
                        name: 'Set Emission Inventory',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['setEmissionInventory']
                    },
                    {
                        name: 'Target Setting',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['targetSetting']
                    },
                    {
                        name: 'Actions',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['actions']
                    }
                ]
            },
            {
                head: 'Carbon offsetting',
                children: [
                    {
                        name: 'Offset Entry',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['carbonOffset']
                    }
                ]
            },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            },
            {
                head: 'Others',
                children: [
                    {
                        name: 'Attachments',
                        iconClasses: 'fa fa-paperclip',
                        iconSRC: 'assets/img/attachments.png',
                        path: ['attachments']
                    }
                ]
            }
        ]
    },

    {
        role: 'Super Admin',
        haveMainGorup: 2,
        package_name: 'Intermediate',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },

            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    }
                    // {
                    //     name: 'KPI Dashboard',
                    //     iconClasses: 'fas fa-table',
                    //     iconSRC: 'assets/img/dashboard.svg',
                    //     path: ['kpiDashboard']
                    // },
                    // {
                    //     name: 'Financed E. Dashboard',
                    //     iconClasses: 'fas fa-table',
                    //     iconSRC: 'assets/img/BRSR.svg',
                    //     path: ['financeDash']
                    // },
                ]
            },

            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    }
                    // {
                    //     name: 'Financed Emissions',
                    //     iconClasses: 'fas fa-table',
                    //     iconSRC: 'assets/img/BRSR.svg',
                    //     path: ['finance_emissions']
                    // },
                    // {
                    //     name: 'Vendors / Cost Centre',
                    //     iconClasses: 'fas fa-table',
                    //     iconSRC: 'assets/img/BRSR.svg',
                    //     path: ['vendors']
                    // }
                ]
            },

            {
                head: 'Reporting ',
                children: [
                    {
                        name: 'Report',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['report']
                    },
                    {
                        name: 'BRSR',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['brsrReport']
                    }
                ]
            },
            {
                head: 'Target Setting',
                children: [
                    {
                        name: 'Set Emission Inventory',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['setEmissionInventory']
                    },
                    {
                        name: 'Target Setting',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['targetSetting']
                    },
                    {
                        name: 'Actions',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['actions']
                    }
                ]
            },
            // {
            //     head: 'Carbon offsetting',
            //     name: 'Offset Entry',
            //     iconClasses: 'fas fa-eye',
            //     iconSRC: 'assets/img/building.svg',
            //     path: ['carbonOffset']
            // },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            }
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // },
        ]
    },

    {
        role: 'Super Admin',
        haveMainGorup: 2,
        package_name: 'Basic',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    }
                    // {
                    //     name: 'Financed E. Dashboard',
                    //     iconClasses: 'fas fa-table',
                    //     iconSRC: 'assets/img/BRSR.svg',
                    //     path: ['financeDash']
                    // }
                ]
            },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    }
                ]
            },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            }
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // }
        ]
    },
    {
        role: 'Auditor',
        haveMainGorup: 2,
        package_name: 'Comprehensive',
        items: [
            {
                head: 'Organisation Structure',
                name: 'Tree',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/trees.png',
                path: ['main_tree']
            },
            {
                head: undefined,
                name: 'Add User',
                iconClasses: 'fas fa-user-plus',
                iconSRC: 'assets/img/user_121.png',
                path: ['user']
            },
            {
                head: undefined,
                name: 'Set GHG Template',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/tracking_icon.svg',
                path: ['setGhgTemplate']
            },
            {
                head: 'Dashboard',
                name: 'GHG Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['dashboard']
            },
            {
                name: 'KPI Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['kpiDashboard']
            },
            {
                name: 'Financed E. Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['financeDash']
            },
            {
                head: 'GHG Emissions',
                name: 'Corporate Emissions',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/trees.png',
                path: ['tracking']
            },
            {
                name: 'Financed Emissions',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['finance_emissions']
            },
            {
                name: 'Data Progress',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['dataProgress']
            },
            {
                name: 'Emissions Inventory',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['kpi_inventory']
            },
            {
                name: 'Cost Centre',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['cost_centre']
            },
            {
                head: 'Vendor',
                name: 'Vendors',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['vendors']
            },
            {
                name: 'Vendor Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['vendorDashboard']
            },
            {
                head: 'Reporting ',
                name: 'Report',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['report']
            },
            {
                name: 'GHG Emissions Report',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['GhgReporting']
            },
            // {
            //     name: 'BRSR',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['brsrReport']
            // },
            {
                head: 'Target Setting',
                name: 'Set Emission Inventory',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['setEmissionInventory']
            },
            {
                name: 'Target Setting',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['targetSetting']
            },
            {
                name: 'Actions',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['actions']
            },
            {
                head: 'Carbon offsetting',
                name: 'Offset Entry',
                iconClasses: 'fas fa-eye',
                iconSRC: 'assets/img/building.svg',
                path: ['carbonOffset']
            },
            {
                head: 'Account Details',
                name: 'Company Profile',
                iconClasses: 'fas fa-eye',
                iconSRC: 'assets/img/building.svg',
                path: ['company-profile']
            },
            {
                name: 'Billing',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/biling_icon_211.png',
                path: ['billing']
            },
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // },
        ]
    },
    {
        role: 'Auditor',
        haveMainGorup: 2,
        package_name: 'Intermediate',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    }
                ]
            },
            // {
            //     name: 'Financed E. Dashboard',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['financeDash']
            // },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    }
                ]
            },
            // {
            //     name: 'Financed Emissions',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['finance_emissions']
            // },
            // {
            //     name: 'Vendors / Cost Centre',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['vendors']
            // },
            {
                head: 'Reporting ',
                children: [
                    {
                        name: 'Report',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['report']
                    },
                    {
                        name: 'BRSR',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['brsrReport']
                    }
                ]
            },
            {
                head: 'Target Setting',
                children: [
                    {
                        name: 'Set Emission Inventory',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['setEmissionInventory']
                    },
                    {
                        name: 'Target Setting',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['targetSetting']
                    },
                    {
                        name: 'Actions',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['actions']
                    }
                ]
            },
            // {
            //     head: 'Carbon offsetting',
            //     name: 'Offset Entry',
            //     iconClasses: 'fas fa-eye',
            //     iconSRC: 'assets/img/building.svg',
            //     path: ['carbonOffset']
            // },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            }
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // }
        ]
    },
    {
        role: 'Auditor',
        haveMainGorup: 2,
        package_name: 'Basic',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    }
                ]
            },
            // {
            //     name: 'Financed E. Dashboard',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['financeDash']
            // },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    }
                ]
            },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            },
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // },
        ]
    },

    {
        role: 'Admin',
        haveMainGorup: 1,
        package_name: 'Comprehensive',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    },
                    {
                        name: 'KPI Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['kpiDashboard']
                    },
                    {
                        name: 'Financed E. Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['financeDash']
                    }
                ]
            },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Financed Emissions',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['finance_emissions']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    },
                    {
                        name: 'Emissions Inventory',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['kpi_inventory']
                    },
                    {
                        name: 'Cost Centre',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['cost_centre']
                    }
                ]
            },
            {
                head: 'Vendor',
                children: [
                    {
                        name: 'Vendors',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['vendors']
                    },
                    {
                        name: 'Vendor Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['vendorDashboard']
                    }
                ]
            },
            {
                head: 'Reporting ',
                children: [
                    {
                        name: 'Report',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['report']
                    },
                    {
                        name: 'GHG Emissions Report',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['GhgReporting']
                    },
                    {
                        name: 'BRSR',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['brsrReport']
                    }
                ]
            },
            {
                head: 'Target Setting',
                children: [
                    {
                        name: 'Set Emission Inventory',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['setEmissionInventory']
                    },
                    {
                        name: 'Target Setting',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['targetSetting']
                    },
                    {
                        name: 'Actions',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['actions']
                    }
                ]
            },
            {
                head: 'Carbon offsetting',
                children: [
                    {
                        name: 'Offset Entry',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['carbonOffset']
                    }
                ]
            },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            },
            {
                head: 'Others',
                children: [
                    {
                        name: 'Attachments',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['attachments']
                    }
                ]
            }
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // },
        ]
    },

    {
        role: 'Admin',
        haveMainGorup: 2,
        package_name: 'Intermediate',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    },
                    {
                        name: 'KPI Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['kpiDashboard']
                    }
                ]
            },
            // {
            //     name: 'Financed E. Dashboard',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['financeDash']
            // },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    }
                ]
            },
            // {
            //     name: 'Financed Emissions',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['finance_emissions']
            // },
            // {
            //     name: 'Vendors / Cost Centre',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['vendors']
            // },
            {
                head: 'Reporting',
                children: [
                    {
                        name: 'Report',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['report']
                    },
                    {
                        name: 'BRSR',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['brsrReport']
                    }
                ]
            },
            // {
            //     head: 'Target Setting',
            //     name: 'Set Emission Inventory',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/report_icon.svg',
            //     path: ['setEmissionInventory']
            // },
            // {
            //     name: 'Target Setting',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['targetSetting']
            // },
            // {
            //     name: 'Actions',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['actions']
            // },
            // {
            //     head: 'Carbon offsetting',
            //     name: 'Offset Entry',
            //     iconClasses: 'fas fa-eye',
            //     iconSRC: 'assets/img/building.svg',
            //     path: ['carbonOffset']
            // },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            },
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // },
        ]
    },

    {
        role: 'Admin',
        haveMainGorup: 1,
        package_name: 'Intermediate',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    },
                    {
                        name: 'KPI Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['kpiDashboard']
                    }
                ]
            },
            // {
            //     name: 'Financed E. Dashboard',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['financeDash']
            // },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    }
                ]
            },
            // {
            //     name: 'Financed Emissions',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['finance_emissions']
            // },
            // {
            //     name: 'Vendors / Cost Centre',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['vendors']
            // },
            {
                head: 'Reporting ',
                children: [
                    {
                        name: 'Report',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['report']
                    },
                    {
                        name: 'BRSR',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['brsrReport']
                    }
                ]
            },
            // {
            //     head: 'Target Setting',
            //     name: 'Set Emission Inventory',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/report_icon.svg',
            //     path: ['setEmissionInventory']
            // },
            // {
            //     name: 'Target Setting',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['targetSetting']
            // },
            // {
            //     name: 'Actions',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['actions']
            // },
            // {
            //     head: 'Carbon offsetting',
            //     name: 'Offset Entry',
            //     iconClasses: 'fas fa-eye',
            //     iconSRC: 'assets/img/building.svg',
            //     path: ['carbonOffset']
            // },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            },
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // },
        ]
    },

    {
        role: 'Admin',
        haveMainGorup: 2,
        package_name: 'Basic',
        items: [
            {
                head: 'Organisation Structure',
                name: 'Tree',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/trees.png',
                path: ['main_tree']
            },
            {
                head: undefined,
                name: 'Add User',
                iconClasses: 'fas fa-user-plus',
                iconSRC: 'assets/img/user_121.png',
                path: ['user']
            },
            {
                head: undefined,
                name: 'Set GHG Template',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/tracking_icon.svg',
                path: ['setGhgTemplate']
            },
            {
                head: 'Dashboard',
                name: 'GHG Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['dashboard']
            },
            // {
            //     name: 'Financed E. Dashboard',
            //     iconClasses: 'fas fa-table',
            //     iconSRC: 'assets/img/BRSR.svg',
            //     path: ['financeDash']
            // },
            {
                head: 'GHG Emissions',
                name: 'Corporate Emissions',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/trees.png',
                path: ['tracking']
            },
            {
                name: 'Data Progress',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['dataProgress']
            },
            {
                head: 'Account Details',
                name: 'Company Profile',
                iconClasses: 'fas fa-eye',
                iconSRC: 'assets/img/building.svg',
                path: ['company-profile']
            },
            {
                name: 'Billing',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/biling_icon_211.png',
                path: ['billing']
            },
        ]
    },

    {
        role: 'Manager',
        haveMainGorup: 2,
        package_name: 'Comprehensive',
        items: [
            {
                head: 'Organisation Structure',
                children: [{
                    name: 'Tree',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/trees.png',
                    path: ['main_tree']
                },
                {
                    name: 'Add User',
                    iconClasses: 'fas fa-user-plus',
                    iconSRC: 'assets/img/user_121.png',
                    path: ['user']
                },
                {
                    name: 'Set GHG Template',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/tracking_icon.svg',
                    path: ['setGhgTemplate']
                }]
            },
            {
                head: 'Dashboard',
                children: [{
                    name: 'GHG Dashboard',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/dashboard.svg',
                    path: ['dashboard']
                },
                {
                    name: 'KPI Dashboard',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/dashboard.svg',
                    path: ['kpiDashboard']
                }]
            },
            {
                head: 'GHG Emissions',
                children: [{
                    name: 'Corporate Emissions',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/trees.png',
                    path: ['tracking']
                },
                {
                    name: 'Data Progress',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['dataProgress']
                },
                {
                    name: 'Emissions Inventory',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['kpi_inventory']
                },
                {
                    name: 'Cost Centre',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['cost_centre']
                }]
            },
            {
                head: 'Vendor',
                children: [{
                    name: 'Vendors',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['vendors']
                },
                {
                    name: 'Vendor Dashboard',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['vendorDashboard']
                }]
            },
            {
                head: 'Reporting',
                children: [{
                    name: 'Report',
                    iconClasses: 'fas fa-folder',
                    iconSRC: 'assets/img/report_icon.svg',
                    path: ['report']
                },
                {
                    name: 'BRSR',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['brsrReport']
                }]
            },
            {
                head: 'Target Setting',
                children: [{
                    name: 'Set Emission Inventory',
                    iconClasses: 'fas fa-folder',
                    iconSRC: 'assets/img/report_icon.svg',
                    path: ['setEmissionInventory']
                },
                {
                    name: 'Target Setting',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['targetSetting']
                },
                {
                    name: 'Actions',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['actions']
                }]
            },
            {
                head: 'Carbon offsetting',
                children: [{
                    name: 'Offset Entry',
                    iconClasses: 'fas fa-eye',
                    iconSRC: 'assets/img/building.svg',
                    path: ['carbonOffset']
                }]
            },
            {
                head: 'Account Details',
                children: [{
                    name: 'Company Profile',
                    iconClasses: 'fas fa-eye',
                    iconSRC: 'assets/img/building.svg',
                    path: ['company-profile']
                },
                {
                    name: 'Billing',
                    iconClasses: 'fas fa-folder',
                    iconSRC: 'assets/img/biling_icon_211.png',
                    path: ['billing']
                }]
            }
        ]
    },

    {
        role: 'Manager',
        haveMainGorup: 2,
        package_name: 'Intermediate',
        items: [
            {
                head: 'Organisation Structure',
                children: [{
                    name: 'Tree',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/trees.png',
                    path: ['main_tree']
                },
                {
                    name: 'Add User',
                    iconClasses: 'fas fa-user-plus',
                    iconSRC: 'assets/img/user_121.png',
                    path: ['user']
                },
                {
                    name: 'Set GHG Template',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/tracking_icon.svg',
                    path: ['setGhgTemplate']
                }]
            },
            {
                head: 'Dashboard',
                children: [{
                    name: 'GHG Dashboard',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/dashboard.svg',
                    path: ['dashboard']
                },
                {
                    name: 'KPI Dashboard',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/dashboard.svg',
                    path: ['kpiDashboard']
                }]
            },
            {
                head: 'GHG Emissions',
                children: [{
                    name: 'Corporate Emissions',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/trees.png',
                    path: ['tracking']
                },
                {
                    name: 'Data Progress',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['dataProgress']
                }]
            },
            {
                head: 'Reporting',
                children: [{
                    name: 'Report',
                    iconClasses: 'fas fa-folder',
                    iconSRC: 'assets/img/report_icon.svg',
                    path: ['report']
                },
                {
                    name: 'BRSR',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['brsrReport']
                }]
            },
            {
                head: 'Account Details',
                children: [{
                    name: 'Company Profile',
                    iconClasses: 'fas fa-eye',
                    iconSRC: 'assets/img/building.svg',
                    path: ['company-profile']
                },
                {
                    name: 'Billing',
                    iconClasses: 'fas fa-folder',
                    iconSRC: 'assets/img/biling_icon_211.png',
                    path: ['billing']
                }]
            }
        ]
    },

    {
        role: 'Manager',
        haveMainGorup: 2,
        package_name: 'Basic',
        items: [
            {
                head: 'Organisation Structure',
                children: [{
                    name: 'Tree',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/trees.png',
                    path: ['main_tree']
                },
                {
                    name: 'Add User',
                    iconClasses: 'fas fa-user-plus',
                    iconSRC: 'assets/img/user_121.png',
                    path: ['user']
                },
                {
                    name: 'Set GHG Template',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/tracking_icon.svg',
                    path: ['setGhgTemplate']
                }]
            },
            {
                head: 'Dashboard',
                children: [{
                    name: 'GHG Dashboard',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/dashboard.svg',
                    path: ['dashboard']
                },
                {
                    name: 'KPI Dashboard',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/dashboard.svg',
                    path: ['kpiDashboard']
                }]
            },
            {
                head: 'GHG Emissions',
                children: [{
                    name: 'Corporate Emissions',
                    iconClasses: 'fas fa-star',
                    iconSRC: 'assets/img/trees.png',
                    path: ['tracking']
                },
                {
                    name: 'Data Progress',
                    iconClasses: 'fas fa-table',
                    iconSRC: 'assets/img/BRSR.svg',
                    path: ['dataProgress']
                }]
            },
            {
                head: 'Account Details',
                children: [{
                    name: 'Company Profile',
                    iconClasses: 'fas fa-eye',
                    iconSRC: 'assets/img/building.svg',
                    path: ['company-profile']
                },
                {
                    name: 'Billing',
                    iconClasses: 'fas fa-folder',
                    iconSRC: 'assets/img/biling_icon_211.png',
                    path: ['billing']
                }]
            }
        ]
    },

    {
        role: 'Preparer',
        haveMainGorup: 2,
        package_name: 'Comprehensive',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    },
                    {
                        name: 'KPI Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['kpiDashboard']
                    }
                ]
            },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    },
                    {
                        name: 'Emissions Inventory',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['kpi_inventory']
                    },
                    {
                        name: 'Cost Centre',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['cost_centre']
                    }
                ]
            },
            {
                head: 'Vendor',
                children: [
                    {
                        name: 'Vendors',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['vendors']
                    },
                    {
                        name: 'Vendor Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['vendorDashboard']
                    }
                ]
            },
            {
                head: 'Reporting ',
                children: [
                    {
                        name: 'Report',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['report']
                    },
                    {
                        name: 'BRSR',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['brsrReport']
                    }
                ]
            },
            {
                head: 'Target Setting',
                children: [
                    {
                        name: 'Set Emission Inventory',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['setEmissionInventory']
                    },
                    {
                        name: 'Target Setting',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['targetSetting']
                    },
                    {
                        name: 'Actions',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['actions']
                    }
                ]
            },
            {
                head: 'Carbon offsetting',
                children: [
                    {
                        name: 'Offset Entry',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['carbonOffset']
                    }
                ]
            },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            }
        ]
    },

    {
        role: 'Preparer',
        haveMainGorup: 2,
        package_name: 'Intermediate',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    }
                ]
            },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    }
                ]
            },
            {
                head: 'Reporting ',
                children: [
                    {
                        name: 'Report',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/report_icon.svg',
                        path: ['report']
                    },
                    {
                        name: 'BRSR',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['brsrReport']
                    }
                ]
            },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            }
        ]
    },

    {
        role: 'Preparer',
        haveMainGorup: 2,
        package_name: 'Basic',
        items: [
            {
                head: 'Organisation Structure',
                children: [
                    {
                        name: 'Tree',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['main_tree']
                    },
                    {
                        name: 'Add User',
                        iconClasses: 'fas fa-user-plus',
                        iconSRC: 'assets/img/user_121.png',
                        path: ['user']
                    },
                    {
                        name: 'Set GHG Template',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/tracking_icon.svg',
                        path: ['setGhgTemplate']
                    }
                ]
            },
            {
                head: 'Dashboard',
                children: [
                    {
                        name: 'GHG Dashboard',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/dashboard.svg',
                        path: ['dashboard']
                    }
                ]
            },
            {
                head: 'GHG Emissions',
                children: [
                    {
                        name: 'Corporate Emissions',
                        iconClasses: 'fas fa-star',
                        iconSRC: 'assets/img/trees.png',
                        path: ['tracking']
                    },
                    {
                        name: 'Data Progress',
                        iconClasses: 'fas fa-table',
                        iconSRC: 'assets/img/BRSR.svg',
                        path: ['dataProgress']
                    }
                ]
            },
            {
                head: 'Account Details',
                children: [
                    {
                        name: 'Company Profile',
                        iconClasses: 'fas fa-eye',
                        iconSRC: 'assets/img/building.svg',
                        path: ['company-profile']
                    },
                    {
                        name: 'Billing',
                        iconClasses: 'fas fa-folder',
                        iconSRC: 'assets/img/biling_icon_211.png',
                        path: ['billing']
                    }
                ]
            }
        ]
    }
];
