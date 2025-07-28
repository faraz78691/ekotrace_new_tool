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
declare var $: any;
@Component({
  selector: 'app-fire-entinguisher',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
  templateUrl: './fire-entinguisher.component.html',
  styleUrls: ['./fire-entinguisher.component.scss']
})
export class FireEntinguisherComponent {
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
  selectedFile: any;
  uploadButton: boolean;
  templateLinks: string;

  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.templateLinks = 'assets/FireExtinguisher_Template.xlsx'
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


  EntrySave(dataEntryForm: NgForm) {

    if (dataEntryForm.valid) {
      this.isSubmitting = true;
      let formData = new FormData();
      formData.set('NumberOfExtinguisher', dataEntryForm.value.ExtinguisherNo.toString());
      formData.set('unit', 'KG');
      formData.set('quantityOfCO2makeup', dataEntryForm.value.coo.toString());
      formData.set('fireExtinguisherID', '');
      formData.set('facilities', this.facilityID.toString());
      formData.set('months', this.months);
      formData.set('year', this.year);
      formData.set('SubCategorySeedID', this.subCategoryID.toString());
      if (this.selectedFile) {
        formData.set('file', this.selectedFile, this.selectedFile.name);
      }
      this.appService.postAPI('/Addfireextinguisher', formData).subscribe({
        next: (response: any) => {

          if (response.success == true) {
            this.notification.showSuccess(
              'Data entry added successfully',
              'Success'
            );
            this.isSubmitting = false;
            this.dataEntryForm.reset();
          } else {
            this.notification.showError(
              response.message,
              'Error'
            );
            this.isSubmitting = false;
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
}
