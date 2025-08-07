import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DataEntry } from '@/models/DataEntry';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TreeviewItem } from '@treeview/ngx-treeview';
import { ToastModule } from 'primeng/toast';
declare var $: any;
@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule, ToastModule],
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent {
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
  dataEntry: DataEntry = new DataEntry();
  selectedFile: File;
  rowsFlightTravel: any[] = [];
  storageTransporationChecked: boolean = false;
  flightDisplay1 = 'block'
  flightDisplay2 = 'none'
  flightDisplay3 = 'none'
  flightsTravelTypes: any[] = [];
  airportGrid: any[] = [];
  flightTypeGrid: any[] = [];
  flightClassGrid: any[] = [];
  annualEntry: any[] = [
    { name: 'Yes', value: 1 },
    { name: 'No', value: 0 },
  ];
  productHSNSelect: any;
  busineessGrid: any[] = [];
  uploadButton: boolean = false;
  months: string;
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
        this.flightsTravelTypes =
            [

                {
                    "id": 1,
                    "flightType": "Generic"
                },
                {
                    "id": 2,
                    "flightType": "To/From"
                },
                // {
                //     "id": 3,
                //     "flightType": "Distance"
                // }

            ];
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();
      }
        this.rowsFlightTravel = [{
            id: 1,
            flightMode: '',
            flightType: null,
            flightClass: null,
            returnFlight: null,
            noOfTrips: null,
            costCentre: '',
            to: null,
            from: null,
            via: null,
            flight_class: null,
            no_of_passengers: null,
            return_flight: null,
            reference_id: null,
            cost_centre: null,
            batch: 1,
            month: this.monthsTable,
            selectedMonths: null
        }];
            this.flightClassGrid =
            [
                {
                    "id": 1,
                    "classs": "Economy"
                },
                {
                    "id": 2,
                    "classs": "Business"
                },
                {
                    "id": 3,
                    "classs": "First Class"
                }
            ]
        this.getFlightType();
    });
  };

  EntrySave(form: NgForm) {
   
    if (form.value.flightMode == 'Generic') {
      if (form.value.no_of_trips === '' || form.value.no_of_trips === null) {
        this.notification.showInfo(
          "Please select no of trips",
          'Warning'
        );
        return;
      }
    }
   this.isSubmitting = true;
    let formData = new FormData();

    if (form.value.flightMode == 'Generic') {
      const payloadsFlight = this.rowsFlightTravel.map(row => ({

        flight_type: row.flightType,
        flight_class: row.flightClass,
        no_of_trips: row.noOfTrips,
        return_flight: row.return_flight,
        cost_centre: row.costCentre,
        batch: 1,
        month: row.selectedMonths

      }));
      formData.set('flight_calc_mode', form.value.flightMode);
      formData.set('jsonData', JSON.stringify(payloadsFlight));
      // formData.set('month', monthString);
      formData.set('year', this.year);
      formData.set('facilities', this.facilityID.toString());
      if (this.selectedFile) {
        formData.set('file', this.selectedFile, this.selectedFile.name);
      }
    } else if (form.value.flightMode == 'To/From') {
      const payloadsFlight = this.rowsFlightTravel.map(row => ({

        to: row.to,
        from: row.from,
        via: row.via,
        flight_class: row.flight_class,
        no_of_passengers: row.no_of_passengers,
        return_flight: row.return_flight,
        reference_id: row.reference_id,
        cost_centre: row.cost_centre,
        batch: 1,
        month: row.selectedMonths

      }));
      formData.set('flight_calc_mode', form.value.flightMode);
      formData.set('jsonData', JSON.stringify(payloadsFlight));
      // formData.set('month', monthString);
      formData.set('year', this.year);
      formData.set('facilities', this.facilityID.toString());
      if (this.selectedFile) {
        formData.set('file', this.selectedFile, this.selectedFile.name);
      }
    } else if (form.value.flightMode == 'Distance') {
      const payloadsFlight = this.rowsFlightTravel.map(row => ({

        flight_type: row.flightType,
        flight_class: row.flightClass,
        no_of_trips: row.noOfTrips,
        return_flight: row.returnFlight,
        cost_centre: row.costCentre,
        batch: 1,
        month: row.selectedMonths

      }));
      formData.set('flight_calc_mode', form.value.flightMode);
      formData.set('flight_type', form.value.flight_type);
      formData.set('flight_class', form.value.classs);
      formData.set('distance', form.value.distance);
      formData.set('no_of_passengers', form.value.no_of_passengers);
      formData.set('return_flight', this.storageTransporationChecked.toString());
      formData.set('reference_id', form.value.reference_id);
      formData.set('cost_centre', form.value.businessunits);
      formData.set('batch', '1');
      formData.set('month', this.months);
      formData.set('year', this.year);
      formData.set('facilities', this.facilityID.toString());
      if (this.selectedFile) {
        formData.set('file', this.selectedFile, this.selectedFile.name);
      }
    }


    this.appService.postAPI('/flightTravel', formData).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );
          this.dataEntryForm.reset();
          // this.ALLEntries();
          this.resetForm();
          // this.getStatusData(this.activeCategoryIndex);
          this.flightDisplay1 = 'block';
          this.flightDisplay2 = 'none';
          this.flightDisplay3 = 'none';
          this.rowsFlightTravel = [{
            id: 1,
            flightMode: '',
            flightType: null,
            flightClass: null,
            returnFlight: null,
            noOfTrips: null,
            costCentre: '',
            to: null,
            from: null,
            via: null,
            flight_class: null,
            no_of_passengers: null,
            return_flight: null,
            reference_id: null,
            cost_centre: null,
            batch: 1,
            month: this.months,
            selectedMonths: null

          }];

        } else {
          this.notification.showError(
            response.message,
            'Error'
          );
          // this.dataEntryForm.reset();


        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.isSubmitting = false;  
        this.notification.showError(
          "EF not found for this facility",
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

  onFlightModeChange(event: any) {
    this.rowsFlightTravel = [{
      id: 1,
      flightMode: '',
      flightType: null,
      flightClass: null,
      returnFlight: null,
      noOfTrips: null,
      costCentre: '',
      to: null,
      from: null,
      via: null,
      flight_class: null,
      no_of_passengers: null,
      return_flight: null,
      reference_id: null,
      cost_centre: null,
      batch: 1,
      month: this.monthsTable,
      selectedMonths: null

    }];
    if (event.value == 'Generic') {
      this.flightDisplay1 = 'block';
      this.flightDisplay2 = 'none';
      this.flightDisplay3 = 'none';
    } else if (event.value == 'To/From') {
      this.getAirportCodes()
      this.flightDisplay1 = 'none';
      this.flightDisplay2 = 'block';
      this.flightDisplay3 = 'none';
    } else if (event.value == 3) {

    } else {

    }
  }

  getAirportCodes() {
    this.appService.getApi('/getflightairportcode').subscribe({
      next: (response: any) => {
        if (response.success == true) {

          this.airportGrid = response.categories

        } else {

        }

      }
    })
  };


  onProductStandardChange(event: any, row: any) {
    // // console.log(event.value);
    const selectedIndex = event.value;
    this.getProductPurchaseItems(selectedIndex, row)
    // this.getSubEmployeeCommuTypes(selectedIndex, row)
  }

  getProductPurchaseItems(standardType, row: any) {
    let formData = new URLSearchParams();

    formData.set('product_code_id', this.productHSNSelect);
    formData.set('typeofpurchase', standardType);
    formData.set('country_id', this.facilityCountryCode);
    formData.set('year', this.year.getFullYear().toString());

    this.appService.postAPI('/purchaseGoodsAllcategories', formData.toString()).subscribe({
      next: (response: any) => {

        if (response.success == true) {

          // row.multiLevelItems = this.getTreeData();
          row.multiLevelItems = response.categories.map(item => new TreeviewItem(item));
        }
      }
    })
  };

  addrowsFlightTravel() {
    this.rowsFlightTravel.push({
      id: this.rowsFlightTravel.length + 1,
      flightMode: '',
      flightType: null,
      flightClass: null,
      returnFlight: null,
      noOfTrips: null,
      costCentre: '',
      to: null,
      from: null,
      via: null,
      flight_class: null,
      no_of_passengers: null,
      return_flight: null,
      reference_id: null,
      cost_centre: null,
      batch: 1,
      month: this.monthsTable,
      selectedMonths: null,
    });
  };

    getFlightType() {
        this.appService.getApi('/flight_types').subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.flightTypeGrid = response.batchIds;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
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

  deleteRow(row: any) {
    if (this.rowsFlightTravel.length == 1) return
    this.rowsFlightTravel = this.rowsFlightTravel.filter(item => item.id !== row.id);
  }
}

