import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { AppService } from '@services/app.service';

import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { id } from '@swimlane/ngx-charts';
import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill, ApexGrid, ApexStroke, ApexAxisChartSeries, ApexYAxis } from 'ng-apexcharts';

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

export type ChartOptions = {
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
  selector: 'app-kpi-dashboard',
  templateUrl: './kpi-dashboard.component.html',
  styleUrls: ['./kpi-dashboard.component.scss']
})
export class KpiDashboardComponent {
  // flightsTravelTypes:any[]= []
  public loginInfo: LoginInfo;
  public pieChart: Partial<ChartOptions2>;
  public pieChart2: Partial<ChartOptions2>;
  facilityData: any[] = [];
  formatData: any[] = [{
    id: 1,
    value: "Aggregate"
  },
  {
    id: 2,
    value: "Compare"
  }];
  targerKpisData: any[] = [];
  graph1: any;
  graph2: any;
  graph3: any;
  graph4: any;
  graph5: any;
  graph6: any;
  graph7: any;
  graph8: any;
  isHowtoUse = false

  kpiList: any[] = []

  dateFormatType = 'Monthly'
  desiredLength = 12;
  visibleDate = false;



  dateFormat =
    [

      {
        id: 1,
        shortBy: "Annually"
      },
      {
        id: 2,
        shortBy: "Quaterly"
      },
      {
        id: 3,
        shortBy: "Monthly"
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
  visible2: boolean = false;
  visible: boolean = false;
  FormEdit: boolean = false;
  selectedFacility: any;
  selectedFormatType: any = 'Aggregate';
  startDate: Date = new Date()
  endDate: Date = new Date()
  selectedKpi1: any = 4
  selectedKpi6: any = 7
  selectedKpi5: any = 13
  selectedKpi4: any = 23
  selectedKpi3: any = 29
  selectedKpi2: any = 35

  //  '4,7,13,23,29,35'

  constructor(
    private themeservice: ThemeService,
    private facilityService: FacilityService,
    private dashboardService: DashboardService,
    private appService: AppService,
    private notification: NotificationService,
  ) { }

  ngOnInit() {
    const savedKpis = JSON.parse(localStorage.getItem('savedkpis') || 'null');

    if (savedKpis && Array.isArray(savedKpis) && savedKpis.length === 6) {
      this.selectedKpi1 = savedKpis[0];
      this.selectedKpi2 = savedKpis[1];
      this.selectedKpi3 = savedKpis[2];
      this.selectedKpi4 = savedKpis[3];
      this.selectedKpi5 = savedKpis[4];
      this.selectedKpi6 = savedKpis[5];
    }
    this.loginInfo = new LoginInfo();
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo);
      this.loginInfo = jsonObj as LoginInfo;
      this.GetAllFacility();
      this.getKPIList();
      this.getKPiTargets();


      for (let i = 1; i <= 8; i++) {
        this.targerKpisData.push({
          id: i,
          kpiId: null,
          target: null,
          unit: null,
          target_type: null,

        });;
      };
    }
  };





