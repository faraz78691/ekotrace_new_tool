import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexDataLabels, ApexAxisChartSeries, ApexXAxis, ApexStroke, ApexTooltip, ApexPlotOptions, ChartComponent, ApexFill, ApexGrid, ApexLegend, ApexYAxis } from 'ng-apexcharts';



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
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
  colors: any;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

export type ChartAreaOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
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
  responsive: ApexResponsive[];
  colors: string[];
  legend: ApexLegend;
};
@Component({
  selector: 'app-energy-emmsions',
  templateUrl: './energy-emmsions.component.html',
  styleUrls: ['./energy-emmsions.component.scss']
})
export class EnergyEmmsionsComponent {
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
  upstreamArray: any[] = [];
  downstreamArray: any[] = [];
  vendorData: any[] = [];
  businessClass: any[] = [];
  businessType: any[] = [];
  groundLabel: any[] = [];
  groundSeries: any[] = [];
  scopeMonths: any[] = [];
  groundTotal: any;
  flightTotal: any;
  flightTypeTotal: any
  airTotal: any;
  activityTotal: any;
  renewableTotal: any;

  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
    this.year = new Date();



    this.donotOptions3 = {
      series: [21, 21, 13, 30],
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
      labels: [
        "EAMC", "COST"
      ],
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



  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    this.GetAllfacilities();
  };

  GetAllfacilities() {
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString())
    this.dashboardService.getdashboardfacilities(formData.toString()).subscribe((result: any) => {

      if (result.success == true) {
        this.dashboardData = result.categories;
 
        if (this.facilityService.selectedfacilitiesSignal() == 0) {
          this.selectedFacility = this.dashboardData[0].ID;
          
        } else {
          this.selectedFacility = this.facilityService.selectedfacilitiesSignal();
        }

        this.emssionByTravel(this.selectedFacility);
        this.totalEmissionByMonth(this.selectedFacility)
        this.BygroundTravel(this.selectedFacility)
        this.emssionByActivity(this.selectedFacility)

      }

    });
  };

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


  emssionByTravel(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.GEByFuelType(formData.toString()).subscribe((result: any) => {

      this.scopeWiseSeries = result.flueType;
      this.labelScopeDonut1 = result.series;
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

  totalEmissionByMonth(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.EnergyByMonth(formData.toString()).subscribe((result: any) => {


      this.barGraph1 = result.series;
      this.labelScopeDonut1 = result.categories;
      this.scopeMonths = result.month


      this.chartOptions = {
        dataLabels: {
          enabled: false
        },
        legend: {
          fontSize: '14px'
        },
        colors: ['#213D49', '#46A5CD', '#FFD914'],
        series:
          this.barGraph1
        ,
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
              fontSize: '14px',
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
                  fontSize: '13px',
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
            offsetY: 0,
            style: {
              fontSize: '13px'
            }
          },
          categories: this.scopeMonths,

          tooltip: {
            enabled: true,
            offsetY: -35
          }
        },
        fill: {
          opacity: 1,
          // stops: [50, 0, 100, 100]
        }
        ,
        yaxis: {
          title: {
            text: 'tCO2e',
            style: {
              fontSize: '13px'
            }
          },
          labels: {
            style: {
              fontSize: '13px'
            }
          }
        },

      };






    });
  };



  BygroundTravel(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.ByEnergyRenewable(formData.toString()).subscribe((result: any) => {

      this.businessClass = result.renewable;
      this.labelScopeDonut2 = result.series;
      this.renewableTotal = result.totalEmssion;
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

  emssionByActivity(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.GEByActivity(formData.toString()).subscribe((result: any) => {


      this.seriesScopeDonut2 = result.energyinuse;
      this.labelScopeDonut2 = result.series;
      this.activityTotal = result.totalEmssion;
      // this.airTotal = result.totalEmssion;


      this.donotOptions2 = {
        series: this.seriesScopeDonut2,
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
        labels: this.labelScopeDonut2,
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

  onFacilityChange(event: any) {
    // // console.log(event.target.value)
    // // console.log(this.selectedFacility);
    this.facilityService.facilitySelected(this.selectedFacility)
    this.emssionByTravel(this.selectedFacility)
    this.totalEmissionByMonth(this.selectedFacility)
    this.BygroundTravel(this.selectedFacility)
    this.emssionByActivity(this.selectedFacility)
  };
}

