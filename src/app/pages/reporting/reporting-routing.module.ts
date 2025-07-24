import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhgReportingComponent } from './ghg-reporting/ghg-reporting.component';

const routes: Routes = [
  {path:'',component:GhgReportingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
