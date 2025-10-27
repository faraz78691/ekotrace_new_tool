import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { DataEntry } from '@/models/DataEntry';
import { AppService } from '@services/app.service';
import { NotificationService } from '@services/notification.service';
import { FacilityService } from '@services/facility.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SubmitButtonComponent } from "@/shared/submit-button/submit-button.component";

@Component({
  selector: 'app-upstream-transportation',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TabViewModule, InputSwitchModule, SubmitButtonComponent],
  templateUrl: './upstream-transportation.component.html',
  styleUrls: ['./upstream-transportation.component.scss']
})
export class UpstreamTransportationComponent {
  isHowtoUse = false;
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
  vehcilestransporationchecked: boolean = false;
  storageTransporationChecked: boolean = false;
  spndBasedChecked: boolean = false;
  upstreamVehicletypeId: any;
  subVehicleCategoryValue: string = 'Van-Petrol';
  storage_type: any;
  facilityID;
  monthString: string;
  dataEntry: DataEntry = new DataEntry();
  selectMonths: any[] = [];
  year: any;
  VehicleGrid: any[] = [];
  selectedVehicleType: any = '';
  subVehicleCategory: any[] = [];
  storageGrid: any[] = [];
  facilityCountryCode: string;
  subCategoryID: number = 1;
  fuelType: [] = [];
  units: any[] = [];
  fuelId: number = 0;
  isSubmitting = false;
  months: string;
  unit: any
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.storageGrid =
      [{
        "id": 1,
        "storagef_type": "Distribution Centre"
      },
      {
        "id": 2,
        "storagef_type": "Dry Warehouse"
      },
      {
        "id": 3,
        "storagef_type": "Refrigerated Warehouse"
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
      this.getPurchaseGoodsCurrency();
    });
  };

  ngOnInit(): void {
    this.getVehicleTypes();

  }

  getPurchaseGoodsCurrency() {
    const formdata = new URLSearchParams();
    formdata.set('facilities', this.facilityID.toString());
    this.appService.postAPI('/getcurrencyByfacilities', formdata).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.unit = response.categories;
        }
      }
    })
  };

  EntrySave(form: NgForm) {

    let formData = new URLSearchParams();

    if (this.storageTransporationChecked === true && this.vehcilestransporationchecked === true && this.spndBasedChecked === false) {
      formData.set('vehicle_type', this.upstreamVehicletypeId);
      formData.set('sub_category', this.subVehicleCategoryValue);
      formData.set('noOfVehicles', form.value.noOfVehicles);
      formData.set('mass_of_products', form.value.mass_of_products);
      formData.set('mass_unit', 'tonnes');
      formData.set('distance_unit', 'km');
      formData.set('area_occupied_unit', 'm2');
      formData.set('distanceInKms', form.value.distanceInKms);
      formData.set('storagef_type', this.storage_type);
      formData.set('area_occupied', form.value.area_occupied);
      formData.set('averageNoOfDays', form.value.averageNoOfDays);
      formData.set('facility_id', this.facilityID);
      formData.set('month', this.months);
      formData.set('year', this.year);
    } else if (this.storageTransporationChecked === true && this.vehcilestransporationchecked === true && this.spndBasedChecked === true) {
      formData.set('storagef_type', this.storage_type);
      formData.set('area_occupied', form.value.area_occupied);
      formData.set('averageNoOfDays', form.value.averageNoOfDays);
      formData.set('area_occupied_unit', 'm2');
      formData.set('spent_base', this.spndBasedChecked ? '1' : '0');
      formData.set('reading_value', form.value.readingvalueLocation);
      formData.set('currency', this.unit);

      formData.set('facility_id', this.facilityID);
      formData.set('month', this.months);
      formData.set('year', this.year);
    } else if (this.storageTransporationChecked === true) {
      formData.set('storagef_type', this.storage_type);
      formData.set('area_occupied', form.value.area_occupied);
      formData.set('averageNoOfDays', form.value.averageNoOfDays);
      formData.set('area_occupied_unit', 'm2');
      formData.set('facility_id', this.facilityID);
      formData.set('month', this.months);
      formData.set('year', this.year);
    } else if (this.vehcilestransporationchecked == true && this.spndBasedChecked == false) {
      formData.set('vehicle_type', this.upstreamVehicletypeId);
      formData.set('sub_category', this.subVehicleCategoryValue);
      formData.set('mass_unit', 'tonnes');
      formData.set('distance_unit', 'km');
      formData.set('noOfVehicles', form.value.noOfVehicles);
      formData.set('mass_of_products', form.value.mass_of_products);
      formData.set('distanceInKms', form.value.distanceInKms);
      formData.set('facility_id', this.facilityID);
      formData.set('month', this.months);
      formData.set('year', this.year);
    } else if (this.spndBasedChecked == true && this.vehcilestransporationchecked == true) {
      formData.set('spent_base', this.spndBasedChecked ? '1' : '0');
      formData.set('reading_value', form.value.readingvalueLocation);
      formData.set('facility_id', this.facilityID);
      formData.set('month', this.months);
      formData.set('year', this.year);
      formData.set('currency', this.unit);
    }


    this.appService.postAPI('/upStreamTransportation', formData.toString()).subscribe({
      next: (response: any) => {

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
  }

  getVehicleTypes() {
    this.appService.getApi(`/vehicleCategories`).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.VehicleGrid = response.categories;
          this.upstreamVehicletypeId = this.VehicleGrid[0].id;
          this.getSubVehicleCategory(this.upstreamVehicletypeId);


        }
      }
    })
  };

  onVehicleTypeChange(event: any) {
    const selectedIndex = event.value;
    this.selectedVehicleType = this.VehicleGrid[selectedIndex - 1].vehicle_type
    this.getSubVehicleCategory(selectedIndex)
  };

  getSubVehicleCategory(categoryId: any) {
    this.appService.getApi(`/vehicleSubCategories?id=${categoryId}&facility_id=${this.facilityID}&year=${this.year}`).subscribe({
      next: (response: any) => {
        // // // console.log(response);
        if (response.success == true) {
          // this.VehicleGrid = response.categories;
          this.subVehicleCategory = response.categories;
          this.subVehicleCategoryValue = this.subVehicleCategory[0].vehicle_type
        }
      }
    })
  };

  onSubCategoryVehicleChange(event: any) {
    this.subVehicleCategoryValue = event.value;
  };
}

