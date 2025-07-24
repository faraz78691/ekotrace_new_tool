import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding,
    ViewChild,
    ElementRef
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha/lib';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { LoginInfo } from '@/models/loginInfo';
import { NotificationService } from '@services/notification.service';
import { Router } from '@angular/router';
import { CompanyDetails } from '@/shared/company-details';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    protected aFormGroup: FormGroup;
    facilitysubgrouplist: any[] = [];
    @HostBinding('class') class = 'login-box';
    loginForm!: FormGroup;
    submitted = false;
    public loginInfo: LoginInfo;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    isLoading: boolean = false;
    showLoader = false;
    isExpiring: boolean = false;
    isExpired: boolean = false;
    public isAuthLoading = false;
    @ViewChild('captchaElem')
    captchaElem!: ReCaptcha2Component;
    @ViewChild('langInput')
    langInput!: ElementRef;
    public captchaIsLoaded = false;
    public captchaSuccess = false;
    public captchaIsExpired = false;
    public captchaResponse?: string;
    public theme: 'light' | 'dark' = 'light';
    public size: 'compact' | 'normal' = 'normal';
    public lang = 'en';
    public type!: 'image' | 'audio';
    public invalidLogin: boolean = false;
    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService,
        private fb: FormBuilder,
        private companyService: CompanyService,
        private notification: NotificationService,
        private router: Router,
        private facilityService: FacilityService
    ) {
        this.companyDetails = new CompanyDetails();
    }

    ngOnInit() {
        this.renderer.addClass(document.querySelector('app-root'), 'test');
        // Initialize the login form with required validators
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],

            //recaptcha: ['', Validators.required]
        });
        // Check if login information exists in local storage
        if (localStorage.getItem('LoginInfo') != null) {
            // Retrieve login information from local storage
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            this.loginInfo = jsonObj as LoginInfo;
            this.getTenantsDetailById(Number(this.loginInfo.tenantID));
        }
    }
    //get tenant details by id
    getTenantsDetailById(id: number) {
        this.companyService.getTenantsDataById(id).subscribe((response) => {
            this.companyDetails = response;
        });
    }

    loginByAuth() {
        if (this.loginForm.valid) {
            // this.submitted = true;
            // this.isLoading = true;
            // this.showLoader = true;
            // this.isAuthLoading = true;
            const formData = new URLSearchParams();
            formData.set('email', this.loginForm.value.email.trim());
            formData.set('password', this.loginForm.value.password.trim());
            this.appService.newloginByAuth(formData).subscribe(
                (res) => {

                    if (res.success == true) {

                        this.loginInfo = res.userinfo[0];
                        if (this.loginInfo.role != 'Platform Admin') {
                            if (this.loginInfo.package_id == null || this.loginInfo.package_id == undefined) {
                                this.toastr.error(
                                    'You dont have any package assigned, Please contact platform admin'
                                );
                                this.showLoader = false;
                                this.isLoading = false;
                                return false
                            }
                        }
                   
                        this.invalidLogin = false;
                    
                        const currentDate = new Date();
                        const licenseExpiredDate = new Date(this.loginInfo.licenseExpired);

                        // Calculate the difference in milliseconds
                        const differenceInMilliseconds = licenseExpiredDate.getTime() - currentDate.getTime();

                        // Convert the difference to days
                        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
                     
                        // Check if the difference is 7 days or less
                        this.isExpiring = differenceInDays <= 7 && differenceInDays > 0;
                        this.isExpired = differenceInDays < 0;
                     
                  
                   

                        if (this.loginInfo.role === 'Platform Admin') {
                    
                            localStorage.setItem('accessToken', this.loginInfo.token);

                            localStorage.setItem(
                                'LoginInfo',
                                JSON.stringify(this.loginInfo)
                            );
                            localStorage.setItem(
                                'refreshToken',
                                this.loginInfo.refreshToken
                            );
                            let userInfo = localStorage.getItem('LoginInfo');
                            let jsonObj = JSON.parse(userInfo); // string to "any" object first
                            this.loginInfo = jsonObj as LoginInfo;
                            this.router.navigate(['/platformAdmin']);
                            return
                        }
                        if (this.isExpiring
                        ) {
                            localStorage.setItem('accessToken', this.loginInfo.token);

                            localStorage.setItem(
                                'LoginInfo',
                                JSON.stringify(this.loginInfo)
                            );
                            localStorage.setItem(
                                'refreshToken',
                                this.loginInfo.refreshToken
                            );
                            let userInfo = localStorage.getItem('LoginInfo');
                            let jsonObj = JSON.parse(userInfo); // string to "any" object first
                            this.loginInfo = jsonObj as LoginInfo;
                            this.router.navigate(['/billing']);
                        } else if(this.isExpired) {
                            this.notification.showError(
                                'Your plan has expired. Please contact the platform admin for renewal.',
                                ''
                            );
                            this.showLoader = false;
                            this.isAuthLoading = false;
                            this.isLoading = false;
                            return false
                        }else{
                            localStorage.setItem('accessToken', this.loginInfo.token);

                            localStorage.setItem(
                                'LoginInfo',
                                JSON.stringify(this.loginInfo)
                            );
                            localStorage.setItem(
                                'refreshToken',
                                this.loginInfo.refreshToken
                            );
                            let userInfo = localStorage.getItem('LoginInfo');
                            let jsonObj = JSON.parse(userInfo); // string to "any" object first
                            this.loginInfo = jsonObj as LoginInfo;
                            this.router.navigate(['/dashboard']);
                        }
                        this.GetSubGroupList(this.loginInfo.tenantID);
                        this.showLoader = false;
                        this.isAuthLoading = false;
                        this.isLoading = false;
                    } else {
                        this.notification.showError(
                            res.message,
                            ''
                        );
                        this.isLoading = false;
                        this.showLoader = false;
                        this.invalidLogin = true;
                    }
                },
                (err) => {
                    console.log(err);
                    if (err.error.message === 'Your license has expired.') {
                        this.toastr.error(
                            'Your plan is expired.please contact Super Admin'
                        );
                    } else {
                        this.notification.showError(
                            'Invalid username or password.',
                            ''
                        );
                    }
                    this.isLoading = false;
                    this.showLoader = false;
                    this.invalidLogin = true;
                },
                () => {
                    // 'onCompleted' callback.
                    // No errors, route to new page here
                }
            );
        } else {
            let inv = this.loginForm.invalid;
            inv === true;
            this.showLoader = false;
            this.isLoading = false;
        }
    }

    ngOnDestroy() {
        // Remove the 'login-page' class from the 'app-root' element
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }

    GetSubGroupList(tenantID) {
        this.facilitysubgrouplist = []

        const formData = new URLSearchParams();
        formData.set('tenantID', tenantID)
        this.facilityService
            .getActualSubGroups(formData.toString())
            .subscribe((res) => {

                if (res.success == true) {
                    this.facilitysubgrouplist = res.categories;
                    const isMainGroup = this.facilitysubgrouplist.filter(items => items.is_main_group == 1)
                    if (isMainGroup.length > 0) {
                        this.facilityService.targetAllowed.set(true)
                    } else {
                        this.facilityService.targetAllowed.set(false)
                    }

                }
            });
    };
}
