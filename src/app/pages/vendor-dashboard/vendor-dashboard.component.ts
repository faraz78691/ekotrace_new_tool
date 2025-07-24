import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { ThemeService } from '@services/theme.service';

import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill, ApexGrid, ApexStroke } from 'ng-apexcharts';


export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  stroke: ApexStroke;
  colors: any;
  labels: any;
};
@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent {
  // flightsTravelTypes:any[]= []
  public loginInfo: LoginInfo;
  public pieChart: Partial<ChartOptions2>;
  public pieChart2: Partial<ChartOptions2>;
  vendorData: any[] = [];
  dashboardData: any[] = [];
  originalData: any[] = [];
  selectedFacility: any;
  selectedProduct: any[] =['Standard Goods', 'Capital Goods', 'Standard Services'];
  labelScopeDonut2: any[] = [];
  businessClass: any[] = [];
  productsSeries: any[] = [];
  productsEmission: any[] = [];
  allVendorReport: any;
  customVendorReport: any;
  sumofALLScope: any;

  flightsTravelTypes =
    [
      {
        "id": 1,
        "flightType": "Standard Goods"
      },
      {
        "id": 2,
        "flightType": "Capital Goods"
      },
      {
        "id": 3,
        "flightType": "Standard Services"
      }

    ];

  shortBy =
    [

      {
        "id": 1,
        "shortBy": "High to Low"
      },
      {
        "id": 2,
        "shortBy": "Low to High"
      }
    ];

  rankBy =
    [

      {
        "id": 1,
        "shortBy": "Emissions"
      },
      {
        "id": 2,
        "shortBy": "Emissions to Expense Ratio"
      }
    ];

  Show =
    [

      {
        "id": 1,
        "Show": "Top 5"
      },
      {
        "id": 2,
        "Show": "Top 10"
      },
      {
        "id": 3,
        "Show": "Top 15"
      }

    ];

  constructor(
    private themeservice: ThemeService,
    private facilityService: FacilityService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.loginInfo = new LoginInfo();
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
      this.GetAllfacilities();

    }
  };


  getVendorDash() {
    const currentYear = new Date().getFullYear();
    const resultID = [...new Set(this.selectedFacility.flat().map(item => +item))];
    const formData = new URLSearchParams();
    formData.set('facility', resultID.toString())
    formData.set('tenant_id', this.loginInfo.super_admin_id.toString())
    formData.set('year', currentYear.toString())
    this.facilityService.getVendorDashboard(formData).subscribe((response: any) => {
      if (response.success == true) {
        this.originalData = response.vendorWiseEmission;
         this.vendorData = this.calculateVendorEmissions('All');
console.log(  this.vendorData );
        // this.vendorData = response.vendorWiseEmission;
        this.customVendorReport = response;

      };
      this.getTotalEmissions(resultID)

    });
  };

  calculateVendorEmissions(typesofpurchasename: string[] | 'All'): any[] {
    
    const groupedBySupplier = this.originalData.reduce((acc, item) => {
      if (!acc[item.supplier]) {
        acc[item.supplier] = [];
      }
      acc[item.supplier].push(item);
      return acc;
    }, {});
  
   
    const result = Object.keys(groupedBySupplier)
      .map((supplier) => {
        const vendorItems = groupedBySupplier[supplier];
  
     
        const { target_status, scorecard } = vendorItems[0];
  
      
        const filteredItems =
          typesofpurchasename === 'All'
            ? vendorItems
            : vendorItems.filter((item) =>
                typesofpurchasename.includes(item.typesofpurchasename)
              );
  
   
        if (filteredItems.length === 0) {
          return null;
        }
  
    
        const totalEmission = filteredItems.reduce((sum, item) => {
          return sum + parseFloat(item.perVendorEmission);
        }, 0);
  
       
        const units = [...new Set(filteredItems.map((item) => item.unit))];
  
        return {
          supplier,
          totalEmission,
          target_status,
          scorecard,
          units, // Include units in the response
        };
      })
      // Remove null entries
      .filter((item) =>
        
       item !== null && item.totalEmission !== 0);
  
    return result;
  }

  
  getTotalEmissions(id: any) {
    this.allVendorReport = [];
    const currentYear = new Date().getFullYear();
    const formData = new URLSearchParams();
    formData.set('facilities', id)
    formData.set('year', currentYear.toString())
    this.facilityService.getScopeDonutsER(formData).subscribe((response: any) => {
      if (response.success == true) {
        this.sumofALLScope = parseFloat(response.scope1) + parseFloat(response.scope2) + parseFloat(response.scope3);
        const vendorEmission = this.customVendorReport.vendorEmission == null || this.customVendorReport.vendorEmission == '0' ? 0 : (parseFloat(this.customVendorReport.vendorEmission)) / 1000;
        this.customVendorReport['contribution'] = vendorEmission == 0 || this.sumofALLScope == 0 ? '0' : (vendorEmission / this.sumofALLScope) * 100;
        this.allVendorReport = this.customVendorReport;

      }

    });
  };
  GetAllfacilities() {
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString());

    this.dashboardService.getdashboardfacilities(formData.toString()).subscribe((result: any) => {
      if (result.success) {
        this.dashboardData = result.categories;

        // Initialize selectedFacility with the first ID as default
        this.selectedFacility = this.dashboardData.length ? [this.dashboardData[0].ID] : [];
        // Call getVendorDash with the selected value
        this.getVendorDash();
        this.getEmissionProducts();
        this.getVendorLocation();

      }
    });
  }


  getVendorLocation() {
    const currentYear = new Date().getFullYear();
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedFacility);
    formData.set('year', currentYear.toString())
    this.facilityService.getVendorLocation(formData).subscribe((response: any) => {
      if (response.success == true) {
        // this.businessClass = response.renewable;
        this.labelScopeDonut2 = response.series;
        this.businessClass = response.renewable.map(items => Number(items / 1000));
        this.pieChart = {
          series: this.businessClass,
          chart: {
            width: "90%",
            height: 270,
            type: "pie",

          },
          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',

          },
          labels: this.labelScopeDonut2,
          colors: ['#246377', '#009087', '#002828', '#F9C74F'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      } else {
        this.pieChart = undefined
      }

    },
      (err: any) => {
        this.pieChart = undefined
      });
  };


  getEmissionProducts() {
    const currentYear = new Date().getFullYear();
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedFacility);
    formData.set('year', currentYear.toString())
    this.facilityService.getEmissionProducts(formData).subscribe((response: any) => {
      if (response.success == true) {
        this.productsSeries = response.emissions.map(items => items.Product);
        this.productsEmission = response.emissions.map(items => Number(items.emission / 1000));
        this.pieChart2 = {
          series: this.productsEmission,
          chart: {
            width: "300px",
            height: "350px",
            type: "pie",

          },
          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',

          },
          labels: this.productsSeries,
          colors: ['#246377', '#009087', '#002828', '#F9C74F', '#F9C74F'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      } else {
        this.pieChart2 = undefined
      }

    });
  };

  onFacilityChange(event: any) {
    this.getVendorDash()
    this.getVendorLocation();
    this.getEmissionProducts()
  };


  onProductChange(type) {

    this.vendorData = this.calculateVendorEmissions(type);
    
    // if (this.selectedProduct.length > 0) {
    //   const filtered = this.originalData.filter(item =>
    //     this.selectedProduct.includes(item.typesofpurchasename)
    //   );

    //   this.vendorData = filtered
    // } else {
    //   this.vendorData = this.originalData
    // }

  }
  onSortChange(event: any) {
    const sortVal = event.value;

    if (sortVal) {
      const filtered = this.sortDataByEmission(sortVal)
      this.vendorData = filtered
    } else {
      // this.vendorData = this.originalData
    }

  };

  sortDataByEmission(order: string) {

    const sortedData = [...this.vendorData].sort((a, b) => {
      const emissionA = parseFloat(a.totalEmission);
      const emissionB = parseFloat(b.totalEmission);

      if (order === 'Low to High') {
        return emissionA - emissionB; // Ascending order
      } else if (order === 'High to Low') {
        return emissionB - emissionA; // Descending order
      } else {
        return 0; // No sorting if order is invalid
      }
    });

    // console.log(sortedData); // Sorted data for debugging
    return sortedData; // Return sorted data for further use
  }
}