  GetAllFacility() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
      this.facilityData = response;
      this.selectedFacility = [this.facilityData[0].id]
      this.generateGraphs();
      // this.GetAssignedDataPoint(this.facilityData[0].id)

    });
  };

  getKPIList() {
    let tenantId = this.loginInfo.tenantID;
    this.appService.getApi('/kpiItemsList').subscribe((response: any) => {
      this.kpiList = response.data;


    });
  };
  getKPiTargets() {
    let tenantId = this.loginInfo.tenantID;
    this.appService.getApi('/getKpiTargetByUserId').subscribe((response: any) => {
      if (response.success == true) {
        this.targerKpisData = response.data;

      }


    });
  };

  onKpiChange(kpiId: any, row: any) {
    const unit = this.kpiList.find((item) => item.id == kpiId).unit;
    this.targerKpisData[row].unit = unit;

  };


  pushTargetKpis() {
    this.targerKpisData.push({
      id: this.targerKpisData.length + 1,
      kpiId: null,
      target: null,
      unit: null,
      target_type: null,

    });;
  };

  onFormatChange(event: any) {
    this.visibleDate = false;

    if (this.selectedFormatType == 'Aggregate') {
      if (event == 'Annually') {
        this.visibleDate = true;
        this.desiredLength = 4
      } else if (event == 'Monthly') {
        this.desiredLength = 12
      } else {
        this.desiredLength = 4
      }
    } else {
      this.desiredLength = 4

    }
    this.generateGraphs();
  };

  onFormatTypeChange(event: any) {
    this.selectedFormatType = event;
    var formatType = this.selectedFormatType;
    this.generateGraphs();
  };

  onFacilityChange(event: any) {

    this.generateGraphs();
  };


  onGraphChange(event: any, graphNo: string) {
    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('formatType', this.selectedFormatType);
    formData.append('startDate', this.startDate.getFullYear().toString());
    formData.append('endDate', this.endDate.getFullYear().toString());
    formData.append('format', this.dateFormatType);
    formData.append('kpiIds', event.toString());

    this.appService.postAPI(`/getKpiInventoryDashboard`, formData).subscribe((response: any) => {


      if (graphNo == '1') {
        this.graph1 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#FFEBB2', response.data.first1.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first1.target_value);
      }
      if (graphNo == '2') {
        this.graph2 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#FFEBB2', response.data.first1.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first1.target_value);
      }
      if (graphNo == '3') {
        this.graph3 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#FFEBB2', response.data.first1.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first1.target_value);
      }
      if (graphNo == '4') {
        this.graph4 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#FFEBB2', response.data.first1.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first1.target_value);
      }
      if (graphNo == '5') {
        this.graph5 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#FFEBB2', response.data.first1.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first1.target_value);
      }
      if (graphNo == '6') {
        this.graph6 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#FFEBB2', response.data.first1.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first1.target_value);
      }


    })
  }



  getBarGraphOptions(
    series: any[],
    label: any[],
    color: any,
    yaxisText: string,
    dateFormatType: string,
    graphType: string,
    targetValue: any
  ) {
    let formatXAxis;

    if (graphType === 'Aggregate') {
      if (dateFormatType === 'Monthly') {
        formatXAxis = [
          "Jan", "Feb", "Mar", "Apr",
          "May", "Jun", "Jul", "Aug",
          "Sep", "Oct", "Nov", "Dec"
        ];
      } else if (dateFormatType === 'Annually') {
        formatXAxis = label;
      } else {
        formatXAxis = ["Q1", "Q2", "Q3", "Q4"];
      }
    } else {
      formatXAxis = label;
    }

    const options: any = {
      series: [
        {
          name: "distributed",
          data: series
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [color],
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
        categories: formatXAxis,
        labels: {
          style: {
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        title: {
          text: yaxisText,
          style: {
            fontSize: '14px',
            fontWeight: '400'
          }
        },
        labels: {
          style: {
            fontSize: '13px'
          }
        }
      }
    };

    // Only add annotation if targetValue is defined and is a number
    if (targetValue !== undefined && targetValue !== null && targetValue !== '') {
      options.annotations = {
        yaxis: [
          {
            y: targetValue,
            borderColor: '#FF4560',
            label: {
              borderColor: '#FF4560',
              style: {
                color: '#fff',
                background: '#FF4560'
              },
              text: 'Target'
            }
          }
        ]
      };
    }

    return options;
  }




  submitTarget() {

    const filteredData = this.targerKpisData
      .filter(item => item.target !== null && item.target !== undefined && item.target !== '')
      .map(item => ({
        kpi_id: item.kpi_id,
        target: item.target,
        unit: item.unit,
        target_type: item.target_type
      }));



    const formData = new URLSearchParams();
    formData.append('jsonData', JSON.stringify(filteredData));
    this.appService.postAPI(`/addKpiTarget`, formData).subscribe((response: any) => {
      if (response.success == true) {
        this.notification.showSuccess('Target Added Successfully', '');
        this.generateGraphs()
      }
      this.visible2 = false;
    })
  }
  generateGraphs() {
    if (this.selectedFacility.length == 0) {
      return false
    }

  
  // Check if savedkpis exist in localStorage
  const savedKpis = JSON.parse(localStorage.getItem('savedkpis') || 'null');

  let kpiArray;

  if (savedKpis && Array.isArray(savedKpis) && savedKpis.length === 6) {
    // Use saved KPIs from localStorage
    kpiArray = savedKpis;
  } else {
    // Fallback to default selected KPIs
    kpiArray = [
      this.selectedKpi1,
      this.selectedKpi2,
      this.selectedKpi3,
      this.selectedKpi4,
      this.selectedKpi5,
      this.selectedKpi6
    ];
  }

  const kpiString = kpiArray.join(',');

  const formData = new URLSearchParams();
  formData.append('facilities', this.selectedFacility);
  formData.append('formatType', this.selectedFormatType);
  formData.append('startDate', this.startDate.getFullYear().toString());
  formData.append('endDate', this.endDate.getFullYear().toString());
  formData.append('format', this.dateFormatType);
  formData.append('kpiIds', kpiString);

    this.appService.postAPI(`/getKpiInventoryDashboard`, formData).subscribe((response: any) => {

      this.graph1 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#F2C464', response.data.first1.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first1.target_value);
      this.graph2 = this.getBarGraphOptions(response.data.first2.series, response.data.first2.time, '#A9C34A', response.data.first2.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first2.target_value);
      this.graph3 = this.getBarGraphOptions(response.data.first3.series, response.data.first3.time, '#7BC8D7', response.data.first3.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first3.target_value);
      this.graph4 = this.getBarGraphOptions(response.data.first4.series, response.data.first4.time, '#FFB3A7', response.data.first4.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first4.target_value);
      this.graph5 = this.getBarGraphOptions(response.data.first5.series, response.data.first5.time, '#FF99C9', response.data.first5.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first5.target_value);
      this.graph6 = this.getBarGraphOptions(response.data.first6.series, response.data.first6.time, '#8BC34A', response.data.first6.kpi_unit, this.dateFormatType, this.selectedFormatType, response.data.first6.target_value);
      // this.graph7 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#CE93D8', "Total Emissions", this.dateFormatType, this.selectedFormatType);
      // this.graph8 = this.getBarGraphOptions(response.data.first1.series, response.data.first1.time, '#FFDDC1', "Total Emissions", this.dateFormatType, this.selectedFormatType);
    })
  };


  saveKpi() {
localStorage.setItem('savedkpis',JSON.stringify([this.selectedKpi1, this.selectedKpi2, this.selectedKpi3, this.selectedKpi4, this.selectedKpi5, this.selectedKpi6]))

this.notification.showSuccess('KPI Saved Successfully', '');
  }


}
