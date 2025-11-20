
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { ManageDataPointSubCategories } from '@/models/TrackingDataPointSubCategories';

import { LoginInfo } from '@/models/loginInfo';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild, computed, effect } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import { Table } from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TabView } from 'primeng/tabview';
import { GroupService } from '@services/group.service';
import { OrderDownlineTreeviewEventParser, TreeviewConfig, TreeviewEventParser, TreeviewItem } from '@treeview/ngx-treeview';
import { AppService } from '@services/app.service';
declare let $: any;
import { NgxSpinnerService } from 'ngx-spinner';


import {

    ComponentRef,
    ViewContainerRef,
    inject
} from '@angular/core';

import { loadComponentByCategoryId } from './component-mapping';
@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss'],
    providers: [
        { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }
    ]
})
export class TrackingComponent {
    dataEntriesPending: any[] = [];
    businessId;
    monthString: string;
    selectedScopeId: number = 1;
    categoryId: number;
    convertedYear: string;
    public isVisited = false;
    haveBasicPackage: number = 0;
    @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
    dynamicContent!: ViewContainerRef;
    selectMonths: any[] = [];
    isInputEdited: boolean;
    forGroup = 'none';
    facilityhavedp = 'none';
    facilitynothavedp = 'flex';
    private componentRef: ComponentRef<any> | null = null;
    accordianIndex = 0;
    facilityCountryCode: any;
    dynamicComponent: any = null;
    items: any[] = [];
    activeID: any
    activeindex: number = 0;
    month: Date;
    year: any;
    facilityID;
    subCatID;
    batchId: any;
    superAdminID: any;
    categoryName: string;
    public loginInfo: LoginInfo;
    AssignedDataPoint: TrackingDataPoint[] = [];
    loading = false;

    todayDate;
    SubCatAllData: ManageDataPointSubCategories;
    id_var: any;
    isDropdownDisabled: boolean = false;
    APIURL: string = environment.baseUrl;
    @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
    @ViewChild('tabView') dataentryTab: TabView;
    @ViewChild('commuteTable') commuteTable: ElementRef;
    @ViewChild('dt1') dt!: Table;

    filteredStatus: any; // Variable to store the selected status
    public statusFilter: string;
    public yearFilter: number;
    visible: boolean;
    defaulttab: string;
    months: any[] = [
        { name: 'Jan', value: 'Jan' },
        { name: 'Feb', value: 'Feb' },
        { name: 'Mar', value: 'Mar' },
        { name: 'Apr', value: 'Apr' },
        { name: 'May', value: 'May' },
        { name: 'June', value: 'Jun' },
        { name: 'July', value: 'Jul' },
        { name: 'Aug', value: 'Aug' },
        { name: 'Sep', value: 'Sep' },
        { name: 'Oct', value: 'Oct' },
        { name: 'Nov', value: 'Nov' },
        { name: 'Dec', value: 'Dec' }
    ];

    scope3OrderCategories = [
        { index: 0, name: 'Purchased goods and services' },
        { index: 1, name: 'Fuel and Energy-related Activities' },
        { index: 2, name: 'Upstream Transportation and Distribution' },
        { index: 3, name: 'Water Supply and Treatment' },
        { index: 4, name: 'Waste generated in operations' },
        { index: 5, name: 'Business Travel' },
        { index: 6, name: 'Employee Commuting' },
        { index: 7, name: 'Home Office' },
        { index: 8, name: 'Upstream Leased Assets' },
        { index: 9, name: 'Downstream Transportation and Distribution' },
        { index: 10, name: 'Processing of Sold Products' },
        { index: 11, name: 'Use of Sold Products' },
        { index: 12, name: 'End-of-Life Treatment of Sold Products' },
        { index: 13, name: 'Downstream Leased Assets' },
        { index: 14, name: 'Franchises' }

    ]
    computedFacilities = computed(() => {
        return this.facilityService.selectedfacilitiesSignal()
    })
    // this.facilityService.headerTracking.set(true);


