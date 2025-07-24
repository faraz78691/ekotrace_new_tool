import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-company-owned-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule],
  templateUrl: './company-owned-vehicles.component.html',
  styleUrls: ['./company-owned-vehicles.component.scss']
})
export class CompanyOwnedVehiclesComponent {
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number;
  isSubmitting = false;
  year: string;
  months: string;
  singleCompanyTab = true;
  multipleCompanyTab = true;
  selectedProductsCategory: any;
  bulkCompanyTab = true;
  rowsCompany: any[] = [];
  jsonCompanyData: any[] = [];
  selectedFile: File;



  constructor(private facilityService: FacilityService,private notification: NotificationService,private appService: AppService) {
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
    for (let i = 1; i <= 1; i++) {
        this.rowsCompany.push({
            id: i,
            vehicleType: '',
            noOfVehicles: null,
            tripsPerVehicle: null,
            modeOfEntry: 'Average distance per trip',
            value: null,
            unit: 'Km'
        })
    }
    // this.getsubCategoryType(this.subCategoryID);
    // this.getUnit(this.subCategoryID);
  };

  EntrySave(dataEntryForm: NgForm) {
    console.log(dataEntryForm.value);
    if (this.singleCompanyTab) {
      var payloads = this.rowsCompany.map(row => ({

          vehicle_type: row.vehicleType,
          no_of_vehicles: row.noOfVehicles,
          trip_per_vehicle: row.tripsPerVehicle,
          mode_of_data_entry: row.modeOfEntry,
          value: row.value,
          unit: row.unit,
          sub_category: this.subCategoryID,
          is_excel: 0

      }));

  }
  if (this.multipleCompanyTab) {
      payloads = this.rowsCompany.map(row => ({

          vehicle_type: row.vehicleType,
          no_of_vehicles: row.noOfVehicles,
          trip_per_vehicle: row.tripsPerVehicle,
          mode_of_data_entry: row.modeOfEntry,
          value: row.value,
          unit: row.unit,
          sub_category: this.subCategoryID,
          is_excel: 1

      }));

  }
  if (this.bulkCompanyTab) {
      payloads = this.jsonCompanyData.map(row => ({
          vehicle_type: row.vehicleType,
          no_of_vehicles: row.noOfVehicles,
          trip_per_vehicle: row.tripsPerVehicle,
          mode_of_data_entry: row.modeOfEntry,
          value: row.value,
          unit: row.unit,
          sub_category: this.subCategoryID,
          is_excel: 1

      }));

  }

  var companyOwnedVehicles = JSON.stringify(payloads);
  if (this.selectedFile) {
      var formData = new FormData();
      formData.set('file', this.selectedFile, this.selectedFile.name);
    //   formData.set('facilityId', this.facilityID);
    //   formData.set('month', monthString);
    //   formData.set('year', this.dataEntry.year);
      formData.set('jsonData', companyOwnedVehicles.toString());
  } else {

      var formData2 = new URLSearchParams();
    //   formData2.set('facilityId', this.facilityID);
    //   formData2.set('month', monthString);
    //   formData2.set('year', this.dataEntry.year);
      formData2.set('jsonData', companyOwnedVehicles.toString());
  }


//   this.appService.postAPI('/add-multiple-company-owned-vehicles', this.selectedFile ? formData : formData2).subscribe({
//       next: (response: any) => {
//           if (response.success == true) {
//               this.ALLEntries();
//               this.notification.showSuccess(
//                   'Data entry added successfully',
//                   'Success'
//               );
//               this.resetForm();
//               this.getUnit(this.SubCatAllData
//                   .manageDataPointSubCategorySeedID);
//               this.VehicleDE.modeOfDE = this.ModeType[0].modeName;

//               if (this.SubCatAllData.manageDataPointSubCategorySeedID == 10) {

//                   this.getPassengerVehicleType();
//               }
//               else {

//                   this.getDeliveryVehicleType();
//               }
//               this.activeindex = 0;

//               this.rowsCompany = [{
//                   vehicleType: null,
//                   noOfVehicles: null,
//                   tripsPerVehicle: null,
//                   modeOfEntry: 'Average distance per trip',
//                   value: null,
//                   unit: 'Km'
//               }];;

//               this.jsonCompanyData = [];
//           } else {
//               this.notification.showError(
//                   'Data entry added failed.',
//                   'Error'
//               );
//               this.rowsCompany = [{
//                   vehicleType: null,
//                   noOfVehicles: null,
//                   tripsPerVehicle: null,
//                   modeOfEntry: 'Average distance per trip',
//                   value: null,
//                   unit: 'Km'
//               }];;

//               this.jsonCompanyData = [];
//           }
//       },
//       error: (err) => {
//           this.notification.showError(
//               'Data entry added failed.',
//               'Error'
//           );
//           console.error('errrrrrr>>>>>>', err);
//       },
//       complete: () => { }
//   });
  };


  bulkUploadCompany(tabNo: any) {
    this.singleCompanyTab = false;
    this.multipleCompanyTab = false;
    this.bulkCompanyTab = false;
    if (tabNo == 1) {
        this.singleCompanyTab = true;
    } else if (tabNo == 2) {
        this.multipleCompanyTab = true;
    } else {
        this.bulkCompanyTab = true;
    }

}
}
