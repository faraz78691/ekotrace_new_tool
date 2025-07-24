import { CustomReportModel } from '@/models/CustomReportModel';
import { Facility } from '@/models/Facility';
import { LoginInfo } from '@/models/loginInfo';
import { months } from '@/models/months';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { Component, ViewChild } from '@angular/core';
import { FacilityService } from '@services/facility.service';
import { GroupService } from '@services/group.service';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import jsPDF from 'jspdf';
import { Calendar } from 'primeng/calendar';
interface financialyear {
  financialyear: string;
}
interface locations {
  location: string;
}

@Component({
  selector: 'app-vendor-report',
  templateUrl: './vendor-report.component.html',
  styleUrls: ['./vendor-report.component.scss']
})
export class VendorReportComponent {
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
  superAdminId: any
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
  selectedMultipleVendors: any;
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
  vendorList: any;
  constructor(
    private notification: NotificationService,
    public facilityService: FacilityService,
    private trackingService: TrackingService,
    private GroupService: GroupService
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
      this.superAdminId = this.loginInfo.super_admin_id;
    }

    this.GetVendors()
  };

  GetVendors() {
    this.GroupService.getVendors(this.superAdminId).subscribe({
      next: (response) => {

        if (response.success == true) {
          this.vendorList = response.categories;
        }
      },
      error: (err) => {
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Group Added')
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
    let url = 'vendorReport'
    const reportFormData = new URLSearchParams();
    const formattedVendor = this.selectedMultipleVendors.map(item => `'${item}'`).join(', ');

    reportFormData.set('vendors', formattedVendor)
    if (this.selectReportType == 'Monthly') {
      reportFormData.set('is_multi_consolidated', 'M')
    } else {
      reportFormData.set('is_multi_consolidated', 'V')
    }

    this.facilityService.gerReport(url, reportFormData.toString()).subscribe({
      next: res => {
        if (res.success == true) {
          this.reportData = res.vendorReport
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
    // const tableElement = this.table.el.nativeElement.querySelector('.p-datatable-table');

    // // Create a new worksheet from the table element
    // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);

    // // Create a new workbook and append the worksheet
    // const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'ReportData');

    // // Generate the Excel file and download it
    // XLSX.writeFile(workbook, 'ReportData.xlsx');
  };

  onMultpleChange(e: any) {
    this.reportData = []

  };

}
