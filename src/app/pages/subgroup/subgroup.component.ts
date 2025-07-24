import { Facility } from '@/models/Facility';
import { ManageDataPoint1 } from '@/models/ManageDataPoint';
import { ManageDataPointCategory } from '@/models/ManageDataPointCategory';
import { UserInfo } from '@/models/UserInfo';
import { LoginInfo } from '@/models/loginInfo';
import { savedDataPoint } from '@/models/savedDataPoint';
import { SavedDataPointCategory } from '@/models/savedDataPointCategory';
import { SavedDataPointSubCategory } from '@/models/savedDataPointSubcategory';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { TrackingService } from '@services/tracking.service';

import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '@services/user.service';
@Component({
    selector: 'app-subgroup',
    templateUrl: './subgroup.component.html',
    styleUrls: ['./subgroup.component.scss']
})
export class SubgroupComponent {
    showDialog() {
        this.visible = true;
    }
    @ViewChild('addCompForm', { static: false }) addCompForm: NgForm;
    public loginInfo: LoginInfo;
    public userdetails: UserInfo;
    public savedDataPointCat: SavedDataPointCategory;
    public savedDataPointSubCat: SavedDataPointSubCategory;
    public admininfo: UserInfo;
    facilityDetails: any;
    Add_Editdisplay = 'none';
    deleteDialog = 'none';
    AddManageDataPoint = 'none';
    FacilityData = 'none';
    FacilityFullData = 'none';
    NoData = 'none';
    visible: boolean;
    DP_BoxVisible: boolean;
    dp_data_box: 'none';
    unlock: number = 0;
    Alert: boolean = false;
    id_var: any;
    isEdit: boolean;
    LocData: Facility[] = [];
    admininfoList = new Array<any>();
    public managerList: UserInfo[] = [];
    public staffList: UserInfo[] = [];
    dropCountManager = document.getElementsByClassName('dropItemManager');
    dropCountStaff = document.getElementsByClassName('dropItemStaff');
    facilityrefresh = true;
    items: MenuItem[];
    active: MenuItem;
    selectedValues: string[] = [];
    checked: boolean = false;
    value_tab = 'Scope 1';
    searchData;
    searchDataPoint: string;
    countryData: any[] = [];
    stateData: Location[] = [];
    cityData: Location[] = [];
    datapointCatagory: ManageDataPointCategory[] = [];
    selectedCountry: any;
    selectedState: any;
    selectedCity: any;
    // seedData: ManageDataPoint[] = [];
    seedData: any;
    scope1Category: any[] = [];
    scope2Category: any[] = [];
    scope3Category: any[] = [];
    savedData: savedDataPoint[] = [];
    public manageDataPoint1: ManageDataPoint1[] = [];
    public savedDataPoint: savedDataPoint[] = [];
    model2Data;
    catblank = true;
    updatedtheme: string;
    getfacilitystring: string;
    managerList1: any[] = [];
    staffList1: any[] = [];
    year: Date;
    groupedCities: any[];
    selectedCities4: any[];
    selectedScope1: any[] = [];
    selectedScope2: any[] = [];
    selectedScope3: any[] = [];
    standardList: any[] = [];
    originalData: any[] = [];

