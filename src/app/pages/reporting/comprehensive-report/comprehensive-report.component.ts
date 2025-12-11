import { Component } from '@angular/core';
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-comprehensive-report',
  templateUrl: './comprehensive-report.component.html',
  styleUrls: ['./comprehensive-report.component.scss']
})
export class ComprehensiveReportComponent {
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
  selectedFacilityId: any;
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
    let url = this.getUrlByCategory(category);
    this.getDetails(url);
  }
  toggleRow3(index: number, category: string) {
    this.expandedRowIndex3 = this.expandedRowIndex3 === index ? null : index;
    let url = this.getUrlByCategory(category);
    this.getDetails(url);
  }

  toggleRow(index: number, category: string) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
    let url = this.getUrlByCategory(category);
    this.getDetails(url);
  }

  getDetails(url: string) {
    this._appService.getApi(url + '?facilities=' + this.selectedFacilityId.toString() + '&year=' + this.year.getFullYear()).subscribe((result: any) => {
      this.detailsData = result.data;
    }, (error: any) => {
      this.detailsData = [];
    });
  }

  isExpanded(category: string) {
    let categories = ['Stationary Combustion', 'Company Owned Vehicles', 'Heat and Steam', 'Purchased goods and services', 'Fuel and Energy-related Activities', 'Waste generated in operations', 'Water Supply and Treatment'];
    return categories.includes(category);
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
}