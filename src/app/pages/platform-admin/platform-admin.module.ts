import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformAdminRoutingModule } from './platform-admin-routing.module';
import { PlatformAdminComponent } from './platform-admin.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [
    PlatformAdminComponent,
  ],
  imports: [
    CommonModule,
    PlatformAdminRoutingModule,DialogModule,FormsModule,ProgressSpinnerModule,DropdownModule
  ]
})
export class PlatformAdminModule { }