    constructor(
        private facilityService: FacilityService,
        private UserService: UserService,
        private notification: NotificationService,
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private themeservice: ThemeService,
        private trackingService: TrackingService,

    ) {
        this.standardList = [
            {
                name: 'Verra',
                value: 1
            },
            {
                name: 'Gold Standard (GS)',
                value: 2
            },
            {
                name: 'Clean Development Mechanism (CDM)',
                value: 3
            },
            {
                name: 'American Carbon Standard (ACR)',
                value: 4
            },
            {
                name: 'Climate Action Reserve (CAR)',
                value: 5
            },
            {
                name: 'Others',
                value: 6
            }
        ];
        this.selectedCountry = 'Gold Standard (GS)'
        this.facilityDetails = new Facility();
        this.loginInfo = new LoginInfo();
        this.admininfo = new UserInfo();
        this.userdetails = new UserInfo();
        this.savedDataPointCat = new SavedDataPointCategory();
        this.savedDataPointSubCat = new SavedDataPointSubCategory();
        this.year = new Date();
    }
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
        }
        let tenantID = this.loginInfo.tenantID;
        if (this.loginInfo.role == 'Super Admin' || this.loginInfo.role == 'Admin' || this.loginInfo.role == 'Auditor') {

            this.subGroupGet(tenantID);

        } else {
            this.FacilityData = 'block';

            this.NoData = 'none';
        }

        this.items = [
            {
                label: 'Scope 1',
                command: (event) => {
                    this.value_tab = event.item.label;
                }
            },
            {
                label: 'Scope 2',
                command: (event) => {
                    this.value_tab = event.item.label;
                }
            },
            {
                label: 'Scope 3',
                command: (event) => {
                    this.value_tab = event.item.label;
                }
            }
        ];
        this.active = this.items[0];
        this.updatedtheme = this.themeservice.getValue('theme');
        this.AllCountry();
    }




    //method for update a facility by id
    editfacility(id: any, data: NgForm) {
        if (this.loginInfo.role == 'Auditor') {
            this.notification.showInfo('You are not Authorized', '');
            return
        }

        let tenantId = this.loginInfo.tenantID;
        let formdata = new URLSearchParams();

        formdata.set('group_id', (this.facilityDetails.id).toString())
        formdata.set('country_id', this.facilityDetails.country_id.toString());

        this.facilityService
            .AssignCountrySubGroup(formdata.toString())
            .subscribe({
                next: (response) => {
                    this.subGroupGet(tenantId);

                    this.visible = false;
                    this.facilityrefresh = false;
                    this.notification.showSuccess(
                        'Country updated successfully',
                        'Success'
                    );
                },
                error: (err) => {
                    this.notification.showError(
                        'failed.',
                        'Error'
                    );
                    console.error(err);
                },
                complete: () => console.info('Facility edited')
            });
    }
    //Retrieves facility data for the specified tenant ID and updates the UI based on the data availability.
    subGroupGet(tenantId) {
        let formdata = new URLSearchParams();

        formdata.set('tenantID', tenantId.toString())
        this.facilityService.getActualSubGroups(formdata).subscribe({
            next: (response: any) => {
                this.originalData = response.categories.reverse();
                this.LocData = response.categories.reverse();
                this.facilityDetails = this.LocData[0];
                this.managerList1 = [];
                this.staffList1 = [];

                this.facilityDetails.userInfoModels.forEach(user => {
                    this.managerList1.push({
                        firstname: user.firstname,
                        lastname: user.lastname
                    });
                });


                if (this.LocData.length == 0) {

                    this.NoData = 'block';
                    this.FacilityData = 'none';
                    this.FacilityFullData = 'none';
                } else {

                    this.FacilityData = 'block';
                    this.FacilityFullData = 'flex';
                    this.NoData = 'none';
                }
                // if (this.facilityrefresh == true) 
                this.defaultData();
                localStorage.setItem('FacilityCount', String(this.LocData.length));
            }, error: err => {
                console.log(err)
            }
        })


    };

    //retrieves users associated with the facility

    tableData(data: any) {
        this.managerList1 = []
        this.id_var = data.id;
        this.getSUbGrupsDetails(data);
    }

    defaultData() {
        this.id_var = this.LocData[0].id;
        let tenantId = this.loginInfo.tenantID;
        this.facilityDetails = this.LocData[0];

    }

    //delete a facility by id


    //Retrieves the users associated with a specific facility and updates the lists of managers and staff members.
    getSUbGrupsDetails(data) {
        this.facilityDetails = data;

        this.facilityDetails.userInfoModels.forEach(user => {
            this.managerList1.push({
                firstname: user.firstname,
                lastname: user.lastname
            });
        });
    };
    //display a dialog for adding a facility
    showAddFacilityDialog() {
        this.visible = true;

        this.facilityDetails = new Facility();

        this.isEdit = false;
        // this.resetForm();
    }
    //display a dialog for editing a facility
    showEditFacilityDialog() {
        this.visible = true;
        this.isEdit = true;

        // this.searchState();
        // this.searchCity()
    }
    //handles the closing of Add facility dialog
    closeAddFacilityDialog() {
        this.visible = false;
        this.defaultData();
    }
    //handles the closing of edit facility dialog
    closeEditFacilityDialog() {
        this.visible = false;
    }
    //display a dialog for manage datapoint

    //handles the closing of datapoint dialog
    closeDp_Dialog() {
        this.DP_BoxVisible = false;
    }

    sendValue(value: any) {
        this.value_tab = value;
    }
    //method for retrieve all country name
    AllCountry() {

        this.facilityService.GetCountry().subscribe({
            next: (response) => {

                this.countryData = response;

                // this.facilityDetails.CountryId = 2

            },
            error: err => {
                console.log(err)
            }
        });
    }

    updateActiveState(manageDataPointSubCategories: any, event: any) {
        manageDataPointSubCategories.active =
            !manageDataPointSubCategories.active;
    };
    //method for get all the seed data


    onMultiSelectChange(event: { originalEvent: Event, value: any }) {
        this.selectedScope1
    }

    onInputSearch(value: string) {
        const search = value?.trim().toLowerCase() || '';
        if (!search) {
            this.LocData = this.originalData;
        } else {
            this.LocData = this.originalData.filter(item =>
                (item.name || '').toLowerCase().includes(search)
            );
        }
    }
}
