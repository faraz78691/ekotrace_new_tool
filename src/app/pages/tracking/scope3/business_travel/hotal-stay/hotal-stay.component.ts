import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ToastModule } from 'primeng/toast';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { countries } from '@/store/countrieslist';
import { DataEntry } from '@/models/DataEntry';
declare var $: any;

@Component({
  selector: 'app-hotal-stay',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule, ToastModule],
  templateUrl: './hotal-stay.component.html',
  styleUrls: ['./hotal-stay.component.scss']
})
export class HotalStayComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
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
  selectedFile: File;
  uploadButton: boolean = false
  rowsHotelStay: any[] = [];
  hotelTypeGrid: any[] = [];
  public countriesList: any = countries;
  dataEntry: DataEntry = new DataEntry();
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

  EntrySave(form: NgForm) {

    var spliteedMonth = this.dataEntry.month.split(",");
    var monthString = JSON.stringify(spliteedMonth);

    let hasNullValue = this.rowsHotelStay.some(row =>
      row.selectedCountry == null ||
      row.type_of_hotel == null ||
      row.no_of_occupied_rooms == null ||
      row.no_of_nights == null ||
      row.selectedMonths == null
    );

    if (hasNullValue) {
      this.notification.showWarning(
        'Error: Some hotel stay fields are missing.',
        ''
      );
      return; // stop further execution
    }
    let formData = new FormData();
    const payloadsHotelStay = this.rowsHotelStay.map(row => ({

      country_of_stay: row.selectedCountry,
      type_of_hotel: row.type_of_hotel,
      no_of_occupied_rooms: row.no_of_occupied_rooms,
      no_of_nights_per_room: row.no_of_nights,
      batch: 1,
      month: row.selectedMonths

    }));


    formData.set('year', this.dataEntry.year);
    formData.set('facilities', this.facilityID.toString());
    formData.set('jsonData', JSON.stringify(payloadsHotelStay));
    if (this.selectedFile) {
      formData.set('file', this.selectedFile, this.selectedFile.name);
    }


    this.appService.postAPI('/hotelStay', formData).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );
          this.resetForm();
          this.dataEntryForm.reset();
          // this.ALLEntries();
          this.rowsHotelStay = [{
            id: 1,
            country_stay: null,
            type_of_hotel: 'star_2',
            no_of_occupied_rooms: null,
            no_of_nights: null,
            selectedCountry: null,
            month: this.months,
            selectedMonths: null
          }];

          // this.getStatusData(this.activeCategoryIndex)
        } else {
          this.notification.showError(
            response.message,
            'Error'
          );
          this.dataEntryForm.reset();


        }
      },
      error: (err) => {
        this.notification.showError(
          'Data entry added failed.',
          ''
        );
        this.dataEntryForm.reset();


        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    })
  }

  resetForm() {
    this.dataEntryForm.resetForm();
    this.fileUpload.clear();
    this.selectedFile = null;
  }
  addrowsHotelStay() {
    this.rowsHotelStay.push({
      id: this.rowsHotelStay.length + 1,
      country_stay: null,
      type_of_hotel: 'star_2',
      no_of_occupied_rooms: null,
      no_of_nights: null,
      month: this.months,
      selectedMonths: null,
    });
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
