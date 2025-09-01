import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { DownloadFileService } from '@services/download-file.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';

@Component({
    selector: 'app-employee-commuting',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
    templateUrl: './employee-commuting.component.html',
    styleUrls: ['./employee-commuting.component.scss']
})
export class EmployeeCommutingComponent {
    @ViewChild('dataEntryForm', { static: false }) dataEntryForm;
    rows: any[] = [];
    facilityID: number;
    facilityCountryCode: string;
    isHowtoUse = false;
    subCategoryID: number;
    isSubmitting = false;
    year: string;
    months: string;
    VehicleGrid: any;

    constructor(private facilityService: FacilityService, private downloadFileService: DownloadFileService, private notification: NotificationService, private appService: AppService) {
        for (let i = 1; i <= 5; i++) {
            this.rows.push({ id: i, subVehicleCategory: [], vehicleType1: null, vehicleType2: null, employeesCommute: '', avgCommute: '' });
        }
        effect(() => {
            this.subCategoryID = this.facilityService.subCategoryId();

            this.year = this.facilityService.yearSignal();
            this.months = this.facilityService.monthSignal();
            if (this.facilityService.selectedfacilitiesSignal() != 0) {
                this.facilityID = this.facilityService.selectedfacilitiesSignal();
                this.facilityCountryCode = this.facilityService.countryCodeSignal();
            };
            this.getEmployeeCommuTypes();
        });
    };

    ngOnInit(): void {
        this.appService.sendData(true);
    }

    getEmployeeCommuTypes() {
        this.appService.getApi('/employeeCommunityCategory?facility_id=' + this.facilityID).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.VehicleGrid = response.batchIds;
                }
            }
        })
    };

    onEmpTypeChange(event: any, row: any) {

        const selectedIndex = event.value;

        this.getSubEmployeeCommuTypes(selectedIndex, row)
    };


    getSubEmployeeCommuTypes(id, row: any) {

        this.appService.getApi('/employeeCommunitysubCategory/' + id + '/' + this.facilityID + '/' + this.year).subscribe({
            next: (response) => {

                if (response.success == true) {
                    row.subVehicleCategory = response.batchIds;
                } else {

                    row.subVehicleCategory = [];
                }
            }
        })
    };

    addCommutes() {
        this.rows.push({ id: this.rows.length + 1, subVehicleCategory: [], vehicleType1: null, vehicleType2: null, employeesCommute: '', avgCommute: '' });
    }

    EntrySave(form: NgForm) {
        if (!form.valid) {
            Object.values(form.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }


        const filledRows = this.rows.filter(row => row.vehicleType1 !== null);

        if (filledRows.length === 0) {
            this.notification.showWarning(
                "Select at least one vehicle type",
                'Warning'
            );
            return;
        }

        const isValid = filledRows.every(row =>
            row.vehicleType1 &&
            row.vehicleType2 &&
            row.employeesCommute &&
            row.avgCommute
        );

        if (!isValid) {
            this.notification.showWarning('All fields in each selected row must be filled!', 'Warning');
            // Show user feedback or stop form submission
            return;
        }

        // Prepare the payload
        const payload = filledRows.map(row => ({
            type: row.vehicleType1,
            subtype: row.vehicleType2,
            employeesCommute: row.employeesCommute,
            avgCommute: row.avgCommute
        }));


        this.isSubmitting = true;
        var typeoftransportStringfy = JSON.stringify(payload)
        let formData = new URLSearchParams();

        formData.set('batch', '1');
        formData.set('noofemployees', form.value.noofemployees);
        formData.set('workingdays', form.value.workingdays);
        formData.set('typeoftransport', typeoftransportStringfy);
        formData.set('facilities', this.facilityID.toString());
        formData.set('month', this.months);
        formData.set('year', this.year);

        this.appService.postAPI('/AddemployeeCommuting', formData.toString()).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.notification.showSuccess(
                        response.message,
                        'Success'
                    );
                    this.dataEntryForm.reset();


                } else {
                    this.notification.showWarning(
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


    deleteRow(row: any) {
        if (this.rows.length == 1) return
        this.rows = this.rows.filter(item => item.id !== row.id);
    }
    ngOnDestroy(): void {
        this.appService.sendData(false);
    }

}
