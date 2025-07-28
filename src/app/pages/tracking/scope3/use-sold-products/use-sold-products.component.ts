import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from "@/shared/submit-button/submit-button.component";
import { FormsModule } from '@angular/forms';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-use-sold-products',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
  templateUrl: './use-sold-products.component.html',
  styleUrls: ['./use-sold-products.component.scss']
})
export class UseSoldProductsComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  isSubmitting = false;
  year: string;
  months: string;
  productEnergyTypes =
    [

      {
        "id": 1,
        "energyTypes": "Direct use-phase emissions"
      },
      {
        "id": 2,
        "energyTypes": "Indirect use-phase emissions"
      }
    ]
  selectedProductEnergyType: any;
  prodductEnergySubTypes: any;
  selectedProductsCategory: any;

  energyUnitsGrid =
    [
      {
        "id": 1,
        "units": "No. of Item"
      },
      {
        "id": 2,
        "units": "Tonnes"
      },
      {
        "id": 3,
        "units": "kg"
      },
      {
        "id": 4,
        "units": "litres"
      }
    ]
  selectedQuantitySoldUnit: any;
  noOfItems: boolean;
  fuelEnergyTypes: any;
  refrigeratedTypes: any;
  subElectricityUnits: string;
  expectedElectricityUnitsGrid =
    [
      {
        "id": 1,
        "unitsExpElec": "No. of times used"
      },
      {
        "id": 2,
        "unitsExpElec": " Days"
      },
      {
        "id": 3,
        "unitsExpElec": "Months"
      },
      {
        "id": 4,
        "unitsExpElec": "Years"
      }
    ]
  selectedExpectedLifetimeUnit: any;


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
  ngOnInit(): void {
    this.getProductsEnergyCategory(1)
  }

  onProductEnergyTypeChange(event: any) {
    const energyMethod = event.value;
    this.getProductsEnergyCategory(energyMethod);
  };

  getProductsEnergyCategory(typeId: any) {
    let formData = new URLSearchParams();

    formData.set('type', typeId);
    formData.set('country_code', this.facilityCountryCode);
    formData.set('year', this.year.toString());

    this.appService.postAPI('/getsoldproductCategory', formData).subscribe({
      next: (response) => {
        // // // console.log(response);
        if (response.success == true) {
          this.prodductEnergySubTypes = response.categories;

        } else {
          this.prodductEnergySubTypes = [];
        }
      }
    })
  };


  onQuantitySoldUnitChange(event: any) {

    const energyMethod = event.value;

    if (energyMethod == 1) {
      this.noOfItems = true;
           this.subElectricityUnits = "per usage"
      this.getFuelEnergyCategory();
      this.getRefrigerants();
    } else {
      this.subElectricityUnits = "per usage"
      this.noOfItems = false;
    }
    // this.getProductsEnergyCategory(energyMethod);

  };

  getFuelEnergyCategory() {
    this.appService.getApi('/getsoldproductFuelType').subscribe({
      next: (response) => {

        if (response.success == true) {
          this.fuelEnergyTypes = response.categories;

        }
      }
    })
  };
  getRefrigerants() {
    this.appService.getApi('/getrefrigents').subscribe({
      next: (response) => {

        if (response.success == true) {
          this.refrigeratedTypes = response.categories;

        }
      }
    })
  };

  onExpectedLifetimeUnitChange(event: any) {
    const energyMethod = event.value;

    if (energyMethod == 1) {
      this.subElectricityUnits = "per usage"
    } else if (energyMethod == 2) {
      this.subElectricityUnits = "per day"
    }
    else if (energyMethod == 3) {
      this.subElectricityUnits = "per months"

    } else if (energyMethod == 4) {
      this.subElectricityUnits = "per year"
    }
    // this.getProductsEnergyCategory(energyMethod);

  };



  EntrySave(form: any) {
    if (this.dataEntryForm.invalid) {

      return;
    }
    if (this.selectedQuantitySoldUnit == undefined || this.selectedQuantitySoldUnit == null) {

      return;
    }


    this.isSubmitting = true;


    let formData = new URLSearchParams();
    if (this.selectedQuantitySoldUnit == 1) {
      formData.set('type', this.selectedProductEnergyType);
      formData.set('productcategory', this.selectedProductsCategory);
      formData.set('no_of_Items', form.value.numberofitems);
      formData.set('no_of_Items_unit', this.selectedQuantitySoldUnit.toString());
      formData.set('expectedlifetimeproduct', form.value.expectedlifetimeproduct);
      formData.set('expectedlifetime_nooftimesused', this.selectedExpectedLifetimeUnit.toString());
      formData.set('electricity_use', form.value.electricity_use);
      formData.set('electricity_usage', form.value.unitsExpElec);
      formData.set('fuel_type', form.value.fuelItem);
      formData.set('fuel_consumed', form.value.fuel_consumed);
      formData.set('fuel_consumed_usage', form.value.unitsExpElec);
      formData.set('referigentused', form.value.ItemRefrigerant);
      formData.set('referigerantleakage', form.value.refLeakageValue);
      formData.set('referigerant_usage', form.value.unitsExpElec);
      formData.set('batch', '1');
      formData.set('month', this.months);
      formData.set('year', this.year);
      formData.set('facilities', this.facilityID.toString());

    } else {
      formData.set('type', this.selectedProductEnergyType);
      formData.set('productcategory', this.selectedProductsCategory);
      formData.set('no_of_Items', form.value.numberofitems);
      formData.set('no_of_Items_unit', this.selectedQuantitySoldUnit.toString());
      formData.set('batch', '1');
      formData.set('month', this.months);
      formData.set('year', this.year);
      formData.set('facilities', this.facilityID.toString());
    }



    this.appService.postAPI('/AddSoldProductsCategory', formData).subscribe({
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
          // this.dataEntryForm.reset();


        }
        this.isSubmitting = false;

      },
      error: (err) => {
        this.isSubmitting = false;
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






}
