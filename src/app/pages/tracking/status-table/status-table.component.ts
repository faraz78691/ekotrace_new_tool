import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownModule } from "primeng/dropdown";
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-status-table',
  standalone: true,
  imports: [CommonModule, TableModule, MultiSelectModule, FormsModule, DropdownModule, ButtonModule],
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.scss']
})
export class StatusTableComponent {
  @Input() data: any[] = [];
  orgData: any[] = [];
  @Input() categoryId: number;
  @Input() businessId: number | null = null;
  @Input() category_name: number | string = '';
  @Input() loading = true;
  columns: any[] = [];
  value: any[] = [];
  categories = [
    { id: 1, name: 'Stationary Combustion', value: 'stationarycombustionde' },
    { id: 2, name: 'Company Owned Vehicles', value: 'combineVehicle' },
    { id: 3, name: 'Electricity', value: 'dbo.renewableelectricityde' },
    { id: 4, name: 'Heat and Steam', value: 'dbo.heatandsteamde' }
  ];

  subCategories = [
    { id: 1, name: 'Liquid Fuels', categoryId: 1 },
    { id: 2, name: 'Solid Fuels', categoryId: 1 },
    { id: 5, name: 'Biomass', categoryId: 1 },
    { id: 3, name: 'Gaseous Fuels', categoryId: 1 },
    { id: 4, name: 'Biofuel', categoryId: 1 },
    { id: 6, name: 'Biogas', categoryId: 1 },

    { id: 11, name: 'Delivery Vehicle', categoryId: 2 },
    { id: 10, name: 'Passenger Vehicle', categoryId: 2 },

    { id: 9, name: 'Location Based', categoryId: 3 },
    { id: 1002, name: 'Market Based', categoryId: 3 },

    { id: 3, name: 'District heat and steam', categoryId: 4 },
    { id: 4, name: 'District Cooling', categoryId: 4 }
  ];
  purchaseOptions = []
  categoriesOptions = [{ id: 1, name: 'Standard Goods' }, { id: 2, name: 'Capital Goods' }, { id: 3, name: 'Standard Services' }];
  subCategoriesOptions = [];
  columnFilterValues: { [key: string]: any } = {};
  months: any[] = [
    { name: 'Jan', value: 'Jan' },
    { name: 'Feb', value: 'Feb' },
    { name: 'Mar', value: 'Mar' },
    { name: 'Apr', value: 'Apr' },
    { name: 'May', value: 'May' },
    { name: 'June', value: 'Jun' },
    { name: 'July', value: 'Jul' },
    { name: 'Aug', value: 'Aug' },
    { name: 'Sep', value: 'Sep' },
    { name: 'Oct', value: 'Oct' },
    { name: 'Nov', value: 'Nov' },
    { name: 'Dec', value: 'Dec' }
  ];
  constructor(private service: AppService, private facilityService: FacilityService) {
  }

  ngOnInit() {
    this.columns = this.getColumnsByCategory(this.categoryId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && !changes['categoryId'].firstChange) {
      this.columns = this.getColumnsByCategory(this.categoryId);

    }
    if (changes['data'] && !changes['data'].firstChange) {
      this.orgData = this.data = changes['data'].currentValue;
    }
    if (changes['category_name'] && !changes['category_name'].firstChange) {
      this.category_name = changes['category_name'].currentValue;

    }
    if (changes['businessId'] && !changes['businessId'].firstChange) {
      this.columns = this.getColumnsByCategory(this.categoryId, this.businessId);

    }
    if (changes['loading'] && !changes['loading'].firstChange) {
      this.loading = changes['loading'].currentValue;
    }

    if (changes['data'] && !changes['data'].firstChange) {
      this.resetTableFilters();
    }
  }

  @ViewChild('dt') table!: any;
  resetTableFilters() {
    this.table.clear();
    this.table.filters = {};
    this.columnFilterValues = {};
    this.table.first = 0;
  }


