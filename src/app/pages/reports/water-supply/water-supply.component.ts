import { CustomReportModel } from '@/models/CustomReportModel';
import { DataEntry } from '@/models/DataEntry';
import { DataEntrySetting } from '@/models/DataEntrySettings';
import { EmissionFactor } from '@/models/EmissionFactorALL';
import { Facility } from '@/models/Facility';
import { LoginInfo } from '@/models/loginInfo';
import { months } from '@/models/months';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { ManageDataPointSubCategories } from '@/models/TrackingDataPointSubCategories';
import { Component, ViewChild } from '@angular/core';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import jsPDF from 'jspdf';
import { Calendar } from 'primeng/calendar';
import * as XLSX from 'xlsx';
interface financialyear {
    financialyear: string;
}
interface locations {
    location: string;
}
@Component({
    selector: 'app-water-supply',
    templateUrl: './water-supply.component.html',
    styleUrls: ['./water-supply.component.scss']
})
export class WaterSupplyComponent {
    public loginInfo: LoginInfo;
    financialyear: financialyear[];
    locations: locations[];
    reportdatapoints: any[];
    year: Date;
    months: months;
    entryExist: boolean = false;
    convertedYear: string;
    selectReportType = 'Monthly'
    notevalue: string;
    Datapoints: string;
    AssignedDataPoint: TrackingDataPoint[] = [];
    selectedFacilityID: any;
    selectedYear: number;
    facilityhavedp = 'none';
    id_var: any;
    dataEntrySetting: DataEntrySetting = new DataEntrySetting();
    dataEntry: DataEntry = new DataEntry();
    SubCatAllData: ManageDataPointSubCategories;
    selectedDate: Date;
    currentYear: number;
    nextYear: number;
    facilityID;
    month: Date;
    facilitynothavedp = 'flex';
    facilityData: Facility[] = [];
    years: number[] = [];
    selectedCategory: number;
    selectMode: number;
    isDropdownOpen = false;
    StationaryCombustion: EmissionFactor = new EmissionFactor();
    yearRangeOptions: string;
    kgCO2e: number;
    lfcount: number = 0;
    selectMonths: any[] = [];
    reportData: any[] = [];
    Modes: any[] = [];
    modeShow = false;
    CustomReportData: CustomReportModel[] = [];
    isMultiple: boolean = undefined
    selectedMultipleCategories: any;
    selectedMultipleFacility: any;
    @ViewChild('dt', { static: false }) table: any;
    startMonth: any;
    startYear: any;
    endMonth: any;
    endYear: any;


    reportmonths: any[] = [
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
    reportType: any[] = [
        { name: '1', value: 'Monthly' },
        { name: '2', value: 'Consolidated' },

    ];
    @ViewChild('calendarRef') calendarRef!: Calendar;
    date: Date;
    constructor(
        private notification: NotificationService,
        public facilityService: FacilityService,
        private trackingService: TrackingService
    ) {



        this.AssignedDataPoint = [];
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
    };



    async ngOnInit() {

        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.facilityID = sessionStorage.getItem('SelectedfacilityID');


            this.GetAllFacility()

        }
    };





