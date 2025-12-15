import { Component, ViewChild } from '@angular/core';
import { AppService } from '@services/app.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-comprehensive-report',
  templateUrl: './comprehensive-report.component.html',
  styleUrls: ['./comprehensive-report.component.scss']
})
export class ComprehensiveReportComponent {
  @ViewChild('dt', { static: false }) table: any;
  AllFacilityData: any[] = [];
  selectedFacility: any[] = [];
  year: Date;
  currentYear: any;
  loginInfo: any;
  ComprehensiveReportData: any[] = [];
  selectedRowIndex = -1;
  FacilityWiseScope1Data: any[] = [];
  FacilityWiseScope2Data: any[] = [];
  FacilityWiseScope3Data: any[] = [];
  detailsData: any[] = [];
  detailsScope1: any[] = [];
  detailsScope2: any[] = [];
  detailsScope3: any[] = [];

  selectedFacilityId: any;
  totalScope1 = 0;
  totalScope2 = 0;
  totalScope3 = 0;
  totalAll = 0;
  constructor(private _appService: AppService) {

  }

  ngOnInit(): void {
    const storedYear = sessionStorage.getItem('selected_year');
    if (storedYear) {
      this.year = new Date(Number(storedYear), 0);
    } else {
      this.year = new Date();
    }

    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo);
      this.loginInfo = jsonObj as any;
      this.currentYear = new Date().getFullYear();
      this.GetAllfacilities();
    }
  }


  GetAllfacilities() {
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString())
    formData.set('superAdminId', this.loginInfo.super_admin_id.toString())
    this._appService.postAPI('/getdashboardfacilities', formData.toString()).subscribe((result: any) => {
      this.AllFacilityData = result.categories;
    });
  }


  onGenerateReport() {
    this._appService.getApi(`/reporting/get-facility-wise-scope?facility_id=${this.selectedFacility.join(',')}&year=${this.year.getFullYear()}`).subscribe((result: any) => {
      this.ComprehensiveReportData = result.data;

      this.calculateTotals();
      this.onFacilityClick(this.selectedFacility[0], 0, this.selectedFacility[0]);
    });
  }

  onFacilityClick(id: any, index: any, fName: any) {
    this.selectedRowIndex = index;
    this.getFacilityWiseScope(id);
  }

  getFacilityWiseScope(id: any) {
    this.selectedFacilityId = id;
    this._appService.getApi(`/reporting/get-category-wise-scope1-emission?facilities=${id.toString()}&year=${this.year.getFullYear()}`).subscribe((result: any) => {
      this.FacilityWiseScope1Data = [
        ...result.data.filter((item: any) => item.category === 'Scope 1'),
        ...result.data.filter((item: any) => item.category !== 'Scope 1'),
      ];
    });
    this._appService.getApi(`/reporting/get-category-wise-scope2-emission?facilities=${id.toString()}&year=${this.year.getFullYear()}`).subscribe((result: any) => {
      this.FacilityWiseScope2Data = [
        ...result.data.filter((item: any) => item.category === 'Scope 2'),
        ...result.data.filter((item: any) => item.category !== 'Scope 2'),
      ];
    });
    this._appService.getApi(`/reporting/get-category-wise-scope3-emission?facilities=${id.toString()}&year=${this.year.getFullYear()}`).subscribe((result: any) => {
      this.FacilityWiseScope3Data = [
        ...result.data.filter((item: any) => item.category === 'Scope 3'),
        ...result.data.filter((item: any) => item.category !== 'Scope 3'),
      ];
    });
  }

  expandedRowIndex: number | null = null;
  expandedRowIndex2: number | null = null;
  expandedRowIndex3: number | null = null;
  toggleRow2(index: number, category: string) {
    this.expandedRowIndex2 = this.expandedRowIndex2 === index ? null : index;
    if (this.expandedRowIndex2 !== null) {
      let url = this.getUrlByCategory(category);
      this.getDetails(url, 2);
    }
  }
  toggleRow3(index: number, category: string) {
    this.expandedRowIndex3 = this.expandedRowIndex3 === index ? null : index;
    if (this.expandedRowIndex3 !== null) {
      let url = this.getUrlByCategory(category);
      this.getDetails(url, 3);
    }
  }
  

  toggleRow(index: number, category: string) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
    if (this.expandedRowIndex !== null) {
      let url = this.getUrlByCategory(category);
      this.getDetails(url, 1);
    }
  }
  

  getDetails(url: string, scope: number) {
    this._appService.getApi(url + '?facilities=' + this.selectedFacilityId.toString() + '&year=' + this.year.getFullYear()).subscribe((result: any) => {
      if (scope === 1) this.detailsScope1 = result.data;
      if (scope === 2) this.detailsScope2 = result.data;
      if (scope === 3) this.detailsScope3 = result.data;
    });
  }
  

  isExpanded(category: string) {
    let categories = ['Stationary Combustion', 'Company Owned Vehicles', 'Heat and Steam', 'Purchased goods and services', 'Fuel and Energy-related Activities', 'Waste generated in operations', 'Water Supply and Treatment'];
    return categories.includes(category);
  }
  isArray(id: any) {
    return Array.isArray(id);
  }
  getUrlByCategory(category: string) {
    switch (category) {
      case 'Stationary Combustion':
        return '/reporting/get-stationarycombustion-sub-category-wise-scope1-emission';
      case 'Company Owned Vehicles':
        return '/reporting/get-companyvehicles-sub-category-wise-scope1-emission';
      case 'Heat and Steam':
        return '/reporting/get-heatandsteam-sub-category-wise-scope2-emission';
      case 'Purchased goods and services':
        return '/reporting/get-purchasedgoodsservices-sub-category-wise-scope3-emission';
      case 'Fuel and Energy-related Activities':
        return '/reporting/get-fuelrelatedservices-sub-category-wise-scope3-emission';
      case 'Waste generated in operations':
        return '/reporting/get-wastegenerated-sub-category-wise-scope3-emission';
      case 'Water Supply and Treatment':
        return '/reporting/get-watersupplytreatment-sub-category-wise-scope3-emission';
      default:
        return '';
    }
  }

  exportTableToExcel() {
    const table1: any = document.querySelector('.table_loc');
    const table2: any = document.querySelector('.table_loc2');

    // Convert both tables
    const ws1 = XLSX.utils.table_to_sheet(table1);
    const ws2 = XLSX.utils.table_to_sheet(table2);

    // Start by using ws1 as base
    const ws = ws1;

    // Find last row of table1
    const range1 = XLSX.utils.decode_range(ws1['!ref']);
    const startRowForTable2 = range1.e.r + 2; // 2 blank rows gap

    // Merge table2 below table1
    Object.keys(ws2).forEach(cell => {
      if (cell[0] === '!') return;

      const cellRef = XLSX.utils.decode_cell(cell);

      const newCellRef = XLSX.utils.encode_cell({
        r: cellRef.r + startRowForTable2,
        c: cellRef.c // keep month columns as-is
      });

      ws[newCellRef] = ws2[cell];
    });

    // Update sheet size (ref)
    const range2 = XLSX.utils.decode_range(ws2['!ref']);
    ws['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: startRowForTable2 + range2.e.r, c: range2.e.c }
    });

    // Save workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ReportData");
    XLSX.writeFile(wb, "ReportData.xlsx");
  }


  calculateTotals() {
    this.totalScope1 = this.ComprehensiveReportData
      .reduce((acc, item) => acc + Number(item.scope1 || 0), 0);

    this.totalScope2 = this.ComprehensiveReportData
      .reduce((acc, item) => acc + Number(item.scope2 || 0), 0);

    this.totalScope3 = this.ComprehensiveReportData
      .reduce((acc, item) => acc + Number(item.scope3 || 0), 0);

    this.totalAll = this.ComprehensiveReportData
      .reduce((acc, item) => acc + Number(item.total || 0), 0);
  }

  onFacilityTotalClick(data: any) {
    this.selectedRowIndex = -1
    this.selectedFacilityId = data.map((item: any) => item.id).join(',');
    this.getFacilityWiseScope(this.selectedFacilityId);
    this.calculateTotals();
  }

}