import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { ChartComponent } from 'ng-apexcharts';
import { Chart3Options } from '../business-travel/business-travel.component';
import { ChartOptions, ChartAreaOptions, ChartOptions2 } from '../ghg-emmissions/ghg-emmissions.component';

@Component({
  selector: 'app-water-usage',
  templateUrl: './water-usage.component.html',
  styleUrls: ['./water-usage.component.scss']
})
export class WaterUsageComponent {
  @ViewChild("ct_emission_by_travel") ct_emission_by_travel: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public secondChart: Partial<ChartOptions>;
  public thirdChart: Partial<ChartOptions>;
  public fourChart: Partial<ChartOptions>;
  public areachart: Partial<ChartAreaOptions>;
  public areaBusinesschart: Partial<ChartAreaOptions>;
  public donotOptions1: Partial<ChartOptions2>;
  public donotOptions2: Partial<ChartOptions2>;
  public donotOptions3: Partial<ChartOptions2>;
  public pieChart: Partial<ChartOptions2>;
  public pieChart2: Partial<ChartOptions2>;
  public pieChart3: Partial<ChartOptions2>;
  public groupChart: Partial<Chart3Options>;
  dashboardData: any[] = [];
  public loginInfo: LoginInfo;
  selectedFacility:any;
  year: Date;
  scopeWiseSeries: any[] = [];
  scopeWiseSeries2: any[] = [];
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
  seriesScopeDonut4: any[] = [];
  labelScopeDonut1: any[] = [];
  labelScopeDonut2: any[] = [];
  labelScopeDonut3: any[] = [];
  labelScopeDonut4: any[] = [];
  upstreamArray: any[] = [];
  downstreamArray: any[] = [];
  vendorData: any[] = [];
  labelSeries1: any[] = [];
  waterDisposed: any;
  totalConsumed: any;
  totalDischarged: any;
  totalTreated: any;
  totalDisposed: any;
  waterTotal: any;
  totalWithdrawn: any;

  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
    this.year = new Date();

    this.groupChart = {
      series: [
        {
          name: "distibuted",
          data: [21, 21, 13, 30]
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
          ["John"],
          ["Joe"],
          ["Jake"],
          ["Peter"],

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




    this.donotOptions2 = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 400,
        type: "donut"
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        position: "bottom",
        fontSize:"14px"
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
        if (this.facilityService.selectedfacilitiesSignal() == 0) {
          this.selectedFacility = result.categories[0].ID;

        } else {
          this.selectedFacility = this.facilityService.selectedfacilitiesSignal();
        }
        this.Waterwithdrawnby_source(this.selectedFacility);
        this.dashboardWaterDischargedbydestination(this.selectedFacility);
        this.dashboardWaterTreated_nonTreated(this.selectedFacility);
        this.waterWaste(this.selectedFacility);
        this.waterTreatedByLevel(this.selectedFacility);
        this.waterTreatedByDestination(this.selectedFacility);
        this.waterEmission(this.selectedFacility);
        // this.getTopFiveE(this.selectedFacility);
        //  this.getScopeDonnutsE(this.selectedFacility);85
        //  this.getActivityE(this.selectedFacility);
        //  this.getVendorE(this.selectedFacility)
      }

    });
  };

  Waterwithdrawnby_source(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.Waterwithdrawnby_source(formData.toString()).subscribe((result: any) => {


      this.scopeWiseSeries = result.series;
      this.labelSeries1 = result.month;
      this.labelScopeDonut1 = result.water_withdrawl;
   
      this.pieChart = {
        series: this.scopeWiseSeries,
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
        labels: this.labelScopeDonut1,
        colors: ['#246377', '#009087', '#002828', '#F9C74F', '#BADA55',],
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

  waterWaste(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.waterWaste(formData.toString()).subscribe((result: any) => {
      this.totalDischarged = result.water_discharge
      this.totalConsumed = result.water_consumed
      this.totalTreated = result.water_treated
      this.totalDisposed = result.water_withdrawn;
      this.totalWithdrawn = result.water_withdrawn;
      this.waterTotal = result.water_total;

    });
  };

  dashboardWaterDischargedbydestination(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.WaterDischargedbydestination(formData.toString()).subscribe((result: any) => {

      this.scopeWiseSeries2 = result.series;
      this.labelScopeDonut2 = result.water_discharge;

      this.pieChart2 = {
        series: this.scopeWiseSeries2,
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
        colors: ['#246377', '#009087', '#002828', '#F9C74F', '#BADA55',],
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

  dashboardWaterTreated_nonTreated(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.dashboardWaterTreated_nonTreated(formData.toString()).subscribe((result: any) => {


      this.seriesScopeDonut1 = result.water_treated_nontreated;
      this.labelScopeDonut1 = result.category;

      this.donotOptions1 = {
        series: this.seriesScopeDonut1,
        chart: {
          width: 400,
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
          fontSize:"14px"
        },
        labels: this.labelScopeDonut1,
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







    });
  };

  waterTreatedByDestination(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.waterTreatedDestination(formData.toString()).subscribe((result: any) => {
     
      this.seriesScopeDonut3 = result.series;
      this.labelScopeDonut3 = result.water_discharge;

      this.pieChart3 = {
        series: this.seriesScopeDonut3,
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
        labels: this.labelScopeDonut3,
        colors: ['#246377', '#009087', '#002828', '#F9C74F', '#BADA55',],
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
  waterTreatedByLevel(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.waterTreatedByLevel(formData.toString()).subscribe((result: any) => {
   
      this.seriesScopeDonut2 = result.series;
      this.labelScopeDonut2 = result.leveloftreatment;

      this.donotOptions2 = {
        series: this.seriesScopeDonut2,
        chart: {
          width: 380,
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
          fontSize:"15px"
        },
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







    });
  };
  waterEmission(facility) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.WaterEmision(formData.toString()).subscribe((result: any) => {
      // console.log(result);
      this.seriesScopeDonut4 = result.water_treated_wiitdrawn;
      this.labelScopeDonut4 = result.category;

      this.donotOptions3 = {
        series: this.seriesScopeDonut4,
        chart: {
          width: 400,
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
          fontSize:"15px"
        },
        labels: this.labelScopeDonut4,
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







    });
  };

  onFacilityChange(event: any) {
    this.facilityService.facilitySelected(this.selectedFacility)
    this.Waterwithdrawnby_source(this.selectedFacility);
    this.dashboardWaterDischargedbydestination(this.selectedFacility);
    this.dashboardWaterTreated_nonTreated(this.selectedFacility);
    this.waterWaste(this.selectedFacility);
    this.waterTreatedByLevel(this.selectedFacility);
    this.waterTreatedByDestination(this.selectedFacility);
    this.waterEmission(this.selectedFacility);
    // // console.log(event.target.value)
    // // console.log(this.selectedFacility);
    // this.emssionByTravel(this.selectedFacility)
  };
}
