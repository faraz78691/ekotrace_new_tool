import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingRoutingModule } from './tracking-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TreeviewEventParser } from '@treeview/ngx-treeview';


import { TableModule } from 'primeng/table';
import { TrackingComponent } from './tracking.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '@/shared.module';
import { ControlSidebarComponent } from '@modules/main/control-sidebar/control-sidebar.component';

import { HeaderComponent } from '@modules/main/header/header.component';
import { StatusTableComponent } from "./status-table/status-table.component";
import { SettingsTableComponent } from './settings-table/settings-table.component';
@NgModule({
  declarations: [TrackingComponent],
  imports: [
    TrackingRoutingModule,
    CalendarModule,
    NgxSpinnerModule,
    SharedModule,
    HeaderComponent,
    StatusTableComponent,
    SettingsTableComponent
],
  providers: [
  
  ]
})
export class TrackingModule { }
