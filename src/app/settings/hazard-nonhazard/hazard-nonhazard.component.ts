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
  selector: 'app-hazard-nonhazard',
  templateUrl: './hazard-nonhazard.component.html',
  styleUrls: ['./hazard-nonhazard.component.scss']
})
export class HazardNonhazardComponent {
  countries: any;
  public loginInfo: LoginInfo;
  public companyDetails: CompanyDetails;
  companyData: CompanyDetails = new CompanyDetails();
  industryTypes: IndustryType[];
  hazadrous: any[];
  non_hazadrous: any[];
  uploadedFile: any[] = [];
  companyProfile: any[] = [];
  wasteGrid: any[] = [];
  rootUrl: string;
  updatedtheme: string;
  multiselectcolor: any;
  selectedFile: File;
  selectedCountry = 'India'
  uploadedImageUrl: string | ArrayBuffer | null = null;
  companyName: string;
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
  }
  ngOnInit() {
      //creating Array for industry type
    
      //Retrieves the user login information from local storage and assigns it to the loginInfo variable.
      if (localStorage.getItem('LoginInfo') != null) {
          let userInfo = localStorage.getItem('LoginInfo');
          let jsonObj = JSON.parse(userInfo);
          this.loginInfo = jsonObj as LoginInfo;
      }
      // this.getTenantsDetailById(Number(this.loginInfo.tenantID));
    //  this.getEndWasteType();
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

//   getEndWasteType() {
//     this.companyService.getWasteType().subscribe({
//         next: (response) => {
//             // console.log(response, "sdgs");
//             if (response.success == true) {
//                 this.wasteGrid = response.categories;
            
//             }
//         }
//     })
// };
}
