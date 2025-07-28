import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { TabViewModule } from "primeng/tabview";
import { FileUploadModule } from "primeng/fileupload";
declare var $: any;
@Component({
  selector: 'app-stationary-combustion',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
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

  selectedFile: File;


  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
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
    this.getsubCategoryType(this.subCategoryID);
    this.getUnit(this.subCategoryID);
  }


  EntrySave(dataEntryForm: NgForm) {
    console.log(dataEntryForm.value);
    if (dataEntryForm.valid) {
      this.isSubmitting = true;
      let formData = new FormData();
      if (this.selectedBlend == 'Perc. Blend') {
        formData.set('blendPercent', this.blendPercent.toString());
      }
      formData.set('subCategoryTypeId', (this.fuelId).toString());
      formData.set('SubCategorySeedID', (this.subCategoryID).toString());
      if (this.subCategoryID == 1 && (this.fuelId == 1 || this.fuelId == 2)) {
        formData.set('blendType', this.selectedBlend);
      }
      formData.set('calorificValue', dataEntryForm.value.calorificValue ? dataEntryForm.value.calorificValue : '');
      formData.set('unit', this.unit);
      formData.set('readingValue', dataEntryForm.value.readingvalue.toString());
      formData.set('months', this.months);
      formData.set('year', this.year);
      formData.set('facility_id', this.facilityID.toString());
      if (this.selectedFile) {
        formData.set('file', this.selectedFile, this.selectedFile.name);
      }
      this.appService.postAPI('/stationaryCombustionEmission', formData).subscribe({
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


  getsubCategoryType(subCatID: number) {
    this.appService.getApi(`/GhgSubcategoryTypesByCategoryId?category_id=${subCatID}`).subscribe({
      next: (response: any) => {
        this.fuelType = response.data;
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
  onTypeChange(event: any) {



  }
}
