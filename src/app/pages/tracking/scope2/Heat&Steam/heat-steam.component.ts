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
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
declare var $: any;
@Component({
  selector: 'app-heat-steam',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule, InputSwitchModule, DialogModule],
  templateUrl: './heat-steam.component.html',
  styleUrls: ['./heat-steam.component.scss']
})
export class HeatSteamComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  units: any[] = [];
  isSubmitting = false;
  unit: any;
  year: string;
  months: string;
  heatType: any;
  heatTypeId: any;
  selectedFile: any;
  uploadButton: boolean;
  viewValue: Boolean = false
  visible: Boolean = false
  monthsData: any[] = [];
  annualEntry = false
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.monthsData = this.appService.monthsData;
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
    this.getsubCategoryType(this.subCategoryID);
    this.getUnit(this.subCategoryID);
  };

  getsubCategoryType(subCatID: number) {

    this.appService.getApi(`/GetSubCategoryTypes/${subCatID}?facilityId=${this.facilityID}&year=${this.year}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.heatType = response.categories;

        }
        // this.fuelType = response.data;
      },
      error: (err) => {

      }
    })
  };

  getUnit(subcatId) {
    this.appService.getApi('/GetUnits/' + subcatId).subscribe({
      next: (Response) => {
        if (Response) {
          this.units = Response['categories'];

        }
        else {
          this.units = [];
        }
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


  EntrySave(dataEntryForm: NgForm) {
    if (dataEntryForm.invalid && !this.annualEntry) {
      Object.values(dataEntryForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.isSubmitting = true;
    var formData = new FormData();
    formData.set('typeID', this.heatTypeId.toString());
    formData.set('unit', this.unit);
    formData.set('facilities', this.facilityID.toString());
    formData.set('year', this.year);
    formData.set('SubCategorySeedID', this.subCategoryID.toString());
    if (this.selectedFile) {
      formData.set('file', this.selectedFile, this.selectedFile.name);
    };
    if (this.annualEntry) {
      const selectedMonths = this.monthsData.filter(item => item.selected)
      this.monthsData.forEach((item, index) => {
        if (item.selected) {
          formData.set('months', JSON.stringify([item.value]));
          formData.set('readingValue', (item.readingValue || '').toString());
          this.appService.postAPI('/Addheatandsteam', formData).subscribe({
            next: (response: any) => {
              if (response.success === true) {
                if (index === selectedMonths.length - 1) {
                  this.notification.showSuccess('Data entry added successfully', 'Success');
                  this.isSubmitting = false;
                  dataEntryForm.reset();
                }
                formData.delete('months');
                formData.delete('readingValue');
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
      formData.set('readingValue', dataEntryForm.value.readingvalue.toString());
      this.appService.postAPI('/Addheatandsteam', formData).subscribe({
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
