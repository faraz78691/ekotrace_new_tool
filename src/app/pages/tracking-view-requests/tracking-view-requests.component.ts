import { DataEntry } from '@/models/DataEntry';
import { PendingDataEntries } from '@/models/PendingDataEntry';
import { SendNotification } from '@/models/SendNotification';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { TrackingTable } from '@/models/TrackingTable';
import { ViewrequestTable } from '@/models/ViewrequestTable';
import { LoginInfo } from '@/models/loginInfo';
import { months } from '@/models/months';
import { Component, computed, effect, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { ManageDataPointCategories } from '@/models/TrackingDataPointCategories';
import { ManageDataPointCategory } from '@/models/ManageDataPointCategory';
import { StationaryCombustionDE, selectedObjectEntry } from '@/models/StationaryCombustionDE';
import { RefrigerantsDE } from '@/models/RefrigerantsDE';
import { FireExtinguisherDE } from '@/models/FireExtinguisherDE';
import { VehicleDE } from '@/models/VehicleDE';
import { ElectricityDE } from '@/models/ElectricityDE';
import { HeatandSteamDE } from '@/models/HeatandSteamDE';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { stat } from 'fs';

@Component({
    selector: 'app-tracking-view-requests',
    templateUrl: './tracking-view-requests.component.html',
    styleUrls: ['./tracking-view-requests.component.scss']
})

export class TrackingViewRequestsComponent {
    @ViewChild('dt') dt!: Table;
    allSelected: boolean = false;
    status: ViewrequestTable[];
    facilityID;
    flag;
    modeShow = false;

    dataEntriesPending: PendingDataEntries[] = [];
    selectedEntry: PendingDataEntries[] = [];
    selectedScEntry: StationaryCombustionDE;
    selectedObjectEntry: selectedObjectEntry;
    selectedSendEntry: any[] = [];

    sendEntries: DataEntry[] = [];
    sendSCEntries: StationaryCombustionDE[] = [];
    sendApprovalEntries: any[] = [];

    public loginInfo: LoginInfo;
    Approver = environment.Approver;
    Preparer = environment.Preparer;
    Admin = environment.Admin;
    SuperAdmin = environment.SuperAdmin;
    Manager = environment.Manager;

    Pending = environment.pending;
    Rejected = environment.rejected;
    Approved = environment.approved;

    visible: boolean = false;
    reason: string;
    issended: boolean = false;
    year: any;
    convertedYear: string;
    filteredStatus: any;
    months: months;
    sortField: string = ''; // Initialize sortField property
    globalFilterValue: string;
    clonedProducts: { [n: string]: PendingDataEntries } = {};
    filterDropdownVisible: boolean;
    yearOptions: any[] = [];
    selectedCategory: any;
    AllCategory: ManageDataPointCategory[] = [];
    BusinessEntires: any[] = [];
    dataEntry: any;
    display = 'none';
    display2 = 'none';
    Modes: any[] = [];
    selectMode: number = 1;
    action = 'approve';
    indexPage = 0
    rows = 10
    computedFacilities = computed(() => {
        return this.facilityService.selectedfacilitiesSignal();
    });
    loading = true;
    columns: any[] = [];
    isCategoryChanged = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trackingService: TrackingService,
        private notification: NotificationService,
        private toastr: ToastrService, private appService: AppService,
        private facilityService: FacilityService,
    ) {
        const storedYear = sessionStorage.getItem('selected_year');
        if (storedYear) {
            // Create a new Date object using the stored year
            this.year = new Date(Number(storedYear), 0); // January of the stored year
        } else {
            this.year = new Date();
        }
        effect(() => {
            // this.year = this.facilityService.yearSignal();
            if (this.computedFacilities() != 0) {
                this.facilityID = this.computedFacilities();
                this.ALLEntries(this.facilityID);
            }
        });

        this.Modes =
            [

                {
                    "id": 1,
                    "modeType": "Flight"
                },
                {
                    "id": 2,
                    "modeType": "Hotel Stay"
                },
                {
                    "id": 3,
                    "modeType": "Other Modes"
                }

            ];
        this.reason = '';

        this.months = new months();
        this.globalFilterValue = '';
        this.AllCategory = [];
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 20;

        this.yearOptions.push({ label: 'All', value: null });

        for (let year = startYear; year <= currentYear; year++) {
            this.yearOptions.push({ label: year.toString(), value: year });
        }
    }
    statusOptions: any[] = [
        { label: 'All', value: null },
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];
    buttonOptions: any[] = [

        { label: "Approve selected 'Pending' ", value: 'approve' },
        { label: "Reject selected 'Pending' ", value: 'reject' },
        { label: "Delete selected 'Approved' ", value: 'delete' },
    ];
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.route.queryParams.subscribe((params) => {
                this.facilityID = params['data']; // Access the passed data parameter
                this.getCat();
                // Use the data as needed

            });
        }



    };


    getAllDataentries(facilityID: any) {
        //this.getAllDataentries()
    }
    showDialog() {
        this.visible = true;
    };

    onUpdateUserStatus(data: any) {
        this.dataEntry = '';
        this.display = 'block';
        this.dataEntry = data
    };

    deleteAllPopUp() {

        this.display2 = 'block';
    };

    onPageChange(event) {
        this.indexPage = event.first;
        this.rows = event.rows;
    }

    onClose2() {
        this.dataEntry = '';
        this.display = 'none';
        this.display2 = 'none';
    };

    sendEntires(type: any) {

        let url = '';
        if (type == 'delete') {
            url = '/deleteAllEntry'
        } else if (type == 'approve') {
            url = '/UpdateelecEntry'
        } else if (type == 'reject') {
            url = '/rejectAllEntry'
        }

        if (this.loginInfo.role == 'Auditor') {
            this.notification.showWarning('You are not Authorized', 'Warning');
            return
        }
        if (this.loginInfo.role == 'Preparer') {
            this.notification.showWarning(
                'You are not Authorized to approve entry',
                'Warning'
            );
            return false
        }
        if (this.selectedEntry.length === 0) {
            this.notification.showWarning('Please select any entry', 'Warning');
            return
        }
        if (this.selectedEntry[0].ID == undefined || this.selectedEntry[0].ID == null) {
            this.sendApprovalEntries = [];
            this.sendSCEntries = [];
            let status = '';
            this.selectedEntry.forEach((element) => {
                if (type == 'delete') {
                    status = 'Approved';
                } else if (type == 'approve') {
                    status = 'Pending';
                } else if (type == 'reject') {
                    status = 'Pending';
                }
                if (element.status === status) {
                    const selectedObject = {
                        id: element.id,
                        categoryID: element.categoryID,
                        tablename: element.tablename
                    };
                    this.sendApprovalEntries.push(selectedObject);
                }
            });
        } else {
            console.log(this.selectedEntry);
            this.sendSCEntries = [];

            this.sendApprovalEntries = [];
            let status = '';
            this.selectedEntry.forEach((element) => {
                if (type == 'delete') {
                    status = 'Approved';
                } else if (type == 'approve') {
                    status = 'Pending';
                } else if (type == 'reject') {
                    status = 'Pending';
                }
                if (element.status === status) {
                    const selectedObject = {
                        id: element.ID,
                        categoryID: element.categoryID,
                        tablename: element.tablename
                    };
                    this.sendApprovalEntries.push(selectedObject);
                }
            });
        }

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', this.selectedEntry[0].categoryID.toString());

        this.appService.postAPI(url, formURlData).subscribe({
            next: (response: any) => {

                if (response.success == true) {
                    this.notification.showSuccess(
                        response.message,
                        'Success'
                    );
                    this.ALLEntries(this.facilityID);
                    this.onClose2()
                    var recipient = environment.Approver;
                    var message = environment.SendEntryMessage;
                    var count = this.sendEntries.length;

                    this.sendApprovalEntries = [];
                    this.selectedEntry = [];
                    this.allSelected = false;
                } else {
                    this.notification.showError(
                        response.message,
                        ''
                    );
                    this.ALLEntries(this.facilityID);
                    this.onClose2()
                    var recipient = environment.Approver;
                    var message = environment.SendEntryMessage;
                    var count = this.sendEntries.length;

                    this.sendApprovalEntries = [];
                    this.selectedEntry = [];
                    this.allSelected = false;
                }
            },
            error: (err) => {
                this.notification.showError(
                    'Entries sent failed.',
                    'Error'
                );
                console.error('errrrrrr>>>>>>', err);
            }
        });


    };

    ALLEntries(facilityID: number) {
        
        this.loading = true;

        this.modeShow = false;
        this.months = new months();
        // this.convertedYear = this.trackingService.getYear(this.year);
        const formData = new URLSearchParams();
        formData.set('year', this.year.getFullYear().toString());
        formData.set('facilities', facilityID.toString());
        formData.set('categoryID', this.selectedCategory);
        if (this.selectedCategory != 13) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = [];
                        } else {
                            // this.dataEntriesPending = [];
                            this.dataEntriesPending = response.categories;
                            this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
                        }
                        if (this.isCategoryChanged == true) {
                            setTimeout(() => {
                                this.dt.first = 0
                                this.isCategoryChanged = false
                            });
                        } else {
                            setTimeout(() => {
                                this.dt.first = this.indexPage
                            });
                        }
                        this.loading = false;
                    },
                    error: (err) => {
                        this.loading = false;
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }

        if (this.selectedCategory == 13) {
            this.modeShow = true;
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = [];
                        } else {
                            this.BusinessEntires = response.categories
                            if (this.selectMode == 1) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                                this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
                            } else if (this.selectMode == 2) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                                this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
                            } else if (this.selectMode == 3) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                                this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
                            } else {
                                this.dataEntriesPending = response.categories;
                                this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
                            }
                        }
                        this.loading = false;

                    },
                    error: (err) => {
                        this.loading = false;
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }

    };



    AcceptSingleEntry() {
        if (this.loginInfo.role == 'Preparer') {
            this.notification.showWarning(
                'You are not authorized to approve entry',
                'Warning'
            );
            return false
        }
        const entry = this.dataEntry;
        this.sendApprovalEntries = [];
        if (entry.ID == undefined || entry.ID == null) {
            this.selectedObjectEntry = {
                // Create a new object for each iteration
                id: entry.id,
                categoryID: entry.categoryID,
                tablename: entry.tablename
            };

        } else {
            this.selectedObjectEntry = {
                // Create a new object for each iteration
                id: entry.id,
                categoryID: entry.categoryID,
                tablename: entry.tablename
            };
        }
        this.sendApprovalEntries.push(this.selectedObjectEntry); // Add the new object to the sendEntries array

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', entry.categoryID);

        this.trackingService
            .newSendSCSingleDataforApprove(formURlData)
            .subscribe({
                next: (response) => {
                    // console.log(response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Entry Approved',
                            'Success'
                        );
                        this.ALLEntries(this.facilityID);
                        this.onClose2();
                        this.sendApprovalEntries = [];


                        this.selectedEntry = [];
                    } else {
                        this.notification.showWarning(
                            'Entry not Approved',
                            'Warning'
                        );
                        this.onClose2();
                    }
                    this.sendApprovalEntries = [];
                },
                error: (err) => {
                    this.notification.showError(
                        'Entry Approval Failed.',
                        'Error'
                    );
                    this.onClose2();
                    console.error('errrrrrr>>>>>>', err);
                }
            });

    };

    RejectSingleEntry() {
        const entry = this.dataEntry;

        this.sendApprovalEntries = [];

        this.selectedObjectEntry = {
            // Create a new object for each iteration
            id: entry.id,

            categoryID: entry.categoryID,
            tablename: entry.tablename,
            Reason: entry.reason
        };
        this.sendApprovalEntries.push(this.selectedObjectEntry); // Add the new object to the sendEntries array

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', entry.categoryID);


        this.trackingService
            .newSendDeleteSingleDataforApprove(formURlData)
            .subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Entry Rejected',
                            'Success'
                        );
                        this.ALLEntries(this.facilityID);
                        this.visible = false;

                        this.onClose2();

                        this.selectedEntry = [];
                        this.sendApprovalEntries = [];
                    } else {
                        this.notification.showWarning(
                            'Entry not Rejected',
                            'Warning'
                        );
                    }
                    this.sendApprovalEntries = [];
                },
                error: (err) => {
                    this.notification.showError(
                        'Entry Rejection Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        return

    };



    FilterByYear() {
        const year2 = this.trackingService.getYear(this.year);
        this.facilityService.yearSignal.set(year2.toString());
        sessionStorage.setItem('selected_year', year2.toString());
        this.ALLEntries(this.facilityID);

    }

    getCat() {
        this.trackingService.newgetCategory().subscribe({
            next: (response) => {

                // console.log(response);
                this.AllCategory = response;
                this.selectedCategory = this.AllCategory[0].id;

                if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                    // this.ALLEntries(this.loginInfo.facilityID);
                    this.ALLEntries(this.facilityID);

                } else {
                    this.ALLEntries(this.facilityID);
                }
            }
        })
    }
    getEntry() {
        this.isCategoryChanged = true;
        this.ALLEntries(this.facilityID);
    }



    getModesEntry() {
        if (this.selectMode == 1) {
            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'flight_travel');
            this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
        } else if (this.selectMode == 2) {
            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'hotel_stay');
            this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
        } else if (this.selectMode == 3) {
            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'other_modes_of_transport');
            this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
        } else {
            this.dataEntriesPending = this.dataEntriesPending;
            this.columns = this.getColumnsByCategory(this.selectedCategory, this.selectMode);
        }

    };


    sendAction(action: string) {
        console.log(action);
        if (action == 'approve') {
            this.sendEntires(action);
        } else if (action == 'reject') {
            this.sendEntires(action);
        } else {
            this.display2 = 'block';
        }
    };




    toggleSelectAll(event: any) {
        this.allSelected = event.target.checked;

        if (this.allSelected) {
            if (this.action === 'approve') {
                this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Pending');
            } else if (this.action === 'reject') {
                this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Pending');
            } else if (this.action == 'delete') {
                this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Approved');
            }
        } else {
            this.selectedEntry = [];
        }


    };


    changeHandler() {
        if (this.allSelected) {
            if (this.action === 'approve') {
                this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Pending');
            } else if (this.action === 'reject') {
                this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Pending');
            } else if (this.action == 'delete') {
                this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Approved');
            }
        }

    };


    getColumnsByCategory(categoryId: number, businessId?: number): { field: string; header: string }[] {
        switch (categoryId) {
            case 1:
                return [
                    { field: 'subcatName', header: 'Category' },
                    { field: 'TypeName', header: 'Fuel Type' },
                    { field: 'BlendType', header: 'Blend' },
                    { field: 'readingValue', header: 'Value' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' },
                ]
            case 2:
                return [

                    { field: 'TypeName', header: 'Refrigerant Type' },
                    { field: 'refAmount', header: 'Refrigerant Amount' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' },
                ]
            case 3:
                return [
                    { field: 'subcatName', header: 'Category' },
                    { field: 'numberOfExtinguisher', header: 'Extinguisher' },
                    { field: 'quantityOfCO2makeup', header: 'CO2 Makeup' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' },
                ]
            case 6:
                return [
                    { field: 'subcatName', header: 'Category' },
                    { field: 'TypeName', header: 'Vehicle Type' },
                    { field: 'vehicle_model', header: 'Vehicle Model' },
                    { field: 'NoOfVehicles', header: 'No of Vehicles' },
                    { field: 'TotalnoOftripsPerVehicle', header: 'Trips per vehicle' },
                    { field: 'ModeofDEID', header: 'Mode' },
                    { field: 'Value', header: 'Value' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'months', header: 'Month' },
                ]
            case 5:
                return [
                    { field: 'subcatName', header: 'Category' },
                    { field: '-', header: 'Type' },
                    { field: 'RegionName', header: 'Region Name' },
                    { field: 'readingValue', header: 'Value' },
                    { field: 'SourceName', header: 'Source' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' },
                ]
            case 7:
                return [
                    { field: 'typeName', header: 'Type' },
                    { field: 'readingValue', header: 'Value' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' },
                ]
            case 8:
                return [
                    { field: 'typeofpurchase', header: 'Category' },
                    { field: 'product_category_name', header: 'Product / Service' },
                    { field: 'productcode', header: 'Code' },
                    { field: 'valuequantity', header: 'Quantity' },
                    { field: 'supplier', header: 'Vendor' },
                    { field: 'supplierspecificEF', header: 'Vendor EF' },
                    { field: 'supplierunit', header: 'Vendor EF Unit' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' },

                ];
            case 9:
                return [
                    { field: 'typeofpurchase', header: 'Category' },
                    { field: 'typeofpurchase', header: 'Product / Service' },
                    { field: 'typeofpurchase', header: 'Code' },
                    { field: 'typeofpurchase', header: 'Quantity' },
                    { field: 'typeofpurchase', header: 'Product / Service' },
                    { field: 'typeofpurchase', header: 'Vendor' },
                    { field: 'typeofpurchase', header: 'Vendor EF' },
                    { field: 'typeofpurchase', header: 'Vendor EF Unit' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'unit', header: 'Month' },

                ];

            case 10:
            case 17:
                return [
                    { field: 'vehicle_type_name', header: 'Vehicle Type' },
                    { field: 'sub_category', header: 'Sub Category' },
                    { field: 'no_of_vehicles', header: 'No of Vehicles' },
                    { field: 'distance_travelled_km', header: 'Distance Travelled (Km)' },
                    { field: 'mass_of_product_trans', header: 'Mass of Product (tonnes)' },
                    { field: 'storage_facility_type', header: 'Storage Facility ' },
                    { field: 'area_occupied', header: 'Area occupied (sqm)' },
                    { field: 'avg_no_of_days', header: 'No of days storage' },
                    { field: 'month', header: 'Month' },
                ];

            case 11:
                return [
                    { field: 'water_withdrawn_value', header: 'Total Water Withdrawn' },
                    { field: 'water_discharged_value', header: 'Surface Water(%)' },
                    { field: 'withdrawn_emission_factor_used', header: 'Groundwater (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Third party (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Sea water / desalinated water (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Others (%)' },
                    { field: 'water_withdrawn_value', header: 'Total Water Discharged' },
                    { field: 'water_discharged_value', header: 'Surface Water(%)' },
                    { field: 'withdrawn_emission_factor_used', header: 'Groundwater (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Third party (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Sea water / desalinated water (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Others (%)' },
                    { field: 'water_withdrawn_value', header: 'Total Water Treated' },
                    { field: 'water_discharged_value', header: 'Surface Water(%)' },
                    { field: 'withdrawn_emission_factor_used', header: 'Treatment' },
                    { field: 'treatment_emission_factor_used', header: 'Groundwater (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Treatment' },
                    { field: 'treatment_emission_factor_used', header: 'Third party (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Treatment' },
                    { field: 'treatment_emission_factor_used', header: 'Sea water / desalinated water (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Treatment' },
                    { field: 'treatment_emission_factor_used', header: 'Others (%)' },
                    { field: 'treatment_emission_factor_used', header: 'Treatment' },
                    { field: 'unit', header: 'Month' },

                ];
            case 12:
                return [
                    { field: 'product', header: 'Category' },
                    { field: 'waste_type', header: 'Sub Category' },
                    { field: 'method', header: 'Method' },
                    { field: 'total_waste', header: 'Quantity' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' },
                ];
            case 13:
                switch (businessId) {
                    case 1:
                        return [
                            { field: 'flight_calc_mode', header: 'Flight Mode' },
                            { field: 'flight_Type', header: 'Flight Type' },
                            { field: 'flight_Class', header: 'Flight Class' },
                            { field: 'no_of_passengers', header: 'No of Trips/Passengers' },
                            { field: 'avg_distance', header: 'Distance Travelled' },
                            { field: 'return_Flight', header: 'Return Flight' },
                            { field: 'month', header: 'Month' },
                        ];

                    case 2:
                        return [
                            { field: 'country_of_stay', header: 'Country of Stay' },
                            { field: 'type_of_hotel', header: 'Type of Hotel' },
                            { field: 'no_of_occupied_rooms', header: 'No of Rooms' },
                            { field: 'no_of_nights_per_room', header: 'No of Nights per Room' },
                            { field: 'month', header: 'Month' },
                        ];

                    case 3:
                        return [
                            { field: 'mode_of_trasport', header: 'Mode of Transport' },
                            { field: 'no_of_trips', header: 'No of Trips' },
                            { field: 'no_of_passengers', header: 'No of Passengers' },
                            { field: 'distance_travelled', header: 'Distance Travelled (km)' },
                            { field: 'month', header: 'Month' },
                        ];

                    default:
                        return [];
                }
            case 14:
                return [
                    { field: 'combineVehicle', header: 'Type' },
                    { field: 'allemployeescommute', header: '% of Employee Commute' },
                    { field: 'avgcommutedistance', header: 'Average Commuted Distance (km)' },
                    { field: 'noofemployees', header: 'Total Employees' },
                    { field: 'workingdays', header: 'Working Days' },
                    { field: 'unit', header: 'Unit' }
                ];
            case 15:
                return [
                    { field: 'typeof_homeoffice_name', header: 'Type of Home Office' },
                    { field: 'noofemployees', header: 'Employee wfh' },
                    { field: 'noofdays', header: 'Days/ week wfh' },
                    { field: 'noofmonths', header: 'Months wfh' },
                    { field: 'unit', header: 'Unit' },
                ];

            case 16:
            case 21:
                return [
                    { field: 'category', header: 'Facility Type' },
                    { field: 'sub_category', header: 'Sub Category' },
                    { field: 'franchise_spaceLease', header: 'Franchise Space' },
                    { field: 'scope1_emission', header: 'Scope 1 (kg CO2e)' },
                    { field: 'scope2_emission', header: 'Scope 2 (kg CO2e)' },
                    { field: 'vehicle_type', header: 'Vehicle' },
                    { field: 'vehicle_subtype', header: 'Sub Category' },
                    { field: 'no_of_vehicles', header: 'No of Vehicles' },
                    { field: 'distance_travelled', header: 'Distance Travelled' },
                    { field: 'month', header: 'Month' },
                ];
            case 18:
                return [
                    { field: 'intermediate_category', header: 'Category' },
                    { field: 'processing_acitivity', header: 'Processing Activity' },
                    { field: 'sub_activity', header: 'Processing Sub Activity' },
                    { field: 'valueofsoldintermediate', header: 'Value' },
                    { field: 'calculation_method', header: 'Calculation Method' },
                    { field: 'scope1emissions', header: 'Scope 1 Emission (kg CO2e)' },
                    { field: 'scope2emissions', header: 'Scope 2 Emission (kg CO2e)' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' },
                ];
            case 19:
                return [
                    { field: 'type_name', header: 'Product Energy Use' },
                    { field: 'productcategory_name', header: 'Category' },
                    { field: 'no_of_Items', header: 'Quantity' },
                    { field: 'expectedlifetimeproduct', header: 'Expected Life' },
                    { field: 'electricity_use', header: 'Electricity Use' },
                    { field: 'fuel_type', header: 'Fuel Type' },
                    { field: 'referigentused', header: 'Fuel Used' },
                    { field: 'referigerantleakage', header: 'Refri. Leak' },
                    { field: 'no_of_Items_unit', header: 'Unit' },
                    { field: 'month', header: 'Month' }
                ];
            case 20:
                return [
                    { field: 'waste_type_name', header: 'Waste Type' },
                    { field: 'waste_type_name', header: 'Sub Category' },
                    { field: 'total_waste', header: 'Total Waste' },
                    { field: 'combustion', header: 'Combustion' },
                    { field: 'composing', header: 'Composing' },
                    { field: 'landfill', header: 'Landfill' },
                    { field: 'recycling', header: 'Recycling' },
                    { field: 'unit', header: 'Unit' },
                    { field: 'month', header: 'Month' }
                ];
            case 22:
                return [
                    { field: 'franchise_type', header: 'Type' },
                    { field: 'sub_category', header: 'Sub Category' },
                    { field: 'calculation_method', header: 'Calculation Method' },
                    { field: 'franchise_spaceLease', header: 'Franchise Space' },
                    { field: 'scope1_emission', header: 'Scope 1 (kg CO2e)' },
                    { field: 'scope2_emission', header: 'Scope 2 (kg CO2e)' },
                    { field: 'month', header: 'Month' }
                ];

        }
    }

}
