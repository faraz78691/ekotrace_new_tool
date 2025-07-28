import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-franchises',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule, InputSwitchModule],
  templateUrl: './franchises.component.html',
  styleUrls: ['./franchises.component.scss']
})
export class FranchisesComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;

  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  isSubmitting = false;
  year: string;
  months: string;
  leasefacilitieschecked: any;
  leasevehcileschecked: any;
  franchiseGrid: any;
  franchiseCategoryValue: any;
  subFranchiseCategory: any;
  subfacilityTypeValue: any;

  calculationGrid =
    [
      {
        "id": 1,
        "calculationmethod": "Average data method"
      },
      {
        "id": 2,
        "calculationmethod": "Facility Specific method"
      }
    ]
  franchiseMethodValue: any;
  franchiseMethod: boolean = false;
  averageMethod: boolean = true;
  subFranchiseCategoryValue: any;

  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      console.log("months", this.months);
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();

      }

    });
  };

  ngOnInit(): void {
    this.getFranchiseType();
  };

  onCalculationMethodChange(event: any) {
    const calMethod = event.value;
    this.franchiseMethodValue = calMethod;
    if (calMethod == 'Facility Specific method') {
      this.franchiseMethod = true;
      this.averageMethod = false
    } else {
      this.franchiseMethod = false;
      this.averageMethod = true
    }
  };



  getFranchiseType() {
    this.appService.getApi('/franchiseCategories').subscribe({
      next: (response) => {

        if (response.success == true) {
          this.franchiseGrid = response.categories;
          this.franchiseCategoryValue = this.franchiseGrid[0].categories;
          this.getSubFranchiseCategory(this.franchiseCategoryValue);
        }
      }
    })
  };

  onFranchiseChange(event: any) {
    const frachiseTypevalue = event.value;

    this.franchiseCategoryValue = frachiseTypevalue
    this.getSubFranchiseCategory(frachiseTypevalue)
  };

  getSubFranchiseCategory(category: any) {
    this.appService.getApi('/franchiseSubCategories?category=' + category + '&facility_id=' + this.facilityID + '&year=' + this.year).subscribe({
      next: (response) => {
        // // // console.log(response);
        if (response.success == true) {
          this.subFranchiseCategory = response.categories;

        } else {
          this.subFranchiseCategory = [];
        }
      }
    })
  };

  EntrySave(form: any) {


    this.isSubmitting = true;
    let formData = new URLSearchParams();
    if (this.averageMethod == true) {
      formData.set('franchise_type', this.franchiseCategoryValue);
      formData.set('sub_category', this.subFranchiseCategoryValue);
      formData.set('calculation_method', 'Average data method');
      formData.set('franchise_space', form.value.franchise_space);
      formData.set('facility_id', this.facilityID.toString());
      formData.set('unit', 'm2');
      formData.set('month', this.months);
      formData.set('year', this.year);

    } else if (this.franchiseMethod == true) {
      formData.set('franchise_type', this.franchiseCategoryValue);
      formData.set('sub_category', this.subFranchiseCategoryValue);
      formData.set('calculation_method', 'Investment Specific method');
      formData.set('scope1_emission', form.value.scope1_emission);
      formData.set('scope2_emission', form.value.scope2_emission);
      formData.set('facility_id', this.facilityID.toString());
      formData.set('unit', form.value.upfacilityUnits);
      formData.set('month', this.months);
      formData.set('year', this.year);
    }


    this.appService.postAPI('/franchiseEmissionCalculate', formData).subscribe({
      next: (response) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );

          this.dataEntryForm.reset();



        } else {
          this.notification.showError(
            response.message,
            'Error'
          );
          this.dataEntryForm.reset();
        }
        this.isSubmitting = false;
      },
      error: (err) => {

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
}
