import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { HeaderComponent } from '@modules/main/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HazardNonhazardComponent } from './hazard-nonhazard/hazard-nonhazard.component';

import {MultiSelectModule} from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
@NgModule({
  declarations: [
    SettingsComponent,
    HazardNonhazardComponent
  ],
  imports: [
    CommonModule,HeaderComponent,
    SettingsRoutingModule,
    DialogModule,
    ButtonModule,
    FileUploadModule,
    DropdownModule,
    FormsModule,
        ReactiveFormsModule,
        MultiSelectModule
  ]
})
export class SettingsModule { }
