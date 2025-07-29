import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
 
@Component({
  selector: 'app-settings-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './settings-table.component.html',
  styleUrls: ['./settings-table.component.scss']
})
export class SettingsTableComponent {
  @Input() data: any[] = [];
  @Input() categoryId: number;
  @Input() businessId: number | null = null;
  @Input() category_name: string | null = null;
 
  columns: any[] = [];
 
  ngOnInit() {
    this.columns = this.getColumnsByCategory(this.categoryId);
  }
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && !changes['categoryId'].firstChange) {
      this.columns = this.getColumnsByCategory(this.categoryId);
 
    }
    if (changes['data'] && !changes['data'].firstChange) {
      this.data = changes['data'].currentValue;
 
    }
    if (changes['category_name'] && !changes['category_name'].firstChange) {
      this.category_name = changes['category_name'].currentValue;

    }
    if (changes['businessId'] && !changes['businessId'].firstChange) {
      this.columns = this.getColumnsByCategory(this.categoryId, this.businessId);
    }
 
  
  }
 
  getColumnsByCategory(categoryId: number, businessId?: number): { xtra?: string; field: string; header: string }[] {
    switch (categoryId) {
      case 1:
        return [
          { field: 'subcatName', header: 'D.P' },
          { field: 'TypeName', header: 'Type' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'Unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ]
      case 2:
        return [
          { field: 'subcatName', header: 'D.P' },
          { field: 'TypeName', header: 'Type' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'Unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ]
      case 3:
        return [
          { field: 'subcatName', header: 'D.P' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'Unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ]
      case 6:
        return [
          { field: 'subcatName', header: 'D.P' },
          { field: 'TypeName', header: 'Type' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'Unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ]
      case 5:
        return [
          { field: 'subcatName', header: 'D.P' },
          { field: 'TypeName', header: 'Type' },
          { field: 'emission_factor', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ]
      case 7:
        return [
          { field: 'typeName', header: 'Type' },
          { field: 'readingValue', header: 'Value' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' },
        ]
      case 8:
        return [
          { field: 'typeofpurchase', header: 'Type of Purchase' },
          { field: 'product_category_name', header: 'Type' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'unit', header: 'Unit' },
        ];
      case 9:
        return [
          { field: 'product_category_name', header: 'Type' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ];
 
      case 10:
      case 17:
        return [
          { field: 'vehicle_type_name', header: 'Vehicle Type' },
          { field: 'sub_category', header: 'Sub Category' },
          { field: 'storage_facility_type', header: 'Storage facility' },
          { field: 'emission_factor_value', header: 'Vehicles Emission Factor' },
          { field: 'emission_factor_storage', header: 'Storage Emission Factor' },
          { field: 'emission_factor_value_unit', header: 'Vehicle Unit' },
          { field: 'emission_factor_storage_unit', header: 'Storage Unit' },
          { field: 'user_name', header: 'User' },
        ];
      case 11:
        return [
          { field: 'water_withdrawn_value', header: 'Water Withdrawn' },
          { field: 'water_discharged_value', header: 'Water Discharge' },
          { field: 'withdrawn_emission_factor_used', header: ' Water Withdrawn EF ' },
          { field: 'treatment_emission_factor_used', header: ' Water Treatment EF ' },
          { field: 'emission_factor_unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ];
      case 12:
        return [
          { field: 'waste_type', header: 'Waste Type' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ];
      case 13:
        switch (businessId) {
          case 24:
            return [
              { field: 'flight_calc_mode', header: 'Type' },
              { field: 'emissionFactorUsed', header: 'Emission Factor' },
              { xtra: 'kg CO2e/', field: 'unit', header: 'Unit' },
              { field: 'user_name', header: 'User' },
            ];
 
          case 25:
            return [
              { field: 'country_of_stay', header: 'Country' },
              { field: 'type_of_hotel', header: 'Type of Hotel' },
              { field: 'emissionFactorUsed', header: 'Emission Factor' },
              { field: 'emission_factor_unit', header: 'Unit' },
              { field: 'user_name', header: 'User' },
            ];
 
          case 26:
            return [
              { field: 'mode_of_trasport', header: 'Type' },
              { field: 'emissionFactorUsed', header: 'Emission Factor' },
              { field: 'emission_factor_unit', header: 'Unit' },
              { field: 'user_name', header: 'User' },
            ];
 
          default:
            return [];
        }
      case 14:
        return [
          { field: 'combineVehicle', header: 'Type' },
          { field: 'EFs', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ];
      case 15:
        return [
          { field: 'typeof_homeoffice_name', header: 'Type' },
          { field: 'emission_factor', header: 'Emission Factor' },
          { field: 'emission_factor_unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ];
 
      case 16:
      case 21:
        return [
          { field: 'category', header: 'Type' },
          { field: 'sub_category', header: 'Sub Category' },
          { field: 'emission_factor_lease', header: ' Lease Emission Factor ' },
          { field: 'emission_factor_lease_unit', header: ' Lease EF Unit ' },
          { field: 'emission_factor_vehichle', header: ' Vehicle Emission Factor ' },
          { field: 'emission_factor_vehicle_unit', header: ' Vehicle EF Unit ' },
          { field: 'user_name', header: 'User' },
        ];
      case 18:
        return [
          { field: 'intermediate_category', header: 'Type ' },
          { field: 'sub_activity', header: ' Sub Activity ' },
          { field: 'emissionFactorUsed', header: ' Emission Factor ' },
          { xtra: 'kg CO2e/', field: 'unit', header: ' Unit ' },
          { field: 'user_name', header: 'User' },
        ];
      case 19:
        return [
          { field: 'type_name', header: 'Category' },
          { field: 'productcategory_name', header: 'Sub Category' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'no_of_Items_unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ];
      case 20:
        return [
          { field: 'waste_type_name', header: 'Type' },
          { field: 'endOfLife', header: 'Emission Factor' },
          { field: 'emission_factor_unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ];
      case 22:
        return [
          { field: 'franchise_type', header: 'Type' },
          { field: 'sub_category', header: 'Sub Category' },
          { field: 'emissionFactorUsed', header: 'Emission Factor' },
          { xtra: 'kg CO2e/', field: 'unit', header: 'Unit' },
          { field: 'user_name', header: 'User' },
        ];
 
    }
  }
}
 
 