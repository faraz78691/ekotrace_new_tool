import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { ApexAxisChartSeries, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

// type ApexXAxis = {
//   type?: "category" | "datetime" | "numeric";
//   categories?: any;
//   labels?: {
//     style?: {
//       colors?: string | string[];
//       fontSize?: string;
//     };
//   };
// };

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: any;
  stroke: ApexStroke;
  labels: any;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  markers: ApexMarkers
};

export type ChartAreaOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: any
};
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

export type Chart3Options = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};
@Component({
  selector: 'app-business-travel',
  templateUrl: './business-travel.component.html',
  styleUrls: ['./business-travel.component.scss']
})
export class BusinessTravelComponent {
  @ViewChild("ct_emission_by_travel") ct_emission_by_travel: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public secondChart: Partial<ChartOptions>;
  public thirdChart: Partial<ChartOptions>;
  public fourChart: Partial<ChartOptions>;
  public areachart: Partial<ChartAreaOptions>;
  public areaBusinesschart: Partial<ChartAreaOptions>;
  public donotOptions1: Partial<ChartOptions2>;
  public donotOptions2: Partial<ChartOptions2>;
  public donotOptions3: Partial<ChartOptions2>;
  public pieChart: Partial<ChartOptions2>;
  public groupChart: Partial<Chart3Options>;
  dashboardData: any[] = [];
  public loginInfo: LoginInfo;
  selectedFacility:any;
  year: Date;
  scopeWiseSeries: any[] = [];
  progress1: any = '';
  progress2: any = '';
  progress3: any = '';
  scope1E: any = '';
  scope2E: any = '';
  scope3E: any = '';
  sumofScope2: any = '';
  series_graph: any[]
  topFIveE: any[];
  seriesScopeDonut1: any[] = [];
  barGraph1: any[] = [];
  seriesScopeDonut2: any[] = [];
  seriesScopeDonut3: any[] = [];
  labelScopeDonut1: any[] = [];
  labelScopeDonut2: any[] = [];
  labelScopeDonut3: any[] = [];
  scopeMonths: any[] = [];
  upstreamArray: any[] = [];
  downstreamArray: any[] = [];
  vendorData: any[] = [];
  businessClass: any[] = [];
  businessType: any[] = [];
  groundLabel: any[] = [];
  groundSeries: any[] = [];
  groundTotal: any;
  flightTotal: any;
  flightTypeTotal: any
  airTotal: any;
  totalCostCentre: any;

  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
    this.year = new Date();


   

  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    this.GetAllfacilities();
  };

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


  GetAllfacilities() {
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString())
    this.dashboardService.getdashboardfacilities(formData.toString()).subscribe((result: any) => {
   
      if (result.success == true) {
        this.dashboardData = result.categories;
        if(this.facilityService.selectedfacilitiesSignal() == 0){
          this.selectedFacility = this.dashboardData[0].ID;

        }else{
          this.selectedFacility = this.facilityService.selectedfacilitiesSignal();
        }
        this.emssionByTravel(this.selectedFacility);
        this.totalEmissionByMonth(this.selectedFacility)
        this.emssionByTypeANDClass(this.selectedFacility)
        this.BygroundTravel(this.selectedFacility)
        this.costCentre(this.selectedFacility)

      }

    });
  };

  emssionByTravel(facility) {
  
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.GEByTravel(formData.toString()).subscribe((result: any) => {
    
      this.scopeWiseSeries = result.series;
      this.labelScopeDonut1 = result.categories;
      this.airTotal = result.totalEmssion;


      this.donotOptions1 = {
        series: this.scopeWiseSeries,
        chart: {
          width: "100%",
          height: 350,
          type: "donut"
        },
        dataLabels: {
          enabled: true
        },
        fill: {
          type: "gradient"
        },
        legend: {
          position: "bottom",
          fontSize: '15px',
          floating: false,
          horizontalAlign: 'left',
        },
        colors: ['#246377', '#009087', '#002828', '#F9C74F'],
        labels: this.labelScopeDonut1,
        responsive: [
          {
            breakpoint: 400,
            options: {
              chart: {
                width: 250
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };

    });
  };
  costCentre(facility) {
  
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.BycostTravel(formData.toString()).subscribe((result: any) => {
  
    this.totalCostCentre = result.totalemssion;

      this.donotOptions3 = {
        series: result.series,
        chart: {
          width: "100%",
          height: 350,
          type: "donut"
        },
        dataLabels: {
          enabled: true
        },
        legend: {
          position: "bottom",
          fontSize: '15px',
          floating: false,
          horizontalAlign: 'left',
  
        },
        labels: result.cost_center,
        colors: ['#F3722C', '#0068F2', '#FFD914'],
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
      

    });
  };

  totalEmissionByMonth(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.businessTravelByMonth(formData.toString()).subscribe((result: any) => {
      this.barGraph1 = result.series[0].data;
      this.labelScopeDonut1 = result.categories;
      this.scopeMonths =  result.month;
      this.chartOptions = {
        dataLabels: {
          enabled: false
        },
        legend: {
          fontSize: '12px'
        },
        colors: ['#46A5CD', '#46A5CD', '#FFD914'],
        series:  [ {
          name: "Months",
          data: this.barGraph1
        }],
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              fontSize: '12px',
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
  
        plotOptions: {
          bar: {
            columnWidth: '40%',
            horizontal: false,
            borderRadius: 8,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '12px',
                  fontWeight: 900
                },
                formatter: function (val) {
                  const numericValue = parseFloat(val);
                  return numericValue.toFixed(2);
                }
              }
            }
          },
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '12px'
            }
          },
          categories:  this.scopeMonths
        },
        yaxis: {
  
          title: {
            style: {
              fontSize: '15px'
            },
  
            text: "t CO2e"
          },
          labels: {
            style: {
              fontSize: '13px'
            }
          },
        },
        fill: {
          opacity: 1
        }
      };






    });
  };

  emssionByTypeANDClass(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.businessdashboardemssionByAir(formData.toString()).subscribe((result: any) => {


      this.businessType = result.flight_type_series;
      this.businessClass = result.flight_class_series;
      this.labelScopeDonut1 = result.flight_type;
      this.labelScopeDonut2 = result.flight_class;
      this.flightTotal = result.totalflight_class;
      this.flightTypeTotal = result.totalflight_type;

      this.donotOptions2 = {
        series: this.businessType,
        chart: {
          width: "100%",
          height: 350,
          type: "donut"
        },
        dataLabels: {
          enabled: true
        },
        fill: {
          type: "gradient"
        },
        legend: {
          position: "bottom",
          fontSize: '15px',
          floating: false,
          horizontalAlign: 'left',
        },
        colors: ['#246377', '#009087', '#002828', '#F9C74F'],
        labels: this.labelScopeDonut1,
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


      this.pieChart = {
        series: this.businessClass,
        chart: {
          width: "100%",
          height: 350,
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


    });
  };

  BygroundTravel(facility) {
 
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.BygroundTravel(formData.toString()).subscribe((result: any) => {
    

      this.groundSeries = result.series;
      this.groundLabel = result.categories;
      this.groundTotal = result.totalEmssion;


      this.groupChart = {
        series: [
          {
            name: "distibuted",
            data: this.groundSeries
          }
        ],
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // // console.log(chart, w, e)
            }
          }
        },
        colors: [
          "#246377",
          "#F9C74F",
          "#009087",
          "#002828"
        ],
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        grid: {
          show: false
        },
        xaxis: {
          categories: [
            ["Car"],
            ["Bus"],
            ["Rail"],
            ["Auto"],

          ],
          labels: {
            style: {
              colors: [
                "#008FFB",
                "#00E396",
                "#FEB019",
                "#FF4560",
                "#775DD0",
                "#546E7A",
                "#26a69a",
                "#D10CE8"
              ],
              fontSize: "12px"
            }
          }
        }
      };





    });
  };

  onFacilityChange(event: any) {
    // // console.log(event.target.value)
    // // console.log(this.selectedFacility);
    this.facilityService.facilitySelected(this.selectedFacility)
    this.emssionByTravel(this.selectedFacility)
    this.totalEmissionByMonth(this.selectedFacility)
    this.emssionByTypeANDClass(this.selectedFacility)
    this.BygroundTravel(this.selectedFacility)
    this.costCentre(this.selectedFacility)
  };

}