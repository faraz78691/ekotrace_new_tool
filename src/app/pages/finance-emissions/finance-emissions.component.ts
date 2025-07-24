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
import { countries } from '@/store/countrieslist';
import { Component, ViewChild, computed, effect } from '@angular/core';
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

@Component({
    selector: 'app-finance-emissions',
    templateUrl: './finance-emissions.component.html',
    styleUrls: ['./finance-emissions.component.scss']
})
export class FinanceEmissionsComponent {
    public countriesList: any = countries
    @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
    @ViewChild('tabView') dataentryTab: TabView;
    @ViewChild('dt1') dt!: Table;
    @ViewChild('fileUpload') fileUpload!: FileUpload;
    @ViewChild('inputFile') inputFile: any;
    filteredStatus: any; // Variable to store the selected status
    public statusFilter: string;
    public yearFilter: number;
    DP_BoxVisible: boolean;
    AddManageDataPoint = '';
    value_tab = 'Scope 1';
    selectedValues: string[] = [];
    selectMonths: any[] = [];
    statusData: any;
    hotelTypeGrid: any[] = [];
    yearOptions: any[] = [];
    checked: boolean = false;
    items: MenuItem[];
    active: MenuItem;
    notevalue: string;
    status: TrackingTable[];
    formGroup: FormGroup;
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
    rootUrl: string;
    fileSelect: File;

    accordianIndex = 0;
    units: Units[] = [];
    monthString: string;
    VehicleType: VehicleType[] = [];
    dataEntriesPending: any[] = [];
    SubCategoryType: SubCategoryTypes[] = [];
    isInputEdited: boolean;
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
    noofdays_3 = ""
    noofmonths_1: string;
    noofmonths_2: string;
    noofmonths_3: string;
    franchiseGrid: any[] = [];
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
    noOfItems = false;
    subElectricityUnits = "per usage";
    expectedElectricityUnitsGrid: any[] = [];
    selectedFuelItem: any;
    fuelEnergyTypes: any[] = [];
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
    flightTime: any[] = [];
    uploadButton = false;
    airportGrid: any[] = [];
    public isVisited = false;
    flightDisplay1 = 'block'
    flightDisplay2 = 'none'
    flightDisplay3 = 'none'

    mode_name = '';
    selectedtemplate = '';
    mode_type: any[] = [];
    marketTypes: any[] = [];
    marketEElecID: any;;
    categoryId = 23;
    superAdminTenantID: any;

