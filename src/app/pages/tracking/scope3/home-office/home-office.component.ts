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
    selector: 'app-home-office',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
    templateUrl: './home-office.component.html',
    styleUrls: ['./home-office.component.scss']
})
export class HomeOfficeComponent {
    @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
    facilityID: number;
    facilityCountryCode: string;
    isHowtoUse = false;
    subCategoryID: number = 1;

    isSubmitting = false;
    year: string;
    months: string;
    noofemployees_1 = ""
    noofemployees_2 = ""
    noofemployees_3 = ""
    noofdays_1 = ""
    noofdays_2 = ""
    noofdays_3 = ""
    noofmonths_1: string;
    noofmonths_2: string;
    noofmonths_3: string;
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
        this.appService.sendData(true);
    }

    EntrySave(dataEntryForm) {
        this.isSubmitting = true;

        if ((parseInt(this.noofmonths_1) + parseInt(this.noofmonths_2) + parseInt(this.noofmonths_3)) > 12) {
            this.notification.showWarning(
                'Sum of no of months cant greater than 12',
                'Error'
            );
            return
        }

        var obj1 = { "type": "1", "noofemployees": this.noofemployees_1, "noofdays": this.noofdays_1, "noofmonths": this.noofmonths_1 };
        var obj2 = { "type": "2", "noofemployees": this.noofemployees_2, "noofdays": this.noofdays_2, "noofmonths": this.noofmonths_2 };
        var obj3 = { "type": "3", "noofemployees": this.noofemployees_3, "noofdays": this.noofdays_3, "noofmonths": this.noofmonths_3 };
        const typoOfOffice = [obj1, obj2, obj3];

        const isValid = typoOfOffice.every(row =>
            row.noofemployees != null && row.noofemployees !== '' &&
            row.noofdays != null && row.noofdays !== '' &&
            row.noofmonths != null && row.noofmonths !== ''
        );

        if (!isValid) {
            this.notification.showWarning('All fields must be filled!', 'Warning');
            return;
        }
        var typeofhomeofficeStringfy = JSON.stringify(typoOfOffice)


        let formData = new URLSearchParams();

        formData.set('batch', '1');
        formData.set('typeofhomeoffice', typeofhomeofficeStringfy);
        formData.set('facilities', this.facilityID.toString());
        formData.set('month', this.months);
        formData.set('year', this.year);

        this.appService.postAPI('/AddhomeofficeCategory', formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.notification.showSuccess(
                        response.message,
                        'Success'
                    );
                    this.dataEntryForm.reset();
                    // this.getStatusData(this.activeCategoryIndex)
                } else {
                    this.notification.showError(
                        response.message,
                        'Error'
                    );
                }
                this.isSubmitting = false;

            },
            error: (err) => {
                this.isSubmitting = false;
                this.notification.showError(
                    'Data entry added failed.',
                    'Error'
                );


                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => { }
        })

    }

    ngOnDestroy(): void {
        this.appService.sendData(false);
    }

}
