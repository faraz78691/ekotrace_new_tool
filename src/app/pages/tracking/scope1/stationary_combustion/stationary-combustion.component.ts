import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { TabViewModule } from "primeng/tabview";
import { FileUploadModule } from "primeng/fileupload";
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { firstValueFrom } from 'rxjs';

import { getMonthsData } from '../../months';
declare var $: any;
@Component({
  selector: 'app-stationary-combustion',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule, InputSwitchModule, MultiSelectModule, DialogModule],
  templateUrl: './stationary-combustion.component.html',
  styleUrls: ['./stationary-combustion.component.scss']
})
export class StationaryCombustionComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  isSubmitting = false;
  year: string;
  months: string;
  fuelType: [] = [];
  units: any[] = [];
  fuelId: number = 0;
  unit: any;
  annualEntry = false;
  blendType =
    [
      {
        "id": 1,
        "typeName": "No Blend"
      },
      {
        "id": 2,
        "typeName": "Average Blend"
      },
      {
        "id": 3,
        "typeName": "Perc. Blend"
      },

    ]
  uploadButton = false;
  selectedBlend: any;
  blendPercent: any = 20;
  monthsData: any[] = [];
  servicemonthsData: any[] = [];
  selectedFile: File;
  multipleMonths: any;
  viewValue: Boolean = false
  visible: Boolean = false
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService,) {
    this.monthsData = getMonthsData();
   

    console.log("monthsData", this.monthsData);
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();

      }
      this.getsubCategoryType(this.subCategoryID);
      this.getUnit(this.subCategoryID);
    });
  };

  ngOnInit(): void {
    this.servicemonthsData = this.appService.monthsData;
    this.getsubCategoryType(this.subCategoryID);
    this.getUnit(this.subCategoryID);
  }


 async EntrySave(dataEntryForm: NgForm) {

    if (!dataEntryForm.valid) {
      Object.values(dataEntryForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    if (this.selectedBlend === 'Perc. Blend' && !this.blendPercent) {
      return;
    }

    this.isSubmitting = true;
 
    if (this.annualEntry) {
      const selectedMonths = this.monthsData.filter(item => item.selected);
      if(selectedMonths.length == 0){
        this.notification.showWarning('Please select at least one month', 'Warning');
        this.isSubmitting = false;
        return
      }
      this.isSubmitting = true;
      console.log("selectedMonths", this.monthsData);
      for (let index = 0; index < this.monthsData.length; index++) {
        const item = this.monthsData[index];
    
        if (item.selected) {
          const formData = new FormData();
    
          formData.set('months', JSON.stringify([item.value]));
          formData.set('readingValue', item.readingValue);
          if (this.selectedBlend === 'Perc. Blend') {
            formData.set('blendPercent', this.blendPercent.toString());
          }
    
          formData.set('subCategoryTypeId', this.fuelId.toString());
          formData.set('SubCategorySeedID', this.subCategoryID.toString());
    
          if (this.subCategoryID === 1 && (this.fuelId === 1 || this.fuelId === 2)) {
            formData.set('blendType', this.selectedBlend);
          }
    
          formData.set('calorificValue', dataEntryForm.value.calorificValue || '');
          formData.set('unit', this.unit);
          formData.set('year', this.year);
          formData.set('facility_id', this.facilityID.toString());
    
          if (this.selectedFile) {
            formData.set('file', this.selectedFile, this.selectedFile.name);
          }
    
          try {
            const response: any = await firstValueFrom(
              this.appService.postAPI('/stationaryCombustionEmission', formData)
            )
    
            if (response.success === true) {
              if (index === selectedMonths.length - 1) {
                this.notification.showSuccess('Data entry added successfully', 'Success');
                this.isSubmitting = false;
                dataEntryForm.reset();
            
                this.monthsData = getMonthsData();  
                console.log("monthsData", this.monthsData);
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
    
          // optional: wait 1 second before next request
          await new Promise(res => setTimeout(res, 200));
        }
      }
      
    } else {
      const formData = new FormData(); 
      if (this.selectedBlend === 'Perc. Blend') {
        formData.set('blendPercent', this.blendPercent.toString());
      }
  
      formData.set('subCategoryTypeId', this.fuelId.toString());
      formData.set('SubCategorySeedID', this.subCategoryID.toString());
  
      if (this.subCategoryID === 1 && (this.fuelId === 1 || this.fuelId === 2)) {
        formData.set('blendType', this.selectedBlend);
      }
  
      formData.set('calorificValue', dataEntryForm.value.calorificValue || '');
      formData.set('unit', this.unit);
      formData.set('year', this.year);
      formData.set('facility_id', this.facilityID.toString());
  
      if (this.selectedFile) {
        formData.set('file', this.selectedFile, this.selectedFile.name);
      }
      formData.set('months', this.months);
      formData.set('readingValue', (dataEntryForm.value.readingvalue || '').toString());
      this.appService.postAPI('/stationaryCombustionEmission', formData).subscribe({
        next: (response: any) => {
          if (response.success === true) {
            this.notification.showSuccess('Data entry added successfully', 'Success');
            this.isSubmitting = false;
            dataEntryForm.reset();
          } else {
            this.notification.showError(response.message, 'Error');
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          this.notification.showError('Data entry failed.', 'Error');
          this.isSubmitting = false;
          console.error('Error while submitting form:', err);
        }
      });
    }
  }



  getsubCategoryType(subCatID: number) {
    this.appService.getApi(`/GhgSubcategoryTypesByCategoryId?category_id=${subCatID}`).subscribe({
      next: (response: any) => {
        this.fuelType = response.data;
      },
      error: (err) => {

      },
    });
  }

  getUnit(subcatId) {
    this.appService.getApi(`/GetUnits/${subcatId}`).subscribe({
      next: (Response) => {
        if (Response) {
          this.units = Response['categories'];

        }
        else {
          this.units = [];
        }
      },
    });
  }

  onFileSelected(event: any) {

    const selectedFile = event[0];

    if (selectedFile) {
      //   this.uploadFiles(files); previous one 
      this.selectedFile = event[0];
      $(".browse-button input:file").change(function () {
        $("input[name='attachment']").each(function () {
          var fileName = $(this).val().split('/').pop().split('\\').pop();
          $(".filename").val(fileName);
          $(".browse-button-text").html('<i class="fa fa-refresh"></i> Change');
        });
      });
      this.uploadButton = true
    }
  };
  onTypeChange(event: any) {
  };

  onAnnualChange(event: any) {
    this.appService.sendData(event);
   
  };

  selectAll(event: any) {
    this.monthsData.forEach(item => {
      item.selected = event.target.checked
    })
  }
}
