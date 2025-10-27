import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { DataEntry } from '@/models/DataEntry';
declare var $: any;
@Component({
  selector: 'app-other-mode-transport',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule, ToastModule],
  templateUrl: './other-mode-transport.component.html',
  styleUrls: ['./other-mode-transport.component.scss']
})
export class OtherModeTransportComponent {
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
  year: string;
  months: string;
  dataEntry: DataEntry = new DataEntry();
  rowsOtherTransport: any[] = [];
  selectedFile: File;
  ModeSelected = false;
  ModesTravelGrid: any[] = [];
  uploadButton: boolean = false;
  carMode = false;
  autoMode = false;
  mode_name = '';
      monthsTable: any[] = [
        { name: 'Jan', value: 'Jan' },
        { name: 'Feb', value: 'Feb' },
        { name: 'Mar', value: 'Mar' },
        { name: 'Apr', value: 'Apr' },
        { name: 'May', value: 'May' },
        { name: 'June', value: 'Jun' },
        { name: 'July', value: 'Jul' },
        { name: 'Aug', value: 'Aug' },
        { name: 'Sep', value: 'Sep' },
        { name: 'Oct', value: 'Oct' },
        { name: 'Nov', value: 'Nov' },
        { name: 'Dec', value: 'Dec' }
    ];
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.rowsOtherTransport = [{
        id: 1,
        trasnportMode: null,
        modeType: [],
        selectedMode: null,
        carFuel_type: [],
        selectedFuelType: null,
        no_of_passengers: null,
        distance_travel_per_trip: null,
        isDisabled: false,
        noOfTrips: null,
        month: this.monthsTable,
        selectedMonths: null
    }];
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();

      }
      this.getOtherModesVechile();
      
    });
  };

  EntrySave(form: NgForm) {

   this.isSubmitting = true;
    let formData = new FormData();

    const payloadsOtherModes = this.rowsOtherTransport.map(row => ({

      mode_of_trasport: row.trasnportMode,
      type: row.selectedMode,
      fuel_type: row.selectedFuelType,
      no_of_passengers: row.no_of_passengers,
      distance_travelled: row.distance_travel_per_trip,
      no_of_trips: row.noOfTrips,
      batch: 1,
      month: row.selectedMonths

    }));
    formData.set('jsonData', JSON.stringify(payloadsOtherModes));

    formData.set('year', this.year);
    formData.set('facilities', this.facilityID.toString());
    if (this.selectedFile) {
      formData.set('file', this.selectedFile, this.selectedFile.name);
    }

    this.appService.postAPI('/Othermodes_of_transport', formData).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );
          this.dataEntryForm.reset();
          this.ModeSelected = false;
          // this.ALLEntries();
          this.resetForm();
          this.rowsOtherTransport = [{
            id: 1,
            trasnportMode: null,
            modeType: [],
            selectedMode: null,
            carFuel_type: [],
            selectedFuelType: null,
            no_of_passengers: null,
            distance_travel_per_trip: null,
            isDisabled: false,
            noOfTrips: null,
            month: this.monthsTable,
            selectedMonths: null,
          }];;

          // this.getStatusData(this.activeCategoryIndex)
        } else {
          this.notification.showError(
            response.message,
            ''
          );
          this.dataEntryForm.reset();
          this.ModeSelected = false;

        }
        this.isSubmitting = false;
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

  resetForm() {
    this.dataEntryForm.resetForm();
    this.fileUpload.clear();
    this.selectedFile = null;
  }

  onModesChangeM(event: any, row) {
    const selectedMode = event.value;
    this.carMode = true;
    this.autoMode = false;
    this.ModeSelected = true;
    let optionvalue = [];
    const formdata = new URLSearchParams();
    formdata.set('type_name', selectedMode);
    formdata.set('facility_id', this.facilityID.toString());
    formdata.set('year', this.year.toString());

    this.appService.postAPI('/get_Othermodes_of_transport_node_type_by_type_name', formdata).subscribe({
      next: (response: any) => {
        optionvalue = response.data;
        if (selectedMode == 'Car') {
          this.carMode = true;
          this.autoMode = false;

          this.mode_name = selectedMode;

          row.mode_type = optionvalue;

          row.isDisabled = true;
          // this.cdRef.detectChanges();
        } else if (selectedMode == 'Auto') {
          this.autoMode = true;
          this.carMode = true;

          this.mode_name = selectedMode;
          row.mode_type = optionvalue;
          row.carFuel_type = [];
          row.isDisabled = true;
        } else if (selectedMode == 'Bus') {
          this.carMode = false;
          this.autoMode = true;

          this.mode_name = selectedMode;
          row.mode_type = optionvalue;
          row.carFuel_type = [];
          row.isDisabled = false;
        }
        else if (selectedMode == 'Rail') {
          this.carMode = false;

          this.mode_name = selectedMode;
          row.mode_type = optionvalue;
          row.carFuel_type = [];
          row.isDisabled = false
        }
        else if (selectedMode == 'Ferry') {
          this.carMode = false;
          this.autoMode = true;

          this.mode_name = selectedMode;
          row.mode_type = optionvalue;
          row.carFuel_type = [];
          row.isDisabled = false
        }
      }
    })


  };

  addrowsOtherModes() {
    this.rowsOtherTransport.push({
      id: this.rowsOtherTransport.length + 1,
      trasnportMode: null,
      modeType: [],
      carFuel_type: [],
      selectedMode: null,
      selectedFuelType: null,
      no_of_passengers: null,
      distance_travel_per_trip: null,
      isDisabled: false,
      noOfTrips: '',
      month: this.monthsTable,
      selectedMonths: null,
      batch: 1,
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

     getOtherModesVechile() {
        const formdata = new URLSearchParams();
        formdata.set('facility_id', this.facilityID.toString());
        this.appService.postAPI('/Othermodes_of_transport_type_name', formdata).subscribe({
            next: (response: any) => {
                this.ModesTravelGrid = response.data;

            }
        })
    };

    deleteRow(row: any) {
      if(this.rowsOtherTransport.length == 1) return
      this.rowsOtherTransport = this.rowsOtherTransport.filter(item => item.id !== row.id);
    }

    handleDropdownShow(): void {
      window.addEventListener('scroll', this.preventScroll, true);
    }
    
    handleDropdownHide(): void {
      window.removeEventListener('scroll', this.preventScroll, true);
    }
    
    preventScroll(event: Event): void {
      const dropdown = document.querySelector('.p-dropdown-panel');
      if (dropdown) {
        // console.log('Preventing scroll');
        event.stopPropagation();
      }
    }
}
