import { BlendType } from '@/models/BlendType';
import { DataEntry } from '@/models/DataEntry';
import { DataEntrySetting } from '@/models/DataEntrySettings';
import { ElectricityDE } from '@/models/ElectricityDE';
import { ElectricityGrid } from '@/models/ElectricityGrid';
import { ElectricitySource } from '@/models/ElectricitySource';
import { EmissionFactor } from '@/models/EmissionFactorALL';
import { EmissionFactorTable } from '@/models/EmissionFactorTable';
import { Facility } from '@/models/Facility';
import { FireExtinguisherDE } from '@/models/FireExtinguisherDE';
import { HeatandSteamDE } from '@/models/HeatandSteamDE';
import { RefrigerantsDE } from '@/models/RefrigerantsDE';
import { StationaryCombustionDE } from '@/models/StationaryCombustionDE';
import { SubCategoryTypes } from '@/models/SubCategoryType';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { ManageDataPointSubCategories } from '@/models/TrackingDataPointSubCategories';
import { TrackingTable } from '@/models/TrackingTable';
import { Units } from '@/models/Units';
import { VehicleDE } from '@/models/VehicleDE';
import { VehicleDEmode } from '@/models/VehicleDEmode';
import { VehicleType } from '@/models/VehicleType';
import { LoginInfo } from '@/models/loginInfo';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import { Table } from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { TabView } from 'primeng/tabview';
import { countries } from '@/store/countrieslist';
import { GroupService } from '@services/group.service';
import { TreeviewItem, TreeviewEventParser, OrderDownlineTreeviewEventParser, TreeviewConfig } from '@treeview/ngx-treeview';
import * as XLSX from 'xlsx';
import { AppService } from '@services/app.service';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { DownloadFileService } from '@services/download-file.service';

