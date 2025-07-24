import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '@services/api.service';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill, ApexGrid, ApexStroke, ApexAxisChartSeries } from 'ng-apexcharts';
import html2pdf from 'html2pdf.js';
import { Calendar } from 'primeng/calendar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { forkJoin, tap } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
  xaxis: ApexXAxis;
  fill: ApexFill;
  grid: ApexGrid;
  stroke: ApexStroke;
  colors: any;
};
@Component({
  selector: 'app-ghg-reporting',
  templateUrl: './ghg-reporting.component.html',
  styleUrls: ['./ghg-reporting.component.scss']
})
export class GhgReportingComponent {
  isHowtoUse = false;
  baseYear: any;
  loginInfo: any;
  facilityData: any[] = [];
  categoriesData: any[] = [];
  selectedMultipleFacility: any[] = [];
  selectedMultipleCategories: any[]=[];
  selectedMultipleKPIs: any[] = [1, 4, 9];
  reportData: any;
  currentYear: any;
  scopeEmissons: any;
  scope1Emissions: any;
  scope2Emissions: any;
  wasteDate: any;

  pieChart: Partial<ChartOptions2>;
  pieElectricityChart: any;
  electrcityBarOptions: any;
  scope3PieOptions: any;
  employeeLineGraphOptions: any;
  scope1BarOptions: any;
  scope3BarOptions: any;
  scope1PieOptions: any;
  standardPieOptions: any;
  servicesPieOptions: any;
  hotelPieOptions: any;
  otherModesOfTransportPieOptions: any;
  transportationPieOptions: any;
  capitalPieOptions: any;
  purchaseGoodsData: any;
  welltank: any;
  welltankpieOptions: any;
  ghgEnergyPieOptions: any;
  ghgEnergyMonthBarOptions: any;
  businesTravelData: any;
  employeeData: any;
  employeePieOptions: any;
  scope3Data: any;
  kpiList: any;
  noofEmployeeData: any;
  ghgTopEmissionsGen: any;
  businessTravelTotal: any;
  employeeTotal: any;
  wasteBarOptions: any;
  wastePieOptions: any;
  wasteMixChartOptions: any;
  rangeScopeBarOptions: any;
  rangeScopeLineOptions: any;
  ghgIntensityLineOptions: any;
  sustainableWaste: any
  nonsustainableWaste: any;
  yearWiseLineOptions: any;
  baseYearGhg: any;
  currentYearGhg: any;
  percentageIncDec: any;
  isGenerating = false;
  kpiData: any[] = [];
  showContent = false;
  ghgIntensity: any[] = [];
  ghgRevenue: any[] = [];
  remarkIntensityCurrent: number[];
  remarkIntensityBase: number[];
  intensitySeries: any[] = [];
  remainingTime: number = 50;  // total countdown time
  timerInterval: any;
  constructor(

    private _apiService: ApiService, private spinner: NgxSpinnerService, private facilityService: FacilityService, private cdr: ChangeDetectorRef, private _appService: AppService, private notificationService: NotificationService
  ) {
    this.categoriesData = [
      { id: 1, name: 'Purchased goods and services' },
      { id: 2, name: 'Fuel and related services' },
      { id: 3, name: 'Business travel' },
      { id: 4, name: 'Employee commuting' },
      { id: 5, name: 'Water supply' },
      { id: 6, name: 'Waste' }
    ]



  }
  openCalendar(calendar: Calendar) {
    calendar.toggle();
  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo);
      this.loginInfo = jsonObj as any;
      this.currentYear = new Date().getFullYear();

