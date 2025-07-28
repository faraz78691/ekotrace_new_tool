import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { FileUploadModule } from 'primeng/fileupload';
import * as XLSX from 'xlsx';
import { DownloadFileService } from '@services/download-file.service';
import { VehicleType } from '@/models/VehicleType';
import { VehicleDEmode } from '@/models/VehicleDEmode';
import { environment } from 'environments/environment';
declare var $: any;

@Component({
    selector: 'app-company-owned-vehicles',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
    templateUrl: './company-owned-vehicles.component.html',
    styleUrls: ['./company-owned-vehicles.component.scss']
})
export class CompanyOwnedVehiclesComponent {
    @ViewChild('dataEntryForm', { static: false }) dataEntryForm: any;
    APIURL: string = environment.baseUrl;
    facilityID: number;
    facilityCountryCode: string;
    isHowtoUse = false;
    subCategoryID: number;
    isSubmitting = false;
    year: string;
    months: string;
    singleCompanyTab = true;
    multipleCompanyTab = false;
    bulkCompanyTab = false;
    selectedProductsCategory: any;

    rowsCompany: any[] = [];
    jsonCompanyData: any[] = [];
    selectedFile: File;
    downloadCompanyExcelUrl: string;
    VehicleType: VehicleType[] = [];
    ModeType: VehicleDEmode[] = [];
    currency: any;
    vehicleModalFleet: any[] = [];
    uploadButton: boolean;
    constructor(private facilityService: FacilityService, private downloadFileService: DownloadFileService, private notification: NotificationService, private appService: AppService) {

        effect(() => {
            this.subCategoryID = this.facilityService.subCategoryId();
            console.log("sub category", this.subCategoryID);

            this.year = this.facilityService.yearSignal();
            this.months = this.facilityService.monthSignal();
            if (this.facilityService.selectedfacilitiesSignal() != 0) {
                this.facilityID = this.facilityService.selectedfacilitiesSignal();
                this.facilityCountryCode = this.facilityService.countryCodeSignal();
            };
            this.downloadCompanyExcelUrl = this.APIURL + `/download-excel-vehicle-fleet-by-facility-category-id?facility_id=${this.facilityID}&categoryID=${this.subCategoryID == 10 ? '1' : '2'} `;
            this.rowsCompany = [{
                vehicleType: null,
                noOfVehicles: null,
                tripsPerVehicle: null,
                modeOfEntry: 'Average distance per trip',
                value: null,
                unit: 'Km'
            }]
            this.getVehicleType(this.subCategoryID);
            this.getCurrencyUnit()
        });
        this.ModeType =
            [
                {
                    "id": 1,
                    "modeName": "Average distance per trip"
                },
                {
                    "id": 2,
                    "modeName": "Average qty of fuel per trip"
                },
                {
                    "id": 3,
                    "modeName": "Avg. amount spent per trip"
                }

            ]
    };



    ngOnInit(): void {
        this.downloadCompanyExcelUrl = this.APIURL + `/download-excel-vehicle-fleet-by-facility-category-id?facility_id=${this.facilityID}&categoryID=${this.subCategoryID == 10 ? '1' : '2'} `;
        this.rowsCompany = [{
            vehicleType: null,
            noOfVehicles: null,
            tripsPerVehicle: null,
            modeOfEntry: 'Average distance per trip',
            value: null,
            unit: 'Km'
        }]
        this.getVehicleType(this.subCategoryID);
        this.getCurrencyUnit()
        // this.getUnit(this.subCategoryID);
    };

    EntrySave(dataEntryForm: NgForm) {

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
            formData.set('facilityId', this.facilityID.toString());
            formData.set('month', this.months);
            formData.set('year', this.year);
            formData.set('jsonData', companyOwnedVehicles.toString());
        } else {

            var formData2 = new URLSearchParams();

            formData2.append('facilityId', this.facilityID.toString());
            formData2.append('month', this.months);
            formData2.append('year', this.year);
            formData2.append('jsonData', companyOwnedVehicles.toString());
        }


