import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { FileUploadModule } from "primeng/fileupload";
declare var $: any;
@Component({
  selector: 'app-heat-steam',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
  templateUrl: './heat-steam.component.html',
  styleUrls: ['./heat-steam.component.scss']
})
export class HeatSteamComponent {

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
    if (dataEntryForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    var formData = new FormData();
    formData.set('typeID', this.heatTypeId.toString());
    formData.set('readingValue', dataEntryForm.value.readingValue.toString());
    formData.set('unit', this.unit);
    formData.set('facilities', this.facilityID.toString());
    formData.set('months', this.months);
    formData.set('year', this.year);
    formData.set('SubCategorySeedID', this.subCategoryID.toString());
    if (this.selectedFile) {
      formData.set('file', this.selectedFile, this.selectedFile.name);
    };

    this.appService.postAPI('/Addheatandsteam', formData).subscribe({
      next: (response: any) => {
        if (response.success == true) {

          this.notification.showSuccess(
            'Data entry added successfully',
            'Success'
          );

        } else {
          this.notification.showError(
            response.message,
            'Error'
          );
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.notification.showError(
          'Data entry added failed.',
          'Error'
        );
        this.isSubmitting = false;

      },
      complete: () => { }
    });
  }
}
