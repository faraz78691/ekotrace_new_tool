// src/app/dashboard/dashboard-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RoleGuard } from '@guards/role.guard';
import { BusinessTravelComponent } from './business-travel/business-travel.component';
import { EnergyEmmsionsComponent } from './energy-emmsions/energy-emmsions.component';
import { GhgEmmissionsComponent } from './ghg-emmissions/ghg-emmissions.component';
import { WasteComponent } from './waste/waste.component';
import { WaterUsageComponent } from './water-usage/water-usage.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
       
        {path:'',redirectTo:'ghgEmission', pathMatch:'full'},
        {path:'ghgEmission',component: GhgEmmissionsComponent},
        {path:'energyEmission',component: EnergyEmmsionsComponent},
        {path:'businessTravel',component: BusinessTravelComponent},
        {path:'waterUsage',component: WaterUsageComponent},
        {path:'waste',component: WasteComponent}
            
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