    constructor(
        private messageService: MessageService,
        private facilityService: FacilityService,
        private trackingService: TrackingService,
        private notification: NotificationService,
        private appService: AppService,
    ) {
        const storedYear = sessionStorage.getItem('selected_year');
        if (storedYear) {
            // Create a new Date object using the stored year
            this.year = new Date(Number(storedYear), 0); // January of the stored year
        } else {
            this.year = new Date();
        }
        effect(() => {
            if (this.computedFacilities() != 0) {
                this.GetAssignedDataPoint(this.computedFacilities())
                this.facilityID = this.computedFacilities();
                this.facilityCountryCode = this.facilityService.countryCodeSignal();

            }
        });

        this.SubCatAllData = new ManageDataPointSubCategories();
        this.AssignedDataPoint = [];
        this.loginInfo = new LoginInfo();
        this.month = new Date();
        this.isInputEdited = false;

    }



    ngOnInit() {
        // this.config = {
        //     hasAllCheckBox: true,
        //     hasFilter: true, // Enable the filter
        //     hasCollapseExpand: false,
        //     decoupleChildFromParent: false,
        //     maxHeight: 500
        // };
        this.appService.data$.subscribe(data => {
            this.isDropdownDisabled = data;
        });

        $(document).ready(() => {
            $('.ct_custom_dropdown').click(() => {

                $('.ct_custom_dropdown').toggleClass('ct_open_modal')
            })
        })
        if (localStorage.getItem('LoginInfo') !== null) {
            const userInfo = localStorage.getItem('LoginInfo');
            const jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.haveBasicPackage = this.loginInfo.package_id
        }
        this.superAdminID = this.loginInfo.super_admin_id;
        this.setDefaultMonth();
    }

