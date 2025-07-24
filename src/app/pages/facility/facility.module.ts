import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';



import { FacilityRoutingModule } from './facility-routing.module';
import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
    declarations: [],
    imports: [CommonModule, FacilityRoutingModule, DropdownModule, TabMenuModule]
})
export class FacilityModule { }
