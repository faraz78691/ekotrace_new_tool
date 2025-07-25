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
  selector: 'app-refrigerants',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
  templateUrl: './refrigerants.component.html',
  styleUrls: ['./refrigerants.component.scss']
})
export class RefrigerantsComponent {
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
  constructor(private facilityService: FacilityService,private notification: NotificationService,private appService: AppService) {
    this.templateLinks = 'assets/Refrigerant_Template.xlsx'
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
    // this.getUnit(this.subCategoryID);
  }
  EntrySave(dataEntryForm: NgForm) {
    console.log(dataEntryForm.value);
    if (dataEntryForm.valid) {
      this.isSubmitting = true;
      let formData = new FormData();
    

      formData.set('subCategoryTypeId', (this.fuelId).toString());
      formData.set('SubCategorySeedID', this.subCategoryID.toString());
      formData.set('refAmount', dataEntryForm.value.refAmount.toString());

      formData.set('unit', 'KG');
      formData.set('facilities', this.facilityID.toString());

      formData.set('months', this.months);
      formData.set('year', this.year);
      // if (this.selectedFile) {
      //     formData.set('file', this.selectedFile, this.selectedFile.name);
      // }
      this.appService.postAPI('/Addrefrigerant', formData).subscribe({
          next: (response:any) => {

              if (response.success == true) {
                  this.notification.showSuccess(
                      'Data entry added successfully',
                      'Success'
                  );
                 this.isSubmitting = false;
            
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

  getsubCategoryType(subCatID: number) {
    this.appService.getApi(`/GhgSubcategoryTypesByCategoryId?category_id=${subCatID}`).subscribe({
      next: (response: any) => {
        this.fuelType = response.data;
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
}