  getColumnsByCategory(categoryId: number, businessId?: number): { field: string; header: string, isArray?: boolean, xtra?: string, filter?: boolean, filterOptions?: any, filterField?: string }[] {
    switch (categoryId) {
      case 1:
        return [
          { field: 'subcatName', header: 'Category' },
          { field: 'TypeName', header: 'Fuel Type' },
          { field: 'BlendType', header: 'Blend' },
          { field: 'readingValue', header: 'Value' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ]
      case 2:
        return [
          { field: 'TypeName', header: 'Refrigerant Type' },
          { field: 'refAmount', header: 'Refrigerant Amount' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ]
      case 3:
        return [
          { field: 'subcatName', header: 'Category' },
          { field: 'numberOfExtinguisher', header: 'Extinguisher' },
          { field: 'quantityOfCO2makeup', header: 'CO2 Makeup' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
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
          { field: 'months', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ]
      case 5:
        return [
          { field: 'subcatName', header: 'Category' },
          { field: '-', header: 'Type' },
          { field: 'RegionName', header: 'Region Name' },
          { field: 'readingValue', header: 'Value' },
          { field: 'SourceName', header: 'Source' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ]
      case 7:
        return [
          { field: 'typeName', header: 'Type' },
          { field: 'readingValue', header: 'Value' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ]
      case 8:
        return [
          { field: 'typeofpurchase', header: 'Category', filter: true, filterOptions: [...this.categoriesOptions], filterField: 'name' },
          { field: 'product_category_name', header: 'Product / Service', filter: true, filterOptions: [...this.purchaseOptions], filterField: 'name' },
          { field: 'productcodes', header: 'Code' },
          { field: 'valuequantity', header: 'Quantity' },
          { field: 'supplier', header: 'Vendor' },
          { field: 'supplierspecificEF', header: 'Vendor EF' },
          { field: 'supplierunit', header: 'Vendor EF Unit' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },

        ];
      case 9:
        return [
          { field: 'tablename', header: 'Category', filter: true, filterOptions: [...this.categories], filterField: 'value' },
          { field: 'subcatName', header: 'Sub Category', filter: true, filterOptions: [...this.subCategoriesOptions], filterField: 'name' },
          { field: 'readingValue', header: 'Reading Value' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ];

      case 10:
      case 17:
        return [
          { field: 'vehicle_type_name', header: 'Vehicle Type' },
          { field: 'sub_category', header: 'Sub Category' },
          { field: 'no_of_vehicles', header: 'No of Vehicles' },
          { field: 'distance_travelled_km', header: 'Distance Travelled (Km)' },
          { field: 'mass_of_product_trans', header: 'Mass of Product (tonnes)' },
          { field: 'spend_base_value', header: 'Spend Amount' },
          { field: 'storage_facility_type', header: 'Storage Facility ' },
          { field: 'area_occupied', header: 'Area occupied (sqm)' },
          { field: 'avg_no_of_days', header: 'No of days storage' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ];

      case 11:
        return [
          { field: 'water_withdrawn_value', header: 'Total Water Withdrawn' },
          { field: 'water_withdrawl_by_source', header: '', isArray: true },
          // { field: 'water_withdrawl_by_source2', header: 'Groundwater (%)' },
          // { field: 'water_withdrawl_by_source3', header: 'Third party (%)' },
          // { field: 'water_withdrawl_by_source4', header: 'Sea water / desalinated water (%)' },
          // { field: 'water_withdrawl_by_source5', header: 'Others (%)' },
          { field: 'water_discharged_value', header: 'Total Water Discharged' },
          { field: 'water_discharge', header: '', isArray: true },
          // { field: 'withdrawn_emission_factor_used', header: 'Groundwater (%)' },
          // { field: 'treatment_emission_factor_used', header: 'Third party (%)' },
          // { field: 'treatment_emission_factor_used', header: 'Sea water / desalinated water (%)' },
          // { field: 'treatment_emission_factor_used', header: 'Others (%)' },
          { field: 'totalwatertreated', header: 'Total Water Treated' },
          { field: 'water_treatment', header: '', isArray: true, xtra: 'treatment' },
          // { field: 'withdrawn_emission_factor_used', header: 'Treatment' },
          // { field: 'treatment_emission_factor_used', header: 'Groundwater (%)' },
          // { field: 'treatment_emission_factor_used', header: 'Treatment' },
          // { field: 'treatment_emission_factor_used', header: 'Third party (%)' },
          // { field: 'treatment_emission_factor_used', header: 'Treatment' },
          // { field: 'treatment_emission_factor_used', header: 'Sea water / desalinated water (%)' },
          // { field: 'treatment_emission_factor_used', header: 'Treatment' },
          // { field: 'treatment_emission_factor_used', header: 'Others (%)' },
          // { field: 'treatment_emission_factor_used', header: 'Treatment' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ];
      case 12:
        return [
          { field: 'product', header: 'Category' },
          { field: 'waste_type', header: 'Sub Category' },
          { field: 'method', header: 'Method' },
          { field: 'total_waste', header: 'Quantity' },
          { field: 'unit', header: 'Unit' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
        ];
      case 13:
        switch (businessId) {
          case 24:
            return [
              { field: 'flight_calc_mode', header: 'Flight Mode' },
              { field: 'flight_Type', header: 'Flight Type' },
              { field: 'flight_Class', header: 'Flight Class' },
              { field: 'no_of_passengers', header: 'No of Trips/Passengers' },
              { field: 'avg_distance', header: 'Distance Travelled' },
              { field: 'return_Flight', header: 'Return Flight' },
              { field: 'spend_base_value', header: 'Spend Amount' },
              { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
            ];

          case 25:
            return [
              { field: 'country_of_stay', header: 'Country of Stay' },
              { field: 'type_of_hotel', header: 'Type of Hotel' },
              { field: 'no_of_occupied_rooms', header: 'No of Rooms' },
              { field: 'no_of_nights_per_room', header: 'No of Nights per Room' },
              { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
            ];

          case 26:
            return [
              { field: 'mode_of_trasport', header: 'Mode of Transport' },
              { field: 'no_of_trips', header: 'No of Trips' },
              { field: 'no_of_passengers', header: 'No of Passengers' },
              { field: 'distance_travelled', header: 'Distance Travelled (km)' },
              { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
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
          { field: 'unit', header: 'Unit' },
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
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
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
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' },
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
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' }
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
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' }
        ];
      case 22:
        return [
          { field: 'franchise_type', header: 'Type' },
          { field: 'sub_category', header: 'Sub Category' },
          { field: 'calculation_method', header: 'Calculation Method' },
          { field: 'franchise_spaceLease', header: 'Franchise Space' },
          { field: 'scope1_emission', header: 'Scope 1 (kg CO2e)' },
          { field: 'scope2_emission', header: 'Scope 2 (kg CO2e)' },
          { field: 'month', header: 'Month', filter: true, filterOptions: [...this.months], filterField: 'value' }
        ];
    }
  }

  onDynamicFilterChange(
    value: any,
    field: string,
    filterCallback: Function,
    columnFilter: any,
    table: any
  ) {
    // 🔹 Apply main filter
    filterCallback(value || null);

    // 🔹 CATEGORY → clear SUB CATEGORY
    if (field === 'typeofpurchase') {
      // Clear model (IMPORTANT)
      this.columnFilterValues['product_category_name'] = null;

      // Clear PrimeNG filter state
      if (table.filters?.['product_category_name']) {
        delete table.filters['product_category_name'];
      }

      // Force table to re-evaluate filters
      table._filter();
    }

    // 🔹 TABLENAME → clear SUBCAT
    if (field === 'tablename') {
      this.columnFilterValues['subcatName'] = null;

      if (table.filters?.['subcatName']) {
        delete table.filters['subcatName'];
      }

      table._filter();
    }

    // 🔹 Your existing logic
    this.onFilterChange(value, field);

    // 🔹 Close popup
    columnFilter.hide();
  }



  onFilterChange(value: any, field: string) {
    if (!value) {
      this.data = [...this.orgData];
      return;
    }

    if (field === 'tablename') {
      let id = this.categories.find((item: any) => item.value === value).id;
      this.subCategoriesOptions = this.subCategories.filter((item: any) => item.categoryId === id);
      this.columns = this.getColumnsByCategory(this.categoryId);
    }

    if (field === 'typeofpurchase') {
      let id: any = this.categoriesOptions.find((item: any) => item.name === value).id;
      let formData = new URLSearchParams();
      formData.set('typeofpurchase', id);
      formData.set('country_id', this.facilityService.countryCodeSignal());
      formData.set('year', this.facilityService.yearSignal());
      this.service.postAPI(`/purchaseGoodsAllcategoriesFilter`, formData).subscribe((res: any) => {
        this.purchaseOptions = res.categories;
        this.columns = this.getColumnsByCategory(this.categoryId);
      });
    }

    // this.data = this.orgData.filter((item: any) => item[field] === value);
    // this.columns = this.getColumnsByCategory(this.categoryId);
  }

  handleDropdownShow(): void {
    window.addEventListener('scroll', this.preventScroll, true);
  }

  handleDropdownHide(): void {
    window.removeEventListener('scroll', this.preventScroll, true);
  }

  preventScroll(event: Event): void {
    const dropdown = document.querySelector('.p-dropdown-panel');
    if (dropdown) {
      // console.log('Preventing scroll');
      event.stopPropagation();
    }
  }

  clearColumnFilter(field: string, filterCallback: Function) {
    delete this.columnFilterValues[field];
    filterCallback(null); // 🔥 clears PrimeNG filter
  }

  clear(table: any) {
    this.table.clear();
    this.columnFilterValues = {};
    this.table.first = 0;
  }

  clear34(table: any) {
    this.columnFilterValues = {};
    this.columnFilterValues['Category'] = null;
    this.columnFilterValues['subCategory'] = null;
    this.columnFilterValues = {};
    table.filters = {};
    table.clear();
    table.reset();
    this.data = [...this.orgData];
  }

  openDirectFilter(event: MouseEvent, multiSelect: Dropdown) {
    event.stopPropagation();
    multiSelect.show();
  }

  applyFilter(value: any, field: string, dt: any) {
    dt.filter(value, field, 'contains');
    this.onFilterChange(value, field);
  }
}
