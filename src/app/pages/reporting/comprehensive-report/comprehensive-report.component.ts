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
  detailsScope1Map = new Map<number, any[]>();
  detailsScope2Map = new Map<number, any[]>();
  detailsScope3Map = new Map<number, any[]>();

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
      this.onFacilityTotalClick(this.ComprehensiveReportData);
    });
  }

  onFacilityClick(id: any, index: any, fName: any) {
    this.selectedRowIndex = index;
    this.getFacilityWiseScope(id);
    setTimeout(() => {
      this.openAllSubCategories();
    }, 1000);
  }

  onYearChange(year: any) {
    this.ComprehensiveReportData = [];
    this.FacilityWiseScope1Data = [];
    this.FacilityWiseScope2Data = [];
    this.FacilityWiseScope3Data = [];
    this.detailsData = [];
    this.detailsScope1Map = new Map<number, any[]>();
    this.detailsScope2Map = new Map<number, any[]>();
    this.detailsScope3Map = new Map<number, any[]>();
    this.selectedRowIndex = -1;
    this.totalScope1 = 0;
    this.totalScope2 = 0;
    this.totalScope3 = 0;
    this.totalAll = 0;
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

  expandedRowsScope1 = new Set<number>();
  expandedRowsScope2 = new Set<number>();
  expandedRowsScope3 = new Set<number>();

  toggleRow2(index: number, category: string) {
    if (this.expandedRowsScope2.has(index)) {
      this.expandedRowsScope2.delete(index);
    } else {
      this.expandedRowsScope2.add(index);

      if (!this.detailsScope2Map.has(index)) {
        const url = this.getUrlByCategory(category);
        this.getDetails(url, 2, index);
      }
    }
  }

  toggleRow3(index: number, category: string) {
    if (this.expandedRowsScope3.has(index)) {
      this.expandedRowsScope3.delete(index);
    } else {
      this.expandedRowsScope3.add(index);

      if (!this.detailsScope3Map.has(index)) {
        const url = this.getUrlByCategory(category);
        this.getDetails(url, 3, index);
      }
    }
  }
  toggleRow(index: number, category: string) {
    if (this.expandedRowsScope1.has(index)) {
      this.expandedRowsScope1.delete(index);
    } else {
      this.expandedRowsScope1.add(index);

      if (!this.detailsScope1Map.has(index)) {
        const url = this.getUrlByCategory(category);
        this.getDetails(url, 1, index);
      }
    }
  }

  openAllSubCategories() {
    this.FacilityWiseScope1Data.forEach((item: any, i: number) => {
      if (this.isExpanded(item.category)) {
        this.expandedRowsScope1.add(i);
        this.getDetails(this.getUrlByCategory(item.category), 1, i);
      }
    });

    this.FacilityWiseScope2Data.forEach((item: any, i: number) => {
      if (this.isExpanded(item.category)) {
        this.expandedRowsScope2.add(i);
        this.getDetails(this.getUrlByCategory(item.category), 2, i);
      }
    });

    this.FacilityWiseScope3Data.forEach((item: any, i: number) => {
      if (this.isExpanded(item.category)) {
        this.expandedRowsScope3.add(i);
        this.getDetails(this.getUrlByCategory(item.category), 3, i);
      }
    });
  }

  getDetails(url: string, scope: number, rowIndex: number) {
    this._appService.getApi(url + '?facilities=' + this.selectedFacilityId.toString() + '&year=' + this.year.getFullYear()).subscribe((result: any) => {
      if (scope === 1) this.detailsScope1Map.set(rowIndex, result.data);
      if (scope === 2) this.detailsScope2Map.set(rowIndex, result.data);
      if (scope === 3) this.detailsScope3Map.set(rowIndex, result.data);
    });
  }


  isExpanded(category: string) {
    let categories = ['Stationary Combustion', 'Company Owned Vehicles', 'Electricity', 'Heat and Steam', 'Purchased goods and services', 'Fuel and Energy-related Activities', 'Waste generated in operations', 'Water Supply and Treatment', 'Business Travel', 'Upstream Transportation and Distribution', 'Downstream Transportation and Distribution', "Upstream Leased Assets", 'Downstream Leased Assets'];
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
      case 'Electricity':
        return '/reporting/get-electricity-sub-category-wise-scope2-emission';
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
      case 'Business Travel':
        return '/reporting/get-businesstravel-sub-category-wise-scope3-emission';
      case 'Upstream Leased Assets':
        return '/reporting/get-upstreamLease-sub-category-wise-scope3-emission';
      case 'Downstream Leased Assets':
        return '/reporting/get-downstreamLease-sub-category-wise-scope3-emission';
      case 'Upstream Transportation and Distribution':
        return '/reporting/get-upstreamtransportation-sub-category-wise-scope3-emission';
      case 'Downstream Transportation and Distribution':
        return '/reporting/get-downstreamtransportation-sub-category-wise-scope3-emission';
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
    setTimeout(() => {
      this.openAllSubCategories();
    }, 1000);
  }
  getTotalValue(item: any) {
    return item.Jan + item.Feb + item.Mar + item.Apr + item.May + item.Jun + item.Jul + item.Aug + item.Sep + item.Oct + item.Nov + item.Dec;
  }
}