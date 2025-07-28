import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-status-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.scss']
})
export class StatusTableComponent {
  @Input() data: any[] = [];
  @Input() categoryId: number;
  @Input() businessId: number | null = null;

  columns: any[] = [];

  ngOnInit() {
    
    this.columns = this.getColumnsByCategory(this.categoryId);
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && !changes['categoryId'].firstChange) {
      this.columns = this.getColumnsByCategory(this.categoryId);
    
    }
    if (changes['data'] && !changes['data'].firstChange) {
      this.data = changes['data'].currentValue;
    
    }
    if (changes['businessId'] && !changes['businessId'].firstChange) {
      this.columns = this.getColumnsByCategory(this.categoryId, this.businessId);
      
    }
  }


  getColumnsByCategory(categoryId: number, businessId?: number): { field: string; header: string }[] {
    switch (categoryId) {
      case 1:
        return [
          { field: 'subcatName', header: 'Category' },
          { field: 'TypeName', header: 'Fuel Type' },
          { field: 'BlendType', header: 'Blend' },
          { field: 'readingValue', header: 'Value' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' },
        ]
      case 2:
        return [
       
          { field: 'TypeName', header: 'Refrigerant Type' },
          { field: 'refAmount', header: 'Refrigerant Amount' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' },
        ]
      case 3:
        return [
          { field: 'subcatName', header: 'Category' },
          { field: 'numberOfExtinguisher', header: 'Extinguisher' },
          { field: 'quantityOfCO2makeup', header: 'CO2 Makeup' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' },
        ]
      case 6:
        return [
          { field: 'subcatName', header: 'Category' },
          { field: 'TypeName', header: 'Vehicle Type' },
          { field: 'vehicle_model', header: 'Vehicle Model' },
          { field: 'NoOfVehicles', header: 'No of Vehicles' },
          { field: 'TotalnoOftripsPerVehicle', header: 'Trips per vehicle' },
          { field: 'ModeofDEID', header: 'Mode' },
          { field: 'Value', header: 'Value' },
          { field: 'unit', header: 'Unit' },
          { field: 'months', header: 'Month' },
        ]
      case 5:
        return [
          { field: 'subcatName', header: 'Category' },
          { field: '-', header: 'Type' },
          { field: 'RegionName', header: 'Region Name' },
          { field: 'readingValue', header: 'Value' },
          { field: 'SourceName', header: 'Source' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' },
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
          { field: 'typeofpurchase', header: 'Category' },
          { field: 'product_category_name', header: 'Product / Service' },
          { field: 'code_name', header: 'Code' },
          { field: 'valuequantity', header: 'Quantity' },
          { field: 'supplier', header: 'Vendor' },
          { field: 'supplierspecificEF', header: 'Vendor EF' },
          { field: 'supplierunit', header: 'Vendor EF Unit' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' },

        ];
      case 9:
        return [
          { field: 'typeofpurchase', header: 'Category' },
          { field: 'typeofpurchase', header: 'Product / Service' },
          { field: 'typeofpurchase', header: 'Code' },
          { field: 'typeofpurchase', header: 'Quantity' },
          { field: 'typeofpurchase', header: 'Product / Service' },
          { field: 'typeofpurchase', header: 'Vendor' },
          { field: 'typeofpurchase', header: 'Vendor EF' },
          { field: 'typeofpurchase', header: 'Vendor EF Unit' },
          { field: 'unit', header: 'Unit' },
          { field: 'unit', header: 'Month' },

        ];

      case 10:
      case 17:
        return [
          { field: 'vehicle_type_name', header: 'Vehicle Type' },
          { field: 'sub_category', header: 'Sub Category' },
          { field: 'no_of_vehicles', header: 'No of Vehicles' },
          { field: 'distance_travelled_km', header: 'Distance Travelled (Km)' },
          { field: 'mass_of_product_trans', header: 'Mass of Product (tonnes)' },
          { field: 'storage_facility_type', header: 'Storage Facility ' },
          { field: 'area_occupied', header: 'Area occupied (sqm)' },
          { field: 'avg_no_of_days', header: 'No of days storage' },
          { field: 'month', header: 'Month' },
        ];

      case 11:
        return [
          { field: 'water_withdrawn_value', header: 'Total Water Withdrawn' },
          { field: 'water_discharged_value', header: 'Surface Water(%)' },
          { field: 'withdrawn_emission_factor_used', header: 'Groundwater (%)' },
          { field: 'treatment_emission_factor_used', header: 'Third party (%)' },
          { field: 'treatment_emission_factor_used', header: 'Sea water / desalinated water (%)' },
          { field: 'treatment_emission_factor_used', header: 'Others (%)' },
          { field: 'water_withdrawn_value', header: 'Total Water Discharged' },
          { field: 'water_discharged_value', header: 'Surface Water(%)' },
          { field: 'withdrawn_emission_factor_used', header: 'Groundwater (%)' },
          { field: 'treatment_emission_factor_used', header: 'Third party (%)' },
          { field: 'treatment_emission_factor_used', header: 'Sea water / desalinated water (%)' },
          { field: 'treatment_emission_factor_used', header: 'Others (%)' },
          { field: 'water_withdrawn_value', header: 'Total Water Treated' },
          { field: 'water_discharged_value', header: 'Surface Water(%)' },
          { field: 'withdrawn_emission_factor_used', header: 'Treatment' },
          { field: 'treatment_emission_factor_used', header: 'Groundwater (%)' },
          { field: 'treatment_emission_factor_used', header: 'Treatment' },
          { field: 'treatment_emission_factor_used', header: 'Third party (%)' },
          { field: 'treatment_emission_factor_used', header: 'Treatment' },
          { field: 'treatment_emission_factor_used', header: 'Sea water / desalinated water (%)' },
          { field: 'treatment_emission_factor_used', header: 'Treatment' },
          { field: 'treatment_emission_factor_used', header: 'Others (%)' },
          { field: 'treatment_emission_factor_used', header: 'Treatment' },
          { field: 'unit', header: 'Month' },

        ];
      case 12:
        return [
          { field: 'product', header: 'Category' },
          { field: 'waste_type', header: 'Sub Category' },
          { field: 'method', header: 'Method' },
          { field: 'total_waste', header: 'Quantity' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' },
        ];
      case 13:
        switch (businessId) {
          case 24:
            return [
              { field: 'vehicle_type_name', header: 'Flight Mode' },
              { field: 'sub_category', header: 'Flight Type' },
              { field: 'sub_category', header: 'Flight Class' },
              { field: 'sub_category', header: 'No of Trips/Passengers' },
              { field: 'sub_category', header: 'Distance Travelled' },
              { field: 'sub_category', header: 'Return Flight' },
              { field: 'sub_category', header: 'Cost Centre' },
              { field: 'unit', header: 'Month' },
            ];

          case 25:
            return [
              { field: 'vehicle_type_name', header: 'Country of Stay' },
              { field: 'sub_category', header: 'Type of Hotel' },
              { field: 'capacity', header: 'No of Rooms' },
              { field: 'range', header: 'No of Nights per Room' },
              { field: 'unit', header: 'Month' },
            ];

          case 26:
            return [
              { field: 'vehicle_type_name', header: 'Mode of Transport' },
              { field: 'sub_category', header: 'No of Trips' },
              { field: 'capacity', header: 'No of Passengers' },
              { field: 'range', header: 'Distance Travelled (km)' },
              { field: 'unit', header: 'Month' },
            ];

          default:
            return [];
        }
      case 14:
        return [
          { field: 'combineVehicle', header: 'Type' },
          { field: 'allemployeescommute', header: '% of Employee Commute' },
          { field: 'avgcommutedistance', header: 'Average Commuted Distance (km)' },
          { field: 'noofemployees', header: 'Total Employees' },
          { field: 'workingdays', header: 'Working Days' },
          { field: 'unit', header: 'Unit' }
        ];
      case 15:
        return [
          { field: 'typeof_homeoffice_name', header: 'Type of Home Office' },
          { field: 'noofemployees', header: 'Employee wfh' },
          { field: 'noofdays', header: 'Days/ week wfh' },
          { field: 'noofmonths', header: 'Months wfh' },
          { field: 'unit', header: 'Month' },
        ];

      case 16:
      case 21:
        return [
          { field: 'category', header: 'Facility Type' },
          { field: 'sub_category', header: 'Sub Category' },
          { field: 'franchise_spaceLease', header: 'Franchise Space' },
          { field: 'scope1_emission', header: 'Scope 1 (kg CO2e)' },
          { field: 'scope2_emission', header: 'Scope 2 (kg CO2e)' },
          { field: 'vehicle_type', header: 'Vehicle' },
          { field: 'vehicle_subtype', header: 'Sub Category' },
          { field: 'no_of_vehicles', header: 'No of Vehicles' },
          { field: 'distance_travelled', header: 'Distance Travelled' },
          { field: 'month', header: 'Month' },
        ];
      case 18:
        return [
          { field: 'intermediate_category', header: 'Category' },
          { field: 'processing_acitivity', header: 'Processing Activity' },
          { field: 'sub_activity', header: 'Processing Sub Activity' },
          { field: 'valueofsoldintermediate', header: 'Value' },
          { field: 'calculation_method', header: 'Calculation Method' },
          { field: 'scope1emissions', header: 'Scope 1 Emission (kg CO2e)' },
          { field: 'scope2emissions', header: 'Scope 2 Emission (kg CO2e)' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' },
        ];
      case 19:
        return [
          { field: 'type_name', header: 'Product Energy Use' },
          { field: 'productcategory_name', header: 'Category' },
          { field: 'no_of_Items', header: 'Quantity' },
          { field: 'expectedlifetimeproduct', header: 'Expected Life' },
          { field: 'electricity_use', header: 'Electricity Use' },
          { field: 'fuel_type', header: 'Fuel Type' },
          { field: 'referigentused', header: 'Fuel Used' },
          { field: 'referigerantleakage', header: 'Refri. Leak' },
          { field: 'no_of_Items_unit', header: 'Unit' },
          { field: 'month', header: 'Month' }
        ];
      case 20:
        return [
          { field: 'waste_type_name', header: 'Waste Type' },
          { field: 'waste_type_name', header: 'Sub Category' },
          { field: 'total_waste', header: 'Total Waste' },
          { field: 'combustion', header: 'Combustion' },
          { field: 'composing', header: 'Composing' },
          { field: 'landfill', header: 'Landfill' },
          { field: 'recycling', header: 'Recycling' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month' }
        ];
      case 22:
        return [
          { field: 'franchise_type', header: 'Type' },
          { field: 'sub_category', header: 'Sub Category' },
          { field: 'calculation_method', header: 'Calculation Method' },
          { field: 'franchise_spaceLease', header: 'Franchise Space' },
          { field: 'scope1_emission', header: 'Scope 1 (kg CO2e)' },
          { field: 'scope2_emission', header: 'Scope 2 (kg CO2e)' },
          { field: 'month', header: 'Month' }
        ];

    }
  }
}