      this.GetAllFacility();
      this.getKPIList();
    }

  }

  GetAllFacility() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
      this.facilityData = response;
      // this.GetAssignedDataPoint(this.facilityData[0].id)

    });
  };

  onGenerateReport() {
    if (this.selectedMultipleFacility.length == 0) {
      console.log(this.selectedMultipleFacility);
      this.notificationService.showInfo('Please select at least one facility', '')
      return
    }
    if (this.selectedMultipleKPIs.length != 3) {
      console.log(this.selectedMultipleFacility);
      this.notificationService.showInfo('Please select any 3 KPIs', '')
      return
    }
    this.spinner.show();
    // this.isGenerating = true;
    const apiCalls = [
      this.getScopeWiseEmission(),
      this.scope1Categories(),
      this.scope2Categories(),
      this.scope3Categories(),
      this.getPurchaseGoodsServices(),
      this.getBusinessTravel(),
      this.getEmployee(),
      this.getWelltoTank(),
      this.ghgEnergy(),
      this.ghgEnergyMonth(),
      this.getWaste(),
      this.getTopEmissions(),
      this.getGhgNoofEmployee(),
      this.getKPIEmisions()

    ];

    // Only add these API calls if `this.baseYear` exists
    if (this.baseYear) {

      apiCalls.push(this.getRangeWiseScopeEmisions());
      apiCalls.push(this.getRangeWiseYearEmisions());

      apiCalls.push(this.getEmissionsIntesity());

    }
    forkJoin(apiCalls).subscribe({
      next: () => {
        this.showContent = true;
        this.spinner.hide();

        console.log('All API calls completed');
        setTimeout(() => {
          // this.downloadPDF(); 
        }, 2500);
      },
      error: (err) => {
        this.spinner.hide();
        this.notificationService.showWarning('Internal Server Error', '');
        this.isGenerating = false;
        console.error('Error in API calls:', err);
      }
    });
  };


  getKPIList() {
    let tenantId = this.loginInfo.tenantID;
    this._appService.getApi('/kpiItemsList').subscribe((response: any) => {
      this.kpiList = response.data;


    });
  };

  getScopeWiseEmission() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/GhgScopewiseEmssion', formData).pipe(
      tap((response) => {
        this.scopeEmissons = response;
        const pieEmissions = [
          Number(this.scopeEmissons.Scope1[0].total_emission),
          Number(this.scopeEmissons.Scope2[0].total_emission) , Number(this.scopeEmissons.Scope3[0].total_emission)
        ];
        this.pieChart = {
          dataLabels: { enabled: false },
          series: pieEmissions,
          chart: { width: '380', type: 'pie' },
          legend: { show: true, position: 'bottom', offsetY: 0, fontSize: "10px" },
          colors: ['#11235aa8', '#46A5CD', '#FFD914'],
          labels: ['Scope 1', 'Scope 2', 'Scope 3'],
          responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }]
        };
      })
    );
  }



  scope1Categories() {
    const formData = new URLSearchParams();
    formData.set('facilityIds', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/ghgScope1Emissions', formData).pipe(
      tap((response: any) => {
        this.scope1Emissions = response.data;

        let scope1series = this.scope1Emissions.CombustionEmissionData.map(items => Number(items.Total_GHGEmission));
        scope1series = [
          ...scope1series,
          this.scope1Emissions?.RefrigerantEmissionData?.Total_GHGEmission || 0,
          this.scope1Emissions?.ExtinguisherEmissionData?.Total_GHGEmission || 0,
          this.scope1Emissions?.DieselPassengerData?.Total_GHGEmission || 0,
          this.scope1Emissions?.PetrolPassengerData?.Total_GHGEmission || 0,
          this.scope1Emissions?.DieselDeliveryData?.Total_GHGEmission || 0,
          this.scope1Emissions?.otherDeliveryData?.Total_GHGEmission || 0
        ];

        let labels = this.scope1Emissions.CombustionEmissionData.map(items => items.TypeName);
        labels = [...labels, "Refrigerant", "Extinguisher", "Diesel Passenger", "Petrol Passenger", "Diesel Delivery", "Other Delivery"];

        console.log(labels);
        console.log(scope1series);

        this.scope1BarOptions = this.getHorizelBarChartOptions(scope1series, labels);
        this.scope1PieOptions = this.getPieCharOptions(scope1series, labels);
      })
    );
  }


  scope2Categories() {
    const formData = new URLSearchParams();
    formData.set('faciltyId', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/fetchScope2Comission', formData).pipe(
      tap((response: any) => {
        this.scope2Emissions = response.data;

        if (this.scope2Emissions) {
          this.electrcityBarOptions = this.getHorizelBarChartOptions(
            [
              Number(this.scope2Emissions.electricity?.totalGHGEmission) || 0,
              Number(this.scope2Emissions.recSolar?.totalGHGEmission) || 0,
              Number(this.scope2Emissions.recWind?.totalGHGEmission) || 0
            ],
            [
              "Electricity from Grid",
              "Renewable Energy (RECs) - Solar",
              "Renewable Energy (RECs) - Wind"
            ]
          );

          this.pieElectricityChart = this.getPieCharOptions(
            [
              Number(this.scope2Emissions.electricity?.totalGHGEmission) || 0,
              Number(this.scope2Emissions.recSolar?.totalGHGEmission) || 0,
              Number(this.scope2Emissions.recWind?.totalGHGEmission) || 0
            ],
            [
              "Electricity from Grid",
              "Renewable Energy (RECs) - Solar",
              "Renewable Energy (RECs) - Wind"
            ]
          );
        }
      })
    );
  }

  scope3Categories() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/Scope3WiseEmssionOnly', formData).pipe(
      tap((response: any) => {
        const scope3Data = response;
        const label = scope3Data.Scope3.map(items => items.category);

        this.scope3BarOptions = this.getHorizelBarChartOptions(scope3Data.seriesScope3, label);
        this.scope3PieOptions = {
          dataLabels: { enabled: false },
          series: scope3Data.seriesScope3,
          chart: { width: '600', height: '600', type: 'pie' },
          legend: {
            show: true,
            position: "right",
            floating: false,
            fontSize: "10px",
            labels: {
              colors: "#333",
              useSeriesColors: false
            }
          },
          colors: ["#AED6F1", // Light Blue  
            "#A3E4D7", // Soft Teal  
            "#F9E79F", // Light Yellow  
            "#F5B7B1", // Light Pink  
            "#D7BDE2", // Light Purple  
            "#A2D9CE", // Mint Green  
            "#FAD7A0", // Soft Orange  
            "#85C1E9", // Sky Blue  
            "#D5F5E3", // Pastel Green  
            "#FDEBD0", // Peach  
            "#C5E1A5", // Light Green  
            "#FFCCBC"],
          labels: label

        };
        this.scope3Data = scope3Data.Scope3;
        this.businessTravelTotal = scope3Data.Scope3.find(items => items.category === 'Business Travel') || {};
        this.employeeTotal = scope3Data.Scope3.find(items => items.category === 'Employee Commuting') || {};
      })
    );
  }



  getPurchaseGoodsServices() {
    const formData = new URLSearchParams();
    formData.set('faciltyId', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/purchaseGoodAndService', formData).pipe(
      tap((response: any) => {
        const purchaseData = response.data;
        this.purchaseGoodsData = purchaseData;

        this.standardPieOptions = purchaseData.purchaseGoodDetailsByTypeOfPurchase1?.length > 0
          ? this.getPieCharOptions(
            purchaseData.purchaseGoodDetailsByTypeOfPurchase1.map(items => Number(items.total_emission)),
            purchaseData.purchaseGoodDetailsByTypeOfPurchase1.map(items => items.product)
          )
          : undefined;

        this.servicesPieOptions = purchaseData.purchaseGoodDetailsByTypeOfPurchase2?.length > 0
          ? this.getPieCharOptions(
            purchaseData.purchaseGoodDetailsByTypeOfPurchase2.map(items => Number(items.total_emission)),
            purchaseData.purchaseGoodDetailsByTypeOfPurchase2.map(items => items.product)
          )
          : undefined;

        this.capitalPieOptions = purchaseData.purchaseGoodDetailsByTypeOfPurchase3?.length > 0
          ? this.getPieCharOptions(
            purchaseData.purchaseGoodDetailsByTypeOfPurchase3.map(items => Number(items.total_emission)),
            purchaseData.purchaseGoodDetailsByTypeOfPurchase3.map(items => items.product)
          )
          : undefined;
      })
    );
  }
  getBusinessTravel() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/ghgBussinessTravelServices', formData).pipe(
      tap((response: any) => {
        this.businesTravelData = response;

        this.hotelPieOptions = this.businesTravelData.hotelStayResponse?.length > 0
          ? this.getPieCharOptions(
            this.businesTravelData.hotelStayResponse.map(items => Number(items.total_emission)),
            this.businesTravelData.hotelStayResponse.map(items => items.type_of_hotel)
          )
          : undefined;

        this.transportationPieOptions = this.businesTravelData.data?.length > 0
          ? this.getPieCharOptions(
            this.businesTravelData.data.map(items => Number(items.total_emission)),
            this.businesTravelData.data.map(items => items.flight_Type)
          )
          : undefined;

        this.otherModesOfTransportPieOptions = this.businesTravelData.modeOfTransportRespose?.length > 0
          ? this.getPieCharOptions(
            this.businesTravelData.modeOfTransportRespose.map(items => Number(items.total_emission)),
            this.businesTravelData.modeOfTransportRespose.map(items => items.mode_of_trasport)
          )
          : undefined;
      })
    );
  }
  getEmployee() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/ghgEmployeeCommute', formData).pipe(
      tap((response: any) => {
        this.employeeData = response;


        this.employeePieOptions = response.data?.length > 0
          ? this.getPieCharOptions(
            response.data.map(items => Number(items.subtotal_total_emission)),
            response.data.map(items => items.type)
          )
          : undefined;
      })
    );
  }
  getWelltoTank() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/ghgEnergyConsumptionWellTank', formData).pipe(
      tap((response: any) => {
        this.welltank = response;
        this.welltankpieOptions = this.getPieCharOptions(this.welltank.energyinuse, this.welltank.series);
      })
    );
  }
  ghgEnergy() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/ghgEnergyConsumption', formData).pipe(
      tap((response: any) => {
        this.ghgEnergyPieOptions = this.getPieCharOptions(response.flueType, response.series);
      })
    );
  }
  getEmissionsIntesity() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('current_year', this.currentYear.toString());
    formData.set('base_year', this.baseYear.toString());

    return this._appService.postAPI('/getKpiInventoryEmissionIntensity', formData).pipe(
      tap((response: any) => {
        this.ghgIntensity = response.ghg_emission;
        this.ghgRevenue = response.revenue;

        const intensityLabel = this.ghgIntensity.map(items => items.category);
        this.intensitySeries = this.ghgIntensity.map((item, index) => {
          const result = item.emission / this.ghgRevenue[index].emission;
          return (!isFinite(result) || isNaN(result)) ? 0 : Number(result.toFixed(2));
        });

        console.log(this.intensitySeries);
        this.ghgIntensityLineOptions = this.getLineChartOptions(this.intensitySeries, intensityLabel);
      })
    );
  }
  getWaste() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/ghgWasteEmission', formData).pipe(
      tap((response: any) => {
        this.wasteDate = response.data;

        this.sustainableWaste = response.data.method_type
          .filter((item: any) => ['reuse', 'composting', 'anerobic_digestion'].includes(item.method))
          .reduce((sum: number, item: any) => sum + Number(item.total_emission), 0);

        this.nonsustainableWaste = response.data.method_type
          .filter((item: any) => ['incineration', 'landfill'].includes(item.method))
          .reduce((sum: number, item: any) => sum + Number(item.total_emission), 0);


        let series = this.wasteDate?.method_type.map((item: any) => {
          if (item.method === 'reuse' || item.method === 'composting') return Number(item.total_emission);
          return 0;
        }) || [];

        series = [
          ...series,
          this.wasteDate?.open_recycling?.length > 0 ? Number(this.wasteDate.open_recycling[0]?.total_emission) : 0,
          this.wasteDate?.close_recycling?.length > 0 ? Number(this.wasteDate.close_recycling[0]?.total_emission) : 0
        ];

        const labels = ['Reuse', 'Composting', 'Open_recycling', 'Close_recycling'];

        this.wasteBarOptions = this.getHorizelBarChartOptions(
          this.wasteDate.waste_type.map(items => Number(items.total_emission)),
          this.wasteDate.waste_type.map(items => items.product)
        );

        this.wastePieOptions = this.getPieCharOptions(
          this.wasteDate.method_type.map(items => Number(items.total_emission)),
          this.wasteDate.method_type.map(items => items.method)
        );

        this.wasteMixChartOptions = this.getPieCharOptions(series, labels);
      })
    );
  }



  ghgEnergyMonth() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/ghgEnergyConsumptionMonth', formData).pipe(
      tap((response: any) => {
        this.ghgEnergyMonthBarOptions = {
          dataLabels: {
            enabled: false
          },
          legend: {
            fontSize: '14px'
          },
          colors: ['#213D49', '#46A5CD', '#FFD914'],
          series: response.series,
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
                    return parseFloat(val).toFixed(2);
                  }
                }
              }
            }
          },
          xaxis: {
            labels: {
              offsetY: 0,
              style: {
                fontSize: '13px'
              }
            },
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            tooltip: {
              enabled: true,
              offsetY: -35
            }
          },
          fill: {
            opacity: 1
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '13px'
              }
            }
          }
        };
      })
    );
  }
  getTopEmissions() {
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('year', this.currentYear.toString());

    return this._appService.postAPI('/ghgTopEmissionGenerating', formData).pipe(
      tap((response: any) => {
        let series = [
          ...response.Scope1.map((item: any) => Number(item.emission)),
          ...response.Scope2.map((item: any) => Number(item.emission)),
          ...response.Scope3.map((item: any) => Number(item.emission))
        ];

        let labels = [
          ...response.Scope1.map((item: any) => item.category),
          ...response.Scope2.map((item: any) => item.category),
          ...response.Scope3.map((item: any) => item.category)
        ];

        this.ghgTopEmissionsGen = this.getPieCharOptions(series, labels);
      })
    );
  }
  getGhgNoofEmployee() {
    if (this.baseYear) {
      this.baseYear = new Date(this.baseYear).getFullYear().toString();
      var formatBaseyear = Number(this.baseYear)

    } else {
      var formatBaseyear = Number(this.currentYear);
    }

    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('current_year', this.currentYear.toString());
    formData.set('base_year', this.baseYear ? this.baseYear.toString() : this.currentYear.toString());

    return this._appService.postAPI('/GhgEmssionPerNumberOfEmployee', formData).pipe(
      tap((response: any) => {
        this.noofEmployeeData = response.data;
        const condition = this.noofEmployeeData.length > 0 ? this.currentYear : this.currentYear + 1;
        for (let i = formatBaseyear; i < condition; i++) {

          const yearExists = this.noofEmployeeData.some((item: any) => item.year === i);
          if (!yearExists) {

            this.noofEmployeeData.push({
              year: i,
              total_emission: 0,
              total_employees: 0,
              total_per_employee_emission: 0
            });
          }
        }


        this.noofEmployeeData.sort((a: any, b: any) => a.year - b.year);

        let series = this.noofEmployeeData.map((item: any) => item.total_per_employee_emission);
        let labels = this.noofEmployeeData.map((item: any) => item.year);

        this.employeeLineGraphOptions = this.getLineChartOptions(series, labels);
      })
    );
  }
  getRangeWiseScopeEmisions() {
    const base_year = new Date(this.baseYear).getFullYear().toString();
    console.log(base_year);
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('current_year', this.currentYear.toString());
    formData.set('base_year', base_year.toString());

    return this._appService.postAPI('/GhgScopewiseEmssionYearRangeWise', formData).pipe(
      tap((response: any) => {

        // this.rangeScopeLineOptions = this.getLineChartOptions(response.emission, response.year);
        this.rangeScopeBarOptions = {
          series: [
            {
              name: "Scope 1",
              data: response.Scope1.map((item: any) => Number(item.emission))
            },
            {
              name: "Scope 2",
              data: response.Scope2.map((item: any) => Number(item.emission))
            },
            {
              name: "Scope 3",
              data: response.Scope3.map((item: any) => Number(item.emission))
            }
          ],
          chart: {
            type: "bar",
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded"
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
          },
          xaxis: {
            categories: response.Scope1.map((item: any) => item.category),
          },
          yaxis: {
            title: {
              text: "Emissions (tonne CO2e)"
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return `$ ${val} thousands`;
              }
            }
          }
        };
      })
    );
  }
  getRangeWiseYearEmisions() {
    const base_year = new Date(this.baseYear).getFullYear().toString();
    console.log(base_year);
    const formData = new URLSearchParams();
    formData.set('facilities', this.selectedMultipleFacility.toString());
    formData.set('current_year', this.currentYear.toString());
    formData.set('base_year', base_year.toString());

    return this._appService.postAPI('/GhgEmssionYearRangeWise', formData).pipe(
      tap((response: any) => {

        this.baseYearGhg = response.data.find((item: any) => item.category == base_year).emission;
        this.currentYearGhg = response.data.find((item: any) => item.category == this.currentYear.toString()).emission;
        if (this.baseYearGhg) {
          if (this.baseYearGhg > this.currentYearGhg) {
            this.percentageIncDec = Number(((this.baseYearGhg - this.currentYearGhg) / this.currentYear) * 100).toFixed(2);
          } else {
            this.percentageIncDec = Number(((this.currentYearGhg - this.baseYearGhg) / this.baseYear) * 100).toFixed(2);

          }
        }
        // this.rangeScopeLineOptions = this.getLineChartOptions(response.emission, response.year);
        this.yearWiseLineOptions = this.getLineChartOptions(response.data.map((item: any) => item.emission), response.data.map((item: any) => item.category));
      })
    );
  }
  getKPIEmisions() {
    if (this.baseYear) {
      this.baseYear = new Date(this.baseYear).getFullYear().toString();
      var formatBaseyear = Number(this.baseYear)
    }


    const formData = new URLSearchParams();
    formData.set('facility_id', this.selectedMultipleFacility.toString());
    formData.set('current_year', this.currentYear.toString());
    formData.set('base_year', this.baseYear ? this.baseYear.toString() : this.currentYear.toString());
    formData.set('kpi_id', this.selectedMultipleKPIs.toString());

    return this._appService.postAPI('/getKpiInventoryByFacilityIdAndYearAndKpiId', formData).pipe(
      tap((response: any) => {
        this.kpiData = response.data.facility;

      })
    );
  }

  getHorizelBarChartOptions(seriesValues: number[], categories: string[]) {
    return {
      series: [
        {
          name: "GHG Emission",
          data: seriesValues
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      colors: ['#11235aa8', '#46A5CD', '#FFD914'],
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories,
      },
      yaxis: {

        title: {
          style: {
            fontSize: '20px',
            fontWeight: '600'
          },
        },
        labels: {
          style: {
            fontSize: '20px'
          }
        },
      },

    };
  }




  getPieCharOptions(seriesValues: number[], categories: string[]) {
    return {
      dataLabels: {
        enabled: false
      },

      series: seriesValues,
      chart: {
        // width: 380,
        width: '470',
        height: '370',
        type: 'pie',
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0,
        fontSize: "10px"
      },
      colors: [
        "#AED6F1", // Light Blue  
        "#A3E4D7", // Soft Teal  
        "#F9E79F", // Light Yellow  
        "#F5B7B1", // Light Pink  
        "#D7BDE2", // Light Purple  
        "#A2D9CE", // Mint Green  
        "#FAD7A0", // Soft Orange  
        "#85C1E9", // Sky Blue  
        "#D5F5E3", // Pastel Green  
        "#FDEBD0", // Peach  
        "#C5E1A5", // Light Green  
        "#FFCCBC"  // Light Coral  
      ],
      labels: categories,
      // responsive: [{
      //   breakpoint: 480,
      //   options: {
      //     chart: {
      //       width: 200
      //     },
      //   }
      // }]
    };
  }

  getLineChartOptions(seriesValues: number[], categories: string[]) {
    return {
      series: [
        {
          name: "Emissions",
          data: seriesValues
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      grid: {
        row: {
          colors: ["#f3f3f3"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: categories,
        title: {

          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }
        }
      },
      yaxis: {
        title: {
          text: "Emissions (kg CO2)", // Y-axis label
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }
        }
      }
    };
  }




  // working one
  // async  downloadPDF() {
  //   console.log("Download PDF");

  //   const pdf = new jsPDF('p', 'mm', [250, 200], true); 
  //   const content = document.getElementById('pdf-content');

  //   if (!content) {
  //     console.error('PDF generation failed: Element #pdf-content not found');
  //     return;
  //   }
  //   const margin = 1;
  //   const sections = Array.from(content.querySelectorAll('.pdf-section')); 
  //   const chunkSize = 8; 

  //   try {
  //     for (let i = 0; i < sections.length; i += chunkSize) {

  //       const chunk = sections.slice(i, i + chunkSize);


  //       const canvasPromises = chunk.map(section =>
  //         html2canvas(section as HTMLElement, {
  //           logging: false,
  //           useCORS: true,
  //           allowTaint: false,
  //           removeContainer: true,
  //           backgroundColor: null
  //         })
  //       );


  //       const canvases = await Promise.all(canvasPromises);

  //       // Add canvases to the PDF
  //       canvases.forEach((canvas, index) => {
  //         console.log('Canvas dimensions:', canvas.width, canvas.height); 

  //         if (canvas.width === 0 || canvas.height === 0) {
  //           console.error('Error: Captured canvas has zero width or height');
  //           return;
  //         }

  //         if (i + index > 0) pdf.addPage(); 

  //         const imgWidth = 230 - (2 * margin); 

  //         const imgHeight = (canvas.height * imgWidth) / canvas.width; 

  //         pdf.addImage(
  //           canvas.toDataURL('image/jpeg', 0.8), 
  //           'JPEG',
  //           margin,
  //           margin,
  //           imgWidth,
  //           imgHeight,
  //           undefined,
  //           'FAST'
  //         );
  //       });

  //       console.log(`Processed chunk ${i / chunkSize + 1} of ${Math.ceil(sections.length / chunkSize)}`);
  //     }

  //     pdf.save('GHG_Emission_Report.pdf');
  //   } catch (error) {
  //     console.error('PDF generation failed:', error);
  //   }
  // }



  // latest one working
  // async downloadPDF() {
  //   console.log("Download PDF");

  //   const content = document.getElementById('pdf-content');
  //   if (!content) {
  //     console.error('PDF generation failed: Element #pdf-content not found');
  //     return;
  //   }

  //   try {
  //     const options = {
  //       margin: 10, 
  //       filename: 'GHG_Emission_Report.pdf',
  //       image: { type: 'jpeg', quality: 0.7 }, 
  //       html2canvas: { scale: 1.5, useCORS: true }, 
  //       pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  //       orientation: 'landscape'
  //     };

  //     const sections = content.querySelectorAll('.pdf-section'); 

  //     const pdf = new jsPDF('l', 'px', [400,400], true); 

  //     for (let i = 0; i < sections.length; i++) {
  //       const section = sections[i] as HTMLElement;

  //       // Convert each section to a canvas
  //       const canvas = await html2canvas(section, options.html2canvas);
  //       const imgData = canvas.toDataURL('image/jpeg', 0.7);
  //       const imgWidth = 400;// A4 width in mm
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width; 

  //       if (i > 0) pdf.addPage(); 
  //       pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth-20, imgHeight, undefined, 'FAST');
  //     }

  //     pdf.save(options.filename);
  //     this.isGenerating = false;
  //     console.log("PDF successfully downloaded!");
  //   } catch (error) {
  //     console.error('PDF generation failed:', error);
  //   }
  // }


  // latest two working
  // async downloadPDF() {
  //   console.log("Download PDF");

  //   const content = document.getElementById('pdf-content');
  //   if (!content) {
  //     console.error('PDF generation failed: Element #pdf-content not found');
  //     return;
  //   }

  //   try {
  //     const options = {
  //       margin: 10,
  //       filename: 'GHG_Emission_Report.pdf',
  //       image: { type: 'jpeg', quality: 0.5 },
  //       html2canvas: { 
  //         scale: 1,
  //         useCORS: true,
  //         logging: false,
  //         ignoreElements: (element: Element) => element.classList.contains('no-print')
  //       },
  //       orientation: 'landscape'
  //     };

  //     const sections = content.querySelectorAll('.pdf-section');
  //     const pdf = new jsPDF('l', 'px', [400, 400], true);

  //     // Parallel processing of sections
  //     const canvasPromises = Array.from(sections).map(section => 
  //       html2canvas(section as HTMLElement, {
  //         ...options.html2canvas,
  //         // Remove async property here
  //         allowTaint: true // Alternative performance boost
  //       })
  //     );

  //     const canvases = await Promise.all(canvasPromises);

  //     canvases.forEach((canvas, index) => {
  //       const imgData = canvas.toDataURL('image/jpeg', options.image.quality);
  //       const imgWidth = 400 - options.margin * 2;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       if (index > 0) pdf.addPage();
  //       pdf.addImage(imgData, 'JPEG', 
  //         options.margin, 
  //         options.margin, 
  //         imgWidth, 
  //         imgHeight, 
  //         undefined, 
  //         'FAST'
  //       );
  //     });

  //     pdf.save(options.filename);
  //     console.log("PDF successfully downloaded!");
  //   } catch (error) {
  //     console.error('PDF generation failed:', error);
  //   }
  // }
  handleDownload() {
    this.isGenerating = true;
    if(this.baseYear && this.selectedMultipleCategories.length ==0){
      this.remainingTime =25;
    }else if(!this.baseYear && this.selectedMultipleCategories.length ==0){
      this.remainingTime =20;
    }else if(this.baseYear && this.selectedMultipleCategories.length > 3){
      this.remainingTime =105;
    }else if(this.baseYear && this.selectedMultipleCategories.length < 3 ){
      this.remainingTime = 45;
    }else if(!this.baseYear && this.selectedMultipleCategories.length > 3){
      this.remainingTime =70;
    }else if(!this.baseYear && this.selectedMultipleCategories.length < 3){
      this.remainingTime = 48;
    }
    setTimeout(() => {
      this.downloadPDF();

    }, 400)

  }


  // async downloadPDF() {


  //   const content = document.getElementById('pdf-content');
  //   if (!content) {
  //     console.error('PDF generation failed: Element #pdf-content not found');
  //     return;
  //   }

  //   try {
  //     const options = {
  //       margin: 10,
  //       filename: 'GHG_Emission_Report.pdf',
  //       image: { type: 'jpeg', quality: 1 },
  //       html2canvas: {
  //         scale: 1.2,
  //         useCORS: true,
  //         logging: false,
  //         ignoreElements: (element: Element) => element.classList.contains('no-print')
  //       }
  //     };

  //     const sections = content.querySelectorAll('.pdf-section');
  //     const pdf = new jsPDF('l', 'mm'); 

    
  //     const canvasPromises = Array.from(sections).map(async (section) => {
  //       const elem = section as HTMLElement;

      
  //       const contentWidth = elem.scrollWidth;
  //       const contentHeight = elem.scrollHeight;

  //       return {
  //         canvas: await html2canvas(elem, {
  //           ...options.html2canvas,
  //           windowWidth: contentWidth,
  //           windowHeight: contentHeight,
  //           width: contentWidth,
  //           height: contentHeight
  //         }),
  //         originalHeight: contentHeight
  //       };
  //     });

  //     const canvasData = await Promise.all(canvasPromises);

  //     canvasData.forEach((data, index) => {
  //       const canvas = data.canvas;
  //       const imgData = canvas.toDataURL('image/jpeg', options.image.quality);

     
  //       const pageWidth = 400; 
  //       const pageHeight = (data.originalHeight * 0.264583) + (options.margin * 2);


  //       if (index > 0) pdf.addPage([pageWidth, pageHeight], 'l');

      
  //       pdf.setPage(index + 1);
  //       pdf.internal.pageSize.height = pageHeight;
  //       pdf.internal.pageSize.width = pageWidth;

       
  //       const imgWidth = pageWidth - options.margin * 2;
  //       const imgHeight = pageHeight - options.margin * 2;

      
  //       pdf.addImage(imgData, 'JPEG',
  //         options.margin,
  //         options.margin,
  //         imgWidth,
  //         imgHeight,
  //         undefined,
  //         'FAST'
  //       );
  //     });

  //     pdf.save(options.filename);
  //     this.isGenerating = false;
  //     console.log("PDF successfully downloaded!");
  //   } catch (error) {
  //     this.isGenerating = false;
  //     this.notificationService.showWarning('PDF generation failed', 'Error');
  //     console.error('PDF generation failed:', error);
  //   }
  // }

  async downloadPDF() {
    const content = document.getElementById('pdf-content');
    if (!content) {
      console.error('PDF generation failed: Element #pdf-content not found');
      return;
    }
  
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      }
    }, 1000);

    try {
      const options = {
        margin: 10,
        filename: 'GHG_Emission_Report.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          logging: false,
          ignoreElements: (element: Element) => element.classList.contains('no-print')
        }
      };
  
      const sections = content.querySelectorAll('.pdf-section');
      const pdf = new jsPDF('l', 'mm'); // Start with landscape orientation
  
      const canvasData: { canvas: HTMLCanvasElement, originalHeight: number }[] = [];
  
      // Sequential rendering instead of Promise.all
      for (const section of Array.from(sections)) {
        const elem = section as HTMLElement;
        const contentWidth = elem.scrollWidth;
        const contentHeight = elem.scrollHeight;
  
        const canvas = await html2canvas(elem, {
          ...options.html2canvas,
          windowWidth: contentWidth,
          windowHeight: contentHeight,
          width: contentWidth,
          height: contentHeight
        });
  
        canvasData.push({
          canvas,
          originalHeight: contentHeight
        });
  
        // Give browser a little time to breathe
        await new Promise(resolve => setTimeout(resolve, 0));
      }
  
      canvasData.forEach((data, index) => {
        const canvas = data.canvas;
        const imgData = canvas.toDataURL('image/jpeg', options.image.quality);
  
        const pageWidth = 400; // Fixed landscape width
        const pageHeight = (data.originalHeight * 0.264583) + (options.margin * 2);
  
        if (index > 0) pdf.addPage([pageWidth, pageHeight], 'l');
  
        pdf.setPage(index + 1);
        pdf.internal.pageSize.height = pageHeight;
        pdf.internal.pageSize.width = pageWidth;
  
        const imgWidth = pageWidth - options.margin * 2;
        const imgHeight = pageHeight - options.margin * 2;
  
        pdf.addImage(imgData, 'JPEG',
          options.margin,
          options.margin,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );
      });
  
      pdf.save(options.filename);
      this.isGenerating = false;
      console.log("PDF successfully downloaded!");
    } catch (error) {
      this.isGenerating = false;
      this.notificationService.showWarning('PDF generation failed', 'Error');
      console.error('PDF generation failed:', error);
    }
   finally {
    clearInterval(this.timerInterval);
    this.isGenerating = false;
  }
  }
  


  limitSelection() {
    if (this.selectedMultipleKPIs.length > 3) {
      this.selectedMultipleKPIs.pop();
      alert("You can select a maximum of three KPIs only.");
    }
  };


  onCategoriesSelected() {
    console.log(this.selectedMultipleCategories);
  }

}
