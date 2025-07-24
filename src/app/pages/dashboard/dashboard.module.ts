// src/app/dashboard/dashboard.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';

// Import child components here if any


@NgModule({
  declarations: [
    DashboardComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {}
