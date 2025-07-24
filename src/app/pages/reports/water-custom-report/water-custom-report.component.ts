import { Facility } from '@/models/Facility';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { Calendar } from 'primeng/calendar';
import jsPDF from 'jspdf';
import { environment } from 'environments/environment';
import { CustomReportModel } from '@/models/CustomReportModel';
@Component({
    selector: 'app-water-custom-report',
    templateUrl: './water-custom-report.component.html',
    styleUrls: ['./water-custom-report.component.scss']
})
export class WaterCustomReportComponent {
    public loginInfo: LoginInfo;
    @ViewChild('calendarRef') calendarRef!: Calendar;
    date: Date;
    AssignedDataPoint: TrackingDataPoint[] = [];
    facilityID;
    notevalue: string;
    selectedFacilityID: any;
    selectedYear: number;
    selectedDataPoints: any[];
    facilitynothavedp = 'flex';
    CustomReportData: CustomReportModel[] = [];
    facilityData: Facility[] = [];
    lfcount: number = 0;
    constructor(
        private facilityService: FacilityService,
        private trackingService: TrackingService
    ) {
        this.AssignedDataPoint = [];
    }

    ngOnInit() {
        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.facilityID = sessionStorage.getItem('SelectedfacilityID');
            this.GetAllFacility();
        }
    }
    ngDoCheck() {
        if (localStorage.getItem('FacilityCount') != null) {
            let fcount = localStorage.getItem('FacilityCount');
            if (this.lfcount != Number(fcount)) {
                this.GetAllFacility();
            }
        }
    }

    //Retrieves all facilities for a tenant
    GetAllFacility() {
        let tenantId = this.loginInfo.tenantID;
        this.facilityService.FacilityDataGet(tenantId).subscribe((response) => {
            this.facilityData = response;
            this.lfcount = this.facilityData.length;
        });
    }

    //opens calendar
    openCalendar(calendar: Calendar) {
        calendar.toggle();
    }

    //Checks the facility ID and calls the GetAssignedDataPoint function with the provided ID
    checkFacilityID(id) {
        this.GetAssignedDataPoint(id);
    }
    //method for get assigned datapoint to a facility by facility id
    GetAssignedDataPoint(facilityID: number) {
        this.trackingService
            .getSavedDataPointforTracking(facilityID)
            .subscribe({
                next: (response) => {
                    if (response === environment.NoData) {
                        this.AssignedDataPoint = [];
                    } else {
                        this.AssignedDataPoint = response;
                    }
                },
                error: (err) => { }
            });
    }


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
                overflow: 'linebreak' // Enable automatic page wrapping
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
                //12: {columnWidth: 20}
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
    }
    //method for generate a report
    generateReport() {
        this.CustomReportData = [];
        this.selectedDataPoints.forEach((element) => {
            var entry: CustomReportModel = {
                dataPoint: element.subCatName,
                April: '-',
                May: '-',
                June: '-',
                July: '-',
                August: '-',
                September: '-',
                October: '-',
                November: '-',
                December: '-',
                January: '-',
                February: '-',
                March: '-'
            };

            element.dataEntries.forEach((subelement) => {
                const month = subelement.month;
                const year = subelement.year;
                const reportYear = this.date.getFullYear().toString();
                const readingValue = parseFloat(subelement.readingValue);

                if (!isNaN(readingValue) && year === reportYear) {
                    entry[month] = this.calculateMonthTotal(
                        entry[month],
                        readingValue
                    );
                }
            });

            this.CustomReportData.push(entry);
        });
    }
    //Calculates the total value by adding the existing value and the new value for each datapoint
    calculateMonthTotal(existingValue: string, newValue: number): string {
        const existingValueNumber = parseFloat(existingValue);
        const totalValue = isNaN(existingValueNumber)
            ? newValue
            : existingValueNumber + newValue;
        return totalValue.toString();
    }
    //retrieves the subcategories under the  refrigenrate category from the AssignedDataPoint object
    refrigenrateCategories() {
        let subCategories: any[] = [];
        this.AssignedDataPoint.forEach(scope => {
            if (scope.manageDataPointCategories !== undefined) {
                const category =
                    scope.manageDataPointCategories.find(
                        (category) => category.catName === 'Refrigerants'
                    );
                if (category) {
                    let subCategories = category.manageDataPointSubCategories;
                    return subCategories;
                } else {
                    // console.log('Category not found');
                    return [];
                }
            }
        })

    }
}
