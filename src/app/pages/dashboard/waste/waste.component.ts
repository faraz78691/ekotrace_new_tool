import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { ChartComponent } from 'ng-apexcharts';
import { Chart3Options } from '../business-travel/business-travel.component';
import { ChartOptions, ChartAreaOptions, ChartOptions2 } from '../ghg-emmissions/ghg-emmissions.component';
import { Observable, Subscription, catchError, combineLatest, of, tap } from 'rxjs';
import { facilities } from '@/models/dashboardFacilities';

@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss']
})
export class WasteComponent {
  dashboardFacilities$ = new Observable<facilities>();
  @ViewChild("ct_emission_by_travel") ct_emission_by_travel: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public secondChart: Partial<ChartOptions>;
  public thirdChart: Partial<ChartOptions>;
  public fourChart: Partial<ChartOptions>;
  public areachart: Partial<ChartAreaOptions>;
  public areaBusinesschart: Partial<ChartAreaOptions>;
  public donotOptions1: Partial<ChartOptions2>;
  public upDowndonotOptions1: Partial<ChartOptions2>;
  public donotOptions2: Partial<ChartOptions2>;
  public donotOptions4: Partial<ChartOptions2>;
  public pieChart: Partial<ChartOptions2>;
  public groupChart: Partial<Chart3Options>;
  dashboardData: any[] = [];
  public loginInfo: LoginInfo;
  selectedFacility:any;
  combinedSubscription: Subscription;
  ;
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
  UpWaste: string;
  downWaste: string;
  hazardLabel: any[] = [];
  upDownLabel: any[] = [];
  hazardSeries: any[] = [];
  upDownSeries: any[] = [];
  totaltype: any
  hazardTotal: any;
  wasteDiversion: any;


  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
    this.year = new Date();



    this.pieChart = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie",
      },
      legend: {
        position: "bottom"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
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


  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString())
    this.dashboardFacilities$ = this.dashboardService.getdashboardfacilities(formData.toString()).pipe(
      tap(response => {
        if(this.facilityService.selectedfacilitiesSignal() == 0){
          this.selectedFacility = response.categories[0].ID;

        }else{
          this.selectedFacility = this.facilityService.selectedfacilitiesSignal();
        }
        this.makeCombinedApiCall(this.selectedFacility)
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
    const scopeWiseEmission$ = this.dashboardService.updownWasteTotal(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in scopeWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const topWiseEmission$ = this.dashboardService.wasteTopFive(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const getScopeSDonuts$ = this.dashboardService.wasteTypeEmission(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const getUpDownDonuts$ = this.dashboardService.WasteUpDownwiseEmssion(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const getBRreakdownEmission$ = this.dashboardService.BreakDownEmssion(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const getHazardType$ = this.dashboardService.hazardGRash(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
  


    // Combine both observables using combineLatest and return the combined observable
    this.combinedSubscription = combineLatest([
      scopeWiseEmission$,
      topWiseEmission$,
      getScopeSDonuts$,
      getUpDownDonuts$,
      getBRreakdownEmission$,
      getHazardType$

    ]).subscribe((results: [any, any, any, any, any,any]) => {
      const [scopeWiseResult, topWiseResult, getALLEmisions, getUpDownDonuts, getBRreakdownEmission,getHazardType] = results;
      // Process the results of both API calls here
      if (scopeWiseResult) {
 
        this.UpWaste = scopeWiseResult.waste_disposed
        this.downWaste = scopeWiseResult.waste_emissions
        this.wasteDiversion = scopeWiseResult.diverted_emssion

      } else {
        // Handle absence of scopeWise result or error
      }

      if (topWiseResult) {
        // Handle topWise result
        this.topFIveE = topWiseResult.top5Emissions;
      
      } else {
        // Handle absence of topWise result or error
      }
      if (getALLEmisions) {
        this.hazardSeries = getALLEmisions.series[0].data;
        this.hazardLabel = getALLEmisions.hazardousmonth;
        this.hazardTotal = getALLEmisions.totalemssion;



        this.donotOptions1 = {
          series: this.hazardSeries,
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
          labels: this.hazardLabel,
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
     

        this.groupChart = {
          series: [
            {
              name: "distibuted",
              data: this.hazardSeries
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
            "#008FFB",
            "#00E396",
            "#FEB019",
            "#D10CE8"
          ],
          plotOptions: {
            bar: {
              columnWidth: "30%",
              // distributed: true
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
            categories: this.hazardLabel,
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

        //   series: this.seriesScopeDonut3,
        //   chart: {
        //     width: "100%",
        //     height:350,
        //     type: "donut"
        //   },
        //   dataLabels: {
        //     enabled: true
        //   },
        //   // fill: {
        //   //   type: "gradient"
        //   // },
        //   legend: {
        //     position: "bottom",
        //     fontSize: '15px',
        //     floating: false,
        //     horizontalAlign: 'left',
        //   },
        //   colors: ['#F3722C', '#0068F2', '#F8961E'],
        //   labels: this.labelScopeDonut3,
        //   responsive: [
        //     {
        //       breakpoint: 480,
        //       options: {
        //         chart: {
        //           width: 200
        //         },
        //         legend: {
        //           position: "bottom"
        //         }
        //       }
        //     }
        //   ]
        // };
      }
      if (getUpDownDonuts) {
      
        this.upDownSeries = getUpDownDonuts.upstream_downstream;
        this.upDownLabel = getUpDownDonuts.series;

        this.upDowndonotOptions1 = {
          series: this.upDownSeries,
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
          labels: this.upDownLabel,
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
      if (getBRreakdownEmission) {
        this.seriesScopeDonut2 = getBRreakdownEmission.series;
        this.labelScopeDonut2 = getBRreakdownEmission.hazardousmonth;
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
          // fill: {
          //   type: "gradient"
          // },

          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',
          },
          labels: this.labelScopeDonut2,
          colors: ['#F3722C', '#0068F2', '#F8961E','#213D49'],
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
      if(getHazardType){
    
        this.donotOptions4 = {
          series: getHazardType.series,
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
          labels: getHazardType.cities,
          colors: ['#F3722C', '#0068F2', '#F8961E','#213D49'],
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
  
    this.scopeWiseSeries = scopeWiseResult.series;
    this.series_graph = scopeWiseResult.series_graph;
    this.sumofScope2 = scopeWiseResult.scope1 + scopeWiseResult.scope2 + scopeWiseResult.scope3;
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
        show: false,
        position: 'top',
        offsetY: 0
      },
      colors: ['#213D49', '#46A5CD', '#FFD914'],
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
              }
            }
          }
        },
      },

      xaxis: {
        categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
      },
      fill: {
        opacity: 1
      }
    };

    //   dataLabels: {
    //     enabled: false
    //   },

    //   series: this.series_graph,
    //   chart: {
    //     // width: 380,
    //     width: '220',
    //     // height:'200',
    //     type: 'pie',
    //   },
    //   legend: {
    //     show: true,
    //     position: 'bottom',
    //     offsetY: 0
    //   },
    //   colors: ['#213D49', '#46A5CD', '#FFD914'],
    //   labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    //   responsive: [{
    //     breakpoint: 480,
    //     options: {
    //       chart: {
    //         width: 200
    //       },
    //     }
    //   }]
    // };
  }


  onFacilityChange(event: any) {
       this.facilityService.facilitySelected(this.selectedFacility)
    this.makeCombinedApiCall(this.selectedFacility)
    // // console.log(event.target.value)
    // // console.log(this.selectedFacility);
    // this.emssionByTravel(this.selectedFacility)
  };
}
