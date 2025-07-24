import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { countries } from '@/store/countrieslist';
import { Component } from '@angular/core';
import { IndustryType } from '@pages/company-profile/industry-type';
import { CompanyService } from '@services/company.service';
import { NotificationService } from '@services/notification.service';
import { RegistrationService } from '@services/registration.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    visible: boolean;
    visible2: boolean;
    countries: any;
    yearSelect: any;
    public loginInfo: LoginInfo;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    industryTypes: IndustryType[];
    hazadrous: any[];
    non_hazadrous: any[];
    uploadedFile: any[] = [];
    companyProfile: any[] = [];
    wasteGrid: any[] = [];
    yearType: any[] = [];
    rootUrl: string;
    updatedtheme: string;
    multiselectcolor: any;
    selectedFile: File;
    selectedCountry = 'India'
    uploadedImageUrl: string | ArrayBuffer | null = null;
    companyName: string;
    yearId: any;
    getYeartype: any;
    constructor(
        private companyService: CompanyService,
        public registrationService: RegistrationService,
        private toastr: ToastrService,
        private notification: NotificationService,
        private messageService: MessageService,
        private themeservice: ThemeService
    ) {
        this.countries = countries;
        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';

        this.yearType =
            [
                {
                    "id": 1,
                    "year": "Calendar Year"
                },
                {
                    "id": 2,
                    "year": "Financial Year"
                }

            ]
    }
    ngOnInit() {

        // console.log("here");
    }

    dialogOpen(num: string) {
        if (num == "1") {
            this.visible = true;
            // this.getEndWasteType();
            this.visible2 = false

        } else {
            this.visible2 = true;
            this.visible = false;
            this.getYEarType();
        }
    };

    //method to update company profile
    saveChanges() {

        const formData = new URLSearchParams();

        formData.append('hazadrous', this.hazadrous.toString());
        formData.append('non_hazadrous', this.non_hazadrous.toString());

        this.companyService.setHazardNonhazard(formData.toString()).subscribe({
            next: (response) => {

                this.notification.showSuccess(
                    'Updated successfully',
                    'Success'
                );
            }
        });
    };

    saveCurrency() {
// console.log( this.yearId);
// console.log(this.yearSelect);

        const formData = new URLSearchParams();

        formData.append('id', this.yearId.toString());
        formData.append('financial_year', this.yearSelect.toString());

        this.companyService.updatefinancial_year(formData.toString()).subscribe({
            next: (response) => {

                this.notification.showSuccess(
                    'Updated successfully',
                    'Success'
                );
            }
        });
    };


    // getEndWasteType() {
    //     this.companyService.getWasteType().subscribe({
    //         next: (response) => {

    //             if (response.success == true) {
    //                 this.wasteGrid = response.categories;

                   
    //             }
    //         }
    //     })
    // };
    getYEarType() {
        this.companyService.getYEarType().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.yearId = response.categories[0].id;
                    this.yearSelect = response.categories[0].financial_year;
                    // this.waterWasteProduct = this.wasteGrid[0].type
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

}
