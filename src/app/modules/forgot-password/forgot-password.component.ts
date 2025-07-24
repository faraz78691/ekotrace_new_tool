import {
    Component,
    HostBinding,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    NgForm,
    UntypedFormControl,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '@services/app.service';
import {UserService} from '@services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ForgotPassword} from './forgot-password';
import {HttpParams} from '@angular/common/http';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box';
    public forgotPasswordForm: UntypedFormGroup;
    public isAuthLoading = false;
    emailIstExist: boolean = false;
    fForm!: FormGroup;
    email: any;
    isLoading: boolean = false;
    public forgotpassword: ForgotPassword;
    forgotData: ForgotPassword = new ForgotPassword();

    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService,
        private fb: FormBuilder,
        public userservice: UserService,
        private route: ActivatedRoute,
        private router: Router,

    ) {
        this.forgotData = new ForgotPassword();
    }
/* 
The ngOnInit function initializes the component by subscribing to the query parameters, 
adding a CSS class to the root element, setting up the form, and checking if a user with 
the given email exists.
*/
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.email = params.email;
        });

        this.renderer.addClass(document.querySelector('app-root'), 'page');
        this.fForm = this.fb.group({
            email: ['', Validators.required]
        });
        this.CheckUserExist(this.email);
    }
//The onSubmit function handles the submission of the form for password recovery and displays appropriate messages based on the response.
    onSubmit(fForm: NgForm) {
        this.isLoading = true;
        
    const formVendorData = new URLSearchParams();
    formVendorData.set('email', this.forgotData.email);
        this.userservice.forgotPassword(formVendorData).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.toastr.success(
                    'The link has been sent, please check your email to reset your password'
                );
                this.router.navigate(['/login'])
            },
            error: (err) => {
                this.isLoading = false;
                // console.log('error', err);
            }
        });
    }
    
//The ngOnDestroy function is called when the component is about to be destroyed. It removes a CSS class from the root element.
    ngOnDestroy(): void {
        // this.renderer.removeClass(document.querySelector('app-root'), '');
    }

    //Check existing user by username
    CheckUserExist(username) {
        this.userservice.CheckUserExist(username).subscribe((result) => {
            this.emailIstExist = result;
        });
    }
}
