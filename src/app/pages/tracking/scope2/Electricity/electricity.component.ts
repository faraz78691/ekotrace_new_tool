import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-electricity',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule],
  templateUrl: './electricity.component.html',
  styleUrls: ['./electricity.component.scss']
})
export class ElectricityComponent {
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  year: string;
  months: string;
  isSubmitting = false;
  regionType: any[] = [];
  units: any;

  constructor(private facilityService: FacilityService,private notification: NotificationService,private appService: AppService) {
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
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

  EntrySave(dataEntryForm: NgForm) {
    // this.appService.EntrySave(dataEntryForm).subscribe({
    //   next: (response) => {
    //     this.next(response);
    //   },
    //   error: (err) => {
    //     this.error(err);
    //   },
    //   complete: () => {
    //     this.complete();
    //   },
    // });
  };

  getRegionName() {

    let formData = new URLSearchParams();
    formData.set('facilities', this.facilityID.toString());
    formData.set('year', this.year.toString());
    this.appService.postAPI('/electricitygridType', formData.toString()).subscribe({
        next: (response:any) => {
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

getUnit(subcatId) {
  this.appService.getApi('/GetUnits/' + subcatId).subscribe({
      next: (Response:any) => {
          if (Response) {

              this.units = Response.categories;
console.log(this.units);
             

          }
          else {
              this.units = [];
          }
      }
  })
};
}
