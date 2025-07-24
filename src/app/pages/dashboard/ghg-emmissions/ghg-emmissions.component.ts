import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexMarkers,
  ApexYAxis,
  ApexTooltip
} from "ng-apexcharts";

import { DashboardService } from '@services/dashboard.service';
import { LoginInfo } from '@/models/loginInfo';
import { Observable, Subscription, catchError, combineLatest, forkJoin, of, switchMap, tap } from 'rxjs';
import { facilities } from '@/models/dashboardFacilities';


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
@Component({
  selector: 'app-ghg-emmissions',
  templateUrl: './ghg-emmissions.component.html',
  styleUrls: ['./ghg-emmissions.component.scss'],

})
export class GhgEmmissionsComponent implements OnDestroy {
  dashboardFacilities$ = new Observable<facilities>();
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public carbonFootvarOptions: Partial<ChartOptions>;
  public donotoptions: Partial<ChartOptions2>;
  public lineoptions: Partial<ChartOptions>;
  public previoucsOptions: Partial<ChartOptions2>;
  public areaBusinesschart: Partial<ChartAreaOptions>;
  public donotOptions1: Partial<ChartOptions2>;
  public donotOptions2: Partial<ChartOptions2>;
  public donotOptions3: Partial<ChartOptions2>;
  dashboardData: any[] = [];
  public loginInfo: LoginInfo;
  selectedFacility: number;
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
  seriesScopeDonut2: any[] = [];
  seriesScopeDonut3: any[] = [];
  labelScopeDonut1: any[] = [];
  labelScopeDonut2: any[] = [];
  labelScopeDonut3: any[] = [];
  upstreamArray: any[] = [];
  downstreamArray: any[] = [];
  vendorData: any[] = [];
  combinedSubscription: Subscription;
  maxYear: any;
  disabledDates: Date[];
  status = 1;
  scopeMonths: any[] = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
    this.year = new Date();