    GetAssignedDataPoint(facilityID: number) {
        if (facilityID == 0) {
            return
        } else {

            this.AssignedDataPoint = [];
            this.SubCatAllData = new ManageDataPointSubCategories();
            this.trackingService
                .newgetSavedDataPointforTracking(facilityID)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.facilityhavedp = environment.none;
                            this.facilitynothavedp = environment.flex;
                            this.forGroup = environment.none;
                        } else {

                            this.AssignedDataPoint = (response.categories).sort((a: any, b: any) => a.ScopeID - b.ScopeID);

                            const isSubcategoryEmptyForAllCategories =

                                (response.categories).every((scope) => {
                                    scope.manageDataPointCategories.every(
                                        (category) =>
                                            category.manageDataPointSubCategories
                                                .length === 0
                                    );
                                })

                            if (isSubcategoryEmptyForAllCategories === true) {
                                this.facilityhavedp = environment.none;
                                this.facilitynothavedp = environment.flex;
                                this.forGroup = environment.none;
                            } else {

                                this.facilitynothavedp = environment.none;
                                this.forGroup = environment.none;
                                this.facilityhavedp = environment.block;
                            }

                            // here we are ordering the scope categories dont delete it
                            const findIndexScope3 = this.AssignedDataPoint.findIndex(item => item.ScopeID === 3);

                            if (findIndexScope3 !== -1) {
                                const tempArr = []
                                for (let index = 0; index < this.scope3OrderCategories.length; index += 1) {


                                    const findCategory = this.AssignedDataPoint[findIndexScope3].manageDataPointCategories.find(items => items.catName == this.scope3OrderCategories[index].name)
                                    if (findCategory) {
                                        findCategory['catIndex'] = index
                                        tempArr.push(findCategory)
                                    }
                                }

                                this.AssignedDataPoint[findIndexScope3].manageDataPointCategories = [...tempArr]

                            }

                            const categoryId = this.AssignedDataPoint[0].manageDataPointCategories[0].manageDataPointCategorySeedID;
                            this.categoryId = categoryId;
                            const child = this.AssignedDataPoint[0].manageDataPointCategories[0].manageDataPointSubCategories[0];
                            const catName = this.AssignedDataPoint[0].manageDataPointCategories[0].catName;
                            if (categoryId === 13) {
                                this.SubCatData(child, categoryId, catName, 24);
                            } else {
                                this.SubCatData(child, categoryId, catName);
                            }

                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
    }




    showDialog() {
        this.visible = true;
    };




    defaultData() {
        for (const cat of this.AssignedDataPoint[0].manageDataPointCategories) {
            this.categoryId = cat.manageDataPointCategorySeedID;
            this.SubCatAllData = cat.manageDataPointSubCategories[0];
            this.id_var = this.SubCatAllData.id;
            break;
        }
    }

    async SubCatData(child: any, categoryID: number, catName: string, businessId?: number) {
        this.categoryName = catName
        this.activeID = child.manageDataPointSubCategorySeedID
        const year = this.trackingService.getYear(this.year);
        this.categoryId = categoryID;
        this.ALLEntries();
        this.facilityService.categoryId.set(categoryID);
        this.facilityService.subCategoryId.set(child.manageDataPointSubCategorySeedID);
        this.facilityService.yearSignal.set(year.toString());
        const monthString = JSON.stringify(this.selectMonths.map(m => m.value));
        this.facilityService.monthSignal.set(monthString);
        try {
            this.dynamicComponent = await loadComponentByCategoryId(categoryID, businessId);
        } catch (err) {
            console.warn(err);
            this.dynamicComponent = null;
        }


    }




    setActive(index: number, child: any, categoryID: number, catName: string): void {
        this.categoryId = 13;
        this.businessId = index;
        this.ALLEntries();
        this.SubCatData(child, categoryID, catName, this.businessId);
    }

    ToggleClick() {
        this.isVisited = true;
    }
    ALLEntries() {
        this.loading = true;
        this.dataEntriesPending = [];
        if (this.categoryId == 25 || this.categoryId == 26 || this.categoryId == 24) {
            const categoryID = 13
            const formData = new URLSearchParams();
            this.convertedYear = this.trackingService.getYear(this.year);
            formData.set('year', this.convertedYear.toString())
            formData.set('facilities', this.facilityID.toString())
            formData.set('categoryID', categoryID.toString())


            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            if (this.businessId == 24 && this.categoryId == 13) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                            } else if (this.businessId == 25 && this.categoryId == 13) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                            } else if (this.businessId == 26 && this.categoryId == 13) {

                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                            } else {

                                this.dataEntriesPending = response.categories;
                            }
                        }
                        this.loading = false;
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
            return
        }

        if (this.facilityID == 0) {
            this.notification.showInfo(
                'Select Facility',
                ''
            );
            return
        }
        if (this.categoryId == 9) {
            const formData = new URLSearchParams();
            this.convertedYear = this.trackingService.getYear(this.year);
            formData.set('year', this.convertedYear.toString())
            formData.set('facilities', this.facilityID.toString())
            formData.set('categoryID', this.categoryId.toString())
            this.trackingService
                .newgetSCpendingDataEntriesForFuels(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            const filterEntries = response.categories.filter((items => items.Scope3GHGEmission !== '0.000'));
                            this.dataEntriesPending = filterEntries;
                        }
                        this.loading = false;
                    },
                    error: (err) => {
                        this.notification.showError('Operation failed', 'Error');
                    }
                });
            return
        }


        const formData = new URLSearchParams();
        this.convertedYear = this.trackingService.getYear(this.year);
        formData.set('year', this.convertedYear.toString())
        formData.set('facilities', this.facilityID.toString())
        formData.set('categoryID', this.categoryId.toString())


        this.trackingService
            .newgetSCpendingDataEntries(formData)
            .subscribe({
                next: (response) => {
                    if (response.success === false) {
                        this.dataEntriesPending = null;
                    } else {
                        if (this.businessId == 24 && this.categoryId == 13) {
                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                        } else if (this.businessId == 25 && this.categoryId == 13) {
                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                        } else if (this.businessId == 26 && this.categoryId == 13) {

                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                        } else {

                            this.dataEntriesPending = response.categories;
                        }
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.loading = false;
                    this.notification.showError('Operation failed', 'Error');
                }
            });
    }

    setDefaultMonth() {
        this.monthString = this.trackingService.getMonthName(this.month);
        this.months.forEach(m => {
            if (m.name == this.monthString) {
                this.selectMonths[0] = m;
            }

        })
    }

    onMonthsChange(event: any) {
        const monthString = JSON.stringify(this.selectMonths.map(m => m.value));
        this.facilityService.monthSignal.set(monthString);

    }



    onYearChange() {
        const year = this.trackingService.getYear(this.year);
        this.facilityService.yearSignal.set(year.toString());
        sessionStorage.setItem('selected_year', year.toString());
        this.ALLEntries();
    }

    onTabChange(event: any) {
        const index = event.index

        if (index != 0) { // index of Status tab
            this.ALLEntries();
        }
    }



}
