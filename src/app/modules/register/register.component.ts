import {
    Component,
    OnInit,
    Renderer2,
    OnDestroy,
    HostBinding
} from '@angular/core';
import {
    UntypedFormGroup,
    UntypedFormControl,
    Validators,
    NgForm
} from '@angular/forms';
import {AppService} from '@services/app.service';
import {ToastrService} from 'ngx-toastr';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegistrationService} from '@services/registration.service';
import {CompanyDetails} from '@/shared/company-details';
import {licenseType} from './licenseType';
import {NotificationService} from '@services/notification.service';
import {Router} from '@angular/router';
import {UserService} from '@services/user.service';
import {CompanyService} from '@services/company.service';
import {CountryCode} from '@/models/CountryCode';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    @HostBinding('class') class = 'register-box';
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    licenseTypes: licenseType[];
    selectedValue: any;
    minDate: string;
    isLoading: boolean = false;
    selectedCountryCode: any;
    selectedCode: string = '';
    showLoader = false;
    usernameIsExist: boolean = false;
    emailIstExist: boolean = false;
    public registerForm: UntypedFormGroup;
    public isAuthLoading = false;
    public isGoogleLoading = false;
    countryCodes: CountryCode[] = [];
    public isFacebookLoading = false;
    constructor(
        private renderer: Renderer2,
        private UserService: UserService,
        private toastr: ToastrService,
        private router: Router,
        private appService: AppService,
        private companyService: CompanyService,
        public registrationService: RegistrationService,
        private notification: NotificationService
    ) {
        const today = new Date(); // get the current date
        this.minDate = today.toISOString().substring(0, 10);
        this.licenseTypes = [];
        this.companyDetails = new CompanyDetails();
    }

    ngOnInit() {
    //licenseTypes array is initialized with a set of license types.
        this.licenseTypes = [
            {code: '', name: 'Select'},
            {code: 'Normal', name: 'Normal'},
            {code: 'FullAccess', name: 'Full Access'}
        ];
        // selectedValue variable is set to the code of the first license type in the array.
        this.selectedValue = this.licenseTypes[0].code;
        this.registerForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required),
            password: new UntypedFormControl(null, [Validators.required]),
            retypePassword: new UntypedFormControl(null, [Validators.required])
        });

        this.getAllCountryCode();
        
    }

    // async registerByAuth() {
    //     if (this.registerForm.valid) {
    //         this.isAuthLoading = true;
    //         await this.appService.registerByAuth(this.registerForm.value);
    //         this.isAuthLoading = false;
    //     } else {
    //         this.toastr.error('Form is not valid!');
    //     }
    // }

    //method for register a new company
    onSubmit(userForm: NgForm) {
        this.isLoading = true;
        this.showLoader = true;
        this.companyData.licenseType = this.selectedValue;
        if (userForm.invalid) {
            this.showLoader = false;
            this.isLoading = false;
            this.toastr.error('Please enter correct values in field!');
            return;
        }
        this.registrationService.registerCompany(this.companyData).subscribe({
            next: (response) => {
                this.notification.showSuccess(
                    'Company Registration successful',
                    'Success'
                );
                this.router.navigate(['']);
                this.showLoader = false;
            },

           
            error: (err) => {
                this.isLoading = false;
                this.showLoader = false;
                // Handle error response here
                if (err.error.message === 'User already exists!') {
                    this.notification.showError(
                        'User already exists.Please choose a different name or email.',
                        ''
                    );
                } else {
                    // Handle other errors
                    console.error('errrrr', err);
                }
            }
        });
    }

 
    //method for reset the form
    resetForm(userForm: NgForm) {
        userForm.resetForm();
        Object.keys(userForm.controls).forEach((key) => {
            userForm.controls[key].setErrors(null);
        });
    }
    //method to check existing username 
    CheckUserExist(username, Userkey) {
        this.UserService.CheckUserExist(username).subscribe((result) => {
            if (Userkey == 'username') {
                this.usernameIsExist = result;
            } else {
                this.emailIstExist = result;
            }
        });
    }
     //method for get all the country code
    getAllCountryCode() {
        this.companyService.GetCountryCode().subscribe({
            next: (response) => {
                this.countryCodes = response;
            }
        });
    }
}
