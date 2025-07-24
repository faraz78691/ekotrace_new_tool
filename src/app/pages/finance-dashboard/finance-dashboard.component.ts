import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexXAxis, ApexResponsive, ApexFill, ApexTooltip, ApexStroke, ApexLegend, ApexNonAxisChartSeries, ApexGrid } from 'ng-apexcharts';
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
@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.scss']
})




export class FinanceDashboardComponent {
  public secondChart: Partial<ChartOptions>;
  public thirdChart: Partial<ChartOptions>;
  public fourChart: Partial<ChartOptions>;
  public areachart: Partial<ChartAreaOptions>;
  public areaBusinesschart: Partial<ChartAreaOptions>;
  public donotOptions1: Partial<ChartOptions2>;
  public pieChart: Partial<ChartOptions2>;
  groupsData: any[] = [];
  public loginInfo: LoginInfo;
  selectedSubGrupId:number;
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

  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    this.GetAllSubGrups();
   
  };

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


  GetAllSubGrups() {
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString())
    this.facilityService.getSubGroupsByTenantId(formData.toString()).subscribe((result: any) => {
      if (result.success == true) {
    
        this.groupsData = result.categories;
        console.log(this.groupsData);
        this.selectedSubGrupId = this.groupsData[0].id;
      
        this.getFinancedEmission(this.selectedSubGrupId);
        this.GetIndustry(this.selectedSubGrupId);
    

      }

    });
  };


  getFinancedEmission(subGroupID) {
   
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('year', this.year.getFullYear().toString());
    formData.set('sub_group_id', subGroupID);
    this.dashboardService.financeEmissionDashType(formData.toString()).subscribe((result: any) => {
     

      this.scopeWiseSeries = result.series;
      this.labelScopeDonut1 = result.categories;
      this.airTotal = result.totalEmssion;

// console.log(this.scopeWiseSeries);
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

  GetIndustry(subGroupID:any) {

    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();

    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('sub_group_id', subGroupID);
    this.dashboardService.getFinanceIndustry(formData.toString()).subscribe((result: any) => {
      this.scopeWiseSeries2 = result.series;
      const numericValues = this.scopeWiseSeries2.map(value => parseFloat(value));
      this.labelScopeDonut2 = result.label;
      this.renewableTotal = result.totalEmission;


      this.donotOptions1 = {
        series: numericValues,
        chart: {
          width: "100%",
          height: 380,
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
        colors: ['#246377', '#009087', '#002828', '#F9C74F','#F9C14F'],
        labels: this.labelScopeDonut2,
        responsive: [
          {
            breakpoint: 450,
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
    console.log(this.selectedSubGrupId);

    const selecteddata = this.groupsData.filter(items=> items.id == this.selectedSubGrupId);
    console.log(selecteddata[0]);
    if(selecteddata[0].group_by ==2){
      this.getFinancedEmission(selecteddata[0].ID)
      this.GetIndustry(selecteddata[0].ID)
    }else{
      this.getFinancedEmission(this.selectedSubGrupId)
      this.GetIndustry(this.selectedSubGrupId)

    }
    // console.log(finalID);
  
  };

}
