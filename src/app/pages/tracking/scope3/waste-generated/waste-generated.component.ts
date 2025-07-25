import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { DataEntry } from '@/models/DataEntry';
import { SubmitButtonComponent } from "@/shared/submit-button/submit-button.component";

@Component({
  selector: 'app-waste-generated',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TabViewModule, SubmitButtonComponent],
  templateUrl: './waste-generated.component.html',
  styleUrls: ['./waste-generated.component.scss']
})
export class WasteGeneratedComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  fuelType: [] = [];
  units: any[] = [];
  fuelId: number = 0;
  isSubmitting = false;
  year: any;
  months: string;
  selectMonths: any[] = [];
  dataEntry: DataEntry = new DataEntry();
  wasteMethod: string;
  waterWasteProduct: string;
  wasteSubCategory: any;
  waterWasteId: number;
  recycleSelectedMethod: string;
  wasteGrid: any[] = [];
  wasteSubTypes: any[] = [];
  waterWasteMethod: any[] = [];
  recycle: boolean = false;
  recycleMethod: any[] = [];
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
  };

  EntrySave(form: NgForm) {
    if (this.selectMonths.length == 0) {
      this.notification.showInfo(
        'Select month',
        ''
      );
      return
    }
    if (form.value.waste_quantity == null || form.value.waste_quantity == '') {
      this.notification.showInfo(
        'Enter waste quantity',
        ''
      );
      return
    }
    var spliteedMonth = this.dataEntry.month.split(",");
    var monthString = JSON.stringify(spliteedMonth)

    let formData = new URLSearchParams();
    if (this.wasteMethod == 'recycling') {
      formData.set('product', this.waterWasteProduct);
      formData.set('waste_type', this.wasteSubCategory);
      formData.set('total_waste', form.value.waste_quantity);
      formData.set('method', this.wasteMethod);
      formData.set('unit', 'tonnes');
      formData.set('waste_loop', this.recycleSelectedMethod);
      formData.set('id', this.waterWasteId.toString());
      formData.set('months', monthString);
      formData.set('year', this.dataEntry.year);
      formData.set('facility_id', this.facilityID.toString());
    } else {
      formData.set('product', this.waterWasteProduct);
      formData.set('waste_type', this.wasteSubCategory);
      formData.set('total_waste', form.value.waste_quantity);
      formData.set('method', this.wasteMethod);
      formData.set('unit', 'tonnes');
      formData.set('id', this.waterWasteId.toString());
      formData.set('months', monthString);
      formData.set('year', this.dataEntry.year);
      formData.set('facility_id', this.facilityID.toString());
    }


    this.appService.postAPI('/wasteGeneratedEmission', formData.toString()).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );
          this.dataEntryForm.reset();
          // this.wasteMethod = this.waterWasteMethod[0].id
          // this.getWasteSubCategory("1")

        } else {
          this.notification.showError(
            response.message,
            'Error'
          );
          // this.dataEntryForm.reset();
          // this.wasteMethod = this.waterWasteMethod[0].id

        }
        // this.ALLEntries();
        // this.recycle = false;
      },
      error: (err) => {
        this.notification.showError(
          'Data entry added failed.',
          'Error'
        );
        this.dataEntryForm.reset();


        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    })
  }


  onWasteTypeChange(event: any) {
    const energyMethod = event.value;
    // // console.log("energy method,", energyMethod);
    this.waterWasteProduct = this.wasteGrid[energyMethod - 1].type

    this.getWasteSubCategory(energyMethod);

  };

  getWasteSubCategory(typeId: any) {

    let formData = new URLSearchParams();

    formData.set('type', typeId);
    formData.set('year', this.year.getFullYear().toString());
    this.appService.postAPI('/getendoflife_waste_type_subcategory', formData).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          // // console.log(response);
          this.wasteSubTypes = response.categories;

        } else {
          this.wasteSubTypes = [];
        }
      }
    })
  };

  wastemethodChange(event: any) {

    if (event.value == 'recycling') {
      this.recycle = true
    } else {
      this.recycle = false;
    }
  }
}

