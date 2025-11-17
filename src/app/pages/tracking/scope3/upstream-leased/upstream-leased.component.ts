import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-upstream-leased',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule, InputSwitchModule],
  templateUrl: './upstream-leased.component.html',
  styleUrls: ['./upstream-leased.component.scss']
})
export class UpstreamLeasedComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  isSubmitting = false;
  year: string;
  months: string;
  leasefacilitieschecked: any;
  leasevehcileschecked: any;
  franchiseGrid: any[] = [];
  franchiseCategoryValue: any;
  subFranchiseCategory: any;
  subfacilityTypeValue: any;
  calculationUpleaseGrid: any[] = [];
  franchiseMethod: boolean = false;
  VehicleGrid: any;
  selectedVehicleType: string;
  subVehicleCategory: any;
  averageMethod: boolean = true;
  subVehicleCategoryValue: any;
  calculationMethod: any;

  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.calculationUpleaseGrid =
      [
        {
          "id": 1,
          "calculationmethod": "Average data method"
        },
        {
          "id": 2,
          "calculationmethod": "Facility Specific method"
        }
      ]
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();

      }

    });
  };

  ngOnInit(): void {
    this.getFranchiseType();
    this.getVehicleTypesLease();
  };

  EntrySave(dataEntryForm) {



    var is_vehicle = 0;
    var is_facility = 0;
    if (this.leasefacilitieschecked === true) {
      is_facility = 1
    }
    if (this.leasevehcileschecked === true) {
      is_vehicle = 1
    }
    let formData = new URLSearchParams();
    if (is_facility == 1 && is_vehicle == 0) {
      if (this.averageMethod == true) {
        formData.set('months', this.months);
        formData.set('year', this.year);
        formData.set('category', this.franchiseCategoryValue);
        formData.set('sub_category', this.subfacilityTypeValue);
        formData.set('calculation_method', this.calculationMethod);
        formData.set('franchise_space', dataEntryForm.value.upLeasefranchise_space);
        formData.set('unit', 'm2');
        formData.set('is_vehicle', is_vehicle.toString());
        formData.set('is_facility', is_facility.toString());
        formData.set('facility_id', this.facilityID.toString());
      } else if (this.franchiseMethod == true) {
        formData.set('months', this.months);
        formData.set('year', this.year);
        formData.set('category', this.franchiseCategoryValue);
        formData.set('sub_category', this.subfacilityTypeValue);
        formData.set('calculation_method', this.calculationMethod);
        formData.set('scope1_emission', dataEntryForm.value.scope1_emission);
        formData.set('scope2_emission', dataEntryForm.value.scope2_emission);
        formData.set('is_vehicle', is_vehicle.toString());
        formData.set('is_facility', is_facility.toString());
        formData.set('facility_id', this.facilityID.toString());
      }
    } else if (is_vehicle == 1 && is_facility == 0) {
      formData.set('months', this.months);
      formData.set('year', this.year);
      formData.set('vehicle_type', this.selectedVehicleType);
      formData.set('vehicle_subtype', this.subVehicleCategoryValue);
      formData.set('no_of_vehicles', dataEntryForm.value.noOfVehicles);
      formData.set('distance_travelled', dataEntryForm.value.distanceInKms);
      formData.set('distance_unit', 'km');
      formData.set('is_vehicle', is_vehicle.toString());
      formData.set('is_facility', is_facility.toString());
      formData.set('facility_id', this.facilityID.toString());
    }
    else if (is_vehicle == 1 && is_facility == 1) {
      if (this.averageMethod == true) {
        formData.set('months', this.months);
        formData.set('year', this.year);
        formData.set('category', this.franchiseCategoryValue);
        formData.set('sub_category', this.subfacilityTypeValue);
        formData.set('calculation_method', this.calculationMethod);
        formData.set('franchise_space', dataEntryForm.value.upLeasefranchise_space);
        formData.set('unit', 'm2');
        formData.set('vehicle_type', this.selectedVehicleType);
        formData.set('vehicle_subtype', this.subVehicleCategoryValue);
        formData.set('no_of_vehicles', dataEntryForm.value.noOfVehicles);
        formData.set('distance_travelled', dataEntryForm.value.distanceInKms);
        formData.set('distance_unit', 'km');
        formData.set('is_vehicle', is_vehicle.toString());
        formData.set('is_facility', is_facility.toString());
        formData.set('facility_id', this.facilityID.toString());
      } else if (this.franchiseMethod == true) {
        formData.set('months', this.months);
        formData.set('year', this.year);
        formData.set('category', this.franchiseCategoryValue);
        formData.set('sub_category', dataEntryForm.value.subfacilityTypeValue);
        formData.set('calculation_method', this.calculationMethod);
        formData.set('scope1_emission', dataEntryForm.value.scope1_emission);
        formData.set('scope2_emission', dataEntryForm.value.scope2_emission);
        formData.set('vehicle_type', this.selectedVehicleType);
        formData.set('vehicle_subtype', this.subVehicleCategoryValue);
        formData.set('no_of_vehicles', dataEntryForm.value.noOfVehicles);
        formData.set('distance_travelled', dataEntryForm.value.distanceInKms);
        formData.set('distance_unit', 'km');
        formData.set('is_vehicle', is_vehicle.toString());
        formData.set('is_facility', is_facility.toString());
        formData.set('facility_id', this.facilityID.toString());
      }
    }



    this.appService.postAPI('/upLeaseEmissionCalculate', formData).subscribe({
      next: (response) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );
          this.dataEntryForm.reset();

        } else {
          this.notification.showError(
            response.message,
            'Error'
          );

        }

      },
      error: (err) => {
        this.notification.showError(
          'Data entry added failed.',
          'Error'
        );
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    });

  };

  getFranchiseType() {
    this.appService.getApi('/franchiseCategories').subscribe({
      next: (response) => {

        if (response.success == true) {
          this.franchiseGrid = response.categories;
          this.franchiseCategoryValue = this.franchiseGrid[0].categories;
          this.getSubFranchiseCategory(this.franchiseCategoryValue);
        }
      }
    })
  };

  onFranchiseChange(event: any) {
    const frachiseTypevalue = event.value;

    this.franchiseCategoryValue = frachiseTypevalue
    this.getSubFranchiseCategory(frachiseTypevalue)
  };

  getSubFranchiseCategory(category: any) {
    this.appService.getApi('/franchiseSubCategories?category=' + category + '&facility_id=' + this.facilityID + '&year=' + this.year).subscribe({
      next: (response) => {
        // // // console.log(response);
        if (response.success == true) {
          this.subFranchiseCategory = response.categories;

        } else {
          this.subFranchiseCategory = [];
        }
      }
    })
  };

  getVehicleTypesLease() {
    this.appService.getApi('/vehicleCategories_lease').subscribe({
      next: (response) => {

        if (response.success == true) {
          this.VehicleGrid = response.categories;

          this.selectedVehicleType = 'Cars'
          this.getSubVehicleCategoryLease(this.VehicleGrid[0].id);

        }
      }
    })
  };



  onVehicleTypeChangeLease(event: any) {
    const selectedIndex = event.value;
    this.selectedVehicleType = this.VehicleGrid.find(items => items.id == selectedIndex).vehicle_type;
    this.getSubVehicleCategoryLease(selectedIndex)
  };

  getSubVehicleCategoryLease(categoryId: any) {
    this.appService.getApi(`/vehicleSubCategories_lease?id=${categoryId}&facility_id=${this.facilityID}&year=${this.year}`).subscribe({
      next: (response) => {
        // // // console.log(response);
        if (response.success == true) {
          // this.VehicleGrid = response.categories;
          this.subVehicleCategory = response.categories;



        }
      }
    })
  };

  onCalculationMethodChange(event: any) {
    const calMethod = event.value;

    if (calMethod == 'Facility Specific method') {
      this.franchiseMethod = true;
      this.averageMethod = false
    } else {
      this.franchiseMethod = false;
      this.averageMethod = true
    }
  };

}
