import { LoginInfo } from '@/models/loginInfo';
import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '@services/api.service';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  selector: 'app-pdf-reporting',
  templateUrl: './pdf-reporting.component.html',
  styleUrls: ['./pdf-reporting.component.scss']
})
export class PdfReportingComponent {
  @Input() data: any;
  loginInfo: any;
  facilityData: any[] = [];
  currentYear: any;
  baseYear: string;
  scopeEmissons: any;
  facilityId:any;

  public pieChart: Partial<ChartOptions2>;
  constructor(

    private _appService: AppService, private facilityService: FacilityService, private cdr: ChangeDetectorRef
  ) {
  
  }

  ngOnChanges(changes: SimpleChanges) {
   
    if (changes['data']) {
      console.log("change",this.data);
      if(this.data){
      this.facilityId = this.data[0].facility;
      }
   
    console.log(this.facilityId);
    this.downloadPDF();
    }
  }

  ngOnInit() {
    console.log("on",this.data);
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
      this.currentYear = new Date().getFullYear()
      // this.facilityGet(this.loginInfo.tenantID);
      this.GetAllFacility();
      this.getScopeWiseEmission();
    }


  }

  GetAllFacility() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
      this.facilityData = response;
      // this.GetAssignedDataPoint(this.facilityData[0].id)

    });
  };
  getScopeWiseEmission() {
   
    const formData = new URLSearchParams();
    formData.set('facilities', '1');
    formData.set('year', this.currentYear.toString());
    this._appService.postAPI('/GhgScopewiseEmssion' , formData).subscribe((response) => {
      this.scopeEmissons = response;
      const pieEmissions = [this.scopeEmissons.Scope1[0].total_emission , this.scopeEmissons.Scope2[0].total_emission , this.scopeEmissons.Scope3[0].total_emission]
      this.pieChart = {
        dataLabels: {
          enabled: false
        },
  
        series:pieEmissions,
        chart: {
          // width: 380,
          width: '380',
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

    });
  };

  getWasteSlide3() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
      this.facilityData = response;
      // this.GetAssignedDataPoint(this.facilityData[0].id)

    });
  };
  // downloadPDF() {
  //   const pdf = new jsPDF('p', 'mm', [210, 210], true); 
  //   const content = document.getElementById('pdf-content');

  //   if (content) {
  //     const sections = Array.from(content.children) as HTMLElement[];
  //     let sectionIndex = 0;
  //     const margin = 10; 

  //     const processSection = () => {
  //       if (sectionIndex >= sections.length) {
  //         pdf.save('GHG_Emission_Report.pdf'); 
  //         return;
  //       }

  //       const section = sections[sectionIndex];
  //       html2canvas(section, { scale: 2 }).then(canvas => {
  //         const imgData = canvas.toDataURL('image/jpeg', 0.5); 
  //         const imgWidth = 210; 
  //         const imgHeight = (canvas.height * imgWidth) / canvas.width; 

  //         if (sectionIndex > 0) {
  //           pdf.addPage(); // Add a new page after the first section
  //         }

  //         pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth - 2 * margin, imgHeight, '', 'FAST'); 
  //         sectionIndex++;
  //         processSection(); 
  //       });
  //     };

  //     processSection(); 
  //   }
  // }

  async downloadPDF() {
    const pdf = new jsPDF('p', 'mm', [210, 210], true);
    const content = document.getElementById('pdf-content');

    if (!content) return;

    const margin = 5; // Reduced margin in mm
    const sections = Array.from(content.children) as HTMLElement[];

    // Process all sections in parallel
    const canvasPromises = sections.map(section =>
      html2canvas(section, {
        scale: 1.5,
        logging: false,
        useCORS: true,       // Correct property for cross-origin images
        allowTaint: false,    // Keep false unless you need to work with tainted canvas
        removeContainer: true, // Clean up temporary container
        backgroundColor: '#FFFFFF' // Ensure white background
      })
    );

    try {
      const canvases = await Promise.all(canvasPromises);

      canvases.forEach((canvas, index) => {
        if (index > 0) pdf.addPage();

        const imgWidth = 210 - (2 * margin);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.4),
          'JPEG',
          margin,
          margin,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );
      });

      pdf.save('GHG_Emission_Report.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  }




}
