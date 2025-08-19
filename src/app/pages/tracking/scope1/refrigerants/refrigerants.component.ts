import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
declare var $: any;
@Component({
  selector: 'app-refrigerants',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule, InputSwitchModule, DialogModule],
  templateUrl: './refrigerants.component.html',
  styleUrls: ['./refrigerants.component.scss']
})
export class RefrigerantsComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  fuelType: [] = [];
  units: any[] = [];
  fuelId: number = 0;
  isSubmitting = false;
  year: string;
  months: string;
  templateLinks: string;
  selectedFile: any;
  uploadButton: boolean;
  viewValue: Boolean = false
  visible: Boolean = false
  annualEntry = false;
  monthsData: any[] = [];
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.monthsData = this.appService.monthsData;
    this.templateLinks = 'assets/Refrigerant_Template.xlsx'
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();

      }
      this.getsubCategoryType(this.subCategoryID);
    });
  };

  ngOnInit(): void {
    this.getsubCategoryType(this.subCategoryID);
    // this.getUnit(this.subCategoryID);
  }
  EntrySave(dataEntryForm: NgForm) {
    if (dataEntryForm.valid || this.annualEntry) {
      this.isSubmitting = true;
      let formData = new FormData();

      formData.set('subCategoryTypeId', (this.fuelId).toString());
      formData.set('SubCategorySeedID', this.subCategoryID.toString());
      formData.set('unit', 'KG');
      formData.set('facilities', this.facilityID.toString());

      formData.set('year', this.year);
      // if (this.selectedFile) {
      //     formData.set('file', this.selectedFile, this.selectedFile.name);
      // }
      if (this.annualEntry) {
        const selectedMonths = this.monthsData.filter(item => item.selected)
        this.monthsData.forEach((item, index) => {
          if (item.selected) {
            formData.set('months', JSON.stringify([item.value]));
            formData.set('refAmount', (item.readingValue || '').toString());
            this.appService.postAPI('/Addrefrigerant', formData).subscribe({
              next: (response: any) => {
                if (response.success === true) {
                  if (index === selectedMonths.length - 1) {
                    this.notification.showSuccess('Data entry added successfully', 'Success');
                    this.isSubmitting = false;
                    dataEntryForm.reset();
                  }
                  formData.delete('months');
                  formData.delete('refAmount');
                } else {
                  if (index === selectedMonths.length - 1) {
                    this.notification.showError(response.message, 'Error');
                    this.isSubmitting = false;
                  }
                }
              },
              error: (err) => {
                if (index === selectedMonths.length - 1) {
                  this.notification.showError('Data entry failed.', 'Error');
                  this.isSubmitting = false;
                  console.error('Error while submitting form:', err);
                }
              }
            });
          }
        })
      } else {
        formData.set('months', this.months);
        formData.set('refAmount', dataEntryForm.value.refAmount.toString());
        this.appService.postAPI('/Addrefrigerant', formData).subscribe({
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
  };

  getsubCategoryType(subCatID: number) {
    this.appService.getApi(`/GetSubCategoryTypes/${subCatID}?facilityId=${this.facilityID}&year=${this.year}`).subscribe({
      next: (response: any) => {
        this.fuelType = response.categories;
      },
      error: (err) => {

      }
    })
  };

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

  onAnnualChange(event: any) {
    this.visible = event
    this.appService.sendData(event);
  };

  selectAll(event: any) {
    this.monthsData.forEach(item => {
      item.selected = event.target.checked
    })
  }
}