        this.appService.postAPI('/add-multiple-company-owned-vehicles', this.selectedFile ? formData : formData2).subscribe({
            next: (response: any) => {
                if (response.success == true) {
                    //   this.ALLEntries();
                    this.notification.showSuccess(
                        'Data entry added successfully',
                        'Success'
                    );
                    //   this.resetForm();
                    //   this.getUnit(this.SubCatAllData
                    //       .manageDataPointSubCategorySeedID);
                    //   this.VehicleDE.modeOfDE = this.ModeType[0].modeName;

                    //   if (this.SubCatAllData.manageDataPointSubCategorySeedID == 10) {

                    //       this.getPassengerVehicleType();
                    //   }
                    //   else {

                    //       this.getDeliveryVehicleType();
                    //   }
                    //   this.activeindex = 0;

                    this.rowsCompany = [{
                        vehicleType: null,
                        noOfVehicles: null,
                        tripsPerVehicle: null,
                        modeOfEntry: 'Average distance per trip',
                        value: null,
                        unit: 'Km'
                    }];;

                    this.jsonCompanyData = [];
                    this.dataEntryForm.reset();
                } else {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.rowsCompany = [{
                        vehicleType: null,
                        noOfVehicles: null,
                        tripsPerVehicle: null,
                        modeOfEntry: 'Average distance per trip',
                        value: null,
                        unit: 'Km'
                    }];;

                    this.jsonCompanyData = [];
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

    onCompanyUpload(event: any, fileUpload: any) {
        const file = event[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });


            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];


            this.jsonCompanyData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });


            const jsonReading = this.convertToKeyValue(this.jsonCompanyData);

            this.jsonCompanyData = jsonReading.filter(items => { return items['Vehicle Model'] !== '' });

            this.jsonCompanyData = this.jsonCompanyData.map(item => {
                return {
                    vehicleType: item['Vehicle Model'],
                    noOfVehicles: item['No of Vehicles'],
                    tripsPerVehicle: item['Trips per vehicle'],
                    modeOfEntry: item['Mode of data entry'],
                    value: item['Value'] ? item['Value'] : '',
                    unit: item['Unit'] ? item['Unit'] : '',
                }
            }
            )

            // console.log(this.jsonData);


            setTimeout(() => {

                fileUpload.clear();
            }, 1000);


        };
        reader.readAsArrayBuffer(file);
    };


    bulkUploadCompany(tabNo: any) {

        this.singleCompanyTab = false;
        this.multipleCompanyTab = false;
        this.bulkCompanyTab = false;
        if (tabNo == 1) {
            this.singleCompanyTab = true;
        } else if (tabNo == 2) {
            this.getVehcileFleet(this.facilityID, this.subCategoryID);
            this.multipleCompanyTab = true;
        } else {
            this.bulkCompanyTab = true;
        }

    };

    addCompanyRows() {
        this.rowsCompany.push({ id: this.rowsCompany.length + 1, vehicleType: null, noOfVehicles: null, tripsPerVehicle: null, modeOfEntry: 'Average distance per trip', chargingOutside: '', value: null, unit: 'Km' });
    };

    convertToKeyValue(data: any[]): any[] {
        if (data.length < 2) return [];

        const headers = data[0]; // Extract headers
        return data.slice(1).map((row) => {
            let obj: any = {};
            headers.forEach((header: string, index: number) => {
                let value = row[index] || '';

                // Convert Excel date serial number to readable date
                if (header.includes('Date') && typeof value === 'number') {
                    value = XLSX.SSF.format('dd-mm-yyyy', value); // Converts to "dd-mm-yyyy"
                }

                obj[header] = value;
            });
            return obj;
        });
    };

    downloadCompanyExcel() {
        this.downloadFileService.downloadFile(this.downloadCompanyExcelUrl, this.subCategoryID == 10 ? 'Passenger Vehicle' : 'Delivery Vehicle');
    };

    modeOfEntryChange(selectedMode: string, row: any) {

        if (selectedMode === 'Average distance per trip') {
            row.unit = 'Km';
        } else if (selectedMode === 'Average qty of fuel per trip') {
            row.unit = 'Litre';
        } else {
            row.unit = this.currency;
        }
    };

    getVehicleType(subCategoryID: number) {
        try {
            let url;
            if (subCategoryID == 10) {
                url = '/Getpassengervehicletypes?facilityId=' + this.facilityID + '&year=' + this.year;
            } else {
                url = '/Getdeliveryvehicletypes?facilityId=' + this.facilityID + '&year=' + this.year;
            }
            // this.VehicleDE.vehicleTypeID = null;
            this.appService.getApi(url).subscribe({
                next: (response: any) => {
                    if (response.success) {
                        this.VehicleType = response.categories;
                        // this.VehicleDE.vehicleTypeID = this.VehicleType[0].ID
                    }
                    else {
                        // this.toastr.warning(response.message);
                        this.VehicleType = [];
                    }
                },
                error: (err) => {
                    this.VehicleType = [];
                }
            })
        }
        catch (ex) {

        }
    };

    getVehcileFleet(facilityId: number, type: number) {

        const formData = new URLSearchParams();
        formData.append('facility_id', facilityId.toString());
        this.appService.postAPI('/get-vehicle-fleet-by-facility-id', formData).subscribe({
            next: (response: any) => {

                if (response.success == true) {

                    const fleet = response.data;
                    if (type == 10) {
                        this.vehicleModalFleet = fleet.filter((item) => item.category == 1 && item.retire_vehicle === 0);
                    } else if (type == 11) {
                        this.vehicleModalFleet = fleet.filter((item) => item.category == 2 && item.retire_vehicle === 0);
                    }


                }
            },
            error: (err) => {

            },
            complete: () => { }
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

    getCurrencyUnit() {

        const formdata = new URLSearchParams();
        formdata.set('facilities', this.facilityID.toString());
        this.appService.postAPI('/getcurrencyByfacilities', formdata).subscribe({
            next: (response: any) => {
                // // // console.log(response);
                if (response.success == true) {
                    this.currency = response.categories;
                };

            }
        })
    };


}
