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
import { getMonthsData } from '@pages/tracking/months';
import { firstValueFrom } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-waste-generated',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TabViewModule, SubmitButtonComponent, InputSwitchModule, DialogModule],
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
  monthsData: any[] = [];
  annualEntry = false;
  visible: boolean = false;
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.recycleMethod =
      [

        {
          "id": 1,
          "template": "Open Loop"
        },
        {
          "id": 2,
          "template": "Close Loop"
        }

      ];
    this.waterWasteMethod =
      [
        {
          "id": 'reuse',
          "water_type": "Reuse"
        },
        {
          "id": 'recycling',
          "water_type": "Recycling"
        },
        {
          "id": 'incineration',
          "water_type": "Incineration"
        },
        {
          "id": 'composting',
          "water_type": "Composting"
        },
        {
          "id": 'landfill',
          "water_type": "Landfill"
        },
        {
          "id": 'anaerobic_digestion',
          "water_type": "Anaerobic digestion"
        }
      ];
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
    this.monthsData = getMonthsData()
    this.getEndWasteType();

  };

  async EntrySave(form: NgForm) {

    if (this.annualEntry) {
      const selectedMonths = this.monthsData.filter(item => item.selected)
      if (selectedMonths.length == 0) {
        this.notification.showWarning('Please select at least one month', 'Warning');
        this.isSubmitting = false;
        return
      }
      let formData = new URLSearchParams();
      if (this.wasteMethod == 'recycling') {
        formData.set('product', this.waterWasteProduct);
        formData.set('waste_type', this.wasteSubCategory);
        formData.set('method', this.wasteMethod);
        formData.set('unit', 'tonnes');
        formData.set('waste_loop', this.recycleSelectedMethod);
        formData.set('id', this.waterWasteId.toString());
        formData.set('year', this.year);
        formData.set('facility_id', this.facilityID.toString());
      } else {
        formData.set('product', this.waterWasteProduct);
        formData.set('waste_type', this.wasteSubCategory);

        formData.set('method', this.wasteMethod);
        formData.set('unit', 'tonnes');
        formData.set('id', this.waterWasteId.toString());
        formData.set('year', this.year);
        formData.set('facility_id', this.facilityID.toString());
      }

      for (let index = 0; index < this.monthsData.length; index++) {
        const item = this.monthsData[index];
        if (item.selected) {
          formData.set('months', JSON.stringify([item.value]));
          formData.set('total_waste', (item.readingValue || '').toString());

          try {
            const response: any = await firstValueFrom(
              this.appService.postAPI('/wasteGeneratedEmission', formData)
            )

            if (response.success === true) {
              if (index === selectedMonths.length - 1) {
                this.notification.showSuccess('Data entry added successfully', 'Success');
                this.isSubmitting = false;
                this.monthsData = getMonthsData()
                this.annualEntry = false;
                this.appService.sendData(false);
              }
            } else {
              if (index === selectedMonths.length - 1) {
                this.notification.showError(response.message, 'Error');
                this.isSubmitting = false;
                this.appService.sendData(false);
              }
            }
          } catch (err) {
            if (index === selectedMonths.length - 1) {
              this.notification.showError('Data entry failed.', 'Error');
              this.isSubmitting = false;
              console.error('Error while submitting form:', err);
            }
          }
          await new Promise(res => setTimeout(res, 200));
        }
      }
    } else {

      if (form.value.waste_quantity == null || form.value.waste_quantity == '') {
        this.notification.showInfo(
          'Enter waste quantity',
          ''
        );
        return
      }
      this.isSubmitting = true;
      let formData = new URLSearchParams();
      if (this.wasteMethod == 'recycling') {
        formData.set('product', this.waterWasteProduct);
        formData.set('waste_type', this.wasteSubCategory);
        formData.set('total_waste', form.value.waste_quantity);
        formData.set('method', this.wasteMethod);
        formData.set('unit', 'tonnes');
        formData.set('waste_loop', this.recycleSelectedMethod);
        formData.set('id', this.waterWasteId.toString());
        formData.set('months', this.months);
        formData.set('year', this.year);
        formData.set('facility_id', this.facilityID.toString());
      } else {
        formData.set('product', this.waterWasteProduct);
        formData.set('waste_type', this.wasteSubCategory);
        formData.set('total_waste', form.value.waste_quantity);
        formData.set('method', this.wasteMethod);
        formData.set('unit', 'tonnes');
        formData.set('id', this.waterWasteId.toString());
        formData.set('months', this.months);
        formData.set('year', this.year);
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
          this.isSubmitting = false;
          // this.ALLEntries();
          // this.recycle = false;
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


  };

  getEndWasteType() {
    this.appService.getApi('/getendoflife_waste_type?facility_id=' + this.facilityID).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.wasteGrid = response.categories;
          this.waterWasteId = this.wasteGrid[0].id
          this.waterWasteProduct = this.wasteGrid[0].type;
          this.getWasteSubCategory(this.waterWasteId);
          // this.franchiseCategoryValue = this.franchiseGrid[0].categories
        }
      }
    })
  };


  onWasteTypeChange(event: any) {
    const energyMethod = event.value;
    // // console.log("energy method,", energyMethod);
    this.waterWasteProduct = this.wasteGrid[energyMethod - 1].type

    this.getWasteSubCategory(energyMethod);

  };

  getWasteSubCategory(typeId: any) {

    let formData = new URLSearchParams();

    formData.set('type', typeId);
    formData.set('year', this.year.toString());
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

  onAnnualChange(event: any) {
    console.log(this.annualEntry);
    this.appService.sendData(event);
  };

  selectAll(event: any) {
    this.monthsData.forEach(item => {
      item.selected = event.target.checked
    })
  }

  ngOnDestroy(): void {
    this.appService.sendData(false);
  }
}

