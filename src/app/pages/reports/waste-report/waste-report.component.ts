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
  selector: 'app-waste-report',
  templateUrl: './waste-report.component.html',
  styleUrls: ['./waste-report.component.scss']
})
export class WasteReportComponent {
  public loginInfo: LoginInfo;
  financialyear: financialyear[];
  locations: locations[];
  reportdatapoints: any[];
  year: Date;
  months: months;
  selectReportType = 'Monthly'
  notevalue: string;
  Datapoints: string;
  AssignedDataPoint: TrackingDataPoint[] = [];
  selectedFacilityID: any;
  selectedYear: number;
  selectedDate: Date;
  currentYear: number;
  nextYear: number;
  facilityID;
  month: Date;

  facilityData: Facility[] = [];
  years: number[] = [];
  selectedCategory: number;
  selectMode: number;
  isDropdownOpen = false;

  kgCO2e: number;

  selectMonths: any[] = [];
  reportData: any[] = [];

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

    });
  };
  //opens calendar
  openCalendar(calendar: Calendar) {
    calendar.toggle();
  };
  //Checks the facility ID and calls the GetAssignedDataPoint function with the provided ID.
  checkFacilityID(id) {
    // this.GetAssignedDataPoint(id);
  };

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
  //method for generate a report
  // generateReport() {
  //     this.CustomReportData = [];

  //     this.selectedCategory.forEach((element) => {
  //         var entry: CustomReportModel = {
  //             dataPoint: element.subCatName,
  //             April: '',
  //             May: '',
  //             June: '',
  //             July: '',
  //             August: '',
  //             September: '',
  //             October: '',
  //             November: '',
  //             December: '',
  //             January: '',
  //             February: '',
  //             March: ''
  //         };

  //         element.dataEntries.forEach((subelement) => {
  //             const month = subelement.month;
  //             const year = subelement.year;
  //             const reportYear = this.date.getFullYear().toString();
  //             const readingValue = parseFloat(subelement.readingValue);
  //             if (!isNaN(readingValue) && year === reportYear) {
  //                 switch (month) {
  //                     case 'April':
  //                         entry.April = this.calculateMonthTotal(
  //                             entry.April,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'May':
  //                         entry.May = this.calculateMonthTotal(
  //                             entry.May,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'June':
  //                         entry.June = this.calculateMonthTotal(
  //                             entry.June,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'July':
  //                         entry.July = this.calculateMonthTotal(
  //                             entry.July,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'August':
  //                         entry.August = this.calculateMonthTotal(
  //                             entry.August,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'September':
  //                         entry.September = this.calculateMonthTotal(
  //                             entry.September,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'October':
  //                         entry.October = this.calculateMonthTotal(
  //                             entry.October,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'November':
  //                         entry.November = this.calculateMonthTotal(
  //                             entry.November,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'December':
  //                         entry.December = this.calculateMonthTotal(
  //                             entry.December,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'January':
  //                         entry.January = this.calculateMonthTotal(
  //                             entry.January,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'February':
  //                         entry.February = this.calculateMonthTotal(
  //                             entry.February,
  //                             readingValue
  //                         );
  //                         break;
  //                     case 'March':
  //                         entry.March = this.calculateMonthTotal(
  //                             entry.March,
  //                             readingValue
  //                         );
  //                         break;
  //                     default:
  //                         // Handle unknown month value
  //                         break;
  //                 }
  //             }
  //         });

  //         this.CustomReportData.push(entry);
  //     });
  // }

  newgenerateReport() {
        let url = ''
    const startYear = this.startYear.getFullYear().toString();
    const endYear = this.endYear.getFullYear().toString();

    const reportFormData = new URLSearchParams();
    if(this.selectReportType == 'Monthly'){
      url = 'reportFilterMultipleCategoryNew'
  }else{
        url = 'reportFilterMultipleCategoryConsolidated'
  }
  let selectedFacilities = this.selectedMultipleFacility.map(String).map(item => `'${item}'`).join(',');
    reportFormData.set('stationary_combustion', "0")
    reportFormData.set('refrigerant', "0")
    reportFormData.set('fire_extinguisher', "0")
    reportFormData.set('renewable_electricity', "0")
    reportFormData.set('heat_steam', "0")
    reportFormData.set('company_owned_vehicles', "0")
    reportFormData.set('purchase_goods', "0")
    reportFormData.set('upstream', "0")
    reportFormData.set('waste_generation', "1")
    reportFormData.set('other_transport', "0")
    reportFormData.set('employee_commuting', "0")
    reportFormData.set('home_office', "0")
    reportFormData.set('upstreamlease_emission', "0")
    reportFormData.set('downstream', "0")
    reportFormData.set('process_sold_products', "0")
    reportFormData.set('sold_products', "0")
    reportFormData.set('water_supply_treatment', "0")
    reportFormData.set('business_travel', "0")
    reportFormData.set('end_of_life_treatment', "0")
    reportFormData.set('downstreamlease_emission', "0")
    reportFormData.set('franchise_emission', "0")
    reportFormData.set('investment_emission', "0")
    reportFormData.set('flight_travel', "0")
    reportFormData.set('hotel_stays', "0")
    reportFormData.set('facility', selectedFacilities)
    reportFormData.set('start_year', startYear)
    reportFormData.set('end_year', endYear)
    reportFormData.set('start_month', this.startMonth.value)
    reportFormData.set('end_month', this.endMonth.value)

    this.facilityService.gerReport(url, reportFormData.toString()).subscribe({
      next: res => {
        if (res.success == true) {
          this.reportData = res.result

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


  //Calculates the total value by adding the existing value and the new value for each datapoint
  calculateMonthTotal(existingValue: string, newValue: number): string {
    const existingValueNumber = parseFloat(existingValue);
    const totalValue = isNaN(existingValueNumber)
      ? newValue
      : existingValueNumber + newValue;
    return totalValue.toString();
  }

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

  };

  
}