    //Retrieves all facilities for a tenant
    GetAllFacility() {
        let tenantId = this.loginInfo.tenantID;
        this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
            this.facilityData = response;
            this.GetAssignedDataPoint(this.facilityData[0].id)
            this.lfcount = this.facilityData.length;
        });
    };
    //opens calendar
    openCalendar(calendar: Calendar) {
        calendar.toggle();
    };
    //Checks the facility ID and calls the GetAssignedDataPoint function with the provided ID.
    checkFacilityID(id) {
      


        this.GetAssignedDataPoint(id);
    };

    dataPointChangedID(id) {
        if (id == 13) {
            this.modeShow = true
        } else {
            this.modeShow = false
        }
    };

    multipleDataPointsChanged(event: any) {
        this.selectedMultipleCategories = event.value; // This stores the selected IDs in the array

        if (this.selectedMultipleCategories.includes(13)) {
            this.modeShow = true;  // Show the mode section if ID 13 is selected
        } else {
            this.modeShow = false; // Hide the mode section if ID 13 is not selected
        }
    }




    GetAssignedDataPoint(facilityID: number) {

        this.trackingService
            .getDataPointsByFacility(facilityID)
            .subscribe({
                next: (response) => {

                    if (response === environment.NoData) {
                        this.AssignedDataPoint = [];
                    } else {
                        this.AssignedDataPoint = response.categories;
                    }
                },
                error: (err) => { }
            });
    };


    //method for download generated report in pdf format
    downloadAsPDF() {
        const doc = new jsPDF({
            orientation: 'portrait', // or 'landscape'
            unit: 'mm',
            format: 'a3'
        });

        const headers = [
            'Data Point',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
            'January',
            'February',
            'March'
        ];

        const rows = this.CustomReportData.map((item) => [
            item.dataPoint,
            item.April,
            item.May,
            item.June,
            item.July,
            item.August,
            item.September,
            item.October,
            item.November,
            item.December,
            item.January,
            item.February,
            item.March
        ]);

        (doc as any).autoTable({
            head: [headers],
            body: rows,
            theme: 'grid',
            styles: {
                cellPadding: 2,
                fontSize: 10,
                // Enable automatic page wrapping
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { cellWidth: 18 },
                1: { cellWidth: 18 },
                2: { cellWidth: 18 },
                3: { cellWidth: 18 },
                4: { cellWidth: 18 },
                5: { cellWidth: 20 },
                6: { cellWidth: 23 },
                7: { cellWidth: 20 },
                8: { cellWidth: 23 },
                9: { cellWidth: 23 },
                10: { cellWidth: 18 },
                11: { cellWidth: 20 },
                //12: {cellWidth: 18}
            },
            startY: 15, // Adjust the starting Y position of the table
            pageBreak: 'auto', // Enable automatic page breaking
            margin: { top: 15, right: 20, bottom: 15, left: 10 },
            didParseCell: function (data) {
                if (data.section === 'head') {
                    data.cell.styles.fillColor = [0, 0, 0]; // Black color for header fill
                    data.cell.styles.textColor = [255, 255, 255]; // White color for header text
                }
            }
        });

        doc.save('report.pdf');
    };


    newgenerateReport() {
        const startYear = this.startYear.getFullYear().toString();
        const endYear = this.endYear.getFullYear().toString();
        let url = ''
        const reportFormData = new URLSearchParams();
        if (this.selectReportType == 'Monthly') {
            url = 'waterReport'
        } else {
            url = 'waterReportConsolidated'
        }
        let selectedFacilities = this.selectedMultipleFacility.map(String).map(item => `'${item}'`).join(',');


        reportFormData.set('facility', selectedFacilities)
        reportFormData.set('start_year', startYear)
        reportFormData.set('end_year', endYear)
        reportFormData.set('start_month', this.startMonth.value)
        reportFormData.set('end_month', this.endMonth.value)

        this.facilityService.gerReport(url, reportFormData.toString()).subscribe({
            next: res => {
              
                if (res.waterWithdrawal.length > 0) {
                    const waterWithDrwal = res.waterWithdrawal;
                    const waterDischarge = res.waterDischargeOnly;
                    const waterTreated = res.waterDischarge;

                    const groupedWaterData = this.groupDataByMonth(waterWithDrwal, waterDischarge,waterTreated);
                  
                    this.reportData = groupedWaterData;

                } else {
                    this.notification.showSuccess(
                        'No data found for tihs month',
                        'Success'
                    );
                }
                // // console.log( this.reportData );

            }
        })
    };


    groupDataByMonth(waterWithdrawal: any[], waterDischarge: any[], waterTreated:any[]) {
        const groupedData: any[] = [];
    
        // Get unique months and years from withdrawal data
        const uniqueMonths = Array.from(new Set(waterWithdrawal.map(w => `${w.month}-${w.year}`)));
    
        uniqueMonths.forEach((monthYear: string) => {
            const [month, year] = monthYear.split("-");
    
            // Filter withdrawal and discharge data for the current month
            const withdrawalForMonth = waterWithdrawal.filter(w => w.month === month && w.year === year);
            const dischargeForMonth = waterDischarge.filter(d => d.month === month && d.year === year);
            const treatmentForMonth = waterTreated.filter(d => d.month === month && d.year === year);
        
            // Merge and sum water withdrawal data by 'water_withdrawl'
            const mergedWithdrawal = Object.values(
                withdrawalForMonth.reduce((acc: any, item: any) => {
                    const key = item.water_withdrawl; // Group by water_withdrawl
                    if (!acc[key]) {
                        // Initialize if not present
                        acc[key] = {
                            totalwaterwithdrawl: parseFloat(item.totalwaterwithdrawl) || 0, // Ensure number
                            water_withdrawl: item.water_withdrawl,
                            month: item.month,
                            year: item.year,
                            AssestType: item.AssestType,
                            water_supply: item.water_supply, // Keep consistent field
                            water_supply_treatment_id: item.water_supply_treatment_id // Optional
                        };
                    } else {
                        // Sum up totalwaterwithdrawl
                        acc[key].totalwaterwithdrawl += parseFloat(item.totalwaterwithdrawl) || 0; // Ensure number
                    }
                    return acc;
                }, {})
            ).map((item :any)=> {
                // Convert totalwaterwithdrawl explicitly to a number before returning
                return {
                    ...item,
                    totalwaterwithdrawl: Number(item.totalwaterwithdrawl.toFixed(2)) // Ensure it's a number with two decimals if needed
                };
            });
            
            
            // Merge and sum water withdrawal data by 'water_withdrawl'
            const mergedDischarge = Object.values(
                dischargeForMonth.reduce((acc: any, item: any) => {
                    const key = item.water_discharge; // Group by water_withdrawl
                    if (!acc[key]) {
                        // Initialize if not present
                        acc[key] = {
                            treatper: parseFloat(item.treatper),
                            water_supply_treatment_id: item.water_supply_treatment_id, // Optional
                            water_discharge: item.water_discharge,
                            leveloftreatment: item.leveloftreatment,
                            month: item.month,
                            year: item.year,
                            AssestType: item.AssestType,
                            water_supply: item.water_supply,
                            water_treatment: item.water_treatment,
                            water_treated: item.water_treated
                        };
                    } else {
                        // Sum up totalwaterwithdrawl
                        acc[key].treatper += parseFloat(item.treatper);
                    }
                    return acc;
                }, {})
            ).map((item :any)=> {
                // Convert totalwaterwithdrawl explicitly to a number before returning
                return {
                    ...item,
                    treatper: Number(item.treatper.toFixed(2)) // Ensure it's a number with two decimals if needed
                };
            });


            const dischargeCategories = [
                "Into Surface water",
                "Into Ground water",
                "Into Seawater",
                "Send to third-parties",
                "Others",
            ];
            const treatmentLevels = ["Primary", "Secondary", "Tertiary"];
    
            const treatedData = treatmentLevels.map(level => {
                const row: any = { leveloftreatment: level, month, year };
   
                // Initialize all discharge categories to 0
                dischargeCategories.forEach(category => {
                    row[category] = 0;
                });
              
                // Populate the row with actual values
                treatmentForMonth.forEach(item => {
                    if (item.leveloftreatment === level && dischargeCategories.includes(item.water_discharge)) {
                        row[item.water_discharge] += parseFloat(item.totalwaterdischarge) || 0;
                    }
                });
    
                // Ensure numerical values are properly formatted
                dischargeCategories.forEach(category => {
                    row[category] = parseFloat(row[category].toFixed(3)); // Round to 3 decimals
                });
    
                return row;
            });
         
    
            groupedData.push({
                month,
                year,
                water_withdrawl: mergedWithdrawal,
                water_discharge: mergedDischarge,
                water_treated: treatedData,
            });
        });
    
        return groupedData;
    }
    


    //Calculates the total value by adding the existing value and the new value for each datapoint
    calculateMonthTotal(existingValue: string, newValue: number): string {
        const existingValueNumber = parseFloat(existingValue);
        const totalValue = isNaN(existingValueNumber)
            ? newValue
            : existingValueNumber + newValue;
        return totalValue.toString();
    }
    //retrieves the subcategories under the Stationary Combustion category from the AssignedDataPoint object
    // stationaryCombustionCategory() {
    //     let subCategories: any[] = [];
    //     this.AssignedDataPoint.forEach(scope => {
    //         if (scope.manageDataPointCategories !== undefined) {
    //             const category =
    //                 scope.manageDataPointCategories.find(
    //                     (category) => category.catName === 'Stationary Combustion'
    //                 );
    //             if (category) {
    //                 let subCategories = category.manageDataPointSubCategories;
    //                 return subCategories;
    //             } else {
    //                 // console.log('Category not found');
    //                 return [];
    //             }
    //         }
    //     })

    // }

    exportTableToExcel() {
        // Get the table element
        const tableElement = this.table.el.nativeElement.querySelector('.p-datatable-table');

        // Create a new worksheet from the table element
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);

        // Create a new workbook and append the worksheet
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ReportData');

        // Generate the Excel file and download it
        XLSX.writeFile(workbook, 'ReportData.xlsx');
    };

    onMultpleChange(e: any) {
        this.reportData = []

  
    }
}
