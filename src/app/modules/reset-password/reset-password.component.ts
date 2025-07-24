import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ResetPassword} from './reset-password';
import {UserService} from '@services/user.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
    public resetpassword: ResetPassword;
    resetData: ResetPassword = new ResetPassword();
    rForm!: FormGroup;
    userid: string;
    isLoading: boolean = false;
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private router: Router,
        public userservice: UserService,
        private route: ActivatedRoute
    ) {
        this.resetpassword = new ResetPassword();
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.userid = params.userid;
        });
    }
    //method for update password
    onSubmit(rForm: NgForm) {
        this.isLoading = true;
        if (rForm.invalid) {
            this.toastr.error('Please enter correct values in field!');
            this.isLoading = false;
            return;
        }

        if (this.resetData.newpassword !== this.resetData.confirmpassword) {
            this.toastr.error('Passwords do not match!');
            return;
        }

        this.resetData.userid = this.userid;
        this.userservice.reSetPassword(this.resetData).subscribe(
            (response) => {
                this.toastr.success('Successfully reset password');
                this.router.navigate(['login']);
            },
            (error) => {
                this.isLoading = false;
                this.toastr.error('Failed to reset password!');
            }
        );
    }
  //method for reset form
    resetForm() {
        this.rForm.reset();
    }
}
