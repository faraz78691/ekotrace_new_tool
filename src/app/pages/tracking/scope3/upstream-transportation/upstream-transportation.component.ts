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
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();

      }
    });
  }

  EntrySave(form: NgForm) {

    this.dataEntry.month = this.selectMonths.map((month) => month.value)
      .join(','); //this.getMonthName();
    this.dataEntry.year = this.year.getFullYear().toString(); //this.getYear();
    var spliteedMonth = this.dataEntry.month.split(",");
    var monthString = JSON.stringify(spliteedMonth);
    let formData = new URLSearchParams();

    if (this.storageTransporationChecked === true && this.vehcilestransporationchecked === true) {
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
      formData.set('month', monthString);
      formData.set('year', this.dataEntry.year);
    } else if (this.storageTransporationChecked === true) {
      formData.set('storagef_type', this.storage_type);
      formData.set('area_occupied', form.value.area_occupied);
      formData.set('averageNoOfDays', form.value.averageNoOfDays);
      formData.set('area_occupied_unit', 'm2');
      formData.set('facility_id', this.facilityID);
      formData.set('month', monthString);
      formData.set('year', this.dataEntry.year);
    } else if (this.vehcilestransporationchecked == true) {
      formData.set('vehicle_type', this.upstreamVehicletypeId);
      formData.set('sub_category', this.subVehicleCategoryValue);
      formData.set('mass_unit', 'tonnes');
      formData.set('distance_unit', 'km');
      formData.set('noOfVehicles', form.value.noOfVehicles);
      formData.set('mass_of_products', form.value.mass_of_products);
      formData.set('distanceInKms', form.value.distanceInKms);
      formData.set('facility_id', this.facilityID);
      formData.set('month', monthString);
      formData.set('year', this.dataEntry.year);
    }


    this.appService.postAPI('/upStreamTransportation', formData.toString()).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );
          this.dataEntryForm.reset();
          // this.getVehicleTypes()
          // this.getSubVehicleCategory(1);
          // this.getStatusData(this.activeCategoryIndex)
        } else {
          this.notification.showError(
            response.message,
            'Error'
          );
          // this.dataEntryForm.reset();
          // this.getSubVehicleCategory(1)
        }
        // this.ALLEntries();
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

  onVehicleTypeChange(event: any) {
    const selectedIndex = event.value;
    this.selectedVehicleType = this.VehicleGrid[selectedIndex - 1].vehicle_type
    this.getSubVehicleCategory(selectedIndex)
  };

  getSubVehicleCategory(categoryId: any) {
    this.appService.getApi(`/vehicleSubCategories?id=${categoryId}&facility_id=${this.facilityID}`).subscribe({
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