import {

    ViewContainerRef,
    ComponentRef,
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
    businessId;
    selectedScopeId: number = 1;
    @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
    dynamicContent!: ViewContainerRef;

    private componentRef: ComponentRef<any> | null = null;

    dynamicComponent: any = null;


    async SubCatData(child: any, categoryID: number, catName: string) {
       
        const year = this.trackingService.getYear(this.year);
        this.categoryId = categoryID;
        this.ALLEntries();
        this.facilityService.categoryId.set(categoryID);
        this.facilityService.subCategoryId.set(child.manageDataPointSubCategorySeedID);
        this.facilityService.yearSignal.set(year.toString());
        const monthString = JSON.stringify(this.selectMonths.map(m => m.value));
        this.facilityService.monthSignal.set(monthString);

        try {
            this.dynamicComponent = await loadComponentByCategoryId(categoryID);
        } catch (err) {
            console.warn(err);
            this.dynamicComponent = null;
        }


    };


    onMonthsChange(event: any) {
        const monthString = JSON.stringify(this.selectMonths.map(m => m.value));
        this.facilityService.monthSignal.set(monthString);
    };



    onYearChange() {

        this.dataEntry.month = this.trackingService.getMonthName(this.month);
        const year = this.trackingService.getYear(this.year);
        console.log(year);
        this.facilityService.yearSignal.set(year.toString());
        this.checkEntry(
            this.dataEntry.month,
            this.dataEntry.year,
            this.SubCatAllData.id
        );
        // this.ALLEntries();
        this.SubCatData(this.SubCatAllData, this.categoryId, this.categoryName);
    }


























    public Number = Number;
    public countriesList: any = countries;
    @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
    @ViewChild('tabView') dataentryTab: TabView;
    @ViewChild('commuteTable') commuteTable: ElementRef;
    @ViewChild('dt1') dt!: Table;
    @ViewChild('fileUpload') fileUpload!: FileUpload;
    @ViewChild('inputFile') inputFile: any;
    @ViewChild('closeModal4') closeModal4: ElementRef;
    computedFacilities = computed(() => {
        return this.facilityService.selectedfacilitiesSignal()
    })
    filteredStatus: any; // Variable to store the selected status
    public statusFilter: string;
    public yearFilter: number;
    DP_BoxVisible: boolean;
    AddManageDataPoint = '';
    value_tab = 'Scope 1';
    selectedValues: string[] = [];
    selectedTreeValues: any[] = [];
    selectMonths: any[] = [];
    storage_type: any;
    statusData: any;
    wasteSubCategory: any;
    hotelTypeGrid: any[] = [];
    yearOptions: any[] = [];
    jsonData: any[] = [];
    jsonCompanyData: any[] = [];
    productID: any;
    checked: boolean = false;
    annualMonths: boolean = false;
    progressPSGTab: boolean = false;
    excelPGSTab: boolean = false;
    isAnnual: any
    singlePGSTab: boolean = true;
    multiLevelItems: TreeviewItem[] = [];
    active: MenuItem;
    selectedExpectedLifetimeUnit: any;
    notevalue: string;
    selectedAirport: string;
    selectedAirport2: string;
    selectedAirport3: string;
    status: TrackingTable[];
    formGroup: FormGroup;
    upstreamVehicletypeId: any;
    selectedProductEnergyType: any;
    productsExcelData = [
        { category: 'Sports Teams and Clubs', expiryDate: '25-10-2025', quantity: 50, currency: 'INR', brand: 'Samsung', price: 2.00, status: 'Matched', isEditing: false },
        { category: 'Electronics', expiryDate: '30-12-2025', quantity: 100, currency: 'USD', brand: 'Sony', price: 5.00, status: 'Unmatched', isEditing: false }
    ];
    //units: units[];
    // setlimit: setlimit[];

    emissiontable: EmissionFactorTable[];
    visible: boolean;
    maxCharacters: number = 9;
    defaulttab: string;
    categoryName: string;
    updatedtheme: string;
    facilityData: Facility[] = [];
    public loginInfo: LoginInfo;
    AssignedDataPoint: TrackingDataPoint[] = [];
    trackingData: Facility = new Facility();
    facility;
    todayDate;
    SubCatAllData: ManageDataPointSubCategories;
    id_var: any;
    dataEntrySetting: DataEntrySetting = new DataEntrySetting();
    dataEntry: DataEntry = new DataEntry();
    selectedVendor: any;
    APIURL: string = environment.baseUrl;
    // liveUrl: 'http://192.168.29.45:4500';
    liveUrl: 'https://ekotrace.ekobon.com:4000';
    SCdataEntry: StationaryCombustionDE = new StationaryCombustionDE();
    RefrigerantDE: RefrigerantsDE = new RefrigerantsDE();
    FireExtinguisherDE: FireExtinguisherDE = new FireExtinguisherDE();
    VehicleDE: VehicleDE = new VehicleDE();
    RenewableElectricity: ElectricityDE = new ElectricityDE();
    commonDE: any[] = [];
    SCDE: StationaryCombustionDE[] = [];
    refDE: RefrigerantsDE[] = [];
    fireDE: FireExtinguisherDE[] = [];
    vehicleDE: VehicleDE[] = [];
    electricDE: ElectricityDE[] = [];
    HeatandSteamDE: HeatandSteamDE = new HeatandSteamDE();
    savedAndEdited: false;
    activeindex: number = 0;
    month: Date;
    year: Date;
    facilityhavedp = 'none';
    facilityID;
    subCatID;
    flag;
    sourceName;
    facilitynothavedp = 'flex';
    forGroup = 'none';
    entryExist: boolean = false;
    getFacilitystring: string;
    Pending = environment.pending;
    Rejected = environment.rejected;
    Approved = environment.approved;
    blendType: BlendType[] = [];
    isHowtoUse = false;
    supplierSelected = false;
    ModeType: VehicleDEmode[] = [];
    ElectricitySource: ElectricitySource[] = [];
    ElectricityGrid: ElectricityGrid[] = [];
    public EmissionFactor: EmissionFactor[] = [];
    flightsTravelTypes: any[] = [];
    kgCO2e: any;
    selectedFile: File;
    uploadedFileUrl: string;
    downloadExcelUrl: string;
    downloadCompanyExcelUrl: string;
    rootUrl: string;
    fileSelect: File;
    categoryId: number;
    accordianIndex = 0;
    units: Units[] = [];
    monthString: string;
    VehicleType: VehicleType[] = [];
    dataEntriesPending: any[] = [];
    rowsCompany: any[] = [];
    SubCategoryType: SubCategoryTypes[] = [];
    isInputEdited: boolean;
    subfacilityTypeValue: string;
    typeEV: boolean = false;
    renewableSelected: boolean = false;
    typeBusCoach: boolean = false;
    // scope 3 variables starts 
    subVehicleCategoryValue: string = 'Van-Petrol';
    leasefacilitieschecked: boolean = false;
    leasevehcileschecked: boolean = false;
    vehcilestransporationchecked: boolean = false;
    storageTransporationChecked: boolean = false;
    VehicleGrid: any[] = [];
    allPRoducts: any[] = [];
    selectedUnit: any;
    psg_product: any;
    sub_sector: any;
    selectedVehicleIndex: number = 1;
    franchiseCategoryValue: string;
    subFranchiseCategoryValue: string = 'Bank Branch';
    selectedVehicleType: any = '';
    subVehicleCategory: any[] = [];
    facilityUnits: any[] = [];
    selectedflightsTravel: any;
    storageGrid: any[] = [];
    waterSupplyUnitGrid: any[] = [];
    wasteGrid: any[] = [];
    regionType: any[] = [];
    goodsTemplates: any[] = [];
    waterWasteProduct: string;
    wasteSubTypes: any[] = [];
    waterWasteId = 1;
    waterWasteMethod: any[] = [];
    recycleMethod: any[] = [];
    wasteUnitsGrid: any[] = [];
    noofemployees_1 = ""
    noofemployees_2 = ""
    noofemployees_3 = ""
    noofdays_1 = ""
    noofdays_2 = ""
    flightClassGrid: any[] = [];
    vehicleModalFleet: any[] = [];
    deliveryModalFleet: any[] = [];
    noofdays_3 = ""
    noofmonths_1: string;
    noofmonths_2: string;
    noofmonths_3: string;
    franchiseGrid: any[] = [];
    HSNCode: any[] = [];
    busineessGrid: any[] = [];
    franchiseGridWithPlaceholder: any[] = [];
    subFranchiseCategory: any[] = [];
    calculationUpleaseGrid: any[] = [];
    franchiseMethodValue: string;
    franchiseMethod = false;
    averageMethod = false;
    purchaseGoodsTypes: any[] = [];
    onIndustrySelected = false;
    onActivitySelected = false;
    OthersSecledted = false;
    productActivitySubTypes: any[] = [];
    prodductEnergySubTypes: any[] = [];
    activitySubTypes: any[] = [];
    purchaseGoodsUnitsGrid: any[] = [];
    calculationPurchaseGrid: any[] = [];
    productEnergyTypes: any[] = [];
    energyUnitsGrid: any[] = [];
    purchaseProduct: any[] = [];
    noOfItems = false;
    subElectricityUnits = "per usage";
    expectedElectricityUnitsGrid: any[] = [];
    selectedFuelItem: any;
    fuelEnergyTypes: any[] = [];
    vendorList: any[] = [];
    purchaseHSNCode: any[] = [];
    standard: any[] = [];
    ModesTravelGrid: any[] = [];
    refrigeratedTypes: any[] = [];
    calculationGrid: any[] = [];
    investmentTypeGrid: any[] = [];
    calculationRow = false;
    investmentTypeValue = '';
    equityInvestmentRow = false;
    convertedYear: string;
    debtInvesmentRow = false;
    InvestmentHeading = '';
    RevenueRow = false;
    returnGrid: any[] = [];
    projectPhaseTypes: any[] = [];
    batchId: any;
    superAdminID: any;
    flightTime: any[] = [];
    upstreamMassUnitsGrid: any[] = [];
    uploadButton = false;
    newExcelData: any[] = []
    airportGrid: any[] = [];
    public isVisited = false;
    flightDisplay1 = 'block'
    flightDisplay2 = 'none'
    flightDisplay3 = 'none'
    carMode = false;
    annaulEntry: any;
    autoMode = false;
    busMode = false;
    railMode = false;
    ferryMode = false;
    ModeSelected = false;
    mode_name = '';
    selectedtemplate = '';
    mode_type: any[] = [];
    marketTypes: any[] = [];
    purchaseProductTypes: any[] = [];
    purchaseProductCategoryTypes: any[] = [];
    marketEElecID: any;
    templateLinks: string;
    singleCompanyTab = true;
    multipleCompanyTab = true;
    selectedProductsCategory: any;
    bulkCompanyTab = true;
    processingUnit: string;
    haveBasicPackage: number = 0;
    carFuel_type: any[] = [];
    purchaseUnits: any[] = [];
    waterUsageLevel: any[] = [];
    distanceTravelled: any[] = [];
    wasteMethod: string;
    recycle = false;
    visible2 = false;
    recycleSelectedMethod = '';
    rows: any[] = [];
    items: any[] = [];
    rowsPurchased: any[] = [];
    rowsFlightTravel: any[] = [];
    rowsHotelStay: any[] = [];
    rowsOtherTransport: any[] = [];
    vendorUnits: any[] = [];
    config: any;
    values: number[];
    currency: any;
    facilityCountryCode: any;
    selectedQuantitySoldUnit: any;
    annualEntry: any[] = [
        { name: 'Yes', value: 1 },
        { name: 'No', value: 0 },
    ];
    selectedGoodsCategory: any;
    productHSNSelect: any;
    waterSupplyUnit = 'kilo litres'
    processing_acitivity: any;
    storagef_typeValue: string = this.storageGrid[0]?.storagef_type;
    psg_ai_progress_data: any;
    hideMatchButon: boolean = false;
    openDatapointDialog() {
        this.AddManageDataPoint = 'block';
    }
    closeDp_Dialog() {
        this.DP_BoxVisible = false;
    }
    statusOptions: any[] = [
        { label: 'All', value: null },
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];
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

    constructor(
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private facilityService: FacilityService,
        private trackingService: TrackingService,
        private themeservice: ThemeService,
        private GroupService: GroupService,
        private notification: NotificationService,
        private toastr: ToastrService,
        private confirmationService: ConfirmationService,
        private renderer: Renderer2,
        private appService: AppService,
        private cdRef: ChangeDetectorRef,
        private spinner: NgxSpinnerService,
        private downloadFileService: DownloadFileService
    ) {

        effect(() => {

            if (this.computedFacilities() != 0) {

                this.GetAssignedDataPoint(this.computedFacilities())
                this.facilityID = this.computedFacilities();
                this.facilityCountryCode = this.facilityService.countryCodeSignal();
                console.log("country code", this.facilityCountryCode);

            }
        });
        // Initialize with the first 5 rows
        for (let i = 1; i <= 5; i++) {
            this.rows.push({ id: i, subVehicleCategory: [], vehicleType1: null, vehicleType2: null, employeesCommute: '', avgCommute: '' });
        }

        for (let i = 1; i <= 1; i++) {
            this.rowsHotelStay.push({
                id: i,
                country_stay: [],
                type_of_hotel: 'star_2',
                no_of_occupied_rooms: null,
                no_of_nights: null,
                selectedCountry: null,
                month: this.months,
                selectedMonths: null,

            });;
        };
        for (let i = 1; i <= 1; i++) {
            this.rowsFlightTravel.push({
                id: i,
                flightMode: '',
                flightType: null,
                flightClass: null,
                returnFlight: null,
                noOfTrips: null,
                costCentre: '',
                to: null,
                from: null,
                via: null,
                flight_class: null,
                no_of_passengers: null,
                return_flight: null,
                reference_id: null,
                cost_centre: null,
                batch: 1,
                month: this.months,
                selectedMonths: null
            })
        };

        for (let i = 1; i <= 1; i++) {
            this.rowsOtherTransport.push({
                id: i,
                trasnportMode: null,
                modeType: [],
                selectedMode: null,
                carFuel_type: [],
                selectedFuelType: null,
                no_of_passengers: null,
                distance_travel_per_trip: null,
                isDisabled: false,
                noOfTrips: null,
                month: this.months,
                selectedMonths: null
            })
        };
        for (let i = 1; i <= 1; i++) {
            this.rowsCompany.push({
                id: i,
                vehicleType: '',
                noOfVehicles: null,
                tripsPerVehicle: null,
                modeOfEntry: 'Average distance per trip',
                value: null,
                unit: 'Km'
            })
        }

        this.facilityService.headerTracking.set(true);
        this.SubCatAllData = new ManageDataPointSubCategories();
        this.AssignedDataPoint = [];
        this.defaulttab = router.url;
        this.loginInfo = new LoginInfo();
        this.trackingData = new Facility();
        this.dataEntrySetting = new DataEntrySetting();
        this.dataEntry = new DataEntry();
        this.SCdataEntry = new StationaryCombustionDE();
        this.RefrigerantDE = new RefrigerantsDE();
        this.FireExtinguisherDE = new FireExtinguisherDE();
        this.RenewableElectricity = new ElectricityDE();
        this.VehicleDE = new VehicleDE();
        this.month = new Date();
        this.year = new Date();
        this.rootUrl = environment.baseUrl + 'uploads/TrackingDocs/';
        this.kgCO2e = '';
        this.EmissionFactor = [];
        this.blendType = [];
        this.ModeType = [];
        this.ElectricitySource = [];
        this.ElectricityGrid = [];
        this.units = [];
        this.HeatandSteamDE = new HeatandSteamDE();
        this.VehicleType = [];
        this.dataEntry.unit = "";
        this.SubCategoryType = [];
        this.isInputEdited;
        this.dataEntry.typeID;

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

        this.purchaseUnits =
            [

                {
                    "id": 1,
                    "units": "kg"
                },
                {
                    "id": 2,
                    "units": "Tonnes"
                },
                {
                    "id": 3,
                    "units": "Litres"
                },
                {
                    "id": 4,
                    "units": "INR"
                }

            ];
        this.flightsTravelTypes =
            [

                {
                    "id": 1,
                    "flightType": "Generic"
                },
                {
                    "id": 2,
                    "flightType": "To/From"
                },
                // {
                //     "id": 3,
                //     "flightType": "Distance"
                // }

            ];
        this.projectPhaseTypes =
            [
                {
                    "id": 1,
                    "projectPhase": "In Construction phase"
                },
                {
                    "id": 2,
                    "projectPhase": "In Operational Phase"
                }
            ];
        this.marketTypes =
            [
                {
                    "id": 1,
                    "Type": "Renewable Energy Cert (REC)"
                },
                {
                    "id": 2,
                    "Type": "Supplier Specific"
                }

            ];
        this.goodsTemplates =
            [

                {
                    "id": 1,
                    "template": "Template 1"
                },
                {
                    "id": 2,
                    "template": "Template 2"
                },
                {
                    "id": 3,
                    "template": "Template 3"
                }

            ];
        this.recycleMethod =
            [

                {
                    "id": 1,
                    "template": "Open Loop"
                },
                {
                    "id": 2,
                    "template": "Close Loop"
                }

            ];
        this.productEnergyTypes =
            [

                {
                    "id": 1,
                    "energyTypes": "Direct use-phase emissions"
                },
                {
                    "id": 2,
                    "energyTypes": "Indirect use-phase emissions"
                }
            ]

        this.flightClassGrid =
            [
                {
                    "id": 1,
                    "classs": "Economy"
                },
                {
                    "id": 2,
                    "classs": "Business"
                },
                {
                    "id": 3,
                    "classs": "First Class"
                }
            ]
        this.ModeType =
            [
                {
                    "id": 1,
                    "modeName": "Average distance per trip"
                },
                {
                    "id": 2,
                    "modeName": "Average qty of fuel per trip"
                },
                {
                    "id": 3,
                    "modeName": "Avg. amount spent per trip"
                }

            ]


        this.hotelTypeGrid =
            [
                {
                    "id": 'star_2',
                    "hoteltype": "2 star"
                },
                {
                    "id": 'star_3',
                    "hoteltype": "3 star"
                },
                {
                    "id": 'star_4',
                    "hoteltype": "4 star"
                },
                {
                    "id": 'star_5',
                    "hoteltype": "5 star"
                }

            ]

        this.returnGrid =
            [
                {
                    "id": 1,
                    "return": "Yes"
                },
                {
                    "id": 2,
                    "return": "No"
                }

            ]

        this.energyUnitsGrid =
            [
                {
                    "id": 1,
                    "units": "No. of Item"
                },
                {
                    "id": 2,
                    "units": "Tonnes"
                },
                {
                    "id": 3,
                    "units": "kg"
                },
                {
                    "id": 4,
                    "units": "litres"
                }
            ]
        this.blendType =
            [
                {
                    "id": 1,
                    "typeName": "No Blend"
                },
                {
                    "id": 2,
                    "typeName": "Average Blend"
                },
                {
                    "id": 3,
                    "typeName": "Perc. Blend"
                },

            ]
        this.facilityUnits =
            [
                {
                    "id": 1,
                    "energyTypes": "sq ft"
                },
                {
                    "id": 2,
                    "energyTypes": "m2"
                }
            ];
        this.purchaseGoodsUnitsGrid =
            [
                {
                    "id": 2,
                    "units": "kg"
                },
                {
                    "id": 3,
                    "units": "tonnes"
                },
                {
                    "id": 4,
                    "units": "litres"
                }
            ]
        this.calculationPurchaseGrid =
            [
                {
                    "id": 1,
                    "calculationmethod": "Average data method"
                },
                {
                    "id": 2,
                    "calculationmethod": "Site Specific method"
                }
            ]
        this.calculationUpleaseGrid =
            [
                {
                    "id": 1,
                    "calculationmethod": "Average data method"
                },
                {
                    "id": 2,
                    "calculationmethod": "Facility Specific method"
                }
            ]
        this.investmentTypeGrid =
            [
                {
                    "id": 1,
                    "type": "Equity investments"
                },
                {
                    "id": 2,
                    "type": "Debt investments"
                },
                {
                    "id": 3,
                    "type": "Project finance"
                }
            ]
        this.calculationGrid =
            [
                {
                    "id": 1,
                    "calculationmethod": "Average data method"
                },
                {
                    "id": 2,
                    "calculationmethod": "Investment Specific method"
                }
            ]
        this.storageGrid =
            [{
                "id": 1,
                "storagef_type": "Distribution Centre"
            },
            {
                "id": 2,
                "storagef_type": "Dry Warehouse"
            },
            {
                "id": 3,
                "storagef_type": "Refrigerated Warehouse"
            }

            ]
        this.distanceTravelled =
            [{
                "id": 1,
                "unit": "km"
            },
            {
                "id": 2,
                "unit": "miles"
            }
            ]
        this.wasteUnitsGrid =
            [
                {
                    "id": 1,
                    "units": "tonnes"
                },
                {
                    "id": 2,
                    "units": "tonnes"
                },
                {
                    "id": 3,
                    "units": "kg"
                }
            ]
        this.upstreamMassUnitsGrid =
            [
                {
                    "id": 1,
                    "units": "kg"
                },
                {
                    "id": 2,
                    "units": "tonnes"
                }
            ]
        this.vendorUnits =
            [
                {
                    "id": 1,
                    "units": "kg CO2e/kg"
                },
                {
                    "id": 2,
                    "units": "kg CO2e/Tonnes"
                },
                {
                    "id": 3,
                    "units": "kg CO2e/Litres"
                },
                {
                    "id": 4,
                    "units": "kg CO2e/INR"
                }
            ]
        this.waterSupplyUnitGrid =
            [{
                "id": 1,
                "unitType": "kilo litres"
            },
            {
                "id": 2,
                "unitType": "cubic m"
            },

            ];
        this.waterUsageLevel =
            [{
                "id": 1,
                "unitType": "Primary"
            },
            {
                "id": 2,
                "unitType": "Secondary"
            },
            {
                "id": 3,
                "unitType": "Tertiary"
            }

            ];
        this.ElectricitySource =
            [{
                "id": 1,
                "sourceName": "Solar"
            },
            {
                "id": 2,
                "sourceName": "Wind"
            },
            {
                "id": 2,
                "sourceName": "Hydro"
            }
            ];
        this.waterWasteMethod =
            [
                {
                    "id": 'reuse',
                    "water_type": "Reuse"
                },
                {
                    "id": 'recycling',
                    "water_type": "Recycling"
                },
                {
                    "id": 'incineration',
                    "water_type": "Incineration"
                },
                {
                    "id": 'composting',
                    "water_type": "Composting"
                },
                {
                    "id": 'landfill',
                    "water_type": "Landfill"
                },
                {
                    "id": 'anaerobic_digestion',
                    "water_type": "Anaerobic digestion"
                }
            ];
        this.HSNCode =
            [
                {
                    "id": 1,
                    "code": "HSN"
                },
                {
                    "id": 2,
                    "code": "SAC"
                }
            ];
        this.expectedElectricityUnitsGrid =
            [
                {
                    "id": 1,
                    "unitsExpElec": "No. of times used"
                },
                {
                    "id": 2,
                    "unitsExpElec": " Days"
                },
                {
                    "id": 3,
                    "unitsExpElec": "Months"
                },
                {
                    "id": 4,
                    "unitsExpElec": "Years"
                }
            ]

        this.purchaseProductCategoryTypes =
            [
                {
                    "id": 1,
                    "product": "Testing"
                },


            ];

        this.active = this.items[0];
        this.SCdataEntry.blendPercent = 20;
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 20;
        this.isInputEdited = false;


        this.yearOptions.push({ label: 'All', value: null });

        for (let year = startYear; year <= currentYear; year++) {
            this.yearOptions.push({ label: year.toString(), value: year });
        }
    }





    //runs when component intialize
    ngOnInit() {
        this.config = {
            hasAllCheckBox: true,
            hasFilter: true, // Enable the filter
            hasCollapseExpand: false,
            decoupleChildFromParent: false,
            maxHeight: 500
        };

        $(document).ready(function () {
            $('.ct_custom_dropdown').click(function () {

                $('.ct_custom_dropdown').toggleClass('ct_open_modal')
            })
        })
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.haveBasicPackage = this.loginInfo.package_id

        }

        let tenantID = this.loginInfo.tenantID;
        this.superAdminID = this.loginInfo.super_admin_id;

        this.flag = localStorage.getItem('Flag');
        const dataEntry = this.trackingService.dataEntry;


        this.getBatch();
        this.setDefaultMonth();


    };


    //retrieves assigned data points for a facility and handles the response to update the UI accordingly.
    GetAssignedDataPoint(facilityID: number) {
        this.recycle = false;

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
                                for (let index = 0; index < this.scope3OrderCategories.length; index++) {


                                    const findCategory = this.AssignedDataPoint[findIndexScope3].manageDataPointCategories.find(items => items.catName == this.scope3OrderCategories[index].name)
                                    if (findCategory) {
                                        findCategory['catIndex'] = index
                                        tempArr.push(findCategory)
                                    }
                                }

                                this.AssignedDataPoint[findIndexScope3].manageDataPointCategories = [...tempArr]

                            };

                            const categoryId = this.AssignedDataPoint[0].manageDataPointCategories[0].manageDataPointCategorySeedID;
                            this.categoryId = categoryId;
                            const child = this.AssignedDataPoint[0].manageDataPointCategories[0].manageDataPointSubCategories[0]
                            this.SubCatData(child, categoryId, '');
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
    };

    onUpload(event) {
        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded with Basic Mode'
        });
    };


    //display a dialog
    showDialog() {
        this.visible = true;
    };


    onSubCategoryVehicleChange(event: any) {
        this.subVehicleCategoryValue = event.value;
    };
    //Sets the default data point and category for the facility.
    defaultData() {
        for (let cat of this.AssignedDataPoint[0].manageDataPointCategories) {
            this.categoryId = cat.manageDataPointCategorySeedID;
            this.SubCatAllData = cat.manageDataPointSubCategories[0];
            this.id_var = this.SubCatAllData.id;
            break; // Exit the outer loop after storing the zero index
        }
        //retrieves the emission factor for the selected subcategory

    };




    // getting subcategory types
    getsubCategoryType(subCatID: number) {

        this.dataEntry.typeID = null;
        this.trackingService.newgetsubCatType(subCatID, this.facilityID, this.year.getFullYear().toString()).subscribe({
            next: (response) => {
                if (response.success) {
                    this.SubCategoryType = response.categories;
                    this.dataEntry.typeID = this.SubCategoryType[0]?.subCatTypeID;
                } else {
                    this.toastr.warning(response.message);
                    this.SubCategoryType = [];
                }

            },
            error: (err) => {

            }
        })
    };
    getStationaryFuelType(subCatID: number) {

        this.dataEntry.typeID = null;
        this.trackingService.stationaryFuels(subCatID).subscribe({
            next: (response) => {
                this.SubCategoryType = response.data;
                this.dataEntry.typeID = this.SubCategoryType[0]?.ID;

            },
            error: (err) => {

            }
        })
    };


    getRegionName() {

        let formData = new URLSearchParams();
        formData.set('facilities', this.facilityID);
        formData.set('year', this.year.getFullYear().toString());
        this.trackingService.newGetRegionType(formData.toString()).subscribe({
            next: (response) => {
                if (response.success) {
                    this.regionType = response.categories;
                    this.RenewableElectricity.electricityRegionID = this.regionType[0].RegionID;

                } else {
                    this.regionType = [];
                    // this.toastr.warning(response.message);
                }

            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            }
        })
    };

    // to get the status of subcategories in status tab
    ALLEntries() {

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
                            if (this.categoryId == 24) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                            } else if (this.categoryId == 25) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                            } else if (this.categoryId == 26) {

                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                            } else {

                                this.dataEntriesPending = response.categories;
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
                        if (this.categoryId == 24) {
                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                        } else if (this.categoryId == 25) {
                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                        } else if (this.categoryId == 26) {

                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                        } else {
                            this.dataEntriesPending = response.categories;
                        }
                    }
                    console.log("this.dataEntriesPending", this.dataEntriesPending);
                },
                error: (err) => {
                    this.notification.showError('Operation failed', 'Error');
                }
            });



    };



    submitUnmatchWithAI() {
        if (this.newExcelData.length == 0) return
        this.spinner.show();
        const payload = this.newExcelData.map(row => ({
            month: '',
            product_description: row['Product Description'],
            product_category: row['Product Category'],
            value: row['Value / Quantity'],
            unit: row['Unit'],
            vendor_name: row['Vendor'],
            vendorunit: row['Vendor Specific Unit'],
            vendor_ef: row['Vendor Specific EF'],
            match_productCategory_Id: row.productResult?.id,
            purchase_date: row['Purchase Date'],
            product_code: row.code,
            is_find: row.is_find,
            facilityID: this.facilityID,
            product_name: row.productResult?.product
        }))
        console.log("payload", payload);
        var purchaseTableStringfy = JSON.stringify(payload);

        let formData = new URLSearchParams();

        // formData.set('productcodestandard', this.productHSNSelect);
        formData.set('facility_id', this.facilityID);
        formData.set('jsonData', purchaseTableStringfy);
        formData.set('user_id', this.loginInfo.Id.toString());
        formData.append('filename', this.selectedFile.name); // Append file

        this.trackingService.submitPurchaseGoodsAI(formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.notification.showSuccess(
                        response.message,
                        'Success'
                    );
                    this.triggerAIProcess();
                    this.openProgresstab();
                    this.newExcelData = [];


                    this.GetHSN();
                    // this.deselectAllItems(this.rowsPurchased)

                    this.resetForm();
                    this.ALLEntries();

                } else {
                    this.notification.showError(
                        response.message,
                        'Error'
                    );

                }
                this.spinner.hide();
            },
            error: (err) => {
                this.spinner.hide();
                this.notification.showError(
                    'Data entry added failed.',
                    'Error'
                );
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => { }
        });
    };
    // getting units for category 1 and 2
    getUnit(subcatId) {
        this.trackingService.newgetUnits(subcatId).subscribe({
            next: (Response) => {
                if (Response) {

                    this.units = Response['categories'];

                    this.dataEntry.unit = this.units[0].UnitName;

                }
                else {
                    this.units = [];
                }
            }
        })
    };


    getApproxTime(rows: number): string {
        const totalSeconds = rows * 2;

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.ceil((totalSeconds % 3600) / 60); // round up minutes

        let timeString = '';
        if (hours > 0) timeString += `${hours} hr `;
        if (minutes > 0 || hours === 0) timeString += `${minutes} min`;

        return timeString.trim();
    };


    refreshPSGStatus() {
        const formdata = new URLSearchParams();
        formdata.set('facilityID', this.facilityID);
        formdata.set('userId', this.loginInfo.Id.toString());
        this.appService.postAPI('/get-purchase-good-data-using-user-facilityId', formdata).subscribe({
            next: (response: any) => {

                if (response.success == true) {
                    this.psg_ai_progress_data = response.data;
                } else {
                    this.psg_ai_progress_data = [];
                    this.notification.showWarning(response.message, '');
                }
            }
        })
    }
    triggerAIProcess() {
        this.trackingService.triggerAIPRocess().subscribe({
            next: (Response) => {
                if (Response) {


                }
                else {

                }
            }
        })
    };
    generateExcel() {

        this.trackingService.getExcelSheet(this.facilityID).subscribe({
            next: (Response) => {
                if (Response) {


                }

            }
        })
    };

    onFlightModeChange(event: any) {
        this.rowsFlightTravel = [{
            id: 1,
            flightMode: '',
            flightType: null,
            flightClass: null,
            returnFlight: null,
            noOfTrips: null,
            costCentre: '',
            to: null,
            from: null,
            via: null,
            flight_class: null,
            no_of_passengers: null,
            return_flight: null,
            reference_id: null,
            cost_centre: null,
            batch: 1,
            month: this.months,
            selectedMonths: null

        }];
        if (event.value == 'Generic') {
            this.flightDisplay1 = 'block';
            this.flightDisplay2 = 'none';
            this.flightDisplay3 = 'none';
        } else if (event.value == 'To/From') {
            this.getAirportCodes()
            this.flightDisplay1 = 'none';
            this.flightDisplay2 = 'block';
            this.flightDisplay3 = 'none';
        } else if (event.value == 3) {

        } else {

        }
    }


    addCommutes() {
        this.rows.push({ id: this.rows.length + 1, subVehicleCategory: [], vehicleType1: null, vehicleType2: null, employeesCommute: '', avgCommute: '' });
    }
    addPurchaseRows() {
        this.rowsPurchased.push({ id: this.rowsPurchased.length + 1, multiLevelItems: [], productService: null, productType: null, months: '', quantity: '', selectedUnit: '', vendorName: '', vendorspecificEF: '', vendorspecificEFUnit: `kgCO2e/${this.currency}` });
    };
    addCompanyRows() {
        this.rowsCompany.push({ id: this.rowsCompany.length + 1, vehicleType: null, noOfVehicles: null, tripsPerVehicle: null, modeOfEntry: 'Average distance per trip', chargingOutside: '', value: null, unit: 'Km' });
    };

    deletePSG(serialNo: number) {
        this.newExcelData = this.newExcelData.filter(item => item['S. No.'] !== serialNo);
    };


    CostCentre() {

        this.GroupService.getCostCentre(this.superAdminID).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.busineessGrid = response.categories;
                    if (this.busineessGrid.length > 0) {
                    } else {
                    }
                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => { }
        });
    };




    wastemethodChange(event: any) {

        if (event.value == 'recycling') {
            this.recycle = true
        } else {
            this.recycle = false;
        }
    }




    getBusineesUnit() {
        this.trackingService.getBusinessUnit().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.busineessGrid = response.categories;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };


    getFlightType() {
        this.trackingService.getflight_types().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.wasteGrid = response.batchIds;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };
    getAirportCodes() {
        this.trackingService.getAirportCodes().subscribe({
            next: (response) => {
                if (response.success == true) {

                    this.airportGrid = response.categories

                } else {

                }

            }
        })
    };
    getFlightTimeTypes() {
        this.trackingService.getFlightTimes().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.flightTime = response.batchIds;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    ToggleClick() {
        this.isVisited = true;
    }


    GetVendors() {

        this.GroupService.getVendors(this.superAdminID).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.vendorList = response.categories;
                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => { }
        });
    };

    bulkUploadPG() {
        this.progressPSGTab = false;
        this.singlePGSTab = !this.singlePGSTab
    }

    onPurchaseGoodsUpload(event: any, fileUpload: any) {

        const file = event[0];
        if (!file) return;
        this.spinner.show();
        this.selectedFile = event[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Read first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            this.jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Convert array to key-value pairs
            this.jsonData = this.convertToKeyValue(this.jsonData);
            const filteredJson = this.jsonData.filter((item: any) => item['Product Description'] !== '');

            if (filteredJson.length > 0) {
                this.newExcelData = filteredJson.map(items => ({
                    ...items,
                    is_find: false,
                    code: '',
                    productResult: {
                        ...items.productResult,
                        id: '',
                        typeofpurchase: '',
                        product: '',
                        typesofpurchasename: '',
                        HSN_code: '',
                        NAIC_code: '',
                        ISIC_code: ''
                    }

                }));
                this.spinner.hide();
            } else {
                this.sendJSON(this.jsonData);
            }

            // setTimeout(() => {
            //     fileUpload.clear();
            // }, 1000);

        };
        reader.readAsArrayBuffer(file);
    };

    onCompanyUpload(event: any, fileUpload: any) {
        const file = event[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });


            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];


            this.jsonCompanyData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });


            const jsonReading = this.convertToKeyValue(this.jsonCompanyData);

            this.jsonCompanyData = jsonReading.filter(items => { return items['Vehicle Model'] !== '' });

            this.jsonCompanyData = this.jsonCompanyData.map(item => {
                return {
                    vehicleType: item['Vehicle Model'],
                    noOfVehicles: item['No of Vehicles'],
                    tripsPerVehicle: item['Trips per vehicle'],
                    modeOfEntry: item['Mode of data entry'],
                    value: item['Value'] ? item['Value'] : '',
                    unit: item['Unit'] ? item['Unit'] : '',
                }
            }
            )

            // console.log(this.jsonData);


            setTimeout(() => {

                fileUpload.clear();
            }, 1000);


        };
        reader.readAsArrayBuffer(file);
    };

    convertToKeyValue(data: any[]): any[] {
        if (data.length < 2) return [];

        const headers = data[0]; // Extract headers
        return data.slice(1).map((row) => {
            let obj: any = {};
            headers.forEach((header: string, index: number) => {
                let value = row[index] || '';

                // Convert Excel date serial number to readable date
                if (header.includes('Date') && typeof value === 'number') {
                    value = XLSX.SSF.format('dd-mm-yyyy', value); // Converts to "dd-mm-yyyy"
                }

                obj[header] = value;
            });
            return obj;
        });
    }

    toggleEdit(index: number, id: any, productmatch: any, finder: any) {

        this.productID = id;
        this.visible2 = true;

        if (finder == '1' && productmatch == true) {
            this.hideMatchButon = true;
        }
        if (finder == 'delete') {
            this.deleteProduct(index);
        }

    }

    deleteProduct(index: number) {
        this.productsExcelData.splice(index, 1);
    }


    GetHSN() {

        this.GroupService.getHSN().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.purchaseHSNCode = response.categories;
                    this.productHSNSelect = this.purchaseHSNCode[0].id;
                    this.GetStandardType(this.productHSNSelect)
                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => { }
        });
    };
    sendJSON(jsonData: any) {
        const json = jsonData.filter((item: any) => item['Product Description'] !== '');

        const jsonDataString = JSON.stringify(json);
        const formData = new URLSearchParams();
        formData.append('product', jsonDataString);
        formData.append('country_code', this.facilityCountryCode);
        formData.append('year', this.year.getFullYear().toString());

        this.GroupService.uploadJsonData(formData).subscribe({
            next: (response) => {
                if (response.success == true) {
                    let res = response;
                    const sortedArray = res.data.sort((a, b) => Number(b.is_find) - Number(a.is_find));
                    // console.log(sortedArray);
                    if (this.productHSNSelect == 1) {
                        this.newExcelData = sortedArray.map(items => ({
                            ...items, // Keep all existing properties
                            code: items.productResult?.HSN_code // Add new 'code' key, ensuring 'productResult' exists
                        }));
                    } else if (this.productHSNSelect == 2) {
                        this.newExcelData = sortedArray.map(items => ({
                            ...items, // Keep all existing properties
                            code: items.productResult?.NAIC_code // Add new 'code' key, ensuring 'productResult' exists
                        }));
                    } else {
                        this.newExcelData = sortedArray.map(items => ({
                            ...items, // Keep all existing properties
                            code: items.productResult?.ISIC_code // Add new 'code' key, ensuring 'productResult' exists
                        }));
                    }


                }
                this.spinner.hide();

            },
            error: (err) => {
                this.spinner.hide();
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => { }
        });
    };

    GetStandardType(typeID) {

        this.GroupService.getStandardType(typeID).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.purchaseProductTypes = response.categories;

                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => { }
        });
    };



    getRefrigerantsubCategoryType(subCatID: number) {
        this.trackingService.newgetsubCatType(subCatID, this.facilityID, this.year.getFullYear().toString()).subscribe({
            next: (response) => {
                this.SubCategoryType = response.categories;
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            }
        })
    };

    onInputEdit() {
        this.isInputEdited = true;
    };


    //checkEntry function for checking if an entry exists for a specific month, year, and subcategory.
    checkEntry(month, year, subcatID) {
        this.trackingService.checkEntry(month, year, subcatID).subscribe({
            next: (response) => {

                if (response == environment.NoEntry) {
                    this.entryExist = false;
                    this.dataEntry = new DataEntry();
                } else {
                    this.entryExist = true;

                    this.dataEntry = response;
                    this.dataEntry = new DataEntry();
                }
            }
        });
    };




    //---method for file upload---
    uploadFiles(files: FileList | null) {
        if (files && files.length > 0) {
            this.selectedFile = files[0];

            const formData: FormData = new FormData();
            formData.append('file', this.selectedFile, this.selectedFile.name);
            if (formData.has('file')) {
                // File is available in the FormData

            } else {
                // File is not available in the FormData

            }
            this.trackingService.UploadFile(formData).subscribe({
                next: (response) => {
                    if (response) {
                        this.toastr.success('Doc uploaded successfully');
                        this.uploadedFileUrl =
                            this.rootUrl + this.selectedFile.name;
                        this.dataEntry.fileName = this.selectedFile.name;
                        this.dataEntry.filePath = this.uploadedFileUrl;
                    } else {
                        // Handle the case when the file upload was not successful
                        this.toastr.error('Doc uploaded failed');
                    }
                },
                error: (err) => {
                    if (
                        err.error.message ===
                        'File size exceeds the allowed limit'
                    ) {
                        this.notification.showError(
                            'File is too large to upload',
                            ''
                        );
                    } else if (
                        err.error.message ===
                        'Only PNG, JPG and PDF files are allowed'
                    ) {
                        this.notification.showError(
                            'Only PNG and JPG files are allowed',
                            ''
                        );
                    } else {
                        // Handle other errors
                        console.error('errrrr', err);
                        this.toastr.error('Doc upload failed');
                    }
                    // Handle the error
                    // // console.log('Error-->>: ', JSON.stringify(err));
                }
            });
        }
    }



    checkVisited() {
        // reverse the value of property
        this.isHowtoUse = !this.isHowtoUse;
    }

    getVehcileFleet(facilityId: number, type: number) {

        const formData = new URLSearchParams();
        formData.append('facility_id', facilityId.toString());
        this.appService.postAPI('/get-vehicle-fleet-by-facility-id', formData).subscribe({
            next: (response: any) => {

                if (response.success == true) {

                    const fleet = response.data;
                    if (type == 10) {
                        this.vehicleModalFleet = fleet.filter((item) => item.category == 1 && item.retire_vehicle === 0);
                    } else if (type == 11) {
                        this.vehicleModalFleet = fleet.filter((item) => item.category == 2 && item.retire_vehicle === 0);
                    }


                }
            },
            error: (err) => {

            },
            complete: () => { }
        });
    };

    onFileSelected(event: any) {

        const selectedFile = event[0];

        if (selectedFile) {
            //   this.uploadFiles(files); previous one 
            this.selectedFile = event[0];
            $(".browse-button input:file").change(function () {
                $("input[name='attachment']").each(function () {
                    var fileName = $(this).val().split('/').pop().split('\\').pop();
                    $(".filename").val(fileName);
                    $(".browse-button-text").html('<i class="fa fa-refresh"></i> Change');
                });
            });
            this.uploadButton = true
        }
    };

    marktetTypeChange(event: any) {
        if (event.value == 1) {
            this.renewableSelected = true
            this.supplierSelected = false;
        } else if (event.value == 2) {

            this.renewableSelected = false
            this.supplierSelected = true;
        }
    }

    purchaseGoodsUpload(event: any) {
        event.preventDefault();
        this.dataEntry.month = this.selectMonths
            .map((month) => month.value)
            .join(', '); //this.getMonthName();
        this.dataEntry.year = this.year.getFullYear().toString(); //this.getYear();
        var spliteedMonth = this.dataEntry.month.split(",");
        var monthString = JSON.stringify(spliteedMonth);
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
        formData.append('batch', '1');
        formData.append('facilities', this.facilityID);
        formData.append('year', this.dataEntry.year);
        formData.append('month', monthString);
        this.trackingService.UploadTemplate(formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.notification.showSuccess(
                        response.message,
                        'Success'
                    );

                } else {
                    this.notification.showError(
                        response.message,
                        'Error'
                    );
                }
            },
            error: (err) => {
                this.notification.showError(
                    'Data entry added failed.',
                    'Error'
                );
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => { }
        });
    };

    //method for download a file
    DownloadFile(filePath: string) {
        this.trackingService.downloadFile(filePath).subscribe(
            () => {
                const link = document.createElement('a');
                link.href = this.getFileUrl(filePath);
                link.download = this.getFileNameFromPath(filePath);
                link.target = '_blank';

                //Trigger the download by programmatically clicking the anchor element
                link.click();

                // Clean up the anchor element
                link.remove();

                this.toastr.success('Doc downloaded successfully');
            },
            (error) => {
                if (
                    error.error.message ===
                    'File size exceeds the allowed limit'
                ) {
                    this.notification.showError(
                        'File is too large to download',
                        ''
                    );
                } else if (
                    error.error.message ===
                    'Only PNG, JPG and PDF files are allowed'
                ) {
                    this.notification.showError(
                        'Only PNG, JPG, and PDF files are allowed',
                        ''
                    );
                } else {
                    console.error('Error:', error);
                    this.toastr.error('Doc download failed');
                }
            }
        );
    };

    addrowsFlightTravel() {
        this.rowsFlightTravel.push({
            id: this.rowsFlightTravel.length + 1,
            flightMode: '',
            flightType: null,
            flightClass: null,
            returnFlight: null,
            noOfTrips: null,
            costCentre: '',
            to: null,
            from: null,
            via: null,
            flight_class: null,
            no_of_passengers: null,
            return_flight: null,
            reference_id: null,
            cost_centre: null,
            batch: 1,
            month: this.months,
            selectedMonths: null,
        });
    };
    addrowsOtherModes() {
        this.rowsOtherTransport.push({
            id: this.rowsOtherTransport.length + 1,
            trasnportMode: null,
            modeType: [],
            carFuel_type: [],
            selectedMode: null,
            selectedFuelType: null,
            no_of_passengers: null,
            distance_travel_per_trip: null,
            isDisabled: false,
            noOfTrips: '',
            month: this.months,
            selectedMonths: null,
            batch: 1,
        });
    };
    addrowsHotelStay() {
        this.rowsHotelStay.push({
            id: this.rowsHotelStay.length + 1,
            country_stay: null,
            type_of_hotel: 'star_2',
            no_of_occupied_rooms: null,
            no_of_nights: null,
            month: this.months,
            selectedMonths: null,
        });
    };

    //The getFileUrl function is used to generate the URL for downloading a file based on the provided filePath.
    private getFileUrl(filePath: string): string {
        const baseUrl = window.location.origin;
        return `${baseUrl}/api/DownloadFile/${encodeURIComponent(filePath)}`;
    }
    onFilterChange(event: any) {

        // Add your custom filter logic here if needed
    }
    //getFileNameFromPath function is used to extract the file name from a given filePath
    private getFileNameFromPath(filePath: string): string {
        const startIndex = filePath.lastIndexOf('/') + 1;
        const endIndex = filePath.length;
        return filePath.substring(startIndex, endIndex);
    }

    //resetForm method for resetting the form and clearing any selected values or input fields.
    resetForm() {
        this.dataEntryForm.resetForm();
        this.fileUpload.clear();
        this.selectedFile = null;
    }

    EditDataEntry(dataEntry: any) {
        this.activeindex = 0;
    }

    getVehicleDEMode() {
        this.trackingService.getVehicleDEMode().subscribe({
            next: (response) => {
                this.ModeType = response;

            }
        })
    };

    getElectricitySource() {
        this.trackingService.getElectricitySource().subscribe({
            next: (response) => {
                this.ElectricitySource = response;
            }
        })
    }
    getElectricityGrid() {
        this.trackingService.getElectricityGrid().subscribe({
            next: (response) => {
                this.ElectricityGrid = response;
            }
        })
    }


    getPassengerVehicleType() {
        try {
            this.VehicleDE.vehicleTypeID = null;
            this.trackingService.newGetPassengerVehicleType(this.facilityID, this.year.getFullYear().toString()).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.VehicleType = response.categories;
                        this.VehicleDE.vehicleTypeID = this.VehicleType[0].ID
                    }
                    else {
                        this.toastr.warning(response.message);
                        this.VehicleType = [];
                    }
                }
            })
        }
        catch (ex) {

        }
    };

    getDeliveryVehicleType() {
        try {
            this.VehicleDE.vehicleTypeID = null;
            this.trackingService.newGetDeliveryVehicleType(this.facilityID, this.year.getFullYear().toString()).subscribe({
                next: (response) => {
                    if (response) {
                        this.VehicleType = response.categories;
                        this.VehicleDE.vehicleTypeID = this.VehicleType[0].ID
                    }
                    else {
                        this.VehicleType = [];
                    }
                }
            })
        }
        catch (ex) {

        }

    };

    setDefaultMonth() {
        this.monthString = this.trackingService.getMonthName(this.month);
        this.months.forEach(m => {
            if (m.name == this.monthString) {
                this.selectMonths[0] = m;
            }

        })
    };

    onModesChange(event: any) {
        const selectedMode = event.value;
        this.carMode = true;
        this.autoMode = false;
        this.ModeSelected = true;
        if (selectedMode == 'Car') {
            this.carMode = true;
            this.autoMode = false;
            const optionvalue =
                [{
                    "id": 1,
                    "type": "Small"
                },
                {
                    "id": 2,
                    "type": "Medium"
                },
                {
                    "id": 3,
                    "type": "Large"
                }
                ]
            const optionvalue2 =
                [{
                    "id": 1,
                    "mode_type": "Petrol"
                },
                {
                    "id": 2,
                    "mode_type": "Diesel"
                },
                {
                    "id": 3,
                    "mode_type": "LPG"
                },
                {
                    "id": 4,
                    "mode_type": "CNG"
                },
                {
                    "id": 5,
                    "mode_type": "Hybrid"
                },
                {
                    "id": 6,
                    "mode_type": "Electric"
                }
                ]
            this.mode_name = selectedMode;

            this.mode_type = optionvalue;
            this.carFuel_type = optionvalue2;
        } else if (selectedMode == 'Auto') {
            this.autoMode = true;
            this.carMode = true;
            const optionvalue =
                [{
                    "id": 1,
                    "type": "Petrol"
                },
                {
                    "id": 2,
                    "type": "CNG"
                },
                {
                    "id": 3,
                    "type": "LPG"
                }
                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        } else if (selectedMode == 'Bus') {
            this.carMode = false;
            this.autoMode = true;
            const optionvalue =
                [{
                    "id": 1,
                    "type": "Local Bus"
                },
                {
                    "id": 2,
                    "type": "Coach"
                }
                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        }
        else if (selectedMode == 'Rail') {
            this.carMode = false;
            const optionvalue =
                [{
                    "id": 1,
                    "type": "National"
                },
                {
                    "id": 2,
                    "type": "International"
                }

                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        }
        else if (selectedMode == 'Ferry') {
            this.carMode = false;
            this.autoMode = true;
            const optionvalue =
                [{
                    "id": 1,
                    "type": "Foot passenger"
                },
                {
                    "id": 2,
                    "type": "Car passenger"
                }
                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        }
    };



    onUnitChange(row) {
        row.vendorspecificEFUnit = 'kgCO2e/' + row.selectedUnit;
    }

    enableCharging(subcatName: any) {

        if (subcatName == "Passenger Vehicle") {
            if (this.VehicleDE.vehicleTypeID == 7 || this.VehicleDE.vehicleTypeID == 8 || this.VehicleDE.vehicleTypeID == 9 || this.VehicleDE.vehicleTypeID == 12 || this.VehicleDE.vehicleTypeID == 17 || this.VehicleDE.vehicleTypeID == 10) {

                this.typeEV = true;
                this.typeBusCoach = false;
                return;

            }
            if (this.VehicleDE.vehicleTypeID == 21 || this.VehicleDE.vehicleTypeID == 22) {
                this.typeEV = false;
                this.typeBusCoach = true;
                return;

            }
            else {
                this.typeEV = false;
                this.typeBusCoach = false;
                return;

            }

        }
        else {
            if (this.VehicleDE.vehicleTypeID == 5) {

                this.typeEV = true;

            }
            else {
                this.typeEV = false;
                this.typeBusCoach = false;

            }
        }
        // if (this.VehicleDE.vehicleTypeID == ) {

        // }
    }

    downloadFireExtTemplate() {
        var fileName = 'FireExtinguisherTemplate.xlsx'
        if (fileName) {
            this.trackingService.downloadFile(fileName).subscribe(
                (response: Blob) => {
                    const url = window.URL.createObjectURL(response);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName; // Specify the desired file name
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    this.toastr.success('Doc downloaded successfully');
                },
                (error) => {
                    console.error('Error downloading the file.', error);
                    this.toastr.error('Error downloading the file.');
                }
            );
        } else {
            this.toastr.warning('File not found!');
        }
    };

    onEmpTypeChange(event: any, row: any) {

        const selectedIndex = event.value;

        this.getSubEmployeeCommuTypes(selectedIndex, row)
    }
    onProductHSNChange(event: any) {

        const selectedIndex = event.value;
        this.productHSNSelect = selectedIndex
        this.GetStandardType(this.productHSNSelect)
        // this.getSubEmployeeCommuTypes(selectedIndex, row)
    }
    onProductHSNChange2(event: any) {

        const selectedIndex = event.value;
        this.productHSNSelect = selectedIndex
        if (this.productHSNSelect == 1) {
            this.newExcelData = this.newExcelData.map(items => ({
                ...items, // Keep all existing properties
                code: items.productResult?.HSN_code // Add new 'code' key, ensuring 'productResult' exists
            }));
        } else if (this.productHSNSelect == 2) {
            this.newExcelData = this.newExcelData.map(items => ({
                ...items, // Keep all existing properties
                code: items.productResult?.NAIC_code // Add new 'code' key, ensuring 'productResult' exists
            }));
        } else {
            this.newExcelData = this.newExcelData.map(items => ({
                ...items, // Keep all existing properties
                code: items.productResult?.ISIC_code // Add new 'code' key, ensuring 'productResult' exists
            }));
        }
        // this.GetStandardType(this.productHSNSelect)
        // this.getSubEmployeeCommuTypes(selectedIndex, row)
    }
    onAnnualChange(event: any) {

        const selectedIndex = event.value;
        if (selectedIndex == '0') {
            this.annualMonths = false
        } else {
            this.annualMonths = true
        }
    }
    onProductStandardChange(event: any, row: any) {
        // // console.log(event.value);
        const selectedIndex = event.value;
        this.getProductPurchaseItems(selectedIndex, row)
        // this.getSubEmployeeCommuTypes(selectedIndex, row)
    }

    getProductPurchaseItems(standardType, row: any) {
        let formData = new URLSearchParams();

        formData.set('product_code_id', this.productHSNSelect);
        formData.set('typeofpurchase', standardType);
        formData.set('country_id', this.facilityCountryCode);
        formData.set('year', this.year.getFullYear().toString());

        this.trackingService.getPurchaseCategorires(formData.toString()).subscribe({
            next: (response) => {

                if (response.success == true) {

                    // row.multiLevelItems = this.getTreeData();
                    row.multiLevelItems = response.categories.map(item => new TreeviewItem(item));
                }
            }
        })
    };
    getEmployeeCommuTypes() {
        this.trackingService.getEmployeeType(this.facilityID).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.VehicleGrid = response.batchIds;
                }
            }
        })
    };
    getItems(): TreeviewItem[] {
        const childrenCategory = new TreeviewItem({
            text: 'Children', value: 1, checked: false, children: [
                { text: 'Baby 3-5', value: 11, checked: false },
                { text: 'Baby 6-8', value: 12, checked: false }
            ]
        });

        return [childrenCategory];
    }

    getSubEmployeeCommuTypes(id, row: any) {

        this.trackingService.getEmployeeSubVehicleCat(id, this.facilityID, this.year.getFullYear()).subscribe({
            next: (response) => {

                if (response.success == true) {
                    row.subVehicleCategory = response.batchIds;
                } else {
                    this.toastr.warning(response.message);
                    row.subVehicleCategory = [];
                }
            }
        })
    };



    getVehicleTypes() {
        this.trackingService.getVehicleType().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.VehicleGrid = response.categories;
                    this.upstreamVehicletypeId = this.VehicleGrid[0].id;
                    this.getSubVehicleCategory(this.upstreamVehicletypeId);


                }
            }
        })
    };
    getALlProducts() {
        const formData = new URLSearchParams();
        formData.set('country_code', this.facilityCountryCode);
        formData.set('year', this.year.getFullYear().toString());
        this.trackingService.getAllProductsPG(formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.allPRoducts = response.data;

                } else {
                    this.allPRoducts = [];
                }
            }
        })
    };
    onAllProductChange() {


        this.newExcelData = this.newExcelData.map(item => {
            if (item['S. No.'] === this.productID) {
                // Determine the correct code value based on productHSNSelect
                let selectedCode;
                if (this.productHSNSelect === 1) {
                    selectedCode = this.psg_product.HSN_code;
                } else if (this.productHSNSelect === 2) {
                    selectedCode = this.psg_product.NAIC_code;
                } else {
                    selectedCode = this.psg_product.ISIC_code;
                }

                return {
                    ...item,
                    code: selectedCode,
                    is_find: true, // Assign the selected code
                    productResult: {
                        ...item.productResult, // Spread the existing productResult
                        id: this.psg_product.id,
                        typeofpurchase: this.psg_product.typeofpurchase,
                        product: this.psg_product.product,
                        typesofpurchasename: this.psg_product.typesofpurchasename,
                        HSN_code: this.psg_product.HSN_code,
                        NAIC_code: this.psg_product.NAIC_code,
                        ISIC_code: this.psg_product.ISIC_code
                    }
                };
            }
            return item;
        });


        setTimeout(() => {
            this.visible2 = false;
        }, 100);
    }


    getVehicleTypesLease() {
        this.trackingService.getVehicleTypeLease().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.VehicleGrid = response.categories;

                    this.selectedVehicleType = 'Cars'

                }
            }
        })
    };

    onVehicleTypeChange(event: any) {
        const selectedIndex = event.value;
        this.selectedVehicleType = this.VehicleGrid[selectedIndex - 1].vehicle_type
        this.getSubVehicleCategory(selectedIndex)
    };

    onVehicleTypeChangeLease(event: any) {
        const selectedIndex = event.value;
        this.selectedVehicleType = this.VehicleGrid.find(items => items.id == selectedIndex).vehicle_type;
        this.getSubVehicleCategoryLease(selectedIndex)
    };

    getSubVehicleCategory(categoryId: any) {
        this.trackingService.getSubVehicleCat(categoryId, this.facilityID).subscribe({
            next: (response) => {
                // // // console.log(response);
                if (response.success == true) {
                    // this.VehicleGrid = response.categories;
                    this.subVehicleCategory = response.categories;
                    this.subVehicleCategoryValue = this.subVehicleCategory[0].vehicle_type
                }
            }
        })
    };

    getSubVehicleCategoryLease(categoryId: any) {
        this.trackingService.getSubVehicleCatLease(categoryId, this.facilityID).subscribe({
            next: (response) => {
                // // // console.log(response);
                if (response.success == true) {
                    // this.VehicleGrid = response.categories;
                    this.subVehicleCategory = response.categories;
                    this.subVehicleCategoryValue = this.subVehicleCategory[0].vehicle_type


                }
            }
        })
    };

    onWasteTypeChange(event: any) {
        const energyMethod = event.value;
        // // console.log("energy method,", energyMethod);
        this.waterWasteProduct = this.wasteGrid[energyMethod - 1].type

        this.getWasteSubCategory(energyMethod);

    };

    getWasteSubCategory(typeId: any) {

        let formData = new URLSearchParams();

        formData.set('type', typeId);
        formData.set('year', this.year.getFullYear().toString());
        this.trackingService.getWasteSubCategory(formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    // // console.log(response);
                    this.wasteSubTypes = response.categories;

                } else {
                    this.wasteSubTypes = [];
                }
            }
        })
    };
    onCityChange(event: any) {
        // event.value will contain the selected city object
        this.selectedflightsTravel = event.value;

        if (this.selectedflightsTravel == 'Generic') {

            this.flightDisplay1 = 'block'
            this.flightDisplay2 = 'none'
            this.flightDisplay3 = 'none'
            this.CostCentre();
        } else if (this.selectedflightsTravel == 'To/From') {
            this.getAirportCodes()
            this.flightDisplay2 = 'block'
            this.flightDisplay1 = 'none'
            this.flightDisplay3 = 'none'
        } else {
            this.getFlightTimeTypes();
            this.flightDisplay3 = 'block'
            this.flightDisplay1 = 'none'
            this.flightDisplay2 = 'none'
        }
    };

    getFranchiseType() {
        this.trackingService.getFranchiseType().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.franchiseGrid = response.categories;
                    this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    onFranchiseChange(event: any) {
        const frachiseTypevalue = event.value;

        this.franchiseCategoryValue = frachiseTypevalue
        this.getSubFranchiseCategory(frachiseTypevalue)
    };

    getSubFranchiseCategory(category: any) {
        this.trackingService.getSubFranchiseCat(category, this.facilityID, this.year.getFullYear().toString()).subscribe({
            next: (response) => {
                // // // console.log(response);
                if (response.success == true) {
                    this.subFranchiseCategory = response.categories;

                } else {
                    this.subFranchiseCategory = [];
                }
            }
        })
    };

    onCalculationMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;
        if (calMethod == 'Facility Specific method') {
            this.franchiseMethod = true;
            this.averageMethod = false
        } else {
            this.franchiseMethod = false;
            this.averageMethod = true
        }
    };

    modeOfEntryChange(selectedMode: string, row: any) {

        if (selectedMode === 'Average distance per trip') {
            row.unit = 'Km';
        } else if (selectedMode === 'Average qty of fuel per trip') {
            row.unit = 'Litre';
        } else {
            row.unit = this.currency;
        }
    }

    onProductEnergyTypeChange(event: any) {
        const energyMethod = event.value;
        this.getProductsEnergyCategory(energyMethod);
    };

    onpurchaseGoodsCategoryChange(event: any) {
        console.log(event.value);
        const energyMethod = event.value;
        this.selectedGoodsCategory = event.value
        this.onActivitySelected = false;
        if (energyMethod == 'Other') {
            this.onIndustrySelected = false;
            this.OthersSecledted = true;
            return;
        }

        this.onIndustrySelected = true;
        this.getProcessingActivityCategory(energyMethod);
    };

    getProductsEnergyCategory(typeId: any) {
        let formData = new URLSearchParams();

        formData.set('type', typeId);
        formData.set('country_code', this.facilityCountryCode);
        formData.set('year', this.year.getFullYear().toString());

        this.trackingService.getProductsEnergy(formData).subscribe({
            next: (response) => {
                // // // console.log(response);
                if (response.success == true) {
                    this.prodductEnergySubTypes = response.categories;

                } else {
                    this.prodductEnergySubTypes = [];
                }
            }
        })
    };

    onpurchaseActivityChange(event: any) {
        const energyMethod = event.value;
        this.onActivitySelected = true;
        this.getActivitySubCategory(energyMethod);

    };
    getActivitySubCategory(sector: any) {
        let formData = new URLSearchParams();

        formData.set('sector', sector);
        this.trackingService.getsubsectorCategory(formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.activitySubTypes = response.categories;

                }
            }
        })
    };

    bulkUploadCompany(tabNo: any) {
        this.singleCompanyTab = false;
        this.multipleCompanyTab = false;
        this.bulkCompanyTab = false;
        if (tabNo == 1) {
            this.singleCompanyTab = true;
        } else if (tabNo == 2) {
            this.multipleCompanyTab = true;
        } else {
            this.bulkCompanyTab = true;
        }

    }

    onCalculationPurchaseMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;
        if (calMethod == 'Site Specific method') {
            this.franchiseMethod = true;
            this.averageMethod = false
        } else {
            this.franchiseMethod = false;
            this.averageMethod = true
        }
    };

    getProcessingActivityCategory(industry: any) {
        let formData = new URLSearchParams();

        formData.set('industry', industry);
        this.trackingService.getPurchaseGoodsActivity(formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.productActivitySubTypes = response.categories;

                }
            }
        })
    };

    onQuantitySoldUnitChange(event: any) {

        const energyMethod = event.value;

        if (energyMethod == 1) {
            this.noOfItems = true;
            this.getFuelEnergyCategory();
            this.getRefrigerants();
        } else {
            this.subElectricityUnits = "per usage"
            this.noOfItems = false;
        }
        // this.getProductsEnergyCategory(energyMethod);

    };

    onExpectedLifetimeUnitChange(event: any) {
        const energyMethod = event.value;

        if (energyMethod == 1) {
            this.subElectricityUnits = "per usage"
        } else if (energyMethod == 2) {
            this.subElectricityUnits = "per day"
        }
        else if (energyMethod == 3) {
            this.subElectricityUnits = "per months"

        } else if (energyMethod == 4) {
            this.subElectricityUnits = "per year"
        }
        // this.getProductsEnergyCategory(energyMethod);

    };

    getFuelEnergyCategory() {
        this.trackingService.getEnergyFuelType().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.fuelEnergyTypes = response.categories;

                }
            }
        })
    };
    getRefrigerants() {
        this.trackingService.getrefrigents().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.refrigeratedTypes = response.categories;

                }
            }
        })
    };

    onSubCategoryFranchiseChange(event: any) {
        this.subFranchiseCategoryValue = event.value;

    };

    onCalculationInvestmentMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;

        if (calMethod == 'Investment Specific method') {
            this.franchiseMethod = true;
            this.averageMethod = false
        } else {
            this.franchiseMethod = false;
            this.averageMethod = true
        }
    };

    onInvestmentTypeChange(event: any) {
        const energyMethod = event.value;
        this.calculationRow = true;
        this.investmentTypeValue = energyMethod;

        if (this.franchiseMethodValue == 'Investment Specific method' && this.investmentTypeValue == 'Equity investments' && this.equityInvestmentRow == true) {
            this.equityInvestmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false;
            this.debtInvesmentRow = false;
        } else if (this.investmentTypeValue == 'Equity investments' && this.franchiseMethodValue == 'Average data method' && this.equityInvestmentRow == true) {
            this.equityInvestmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
            this.debtInvesmentRow = false;
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Average data method') {
            this.debtInvesmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
            this.InvestmentHeading = this.investmentTypeValue;
            this.equityInvestmentRow = false;
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Investment Specific method') {
            this.debtInvesmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false;
            this.InvestmentHeading = this.investmentTypeValue;
            this.equityInvestmentRow = false;
        }
    };

    onProjectPhaseChnage(event: any) {
        const calMethod = event.value;
        if (calMethod == 'In Construction phase') {
            this.RevenueRow = true;
        } else {
            this.RevenueRow = false;
        }
    };

    onInvestmentCalculationMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;
        if (calMethod == 'Investment Specific method' && this.investmentTypeValue == 'Equity investments') {
            this.equityInvestmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false
        } else if (this.investmentTypeValue == 'Equity investments' && calMethod == 'Average data method') {
            this.equityInvestmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && calMethod == 'Average data method') {
            this.debtInvesmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
            this.InvestmentHeading = this.investmentTypeValue;
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && calMethod == 'Investment Specific method') {
            this.debtInvesmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false;
            this.InvestmentHeading = this.investmentTypeValue;
        }
    };

    onInvestmentSectorChange(event: any) {
        const energyMethod = event.value;
        this.getInvestmentSubCategory(energyMethod);
    };

    getInvestmentSubCategory(category: any) {
        this.trackingService.getInvestmentSubCategory(category).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.subFranchiseCategory = response.sub_categories;

                }
            }
        })
    };

    getEndWasteType() {
        this.trackingService.getWasteType(this.facilityID).subscribe({
            next: (response) => {
                // // console.log(response, "sdgs");
                if (response.success == true) {
                    this.wasteGrid = response.categories;
                    this.waterWasteId = this.wasteGrid[0].id
                    this.waterWasteProduct = this.wasteGrid[0].type
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    setUnit() {
        if (this.VehicleDE.modeOfDE == 'Average distance per trip') {
            this.dataEntry.unit = "Km"
        }
        else if (this.VehicleDE.modeOfDE == 'Average qty of fuel per trip') {
            this.dataEntry.unit = "Litre"
        } else {
            this.dataEntry.unit = this.currency
        }
    };

    getPurchaseGoodsCategory() {
        this.trackingService.getPurchaseGoodsType().subscribe({
            next: (response) => {
                // // // console.log(response);
                if (response.success == true) {
                    this.purchaseGoodsTypes = response.categories;


                }
            }
        })
    };
    getPurchaseGoodsCurrency() {
        this.purchaseGoodsUnitsGrid = [];
        const formdata = new URLSearchParams();
        formdata.set('facilities', this.facilityID);
        this.trackingService.getPurchaseGoodsCurrency(formdata).subscribe({
            next: (response) => {
                // // // console.log(response);
                if (response.success == true) {
                    this.currency = response.categories;
                    this.purchaseGoodsUnitsGrid.push({ id: 1, units: this.currency })
                    const concatUnits =
                        [
                            {
                                "id": 2,
                                "units": "kg"
                            },
                            {
                                "id": 3,
                                "units": "tonnes"
                            },
                            {
                                "id": 4,
                                "units": "litres"
                            }
                        ]

                    this.purchaseGoodsUnitsGrid = this.purchaseGoodsUnitsGrid.concat(concatUnits);
                };
                this.rowsPurchased = [{
                    id: 1,
                    multiLevelItems: [],
                    productService: null,
                    productType: null,
                    subVehicleCategory: [],  // Add any other nested dropdown arrays here if needed
                    months: '',
                    quantity: '',
                    selectedUnit: '',
                    vendorName: '',
                    vendorspecificEF: '',
                    vendorspecificEFUnit: `kgCO2e/${this.currency}` // Make sure to initialize this as well
                }];
            }
        })
    };

    getInvestmentCategories() {
        this.trackingService.getInvestmentCategories().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.wasteGrid = response.categories;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    getBatch() {
        this.trackingService.getBatches().subscribe({
            next: (response) => {
                if (response.success == true) {
                    this.batchId = response.batchIds[0].batch_id;
                    // this.getStatusData(1)

                } else {

                }

            }
        })
    };


    onSelectedChange(event: any, row: any) {
        this.deselectAllItems(row.multiLevelItems);

        if (!event.children && event.length === 1) {
            event.checked = true;
            row.productType = event[0].item.value;
        } else {
            this.deselectAllItems(event);
            row.productType = null;

        }
        this.updatePlaceholder();
    }

    deselectAllItems(items: TreeviewItem[]) {
        items.forEach(item => {

            item.checked = false;
            if (item.children) {
                this.deselectAllItems(item.children);
            }
        });
    };

    updatePlaceholder() {
        const selectedItems = this.multiLevelItems.filter(item => item.checked);
        const placeholder = selectedItems.length > 0 ? `${selectedItems.length} options` : 'Choose product type';
        // // console.log('Placeholder:', placeholder);
    };


    openProgresstab() {
        this.singlePGSTab = !this.singlePGSTab
        this.progressPSGTab = true;

        const formdata = new URLSearchParams();
        formdata.set('facilityID', this.facilityID);
        formdata.set('userId', this.loginInfo.Id.toString());
        this.appService.postAPI('/get-purchase-good-data-using-user-facilityId', formdata).subscribe({
            next: (response: any) => {

                if (response.success == true) {
                    this.psg_ai_progress_data = response.data;
                } else {
                    this.psg_ai_progress_data = [];
                    this.notification.showWarning(response.message, '');
                }
            }
        })

    };



    changeStatus() {

        this.newExcelData = this.newExcelData.map(item => {
            if (item['S. No.'] === this.productID) {
                // Determine the correct code value based on productHSNSelect
                let selectedCode;

                return {
                    ...item,
                    code: '',
                    is_find: false,
                    productResult: {
                        ...item.productResult, // Spread the existing productResult
                        id: '',
                        typeofpurchase: '',
                        product: '',
                        typesofpurchasename: '',
                        HSN_code: '',
                        NAIC_code: '',
                        ISIC_code: ''
                    }
                };
            }
            return item;
        });


        setTimeout(() => {
            this.visible2 = false;
        }, 100);
    };

    changeStatustoMatch() {

        this.newExcelData = this.newExcelData.map(item => {
            if (item['S. No.'] === this.productID) {
                // Determine the correct code value based on productHSNSelect
                let selectedCode;

                return {
                    ...item,
                    code: '',
                    is_find: true,
                    productResult: {
                        ...item.productResult,
                        other_category_flag: '0'

                    }
                };
            }
            return item;
        });


        setTimeout(() => {
            this.visible2 = false;
            this.hideMatchButon = false;
        }, 100);
    };


    loadAIMatchData(id: any) {
        const formdata = new URLSearchParams();
        formdata.set('purchase_payload_id', id);
        this.appService.postAPI('/get-purchase-good-matched-data-using-payload-id', formdata).subscribe({
            next: (response: any) => {
                if (response.success == true) {

                    this.newExcelData = response.data;
                    this.progressPSGTab = false;
                    this.singlePGSTab = !this.singlePGSTab;

                } else {
                    this.newExcelData = [];
                    this.notification.showWarning(response.message, '');
                }
            }
        })

    };

    downloadPurchaseGoodsExcel() {
        this.downloadFileService.downloadFile(this.downloadExcelUrl, 'Purchase Goods.xlsx');
    };

    downloadCompanyExcel() {
        this.downloadFileService.downloadFile(this.downloadCompanyExcelUrl, this.SubCatAllData
            .manageDataPointSubCategorySeedID == 10 ? 'Passenger Vehicle' : 'Delivery Vehicle');
    };


    getOtherModesVechile() {
        const formdata = new URLSearchParams();
        formdata.set('facility_id', this.facilityID);
        this.appService.postAPI('/Othermodes_of_transport_type_name', formdata).subscribe({
            next: (response: any) => {
                this.ModesTravelGrid = response.data;

            }
        })
    };

    onModesChangeM(event: any, row) {
        const selectedMode = event.value;
        this.carMode = true;
        this.autoMode = false;
        this.ModeSelected = true;
        let optionvalue = [];
        const formdata = new URLSearchParams();
        formdata.set('type_name', selectedMode);
        formdata.set('facility_id', this.facilityID);

        this.appService.postAPI('/get_Othermodes_of_transport_node_type_by_type_name', formdata).subscribe({
            next: (response: any) => {
                optionvalue = response.data;
                if (selectedMode == 'Car') {
                    this.carMode = true;
                    this.autoMode = false;

                    this.mode_name = selectedMode;

                    row.mode_type = optionvalue;

                    row.isDisabled = true;
                    this.cdRef.detectChanges();
                } else if (selectedMode == 'Auto') {
                    this.autoMode = true;
                    this.carMode = true;

                    this.mode_name = selectedMode;
                    row.mode_type = optionvalue;
                    row.carFuel_type = [];
                    row.isDisabled = true;
                } else if (selectedMode == 'Bus') {
                    this.carMode = false;
                    this.autoMode = true;

                    this.mode_name = selectedMode;
                    row.mode_type = optionvalue;
                    row.carFuel_type = [];
                    row.isDisabled = false;
                }
                else if (selectedMode == 'Rail') {
                    this.carMode = false;

                    this.mode_name = selectedMode;
                    row.mode_type = optionvalue;
                    row.carFuel_type = [];
                    row.isDisabled = false
                }
                else if (selectedMode == 'Ferry') {
                    this.carMode = false;
                    this.autoMode = true;

                    this.mode_name = selectedMode;
                    row.mode_type = optionvalue;
                    row.carFuel_type = [];
                    row.isDisabled = false
                }
            }
        })


    };


    setActive(index: number): void {

        this.categoryId = 13;
        this.businessId = index;
        this.ALLEntries();
        this.noOfItems = false;

        // this.ModeSelected = false;
        this.calculationRow = false;
        this.equityInvestmentRow = false;

        // if (this.categoryId == 24) {

        //     this.ModeSelected = false;
        //     this.categoryName = 'Flight'

        //     this.getFlightType();
        //     this.CostCentre();


        // } else if (this.categoryId == 25) {
        //     this.ModeSelected = false;
        //     this.categoryName = 'Hotel Stay';

        // } else if (this.categoryId == 26) {
        //     this.getOtherModesVechile();
        //     this.categoryName = 'Other Modes of Transport';

        // }


    };

    //entrysave function to save dataentry
    EntrySave(form: NgForm) {
        if (this.loginInfo.role == 'Auditor') {
            this.notification.showError('You are not Authorized', 'Warning');
            return false
        }
        this.dataEntry.month = this.selectMonths.map((month) => month.value)
            .join(','); //this.getMonthName();
        this.dataEntry.year = this.year.getFullYear().toString(); //this.getYear();
        var spliteedMonth = this.dataEntry.month.split(",");
        var monthString = JSON.stringify(spliteedMonth);


        let fId = sessionStorage.getItem('SelectedfacilityID');
        if (fId == '0') {
            this.notification.showInfo(
                'Select Facility',
                ''
            );
            return
        }
        if (this.selectMonths.length == 0 && this.categoryId != 8 && this.categoryId != 14 && this.categoryId != 24 && this.categoryId != 25 && this.categoryId != 26) {
            this.notification.showInfo(
                'Select month',
                ''
            );
            return
        }
        if (this.categoryId == 1) {
            if (
                this.dataEntry.readingValue <= 0 ||
                this.dataEntry.readingValue === null ||
                this.dataEntry.readingValue === undefined
            ) {
                return;
            }
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            let formData = new FormData();

            if (this.SubCatAllData.subCatName == 'Liquid Fuels') {

                if (this.dataEntry.typeID == 1) {
                    if (this.SCdataEntry.blendType == 'No Blend') {
                        this.SCdataEntry.blendID = 1;
                    }
                    if (this.SCdataEntry.blendType == 'Average Blend') {
                        this.SCdataEntry.blendID = 2;
                    }
                    if (this.SCdataEntry.blendType == 'Perc. Blend') {
                        formData.set('blendPercent', this.SCdataEntry.blendPercent.toString());
                    }
                }
                else if (this.dataEntry.typeID == 2) {
                    if (this.SCdataEntry.blendType == 'No Blend') {
                        this.SCdataEntry.blendID = 1;
                    }
                    if (this.SCdataEntry.blendType == 'Average Blend') {
                        this.SCdataEntry.blendID = 2;

                    }
                    if (this.SCdataEntry.blendType == 'Perc. Blend') {
                        formData.set('blendPercent', this.SCdataEntry.blendPercent.toString());

                    }
                }
                else {
                    this.EmissionFactor.forEach(ef => {
                        if (ef.subCatTypeID == this.dataEntry.typeID) {
                            if (this.SCdataEntry.calorificValue != null) {
                                this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                                return;
                            }
                            if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                                this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                                return;
                            }
                            else {
                                this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                                return;
                            }
                        }

                    })

                }

            }
            else if (this.SubCatAllData.subCatName == 'Solid Fuels') {
                this.EmissionFactor.forEach(ef => {
                    if (ef.subCatTypeID == this.dataEntry.typeID) {
                        if (this.SCdataEntry.calorificValue != null) {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                            return;
                        }
                        if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                            return;
                        }
                        else {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                            return;
                        }
                    }

                })
            }
            else if (this.SubCatAllData.subCatName == 'Gaseous Fuels') {
                this.EmissionFactor.forEach(ef => {
                    if (ef.subCatTypeID == this.dataEntry.typeID) {
                        if (this.dataEntry.unit == 'kwh') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                            return;
                        }
                        if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                            return;
                        }
                        else {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                            return;
                        }
                    }

                })

            }
            else {
                this.SCdataEntry.calorificValue = null;
                this.EmissionFactor.forEach(ef => {
                    if (ef.subCatTypeID == this.dataEntry.typeID) {
                        if (this.dataEntry.unit == 'kg' || this.dataEntry.unit == 'KG' || this.dataEntry.unit == 'Kg') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_kg;
                            return;
                        }
                        if (this.dataEntry.unit == 'GJ' || this.dataEntry.unit == 'Gj') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_Gj;
                            return;
                        }
                        if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                            return;

                        }
                        else {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                            return;
                        }
                    }

                })
            }


            console.log("type", this.dataEntry.typeID);

            formData.set('subCategoryTypeId', (this.dataEntry.typeID).toString());
            formData.set('SubCategorySeedID', (this.SubCatAllData
                .manageDataPointSubCategorySeedID).toString());
            formData.set('blendType', this.SCdataEntry.blendType);
            formData.set('calorificValue', this.dataEntryForm.value.calorificValue ? this.dataEntryForm.value.calorificValue : '');
            formData.set('unit', this.dataEntry.unit);
            formData.set('readingValue', this.dataEntry.readingValue.toString());
            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('facility_id', this.facilityID);
            if (this.selectedFile) {
                formData.set('file', this.selectedFile, this.selectedFile.name);
            }
            this.trackingService.newPostSCDataEntry(formData).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        console.log("coming here");
                        this.resetForm();
                        // this.getStationaryFuelType(this.SubCatAllData
                        //     .manageDataPointSubCategorySeedID);
                        this.ALLEntries();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        //this.GetAssignedDataPoint(this.facilityID);
                        // this.trackingService.getrefdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                        //     next: (response) => {
                        //         this.commonDE = response;
                        //     }
                        // });

                        this.activeindex = 0;
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            });
        }
        if (this.categoryId == 2) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            let formData = new FormData();
            this.RefrigerantDE.typeID = this.dataEntry.typeID;

            formData.set('subCategoryTypeId', (this.dataEntry.typeID).toString());
            formData.set('SubCategorySeedID', this.SubCatAllData
                .manageDataPointSubCategorySeedID.toString());
            formData.set('refAmount', this.RefrigerantDE.refAmount.toString());

            formData.set('unit', this.dataEntry.unit);
            formData.set('facilities', this.facilityID);

            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);
            if (this.selectedFile) {
                formData.set('file', this.selectedFile, this.selectedFile.name);
            }
            this.trackingService.newPostRegrigerantDataEntry(formData).subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();

                        this.ALLEntries();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);

                        this.activeindex = 0;
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            });
        }
        if (this.categoryId == 3) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            let formData = new FormData();
            formData.set('NumberOfExtinguisher', this.FireExtinguisherDE.numberOfExtinguisher.toString());
            formData.set('unit', this.dataEntry.unit);
            formData.set('quantityOfCO2makeup', this.FireExtinguisherDE.quantityOfCO2makeup.toString());
            formData.set('fireExtinguisherID', this.FireExtinguisherDE.fireExtinguisherID?.toString());
            formData.set('facilities', this.facilityID);
            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('SubCategorySeedID', this.SubCatAllData.manageDataPointSubCategorySeedID.toString());
            if (this.selectedFile) {
                formData.set('file', this.selectedFile, this.selectedFile.name);
            }
            this.trackingService.newPostFireExtinguisherDataEntry(formData).subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
                        this.ALLEntries();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);


                        this.activeindex = 0;
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            });
        }
        if (this.categoryId == 6) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }

            if (this.singleCompanyTab) {
                var payloads = this.rowsCompany.map(row => ({

                    vehicle_type: row.vehicleType,
                    no_of_vehicles: row.noOfVehicles,
                    trip_per_vehicle: row.tripsPerVehicle,
                    mode_of_data_entry: row.modeOfEntry,
                    value: row.value,
                    unit: row.unit,
                    sub_category: this.SubCatAllData
                        .manageDataPointSubCategorySeedID,
                    is_excel: 0

                }));

            }
            if (this.multipleCompanyTab) {
                var payloads = this.rowsCompany.map(row => ({

                    vehicle_type: row.vehicleType,
                    no_of_vehicles: row.noOfVehicles,
                    trip_per_vehicle: row.tripsPerVehicle,
                    mode_of_data_entry: row.modeOfEntry,
                    value: row.value,
                    unit: row.unit,
                    sub_category: this.SubCatAllData
                        .manageDataPointSubCategorySeedID,
                    is_excel: 1

                }));

            }
            if (this.bulkCompanyTab) {
                var payloads = this.jsonCompanyData.map(row => ({
                    vehicle_type: row.vehicleType,
                    no_of_vehicles: row.noOfVehicles,
                    trip_per_vehicle: row.tripsPerVehicle,
                    mode_of_data_entry: row.modeOfEntry,
                    value: row.value,
                    unit: row.unit,
                    sub_category: this.SubCatAllData
                        .manageDataPointSubCategorySeedID,
                    is_excel: 1

                }));

            }

            var companyOwnedVehicles = JSON.stringify(payloads);
            if (this.selectedFile) {
                var formData = new FormData();
                formData.set('file', this.selectedFile, this.selectedFile.name);
                formData.set('facilityId', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('jsonData', companyOwnedVehicles.toString());
            } else {

                var formData2 = new URLSearchParams();
                formData2.set('facilityId', this.facilityID);
                formData2.set('month', monthString);
                formData2.set('year', this.dataEntry.year);
                formData2.set('jsonData', companyOwnedVehicles.toString());
            }


            this.appService.postAPI('/add-multiple-company-owned-vehicles', this.selectedFile ? formData : formData2).subscribe({
                next: (response: any) => {
                    if (response.success == true) {
                        this.ALLEntries();
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        this.VehicleDE.modeOfDE = this.ModeType[0].modeName;

                        if (this.SubCatAllData.manageDataPointSubCategorySeedID == 10) {

                            this.getPassengerVehicleType();
                        }
                        else {

                            this.getDeliveryVehicleType();
                        }
                        this.activeindex = 0;

                        this.rowsCompany = [{
                            vehicleType: null,
                            noOfVehicles: null,
                            tripsPerVehicle: null,
                            modeOfEntry: 'Average distance per trip',
                            value: null,
                            unit: 'Km'
                        }];;

                        this.jsonCompanyData = [];
                    } else {
                        this.notification.showError(
                            'Data entry added failed.',
                            'Error'
                        );
                        this.rowsCompany = [{
                            vehicleType: null,
                            noOfVehicles: null,
                            tripsPerVehicle: null,
                            modeOfEntry: 'Average distance per trip',
                            value: null,
                            unit: 'Km'
                        }];;

                        this.jsonCompanyData = [];
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            });
            // }


        }
        if (this.categoryId == 5) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            if (this.SubCatAllData.manageDataPointSubCategorySeedID == 9) {
                var formData = new FormData();
                formData.set('RegionID', this.RenewableElectricity.electricityRegionID.toString());
                formData.set('readingValue', this.dataEntry.readingValue.toString());
                formData.set('unit', this.dataEntry.unit);
                formData.set('facilities', this.facilityID);
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('SubCategorySeedID', this.SubCatAllData
                    .manageDataPointSubCategorySeedID.toString());
                if (this.selectedFile) {
                    formData.set('file', this.selectedFile, this.selectedFile.name);
                }
                this.trackingService.newPostElectricityDataEntry(formData).subscribe({
                    next: (response) => {
                        if (response.success == true) {
                            this.resetForm();

                            this.getUnit(this.SubCatAllData
                                .manageDataPointSubCategorySeedID);

                            this.activeindex = 0;

                            this.ALLEntries();

                            this.notification.showSuccess(
                                'Data entry added successfully',
                                'Success'
                            );

                        } else {
                            this.notification.showError(
                                response.message,
                                'Error'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Data entry added failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    },
                    complete: () => { }
                });

            }
            else {
                var formData = new FormData();
                formData.set('typeID', this.marketEElecID);
                formData.set('readingValue', this.dataEntry.readingValue.toString());
                formData.set('sourceName', this.sourceName || '');
                formData.set('unit', this.dataEntry.unit);
                formData.set('facilities', this.facilityID);
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('emission_factor', form.value.emission_factorS);
                formData.set('SubCategorySeedID', this.SubCatAllData
                    .manageDataPointSubCategorySeedID.toString());
                if (this.selectedFile) {
                    formData.set('file', this.selectedFile, this.selectedFile.name);
                }
                this.trackingService.newPostElectricityMarket(formData).subscribe({
                    next: (response) => {

                        if (response.success == true) {
                            this.resetForm();
                            //this.GetAssignedDataPoint(this.facilityID);
                            this.getUnit(this.SubCatAllData
                                .manageDataPointSubCategorySeedID);

                            this.activeindex = 0;

                            this.ALLEntries();

                            this.notification.showSuccess(
                                'Data entry added successfully',
                                'Success'
                            );


                        } else {
                            this.notification.showError(
                                response.message,
                                'Error'
                            );
                        }
                        // this.marketEElecID = this.marketTypes[0].id;


                    },
                    error: (err) => {
                        this.notification.showError(
                            'Data entry added failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    },
                    complete: () => { }
                });
            }



        }
        if (this.categoryId == 7) {
            var formData = new FormData();
            formData.set('typeID', this.dataEntry.typeID.toString());
            formData.set('readingValue', this.dataEntry.readingValue.toString());
            formData.set('unit', this.dataEntry.unit);
            formData.set('facilities', this.facilityID);
            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('SubCategorySeedID', this.SubCatAllData
                .manageDataPointSubCategorySeedID.toString());
            if (this.selectedFile) {
                formData.set('file', this.selectedFile, this.selectedFile.name);
            }

            this.trackingService.newPostHeatandSteamDataEntry(formData).subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.resetForm();
                        this.ALLEntries();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);

                        this.activeindex = 0;
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            });
        }
        if (this.categoryId == 8) {
            if (this.singlePGSTab) {

                const filledRows = this.rowsPurchased.filter(row =>

                    row.productType == null
                );

                if (filledRows.length > 0) {
                    this.notification.showInfo(
                        "Please select product service code",
                        'Warning'
                    );
                    return;
                }
                if (this.isAnnual == undefined || this.isAnnual == null) {
                    this.notification.showInfo(
                        "Please select annual entry",
                        'Warning'
                    );
                    return;
                }
                if (this.selectMonths.length == 0 && form.value.annualEntry == 0) {
                    this.notification.showInfo(
                        'Select month',
                        ''
                    );
                    return
                }

                // Prepare the payload
                const payload = this.rowsPurchased.map(row => ({
                    month: row.months,
                    typeofpurchase: row.productService,
                    valuequantity: row.quantity,
                    unit: row.selectedUnit,
                    vendorId: row.vendorName?.id,
                    vendor: row.vendorName?.name,
                    vendorunit: row.vendorspecificEFUnit,
                    vendorspecificEF: row.vendorspecificEF,
                    product_category: row.productType
                }));

                var purchaseTableStringfy = JSON.stringify(payload)

                var formData = new FormData();
                // formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('productcodestandard', this.productHSNSelect);
                formData.set('is_annual', this.isAnnual);
                formData.set('facilities', this.facilityID);
                formData.set('jsonData', purchaseTableStringfy);
                formData.set('month', monthString);
                if (this.selectedFile) {
                    formData.set('file', this.selectedFile, this.selectedFile.name);
                }

                this.trackingService.submitPurchaseGoods(formData).subscribe({
                    next: (response) => {

                        if (response.success == true) {
                            this.notification.showSuccess(
                                response.message,
                                'Success'
                            );
                            // this.rowsPurchased.forEach(levels => {
                            //     levels.productType = null
                            //     this.deselectAllItems(levels.multiLevelItems)
                            // })


                            // this.rowsPurchased = [{
                            //     id: 1,
                            //     multiLevelItems: [],
                            //     productService: null,
                            //     productType: null,
                            //     subVehicleCategory: [],  
                            //     months: '',
                            //     quantity: '',
                            //     selectedUnit: '',
                            //     vendorName: '',
                            //     vendorspecificEF: '',
                            //     vendorspecificEFUnit: `kgCO2e/${this.currency}` 
                            // }];

                            // this.GetHSN();


                            this.resetForm();
                            this.ALLEntries();

                        } else {
                            this.notification.showError(
                                response.message,
                                'Error'
                            );

                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Data entry added failed.',
                            'Warning'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    },
                    complete: () => { }
                });
            } else {

                const payload = this.newExcelData.filter(row => row.is_find == true && (row.productResult.other_category_flag == '0' || row.productResult.other_category_flag == '')).map(row => ({
                    month: '',
                    typeofpurchase: row.productResult.typeofpurchase,
                    valuequantity: row['Value / Quantity'],
                    unit: row['Unit'],
                    vendorId: '',
                    vendor: row['Vendor'],
                    vendorunit: row['Vendor Specific Unit'],
                    vendorspecificEF: row['Vendor Specific EF'],
                    product_category: row.productResult?.id,
                    product_description: row['Product / Service Description'],
                    purchase_date: row['Purchase Date'],
                    productcode: row.code,
                    is_find: row.is_find,
                    product_name: row.productResult?.product
                }))


                var purchaseTableStringfy = JSON.stringify(payload);


                var formData = new FormData();

                formData.set('productcodestandard', this.productHSNSelect);
                formData.set('facilities', this.facilityID);
                formData.set('jsonData', purchaseTableStringfy);
                formData.set('is_annual', '0');
                formData.set('tenant_id', this.loginInfo.tenantID.toString());
                formData.set('super_tenant_id', this.superAdminID.toString());


                if (this.selectedFile) {
                    formData.set('file', this.selectedFile, this.selectedFile.name);
                }
                this.trackingService.submitPurchaseGoods2(formData).subscribe({
                    next: (response) => {

                        if (response.success == true) {
                            this.notification.showSuccess(
                                response.message,
                                'Success'
                            );
                            this.newExcelData = [];


                            this.GetHSN();
                            // this.deselectAllItems(this.rowsPurchased)

                            this.resetForm();
                            this.ALLEntries();

                        } else {
                            this.notification.showError(
                                response.message,
                                'Error'
                            );

                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Data entry added failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    },
                    complete: () => { }
                });
            }


        }
        if (this.categoryId == 10) {
            let formData = new URLSearchParams();

            if (this.storageTransporationChecked === true && this.vehcilestransporationchecked === true) {
                formData.set('vehicle_type', this.upstreamVehicletypeId);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('mass_unit', 'tonnes');
                formData.set('distance_unit', 'km');
                formData.set('area_occupied_unit', 'm2');
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('storagef_type', this.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.storageTransporationChecked === true) {
                formData.set('storagef_type', this.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
                formData.set('area_occupied_unit', 'm2');
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.vehcilestransporationchecked == true) {
                formData.set('vehicle_type', this.upstreamVehicletypeId);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('mass_unit', 'tonnes');
                formData.set('distance_unit', 'km');
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            }


            this.trackingService.upStreamTransportation(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        // this.getVehicleTypes()
                        // this.getSubVehicleCategory(1);
                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        // this.dataEntryForm.reset();
                        // this.getSubVehicleCategory(1)
                    }
                    this.ALLEntries();
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            });
        }
        if (this.categoryId == 11) {


            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }

            if (form.value.water_supply <= form.value.water_treatment) {
                this.notification.showInfo(
                    'Water withdrawn should be greater than or equal to water discharged',
                    'Error'
                );
                return
            }

            if (form.value.water_supply < 0 || form.value.water_supply == null) {
                this.notification.showInfo(
                    'Enter water withdrawn',
                    'Error'
                );
                return
            }
            if (form.value.water_treatment < 0 || form.value.water_treatment == null) {
                this.notification.showInfo(
                    'Enter water discharged',
                    'Error'
                );
                return
            }


            if (this.waterSupplyUnit == 'kilo litres') {
                var allUnits = 1
            }
            if (this.waterSupplyUnit == 'cubic m') {
                var allUnits = 2
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            var waterobj1 = { "type": "Surface water", "kilolitres": form.value.surface_water };
            var waterobj2 = { "type": "Groundwater", "kilolitres": form.value.groundwater };
            var waterobj3 = { "type": "Third party water", "kilolitres": form.value.thirdParty };
            var waterobj4 = { "type": "Sea water / desalinated water", "kilolitres": form.value.seaWater };
            var waterobj5 = { "type": "Others", "kilolitres": form.value.others };

            const typoOfOffice = [waterobj1, waterobj2, waterobj3, waterobj4, waterobj5]
            var water_withdrawlStringfy = JSON.stringify(typoOfOffice);


            var waterDischargeonlyobj1 = { "type": "Surface water", "kilolitres": form.value.surface_water_dest };
            var waterDischargeonlyobj2 = { "type": "Groundwater", "kilolitres": form.value.groundwater_dest };
            var waterDischargeonlyobj3 = { "type": "Third party water", "kilolitres": form.value.thirdParty_dest };
            var waterDischargeonlyobj4 = { "type": "Sea water / desalinated water", "kilolitres": form.value.seaWater_dest };
            var waterDischargeonlyobj5 = { "type": "Others", "kilolitres": form.value.others_dest };

            const typoOfDischargeonlyOffice = [waterDischargeonlyobj1, waterDischargeonlyobj2, waterDischargeonlyobj3, waterDischargeonlyobj4, waterDischargeonlyobj5]
            var water_DischargeonlyStringfy = JSON.stringify(typoOfDischargeonlyOffice);

            var waterDischargeobj1 = { "type": "Into Surface water", "withthtreatment": form.value.surface_withTreatment, "leveloftreatment": form.value.surface_levelTreatment };
            var waterDischargeobj2 = { "type": "Into Ground water", "withthtreatment": form.value.ground_withTreatment, "leveloftreatment": form.value.ground_levelTreatment };
            var waterDischargeobj3 = { "type": "Into Seawater", "withthtreatment": form.value.seawater_withTreatment, "leveloftreatment": form.value.seawater_levelTreatment };
            var waterDischargeobj4 = { "type": "Send to third-parties", "withthtreatment": form.value.third_withTreatment, "leveloftreatment": form.value.third_levelTreatment };
            var waterDischargeobj5 = { "type": "Others", "withthtreatment": form.value.others_withTreatment, "leveloftreatment": form.value.others_levelTreatment };

            const dischargeWater = [waterDischargeobj1, waterDischargeobj2, waterDischargeobj3, waterDischargeobj4, waterDischargeobj5]
            var waterDischargeStringfy = JSON.stringify(dischargeWater)
            let formData = new URLSearchParams();

            formData.set('water_supply', form.value.water_supply);
            formData.set('water_treatment', form.value.water_treatment);
            formData.set('water_supply_unit', '1');
            formData.set('water_treatment_unit', '1');
            formData.set('water_withdrawl', water_withdrawlStringfy);
            formData.set('water_discharge_only', water_DischargeonlyStringfy);
            formData.set('water_discharge', waterDischargeStringfy);
            formData.set('facilities', this.facilityID);
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('batch', '1');


            this.trackingService.AddwatersupplytreatmentCategory(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.waterSupplyUnit = 'kilo litres'

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.waterSupplyUnit = 'kilo litres'

                    }
                    this.ALLEntries();
                },
                error: (err) => {
                    this.waterSupplyUnit = 'kilo litres'
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 12) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            if (form.value.waste_quantity == null || form.value.waste_quantity == '') {
                this.notification.showInfo(
                    'Enter waste quantity',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            let formData = new URLSearchParams();
            if (this.wasteMethod == 'recycling') {
                formData.set('product', this.waterWasteProduct);
                formData.set('waste_type', this.wasteSubCategory);
                formData.set('total_waste', form.value.waste_quantity);
                formData.set('method', this.wasteMethod);
                formData.set('unit', 'tonnes');
                formData.set('waste_loop', this.recycleSelectedMethod);
                formData.set('id', this.waterWasteId.toString());
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facility_id', this.facilityID);
            } else {
                formData.set('product', this.waterWasteProduct);
                formData.set('waste_type', this.wasteSubCategory);
                formData.set('total_waste', form.value.waste_quantity);
                formData.set('method', this.wasteMethod);
                formData.set('unit', 'tonnes');
                formData.set('id', this.waterWasteId.toString());
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facility_id', this.facilityID);
            }


            this.trackingService.wasteGeneratedEmission(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        // this.wasteMethod = this.waterWasteMethod[0].id
                        // this.getWasteSubCategory("1")

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        // this.dataEntryForm.reset();
                        // this.wasteMethod = this.waterWasteMethod[0].id

                    }
                    this.ALLEntries();
                    // this.recycle = false;
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 14) {

            // Filter out rows where no field is filled
            const filledRows = this.rows.filter(row => row.vehicleType1 != null);


            if (filledRows.length === 0) {
                this.notification.showWarning(
                    "Select at least one vehicle type",
                    'Warning'
                );
                return;
            }

            const isValid = filledRows.every(row =>
                row.vehicleType1 &&
                row.vehicleType2 &&
                row.employeesCommute &&
                row.avgCommute
            );

            if (!isValid) {
                this.toastr.warning('All fields in each selected row must be filled!');
                // Show user feedback or stop form submission
                return;
            }

            // Prepare the payload
            const payload = filledRows.map(row => ({
                type: row.vehicleType1,
                subtype: row.vehicleType2,
                employeesCommute: row.employeesCommute,
                avgCommute: row.avgCommute
            }));



            var typeoftransportStringfy = JSON.stringify(payload)
            let formData = new URLSearchParams();

            formData.set('batch', '1');
            formData.set('noofemployees', form.value.noofemployees);
            formData.set('workingdays', form.value.workingdays);
            formData.set('typeoftransport', typeoftransportStringfy);
            formData.set('facilities', this.facilityID);
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);

            this.trackingService.uploadEmployeeCommunity(formData.toString()).subscribe({
                next: (response) => {
                    this.ALLEntries();
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();


                    } else {
                        this.notification.showWarning(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 15) {
            if ((parseInt(this.noofmonths_1) + parseInt(this.noofmonths_2) + parseInt(this.noofmonths_3)) > 12) {
                this.notification.showWarning(
                    'Sum of no of months cant greater than 12',
                    'Error'
                );
                return
            }

            var obj1 = { "type": "1", "noofemployees": this.noofemployees_1, "noofdays": this.noofdays_1, "noofmonths": this.noofmonths_1 };
            var obj2 = { "type": "2", "noofemployees": this.noofemployees_2, "noofdays": this.noofdays_2, "noofmonths": this.noofmonths_2 };
            var obj3 = { "type": "3", "noofemployees": this.noofemployees_3, "noofdays": this.noofdays_3, "noofmonths": this.noofmonths_3 };
            const typoOfOffice = [obj1, obj2, obj3];

            const isValid = typoOfOffice.every(row =>
                row.noofemployees != null && row.noofemployees !== '' &&
                row.noofdays != null && row.noofdays !== '' &&
                row.noofmonths != null && row.noofmonths !== ''
            );

            if (!isValid) {
                this.toastr.warning('All fields must be filled!');
                return;
            }
            var typeofhomeofficeStringfy = JSON.stringify(typoOfOffice)


            let formData = new URLSearchParams();

            formData.set('batch', '1');
            formData.set('typeofhomeoffice', typeofhomeofficeStringfy);
            formData.set('facilities', this.facilityID);
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
            this.trackingService.uploadHomeOffice(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.averageMethod = false;
                        this.franchiseMethod = false;

                    }
                    this.ALLEntries();
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();
                    this.getFranchiseType();
                    this.getSubFranchiseCategory('Banking Financial Services');
                    this.averageMethod = false;
                    this.franchiseMethod = false;

                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 16) {

            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var is_vehicle = 0;
            var is_facility = 0;
            if (this.leasefacilitieschecked === true) {
                is_facility = 1
            }
            if (this.leasevehcileschecked === true) {
                is_vehicle = 1
            }
            let formData = new URLSearchParams();
            if (is_facility == 1 && is_vehicle == 0) {
                if (this.averageMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', this.franchiseCategoryValue);
                    formData.set('sub_category', this.subfacilityTypeValue);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('franchise_space', form.value.upLeasefranchise_space);
                    formData.set('unit', 'm2');
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                    formData.set('facility_id', this.facilityID);
                } else if (this.franchiseMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', this.franchiseCategoryValue);
                    formData.set('sub_category', this.subfacilityTypeValue);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('scope1_emission', form.value.scope1_emission);
                    formData.set('scope2_emission', form.value.scope2_emission);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                    formData.set('facility_id', this.facilityID);
                }
            } else if (is_vehicle == 1 && is_facility == 0) {
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('vehicle_subtype', this.subVehicleCategoryValue);
                formData.set('no_of_vehicles', form.value.noOfVehicles);
                formData.set('distance_travelled', form.value.distanceInKms);
                formData.set('distance_unit', 'km');
                formData.set('is_vehicle', is_vehicle.toString());
                formData.set('is_facility', is_facility.toString());
                formData.set('facility_id', this.facilityID);
            }
            else if (is_vehicle == 1 && is_facility == 1) {
                if (this.averageMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', this.franchiseCategoryValue);
                    formData.set('sub_category', this.subfacilityTypeValue);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('franchise_space', form.value.upLeasefranchise_space);
                    formData.set('unit', 'm2');
                    formData.set('vehicle_type', this.selectedVehicleType);
                    formData.set('vehicle_subtype', this.subVehicleCategoryValue);
                    formData.set('no_of_vehicles', form.value.noOfVehicles);
                    formData.set('distance_travelled', form.value.distanceInKms);
                    formData.set('distance_unit', 'km');
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                    formData.set('facility_id', this.facilityID);
                } else if (this.franchiseMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', this.franchiseCategoryValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('scope1_emission', form.value.scope1_emission);
                    formData.set('scope2_emission', form.value.scope2_emission);
                    formData.set('vehicle_type', this.selectedVehicleType);
                    formData.set('vehicle_subtype', this.subVehicleCategoryValue);
                    formData.set('no_of_vehicles', form.value.noOfVehicles);
                    formData.set('distance_travelled', form.value.distanceInKms);
                    formData.set('distance_unit', 'km');
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                    formData.set('facility_id', this.facilityID);
                }
            }



            this.trackingService.uploadupLeaseEmissionCalculate(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        // this.averageMethod = true;
                        // this.franchiseMethod = false;
                        this.dataEntryForm.reset();
                        // this.getSubVehicleCategoryLease(15);
                        // this.getVehicleTypesLease();
                        // this.getFranchiseType();
                        // this.getSubFranchiseCategory('Banking Financial Services');
                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        // this.averageMethod = true;
                        // this.franchiseMethod = false;
                        // this.dataEntryForm.reset();
                        // this.getSubVehicleCategoryLease(15);
                        // this.getVehicleTypesLease();
                        // this.getFranchiseType();
                        // this.getSubFranchiseCategory('Banking Financial Services');
                    }
                    this.ALLEntries();
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            });
        }
        if (this.categoryId == 17) {
            let formData = new URLSearchParams();
            if (this.storageTransporationChecked === true && this.vehcilestransporationchecked === true) {
                formData.set('vehicle_type', this.upstreamVehicletypeId);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('mass_unit', 'tonnes');
                formData.set('distance_unit', 'km');
                formData.set('area_occupied_unit', 'm2');
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('storagef_type', this.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.storageTransporationChecked === true) {
                formData.set('storagef_type', this.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
                formData.set('area_occupied_unit', 'm2');
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.vehcilestransporationchecked == true) {
                formData.set('vehicle_type', this.upstreamVehicletypeId);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('mass_unit', 'tonnes');
                formData.set('distance_unit', 'km');
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            }


            this.trackingService.downStreamTransportation(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();


                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        // this.dataEntryForm.reset();

                    }
                    this.ALLEntries();
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 18) {

            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            let formData = new URLSearchParams();
            if (this.selectedGoodsCategory == 'Other') {
                if (this.averageMethod == true) {
                    formData.set('month', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('intermediate_category', this.selectedGoodsCategory);
                    formData.set('processing_acitivity', this.processing_acitivity);
                    formData.set('sub_activity', this.sub_sector);
                    formData.set('other_emission', form.value.emission_factor);
                    formData.set('other', '1');
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    // formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', '1');
                    formData.set('facilities', this.facilityID);

                } else if (this.franchiseMethod == true) {
                    formData.set('month', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('intermediate_category', this.selectedGoodsCategory);
                    formData.set('processing_acitivity', this.processing_acitivity);
                    formData.set('sub_activity', this.sub_sector);
                    formData.set('other_emission', form.value.emission_factor);
                    formData.set('other', '1');
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('scope1emissions', form.value.scope1_emission);
                    formData.set('scope2emissions', form.value.scope2_emission);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', '1');
                    formData.set('facilities', this.facilityID);
                }

            } else if (this.selectedGoodsCategory != 'Other') {
                if (this.averageMethod == true) {
                    formData.set('month', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('intermediate_category', this.selectedGoodsCategory);
                    formData.set('processing_acitivity', this.processing_acitivity);
                    formData.set('sub_activity', this.sub_sector);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    // formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', '1');
                    formData.set('facilities', this.facilityID);

                } else if (this.franchiseMethod == true) {
                    formData.set('month', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('intermediate_category', this.selectedGoodsCategory);
                    formData.set('processing_acitivity', this.processing_acitivity);
                    formData.set('sub_activity', this.sub_sector);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('scope1emissions', form.value.scope1_emission);
                    formData.set('scope2emissions', form.value.scope2_emission);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', '1');
                    formData.set('facilities', this.facilityID);

                }
            }



            this.trackingService.Addprocessing_of_sold_productsCategory(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();



                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );


                    }
                    this.ALLEntries();
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 19) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            let formData = new URLSearchParams();
            if (this.selectedQuantitySoldUnit == 1) {
                formData.set('type', this.selectedProductEnergyType);
                formData.set('productcategory', this.selectedProductsCategory);
                formData.set('no_of_Items', form.value.numberofitems);
                formData.set('no_of_Items_unit', this.selectedQuantitySoldUnit.toString());
                formData.set('expectedlifetimeproduct', form.value.expectedlifetimeproduct);
                formData.set('expectedlifetime_nooftimesused', this.selectedExpectedLifetimeUnit.toString());
                formData.set('electricity_use', form.value.electricity_use);
                formData.set('electricity_usage', form.value.unitsExpElec);
                formData.set('fuel_type', form.value.fuelItem);
                formData.set('fuel_consumed', form.value.fuel_consumed);
                formData.set('fuel_consumed_usage', form.value.unitsExpElec);
                formData.set('referigentused', form.value.ItemRefrigerant);
                formData.set('referigerantleakage', form.value.refLeakageValue);
                formData.set('referigerant_usage', form.value.unitsExpElec);
                formData.set('batch', '1');
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);

            } else {
                formData.set('type', this.selectedProductEnergyType);
                formData.set('productcategory', this.selectedProductsCategory);
                formData.set('no_of_Items', form.value.numberofitems);
                formData.set('no_of_Items_unit', this.selectedQuantitySoldUnit.toString());
                formData.set('batch', '1');
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
            }



            this.trackingService.AddSoldProductsCategory(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        // this.dataEntryForm.reset();


                    }
                    this.ALLEntries();
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 20) {

            var total_waste = Number(form.value.landfill) + Number(form.value.combustion) + Number(form.value.recycling) + Number(form.value.composing);
            if (!form.value.total_waste) {
                this.notification.showInfo(
                    'Please enter total waste',
                    ''
                );
                return
            }
            if (total_waste > 100) {
                this.notification.showInfo(
                    'Waste % cannot be greater than 100%',
                    ''
                );
                return
            }
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            let formData = new URLSearchParams();
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('waste_type', this.waterWasteId.toString());
            formData.set('subcategory', this.wasteSubCategory);
            formData.set('total_waste', form.value.total_waste);
            formData.set('waste_unit', 'tonnes');
            formData.set('landfill', form.value.landfill || '');
            formData.set('combustion', form.value.combustion || '');
            formData.set('recycling', form.value.recycling || '');
            formData.set('composing', form.value.composing || '');
            formData.set('batch', '1');
            formData.set('facilities', this.facilityID);


            this.trackingService.AddendoflifeCategory(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();


                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();


                    }
                    this.ALLEntries();
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 21) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            var is_vehicle = 0;
            var is_facility = 0;
            if (this.leasefacilitieschecked === true) {
                is_facility = 1
            }
            if (this.leasevehcileschecked === true) {
                is_vehicle = 1
            }
            let formData = new URLSearchParams();
            if (is_facility == 1 && is_vehicle == 0) {
                if (this.averageMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', this.franchiseCategoryValue);
                    formData.set('sub_category', this.subfacilityTypeValue);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', 'm2');
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                    formData.set('facility_id', this.facilityID);
                } else if (this.franchiseMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', this.franchiseCategoryValue);
                    formData.set('sub_category', this.subfacilityTypeValue);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('scope1_emission', form.value.scope1_emission);
                    formData.set('scope2_emission', form.value.scope2_emission);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                    formData.set('facility_id', this.facilityID);
                }
            } else if (is_vehicle == 1 && is_facility == 0) {
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('vehicle_subtype', this.subVehicleCategoryValue);
                formData.set('no_of_vehicles', form.value.noOfVehicles);
                formData.set('distance_travelled', form.value.distanceInKms);
                formData.set('distance_unit', 'km');
                formData.set('is_vehicle', is_vehicle.toString());
                formData.set('is_facility', is_facility.toString());
                formData.set('facility_id', this.facilityID);
            }
            else if (is_vehicle == 1 && is_facility == 1) {
                if (this.averageMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', this.franchiseCategoryValue);
                    formData.set('sub_category', this.subfacilityTypeValue);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', 'm2');
                    formData.set('vehicle_type', this.selectedVehicleType);
                    formData.set('vehicle_subtype', this.subVehicleCategoryValue);
                    formData.set('no_of_vehicles', form.value.noOfVehicles);
                    formData.set('distance_travelled', form.value.distanceInKms);
                    formData.set('distance_unit', 'km');
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                    formData.set('facility_id', this.facilityID);
                } else if (this.franchiseMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', this.franchiseCategoryValue);
                    formData.set('sub_category', this.subfacilityTypeValue);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('scope1_emission', form.value.scope1_emission);
                    formData.set('scope2_emission', form.value.scope2_emission);
                    formData.set('vehicle_type', this.selectedVehicleType);
                    formData.set('vehicle_subtype', this.subVehicleCategoryValue);
                    formData.set('no_of_vehicles', form.value.noOfVehicles);
                    formData.set('distance_travelled', form.value.distanceInKms);
                    formData.set('distance_unit', 'km');
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                    formData.set('facility_id', this.facilityID);
                }
            }


            this.trackingService.downstreamLeaseEmissionCalculate(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.ALLEntries();
                        this.dataEntryForm.reset();

                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            });
        }
        if (this.categoryId == 22) {

            let formData = new URLSearchParams();
            if (this.averageMethod == true) {
                formData.set('franchise_type', this.franchiseCategoryValue);
                formData.set('sub_category', this.subFranchiseCategoryValue);
                formData.set('calculation_method', 'Average data method');
                formData.set('franchise_space', form.value.franchise_space);
                formData.set('facility_id', this.facilityID);
                formData.set('unit', 'm2');
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);

            } else if (this.franchiseMethod == true) {
                formData.set('franchise_type', this.franchiseCategoryValue);
                formData.set('sub_category', this.subFranchiseCategoryValue);
                formData.set('calculation_method', 'Investment Specific method');
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
                formData.set('facility_id', this.facilityID);
                formData.set('unit', form.value.upfacilityUnits);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            }


            this.trackingService.uploadFranchise(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.ALLEntries();
                        this.dataEntryForm.reset();


                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();


                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();
                    this.getFranchiseType();
                    this.getSubFranchiseCategory('Banking Financial Services');
                    this.averageMethod = true;

                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 23) {
            let formData = new URLSearchParams();

            if (this.franchiseMethodValue == 'Investment Specific method' && this.investmentTypeValue == 'Equity investments') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
                formData.set('equity_share', form.value.share_Equity);
                formData.set('facilities', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.investmentTypeValue == 'Equity investments' && this.franchiseMethodValue == 'Average data method') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('investee_company_total_revenue', form.value.investe_company_revenue);
                formData.set('equity_share', form.value.share_Equity);
                formData.set('facilities', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Average data method') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('project_phase', form.value.projectPhase);
                formData.set('project_construction_cost', form.value.project_construction_cost);
                formData.set('equity_project_cost', form.value.equity_project_cost);
                formData.set('facilities', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Investment Specific method') {

                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
                formData.set('equity_project_cost', form.value.project_cost);
                formData.set('facilities', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);

            }


            this.trackingService.calculateInvestmentEmission(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.ALLEntries();
                        this.dataEntryForm.reset();
                        this.equityInvestmentRow = false;
                        this.debtInvesmentRow = false;
                        this.calculationRow = false;
                        this.averageMethod = false
                        this.franchiseMethod = false
                        this.franchiseMethodValue = '';
                        this.investmentTypeValue = ''

                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.equityInvestmentRow = false;
                        this.debtInvesmentRow = false;
                        this.calculationRow = false;
                        this.averageMethod = false
                        this.franchiseMethod = false;
                        this.franchiseMethodValue = '';
                        this.investmentTypeValue = ''
                    }
                },
                error: (err) => {
                    this.equityInvestmentRow = false;
                    this.debtInvesmentRow = false;
                    this.calculationRow = false;
                    this.averageMethod = false
                    this.franchiseMethod = false;
                    this.franchiseMethodValue = '';
                    this.investmentTypeValue = ''
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 24) {
            // if (this.selectMonths.length == 0) {
            //     this.notification.showInfo(
            //         'Select month',
            //         ''
            //     );
            //     return
            // }


            if (form.value.flightMode == 'Generic') {
                if (form.value.no_of_trips === '' || form.value.no_of_trips === null) {
                    this.notification.showInfo(
                        "Please select no of trips",
                        'Warning'
                    );
                    return;
                }
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            let formData = new FormData();

            if (form.value.flightMode == 'Generic') {
                const payloadsFlight = this.rowsFlightTravel.map(row => ({

                    flight_type: row.flightType,
                    flight_class: row.flightClass,
                    no_of_trips: row.noOfTrips,
                    return_flight: row.return_flight,
                    cost_centre: row.costCentre,
                    batch: 1,
                    month: row.selectedMonths

                }));
                formData.set('flight_calc_mode', form.value.flightMode);
                formData.set('jsonData', JSON.stringify(payloadsFlight));
                // formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
                if (this.selectedFile) {
                    formData.set('file', this.selectedFile, this.selectedFile.name);
                }
            } else if (form.value.flightMode == 'To/From') {
                const payloadsFlight = this.rowsFlightTravel.map(row => ({

                    to: row.to,
                    from: row.from,
                    via: row.via,
                    flight_class: row.flight_class,
                    no_of_passengers: row.no_of_passengers,
                    return_flight: row.return_flight,
                    reference_id: row.reference_id,
                    cost_centre: row.cost_centre,
                    batch: 1,
                    month: row.selectedMonths

                }));
                formData.set('flight_calc_mode', form.value.flightMode);
                formData.set('jsonData', JSON.stringify(payloadsFlight));
                // formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
                if (this.selectedFile) {
                    formData.set('file', this.selectedFile, this.selectedFile.name);
                }
            } else if (form.value.flightMode == 'Distance') {
                const payloadsFlight = this.rowsFlightTravel.map(row => ({

                    flight_type: row.flightType,
                    flight_class: row.flightClass,
                    no_of_trips: row.noOfTrips,
                    return_flight: row.returnFlight,
                    cost_centre: row.costCentre,
                    batch: 1,
                    month: row.selectedMonths

                }));
                formData.set('flight_calc_mode', form.value.flightMode);
                formData.set('flight_type', form.value.flight_type);
                formData.set('flight_class', form.value.classs);
                formData.set('distance', form.value.distance);
                formData.set('no_of_passengers', form.value.no_of_passengers);
                formData.set('return_flight', this.storageTransporationChecked.toString());
                formData.set('reference_id', form.value.reference_id);
                formData.set('cost_centre', form.value.businessunits);
                formData.set('batch', '1');
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
                if (this.selectedFile) {
                    formData.set('file', this.selectedFile, this.selectedFile.name);
                }
            }


            this.trackingService.uploadflightTravel(formData).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.ALLEntries();
                        this.resetForm();
                        // this.getStatusData(this.activeCategoryIndex);
                        this.flightDisplay1 = 'block';
                        this.flightDisplay2 = 'none';
                        this.flightDisplay3 = 'none';
                        this.rowsFlightTravel = [{
                            id: 1,
                            flightMode: '',
                            flightType: null,
                            flightClass: null,
                            returnFlight: null,
                            noOfTrips: null,
                            costCentre: '',
                            to: null,
                            from: null,
                            via: null,
                            flight_class: null,
                            no_of_passengers: null,
                            return_flight: null,
                            reference_id: null,
                            cost_centre: null,
                            batch: 1,
                            month: this.months,
                            selectedMonths: null

                        }];

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        // this.dataEntryForm.reset();


                    }
                },
                error: (err) => {
                    this.notification.showError(
                        "EF not found for this facility",
                        ''
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 25) {

            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth);

            let hasNullValue = this.rowsHotelStay.some(row =>
                row.selectedCountry == null ||
                row.type_of_hotel == null ||
                row.no_of_occupied_rooms == null ||
                row.no_of_nights == null ||
                row.selectedMonths == null
            );

            if (hasNullValue) {
                this.notification.showWarning(
                    'Error: Some hotel stay fields are missing.',
                    ''
                );
                return; // stop further execution
            }
            let formData = new FormData();
            const payloadsHotelStay = this.rowsHotelStay.map(row => ({

                country_of_stay: row.selectedCountry,
                type_of_hotel: row.type_of_hotel,
                no_of_occupied_rooms: row.no_of_occupied_rooms,
                no_of_nights_per_room: row.no_of_nights,
                batch: 1,
                month: row.selectedMonths

            }));


            formData.set('year', this.dataEntry.year);
            formData.set('facilities', this.facilityID);
            formData.set('jsonData', JSON.stringify(payloadsHotelStay));
            if (this.selectedFile) {
                formData.set('file', this.selectedFile, this.selectedFile.name);
            }


            this.trackingService.uploadHotelStay(formData).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.resetForm();
                        this.dataEntryForm.reset();
                        this.ALLEntries();
                        this.rowsHotelStay = [{
                            id: 1,
                            country_stay: null,
                            type_of_hotel: 'star_2',
                            no_of_occupied_rooms: null,
                            no_of_nights: null,
                            selectedCountry: null,
                            month: this.months,
                            selectedMonths: null
                        }];

                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();


                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        ''
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        }
        if (this.categoryId == 26) {

            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            let formData = new FormData();

            const payloadsOtherModes = this.rowsOtherTransport.map(row => ({

                mode_of_trasport: row.trasnportMode,
                type: row.selectedMode,
                fuel_type: row.selectedFuelType,
                no_of_passengers: row.no_of_passengers,
                distance_travelled: row.distance_travel_per_trip,
                no_of_trips: row.noOfTrips,
                batch: 1,
                month: row.selectedMonths

            }));
            formData.set('jsonData', JSON.stringify(payloadsOtherModes));

            formData.set('year', this.dataEntry.year);
            formData.set('facilities', this.facilityID);
            if (this.selectedFile) {
                formData.set('file', this.selectedFile, this.selectedFile.name);
            }

            this.trackingService.uploadOtherModes(formData).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.ModeSelected = false;
                        this.ALLEntries();
                        this.resetForm();
                        this.rowsOtherTransport = [{
                            id: 1,
                            trasnportMode: null,
                            modeType: [],
                            selectedMode: null,
                            carFuel_type: [],
                            selectedFuelType: null,
                            no_of_passengers: null,
                            distance_travel_per_trip: null,
                            isDisabled: false,
                            noOfTrips: null,
                            month: this.months,
                            selectedMonths: null,
                        }];;

                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            ''
                        );
                        this.dataEntryForm.reset();
                        this.ModeSelected = false;

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })

        }

    };

    // getting status, units, subCategory types where ever required
    // SubCatData(data: any, catID: any, categoryName) {
    //     this.categoryName = categoryName;
    //     this.recycle = false;
    //     this.isVisited = false;
    //     this.renewableSelected = false;
    //     this.supplierSelected = false;
    //     this.storageTransporationChecked = false;
    //     this.singleCompanyTab = true;
    //     this.multipleCompanyTab = false;
    //     this.bulkCompanyTab = false;
    //     this.marketEElecID = null;

    //     this.id_var = data.manageDataPointSubCategorySeedID;

    //     this.categoryId = catID;
    //     this.flightDisplay1 = 'block';
    //     this.flightDisplay2 = 'none';
    //     this.flightDisplay3 = 'none';
    //     this.averageMethod = false;
    //     this.franchiseMethod = false;
    //     this.selectedGoodsCategory = '';
    //     this.onIndustrySelected = false;
    //     this.OthersSecledted = false;
    //     this.onActivitySelected = false;
    //     this.SubCatAllData = data;
    //     this.ALLEntries()
    //     if (catID == 1) {

    //         this.getStationaryFuelType(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);
    //         this.getUnit(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);
    //     }

    //     if (catID == 2) {
    //         this.templateLinks = 'assets/Refrigerant_Template.xlsx'
    //         this.getsubCategoryType(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);
    //         this.getUnit(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);
    //     }

    //     if (catID == 3) {
    //         this.templateLinks = 'assets/FireExtinguisher_Template.xlsx'
    //         // this.getsubCategoryType(this.SubCatAllData
    //         //     .manageDataPointSubCategorySeedID);
    //         this.getUnit(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);
    //     }



    //     if (catID == 5) {

    //         this.getRegionName();
    //         this.getUnit(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);
    //     }

    //     if (catID == 6) {
    //         this.getVehcileFleet(this.facilityID, data.manageDataPointSubCategorySeedID)

    //         this.downloadCompanyExcelUrl = this.APIURL + `/download-excel-vehicle-fleet-by-facility-category-id?facility_id=${this.facilityID}&categoryID=${this.SubCatAllData
    //             .manageDataPointSubCategorySeedID == 10 ? '1' : '2'} `;
    //         // this.downloadCompanyExcelUrl = 'http://192.168.29.45:4500/' + `download-excel-vehicle-fleet-by-facility-category-id?facility_id=${this.facilityID}&categoryID=${this.SubCatAllData
    //         //     .manageDataPointSubCategorySeedID == 10 ? '1' : '2'} `;
    //         this.jsonCompanyData = [];
    //         this.rowsCompany = [{
    //             vehicleType: '',
    //             noOfVehicles: null,
    //             tripsPerVehicle: null,
    //             modeOfEntry: 'Average distance per trip',
    //             value: null,
    //             unit: 'Km'
    //         }];;
    //         this.getPurchaseGoodsCurrency()
    //         if (data.manageDataPointSubCategorySeedID == 10) {
    //             this.getPassengerVehicleType();
    //         }
    //         else {
    //             this.getDeliveryVehicleType();
    //         }

    //         this.getUnit(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);


    //     }
    //     if (catID == 7) {

    //         this.getsubCategoryType(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);
    //         this.getUnit(this.SubCatAllData
    //             .manageDataPointSubCategorySeedID);
    //     }
    //     if (catID == 8) {
    //         this.downloadExcelUrl = this.APIURL + `/get-excelsheet?facility_id=${this.facilityID}&tenantID=${this.loginInfo.super_admin_id}`;
    //         this.getALlProducts();

    //         // // this.generateExcel();
    //         // this.months = [
    //         //     { name: 'Jan', value: 'Jan' },
    //         //     { name: 'Feb', value: 'Feb' },
    //         //     { name: 'Mar', value: 'Mar' },
    //         //     { name: 'Apr', value: 'Apr' },
    //         //     { name: 'May', value: 'May' },
    //         //     { name: 'June', value: 'Jun' },
    //         //     { name: 'July', value: 'July' },
    //         //     { name: 'Aug', value: 'Aug' },
    //         //     { name: 'Sep', value: 'Sep' },
    //         //     { name: 'Oct', value: 'Oct' },
    //         //     { name: 'Nov', value: 'Nov' },
    //         //     { name: 'Dec', value: 'Dec' }
    //         // ];
    //         this.GetVendors();
    //         this.GetHSN()
    //         this.getPurchaseGoodsCurrency()
    //     }
    //     if (catID == 10) {
    //         this.getVehicleTypes();
    //         this.getSubVehicleCategory(1)
    //     }
    //     if (catID == 12) {
    //         this.getEndWasteType();
    //         this.getWasteSubCategory("1");
    //         this.wasteMethod = this.waterWasteMethod[0].id;
    //     }
    //     if (catID == 13) {
    //         this.isVisited = true;

    //     }
    //     if (catID == 14) {
    //         this.getEmployeeCommuTypes()

    //     }
    //     if (catID == 17) {
    //         this.getVehicleTypes();
    //         this.getSubVehicleCategory(1)
    //     }
    //     if (catID == 18) {
    //         this.getPurchaseGoodsCurrency();
    //         this.getPurchaseGoodsCategory();
    //     }
    //     if (catID == 16) {
    //         this.getFranchiseType();
    //         this.getSubFranchiseCategory('Banking Financial Services');
    //         this.getVehicleTypesLease();
    //         this.getSubVehicleCategoryLease(15);
    //         this.averageMethod = true;
    //         // this.franchiseMethodValue = 'Average data method';
    //     }
    //     if (catID == 19) {
    //         this.getProductsEnergyCategory("1")
    //     }
    //     if (catID == 20) {
    //         this.getEndWasteType();
    //         this.getWasteSubCategory("1")
    //     }
    //     if (catID == 21) {
    //         this.getFranchiseType();
    //         this.getSubFranchiseCategory('Banking Financial Services');
    //         this.getVehicleTypesLease();
    //         this.getSubVehicleCategoryLease(15)
    //         this.averageMethod = true;
    //         this.franchiseMethodValue = 'Average data method';
    //     }
    //     if (catID == 22) {
    //         this.getFranchiseType();
    //         this.getSubFranchiseCategory('Banking Financial Services')
    //         this.averageMethod = true;
    //     }
    //     if (catID == 23) {
    //         this.getInvestmentCategories();
    //         this.getInvestmentSubCategory('Coke, Refined Petroleum, and Nuclear Fuel')
    //     }

    //     this.typeEV = false;
    //     this.typeBusCoach = false;
    //     //   this.checkEntryexist();
    //     this.resetForm();
    // };




}
