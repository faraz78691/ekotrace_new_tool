import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-end-of-life-treatment',
  standalone: true,
   imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
  templateUrl: './end-of-life-treatment.component.html',
  styleUrls: ['./end-of-life-treatment.component.scss']
})
export class EndOfLifeTreatmentComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  isSubmitting = false;
  year: string;
  months: string;
  wasteGrid: any;
  waterWasteId: any;
  waterWasteProduct: any;
  wasteSubTypes: any;
wasteSubCategory: any;

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

    ngOnInit(): void {
      this.getEndWasteType();
    };

        getEndWasteType() {
        this.appService.getApi('/getendoflife_waste_type?facility_id=' + this.facilityID).subscribe({
            next: (response) => {
                // // console.log(response, "sdgs");
                if (response.success == true) {
                    this.wasteGrid = response.categories;
                    this.waterWasteId = this.wasteGrid[0].id
                    this.waterWasteProduct = this.wasteGrid[0].type;
                    this.getWasteSubCategory(this.waterWasteId);
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

        onWasteTypeChange(event: any) {
        const energyMethod = event.value;
        // // console.log("energy method,", energyMethod);
        this.waterWasteProduct = this.wasteGrid[energyMethod - 1].type

        this.getWasteSubCategory(energyMethod);

    };

    getWasteSubCategory(typeId: any) {

        let formData = new URLSearchParams();

        formData.set('type', typeId);
        formData.set('year', this.year.toString());
        this.appService.postAPI('/getendoflife_waste_type_subcategory', formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    // // console.log(response);
                    this.wasteSubTypes = response.categories;

                } else {
                    this.wasteSubTypes = [];
                }
            }
        })
    };

    EntrySave(form: any) {
  

            var total_waste = Number(form.value.landfill) + Number(form.value.combustion) + Number(form.value.recycling) + Number(form.value.composing);
            if (!form.value.total_waste) {
                this.notification.showInfo(
                    'Please enter total waste',
                    ''
                );
                return
            }
            if (total_waste > 100) {
                this.notification.showInfo(
                    'Waste % cannot be greater than 100%',
                    ''
                );
                return
            }
         
          
            this.isSubmitting = true;
            let formData = new URLSearchParams();
            formData.set('month', this.months);
            formData.set('year', this.year);
            formData.set('waste_type', this.waterWasteId.toString());
            formData.set('subcategory', this.wasteSubCategory);
            formData.set('total_waste', form.value.total_waste);
            formData.set('waste_unit', 'tonnes');
            formData.set('landfill', form.value.landfill || '');
            formData.set('combustion', form.value.combustion || '');
            formData.set('recycling', form.value.recycling || '');
            formData.set('composing', form.value.composing || '');
            formData.set('batch', '1');
            formData.set('facilities', this.facilityID.toString());


            this.appService.postAPI('/AddendoflifeCategory', formData).subscribe({
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
}
