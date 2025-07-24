import { Component, ViewEncapsulation } from '@angular/core';
import { FacilityService } from '@services/facility.service';
import { LoginInfo } from './models/loginInfo';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    facilitysubgrouplist: any[] = [];
    loginInfo: any;
    constructor(private facilityService: FacilityService) {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            this.loginInfo = jsonObj as LoginInfo;

            let tenantID = this.loginInfo.tenantID;
            this.GetSubGroupList(tenantID)
        }

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