    this.loginInfo = new LoginInfo();

  };

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    // Set the max date to the last day of the current year
    this.maxYear = new Date(currentYear, 11, 31);



    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    };
    const formData = new URLSearchParams();
    let tenantId = 0
    if (this.loginInfo.role == 'Auditor') {
      tenantId = this.loginInfo.super_admin_id;

    } else {
      tenantId = this.loginInfo.tenantID;
    }


    formData.set('tenantID', tenantId.toString())
    this.dashboardFacilities$ = this.dashboardService.getdashboardfacilities(formData.toString()).pipe(
      tap(response => {

        // this.selectedFacility = response.categories[0].ID;
        if (response.success == true) {
          if (this.facilityService.selectedfacilitiesSignal() == 0) {
            this.selectedFacility = response.categories[0].ID;

          } else {
            this.selectedFacility = this.facilityService.selectedfacilitiesSignal();
          }

          this.makeCombinedApiCall(this.selectedFacility);

        }

      })
    );



  };


  private createFormData(facility) {
    const formData = new URLSearchParams();

    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    return formData;
  };

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


  // Combined method to make both API calls
  makeCombinedApiCall(facility) {

    const formData = this.createFormData(facility);

    // Create observables for both API calls
    const scopeWiseEmission$ = this.dashboardService.GScopeWiseEimssion(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in scopeWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const topWiseEmission$ = this.dashboardService.GTopWiseEimssion(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const getScopeSDonuts$ = this.dashboardService.getScopeDonutsER(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const getScopeActivity$ = this.dashboardService.GemissionActivity(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null);
      })
    );

    const formVendorData = new URLSearchParams();
    formVendorData.set('facilities', facility);

    const GVEndorActivity$ = this.dashboardService.GVEndorActivity(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null);
      })
    );
    const getPathNetActivity$ = this.dashboardService.getPathNet(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null);
      })
    );

    // Combine both observables using combineLatest and return the combined observable
    this.combinedSubscription = combineLatest([
      scopeWiseEmission$,
      topWiseEmission$,
      getScopeSDonuts$,
      getScopeActivity$,
      GVEndorActivity$,
      getPathNetActivity$
    ]).subscribe((results: [any, any, any, any, any, any]) => {
      const [scopeWiseResult, topWiseResult, getScopeSDonuts, getScopeActivity, getVendorE, getPathNetZero] = results;



      // Process the results of both API calls here
      if (scopeWiseResult) {
        // Handle scopeWise result

        this.handleScopeWiseResult(scopeWiseResult);
      } else {
        // Handle absence of scopeWise result or error
      }

      if (topWiseResult) {
        // Handle topWise result
        this.topFIveE = topWiseResult.top5Emissions;
      } else {
        // Handle absence of topWise result or error
      }
      if (getScopeSDonuts) {
        this.seriesScopeDonut1 = getScopeSDonuts.seriesScope1;
        this.seriesScopeDonut2 = getScopeSDonuts.seriesScope2;
        this.seriesScopeDonut3 = getScopeSDonuts.seriesScope3;
        this.labelScopeDonut1 = getScopeSDonuts.labelScope1;
        this.labelScopeDonut2 = getScopeSDonuts.labelScope2;
        const lScope3 = getScopeSDonuts.labelScope3;
        this.labelScopeDonut3 = lScope3
        .filter(item => !item.includes("Stationary Combustion - 0.000 Tonnes")) // Remove items with 0.000 Tonnes
        .map(item => {
          if (item.includes("Stationary Combustion")) {
            return item.replace("Stationary Combustion", "Fuel and Energy-related Activities");
          }
          return item;
        });

        this.seriesScopeDonut3 = this.seriesScopeDonut3.filter(item =>  item !== 0); // Remove items with 0.000 Tonnes
      

        this.donotOptions1 = {
          series: this.seriesScopeDonut1,
          chart: {
            width: "100%",
            height: 350,
            type: "donut"
          },
          dataLabels: {
            enabled: true
          },
          // fill: {
          //   type: "gradient"
          // },

          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',
          },
          labels: this.labelScopeDonut1,
          colors: ['#5DADE2', '#48C9B0', '#F4D03F', '#EC7063', '#AF7AC5', '#48C9B0', '#F0B27A', '#3498DB', '#73C6B6', '#F8C471', '#9ACD32', '#FF8A65', '#B3B6B7', '#D7BDE2', '#76D7C4'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
        this.donotOptions2 = {
          series: this.seriesScopeDonut2,
          chart: {
            width: "100%",
            height: 320,
            type: "donut"
          },
          dataLabels: {
            enabled: true
          },
          // fill: {
          //   type: "gradient"
          // },
          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',
          },
          colors: ['#5DADE2', '#48C9B0', '#F4D03F', '#EC7063', '#AF7AC5', '#48C9B0', '#F0B27A', '#3498DB', '#73C6B6', '#F8C471', '#9ACD32', '#FF8A65', '#B3B6B7', '#D7BDE2', '#76D7C4'],
          labels: this.labelScopeDonut2,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
        if (this.seriesScopeDonut3.length > 5) {
          var height = 430;
        } else {
          height = 360;
        };
        this.donotOptions3 = {
          series: this.seriesScopeDonut3,
          chart: {
            width: "100%",
            height: height,
            type: "donut"
          },
          dataLabels: {
            enabled: true
          },
          // fill: {
          //   type: "gradient"
          // },
          legend: {
            position: "bottom",
            fontSize: '14px',
            floating: false,
            horizontalAlign: 'left',
          },
          colors: ['#5DADE2', '#48C9B0', '#F4D03F', '#EC7063', '#AF7AC5', '#48C9B0', '#F0B27A', '#3498DB', '#73C6B6', '#F8C471', '#9ACD32', '#FF8A65', '#B3B6B7', '#D7BDE2', '#76D7C4'],
          labels: this.labelScopeDonut3,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      }
      if (getScopeActivity) {
        this.upstreamArray = getScopeActivity.upstream;
        this.downstreamArray = getScopeActivity.downstrem;
      }
      if (getVendorE) {
        this.vendorData = getVendorE.purchaseGoods
      }

      if (getPathNetZero) {


        this.donotoptions = {
          series: getPathNetZero.series,
          chart: {
            width: "100%",
            height: 350,
            type: "donut"
          },
          dataLabels: {
            enabled: true
          },
          // fill: {
          //   type: "gradient"
          // },

          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',
          },
          labels: getPathNetZero.hazardousmonth,
          colors: ['#F3722C', '#0068F2', '#F8961E'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      }
    });
  };

  // Handle the scopeWiseResult
  handleScopeWiseResult(scopeWiseResult: any) {
  console.log("scopeWiseResult",scopeWiseResult);
    this.scopeMonths = scopeWiseResult.month;
    this.scopeWiseSeries = scopeWiseResult.series;
    this.series_graph = scopeWiseResult.series_graph;

    this.sumofScope2 = parseFloat(scopeWiseResult.scope1) + parseFloat(scopeWiseResult.scope2) + parseFloat(scopeWiseResult.scope3);

    this.scope1E = scopeWiseResult.scope1;
    this.scope2E = scopeWiseResult.scope2;
    this.scope3E = scopeWiseResult.scope3;
    const sumofScope = this.sumofScope2;
    this.progress1 = (scopeWiseResult.scope1 / sumofScope) * 100;
    this.progress2 = (scopeWiseResult.scope2 / sumofScope) * 100;
    this.progress3 = (scopeWiseResult.scope3 / sumofScope) * 100;

    this.chartOptions = {
      dataLabels: {
        enabled: false
      },
      legend: {
        fontSize: '12px'
      },
      colors: ['#11235aa8', '#46A5CD', '#FFD914'],
      series: this.scopeWiseSeries,
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
        categories: this.scopeMonths
      },
      yaxis: {

        title: {
          style: {
            fontSize: '15px',
            fontWeight: '600'
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
    this.previoucsOptions = {
      dataLabels: {
        enabled: false
      },

      series: this.series_graph,
      chart: {
        // width: 380,
        width: '220',
        // height:'200',
        type: 'pie',
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
      colors: ['#11235aa8', '#46A5CD', '#FFD914'],
      labels: ['Scope 1', 'Scope 2', 'Scope 3'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
        }
      }]
    };
  }



  onFacilityChange(event: any) {

    this.facilityService.facilitySelected(this.selectedFacility)
    this.makeCombinedApiCall(this.selectedFacility)

  };

  ngOnDestroy(): void {
    // this.combinedSubscription.unsubscribe();
  }



}
