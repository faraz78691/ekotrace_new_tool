import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from "primeng/fileupload";
import { data } from 'jquery';
declare var $: any;
@Component({
  selector: 'app-electricity',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
  templateUrl: './electricity.component.html',
  styleUrls: ['./electricity.component.scss']
})
export class ElectricityComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  year: string;
  months: string;
  isSubmitting = false;
  regionType: any[] = [];
  units: any;
  marketTypes: any[];
  marketTypeId: any;
  renewableSelected = true;
  supplierSelected = false;
  ElectricitySource: { id: number; sourceName: string; }[];
  sourceName: any;
  unitSelected: any;
  selectedFile: any;
  uploadButton: boolean;
  regionId: any;
  selectedunit: any;
  selectedUnit: any;
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.marketTypes =
      [
        {
          "id": 1,
          "Type": "Renewable Energy Cert (REC)"
        },
        {
          "id": 2,
          "Type": "Supplier Specific"
        }

      ];
    this.ElectricitySource =
      [{
        "id": 1,
        "sourceName": "Solar"
      },
      {
        "id": 2,
        "sourceName": "Wind"
      },
      {
        "id": 2,
        "sourceName": "Hydro"
      }
      ];
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      if (this.subCategoryID == 9) {
        this.renewableSelected = true;
        this.supplierSelected = false;
      }

      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();

      };
      this.getRegionName();
      this.getUnit(this.subCategoryID);
    });
  };

  ngOnInit(): void {

  }

  EntrySave(dataEntryForm: NgForm) {
    if (dataEntryForm.invalid) {
      Object.values(dataEntryForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    let url;
    if (this.subCategoryID == 9) {
      url = '/Addelectricity'
    } else {
      url = '/Addrenewableelectricity'
    }



    var formData = new FormData();
    if (this.subCategoryID == 9) {
      formData.set('RegionID', this.regionId.toString());
      formData.set('readingValue', dataEntryForm.value.readingvalueLocation.toString());
    } else {
      formData.set('typeID', this.marketTypeId);
      formData.set('sourceName', this.renewableSelected ? this.sourceName : '');
      formData.set('emission_factor', dataEntryForm.value.emission_factorS);
      formData.set('readingValue', this.renewableSelected ? dataEntryForm.value.readingValueREnew.toString() : dataEntryForm.value.readingSupplierValue.toString());
    }

    formData.set('unit', this.selectedUnit);
    formData.set('facilities', this.facilityID.toString());
    formData.set('months', this.months);
    formData.set('year', this.year);
    formData.set('SubCategorySeedID', this.subCategoryID.toString());
    if (this.selectedFile) {
      formData.set('file', this.selectedFile, this.selectedFile.name);
    }
    this.appService.postAPI(url, formData).subscribe({
      next: (response: any) => {
        if (response.success == true) {
          this.notification.showSuccess(
            'Data entry added successfully',
            'Success'
          );
          this.dataEntryForm.reset();

        } else {
          this.notification.showError(
            response.message,
            'Error'
          );
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
  };

  getRegionName() {

    let formData = new URLSearchParams();
    formData.set('facilities', this.facilityID.toString());
    formData.set('year', this.year.toString());
    this.appService.postAPI('/electricitygridType', formData.toString()).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.regionType = response.categories;
          // this.RenewableElectricity.electricityRegionID = this.regionType[0].RegionID;

        } else {
          this.regionType = [];
          // this.toastr.warning(response.message);
        }

      },
      error: (err) => {
        console.error('errrrrrr>>>>>>', err);
      }
    })
  };

  marktetTypeChange(event: any) {
    if (event.value == 1) {
      this.renewableSelected = true
      this.supplierSelected = false;
    } else if (event.value == 2) {

      this.renewableSelected = false
      this.supplierSelected = true;
    }
  }

  getUnit(subcatId) {
    this.appService.getApi('/GetUnits/' + subcatId).subscribe({
      next: (Response: any) => {
        if (Response) {

          this.units = Response.categories;



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

}