    carFuel_type: any[] = [];
    wasteMethod: string;
    recycle = false;
    recycleSelectedMethod = '';
    groupId: any;
    countryCode: any;
    storagef_typeValue: string = this.storageGrid[0]?.storagef_type;
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
        { name: 'July', value: 'July' },
        { name: 'Aug', value: 'Aug' },
        { name: 'Sep', value: 'Sep' },
        { name: 'Oct', value: 'Oct' },
        { name: 'Nov', value: 'Nov' },
        { name: 'Dec', value: 'Dec' }
    ];




    constructor(
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private facilityService: FacilityService,
        private trackingService: TrackingService,
        private themeservice: ThemeService,
        private notification: NotificationService,
        private toastr: ToastrService,
        private confirmationService: ConfirmationService
    ) {
        effect(() => {
            if (this.facilityService.selectedGroupSignal() != null) {

                this.groupId = this.facilityService.selectedGroupSignal()
                this.countryCode = this.facilityService.groupsCountrySignal();
                console.log('countryCode', this.countryCode);
                this.ALLEntries()
            }
        })
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

        this.investmentTypeGrid =
            [
                {
                    "id": 1,
                    "type": "Equity investments - subsidiaries"
                },
                {
                    "id": 1,
                    "type": "Equity investments - associated companies"
                },
                {
                    "id": 1,
                    "type": "Equity investments - joint ventures"
                },
                {
                    "id": 1,
                    "type": "Equity investments - other investment"
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

        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
        }
        let tenantID = this.loginInfo.tenantID;
        this.superAdminTenantID = this.loginInfo.super_admin_id;

        this.flag = localStorage.getItem('Flag');
        const dataEntry = this.trackingService.dataEntry;
        this.getInvestmentCategories();
        //   this.getInvestmentSubCategory('Coke, Refined Petroleum, and Nuclear Fuel')

    };



    //display a dialog
    showDialog() {
        this.visible = true;
    };


    onSubCategoryVehicleChange(event: any) {
        this.subVehicleCategoryValue = event.value;
    };




    // to get the status of subcategories in status tab
    ALLEntries() {

        if (!this.groupId) {
            this.notification.showInfo(
                'Select Group',
                ''
            );
            return
        }

        const formData = new URLSearchParams();
        this.convertedYear = this.trackingService.getYear(this.year);
        formData.set('year', this.convertedYear.toString())
        formData.set('facilities', this.groupId.toString())
        formData.set('categoryID', '23'.toString())


        this.trackingService
            .newgetSCpendingDataEntries(formData)
            .subscribe({
                next: (response) => {
                    if (response.success === false) {
                        this.dataEntriesPending = null;
                    } else {
                        this.dataEntriesPending = response.categories;
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



    };

    //entrysave function to save dataentry
    EntrySave(form: NgForm) {
       
        if (this.loginInfo.role != 'Super Admin' && this.loginInfo.role != 'Admin') {
            this.notification.showWarning('You are not allowed to enter the values', '');
            return
        }
        if (!this.year) {
            this.notification.showWarning('Please select year', '');
            return
        }
        if (!form.value.investment_type) {
            this.notification.showWarning('Please select investment type', '');
            return
        }

        this.dataEntry.year = this.year.getFullYear().toString(); //this.getYear();
        let fId = sessionStorage.getItem('SelectedfacilityID');
        if (fId == '0') {
            this.notification.showInfo(
                'Select Subgroup',
                ''
            );
            return
        }

        let formData = new URLSearchParams();

        if (this.franchiseMethodValue == 'Investment Specific method' && this.investmentTypeValue.includes('Equity investments')) {
            formData.set('investment_type', form.value.investment_type);
            formData.set('category', form.value.investment_sector);
            formData.set('sub_category_id', form.value.broad_categoriesId);
            formData.set('calculation_method', form.value.calculationmethod);
            formData.set('scope1_emission', form.value.scope1_emission);
            formData.set('scope2_emission', form.value.scope2_emission);
            formData.set('equity_share', form.value.share_Equity);
            formData.set('facilities', '');
            formData.set('sub_group_id', this.groupId);
            formData.set('tenant_id', this.superAdminTenantID);
            //   formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
        } else if (this.investmentTypeValue.includes('Equity investments') && this.franchiseMethodValue == 'Average data method') {
            formData.set('investment_type', form.value.investment_type);
            formData.set('category', form.value.investment_sector);
            formData.set('sub_category_id', form.value.broad_categoriesId);
            formData.set('calculation_method', form.value.calculationmethod);
            formData.set('investee_company_total_revenue', form.value.investe_company_revenue);
            formData.set('equity_share', form.value.share_Equity);
            formData.set('facilities', '');
            formData.set('sub_group_id', this.groupId);
            formData.set('tenant_id', this.superAdminTenantID);
            formData.set('unit', this.countryCode);
            //   formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Average data method') {
            formData.set('investment_type', form.value.investment_type);
            formData.set('category', form.value.investment_sector);
            formData.set('sub_category_id', form.value.broad_categoriesId);
            formData.set('calculation_method', form.value.calculationmethod);
            formData.set('project_phase', form.value.projectPhase);
            formData.set('project_construction_cost', form.value.project_construction_cost);
            formData.set('equity_project_cost', form.value.equity_project_cost);
            formData.set('facilities', '');
            formData.set('sub_group_id', this.groupId);
            formData.set('tenant_id', this.superAdminTenantID);
            formData.set('unit', this.countryCode);
            //   formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Investment Specific method') {

            formData.set('investment_type', form.value.investment_type);
            formData.set('category', form.value.investment_sector);
            formData.set('sub_category_id', form.value.broad_categoriesId);
            formData.set('calculation_method', form.value.calculationmethod);
            formData.set('scope1_emission', form.value.scope1_emission);
            formData.set('scope2_emission', form.value.scope2_emission);
            formData.set('equity_project_cost', form.value.project_cost);
            formData.set('facilities', '');
            formData.set('sub_group_id', this.groupId);
            formData.set('tenant_id', this.superAdminTenantID);
            //   formData.set('month', monthString);
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
                    //   this.year = new Date();

                } else {
                    this.notification.showError(
                        response.message,
                        'Error'
                    );
                    // this.dataEntryForm.reset();
                    // this.equityInvestmentRow = false;
                    // this.debtInvesmentRow = false;
                    // this.calculationRow = false;
                    // this.averageMethod = false
                    // this.franchiseMethod = false;
                    // this.franchiseMethodValue = '';
                    // this.investmentTypeValue = ''
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

            },
            complete: () => console.info('Data entry Added')
        })
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



    ToggleClick() {
        this.isVisited = true;
    }
    // retrieves the data entry setting for a given subcategory ID.
    getSetting(subCatId: any) {
        this.trackingService
            .getdataEntrySetting(subCatId)
            .subscribe((response) => {
                if (response != null) {
                    this.dataEntrySetting = response;
                } else {
                    this.dataEntrySetting = new DataEntrySetting();
                }
            });
    };


    onInputEdit() {
        this.isInputEdited = true;
    };



    //resetForm method for resetting the form and clearing any selected values or input fields.
    resetForm() {
        this.dataEntryForm.resetForm();
        // this.fileUpload.clear();
    }




    getStatusData(categoryIndex: number) {
        let url = ''
        if (categoryIndex == 1) {
            let formData = new URLSearchParams();
            formData.set('batch', this.batchId);
            url = 'getPurchaseGoodEmissions';
            this.trackingService.getPurchaseGoodEmissions(formData).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.statusData = response.categories;
                    }
                }
            })
            return
        }

        if (categoryIndex == 7) {
            url = 'getInvestmentEmission'
        }

        this.trackingService.getStatus(url).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.statusData = response.categories;
                } else {
                    this.statusData = []
                }
            }
        })
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

    //   onFranchiseChange(event: any) {
    //       const frachiseTypevalue = event.value;

    //       this.franchiseCategoryValue = frachiseTypevalue
    //       this.getSubFranchiseCategory(frachiseTypevalue)
    //   };



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

        if (this.franchiseMethodValue == 'Investment Specific method' && this.investmentTypeValue.includes('Equity investments')) {

            this.equityInvestmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false;
            this.debtInvesmentRow = false;
        } else if (this.investmentTypeValue.includes('Equity investments') && this.franchiseMethodValue == 'Average data method' && this.equityInvestmentRow == true) {

            this.equityInvestmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
            this.debtInvesmentRow = false;
        }
        else if (this.investmentTypeValue.includes('Equity investments') && this.franchiseMethodValue == 'Average data method' && this.equityInvestmentRow == false) {

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
        if (this.investmentTypeValue.includes('Equity investments') && calMethod == 'Investment Specific method') {
            this.equityInvestmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false;
            this.debtInvesmentRow = false;
        } else if (this.investmentTypeValue.includes('Equity investments') && calMethod == 'Average data method') {
            this.equityInvestmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
            this.debtInvesmentRow = false;
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







    getInvestmentCategories() {
        this.trackingService.getInvestmentCategories().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.wasteGrid = response.categories;
                    this.getInvestmentSubCategory(this.wasteGrid[0].investment_type)
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };







}
