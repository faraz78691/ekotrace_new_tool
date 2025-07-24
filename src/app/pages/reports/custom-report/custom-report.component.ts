import { Component } from '@angular/core';

interface customreports {
  heading: string;
  pera: string;
  button: string;
  path:string

}

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.scss']
})
export class CustomReportComponent {

  customreports : customreports[];

  constructor(){
    this.customreports=[
      {
        heading :"Stationary Combustion Report ",
        pera:"Pick and choose the energy data points across the various location and generate your own custom reports",
        button:"view",
        path:"/energy-custom-report"
  
      },
      {
        heading :"Refrigerants Report",
        pera:"Pick and choose the water data points across the various location and generate your own custom reports",
        button:"view",
        path:"/water-custom-report"
  
      },
     

    ]
  }

 
}
