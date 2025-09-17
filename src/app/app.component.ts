import { Component, ViewEncapsulation } from '@angular/core';
import { FacilityService } from '@services/facility.service';
import { LoginInfo } from './models/loginInfo';
import { AppService } from '@services/app.service';
import { ApiService } from '@services/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    facilitysubgrouplist: any[] = [];
    loginInfo: any;
    constructor(private facilityService: FacilityService, private appService: ApiService, private apiService: AppService) {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo);
            this.loginInfo = jsonObj as LoginInfo;

            let tenantID = this.loginInfo.tenantID;
            this.GetSubGroupList(tenantID)
        }

    };

    ngOnInit() {
        // if (localStorage.getItem('assets') != null) {
        //     let userAssets = localStorage.getItem('assets');
        //     console.log(userAssets);
        //    const favIcon = JSON.parse(userAssets).fav_icon;
        //    this.appService.updateFavicon(favIcon);
          
        // } else {
        //     this.apiService.getApi('/login_logo').subscribe((res) => {
        //        const favIcon= res.data.fav_icon;
        //         this.appService.updateFavicon(favIcon);
        //         const jsonAssets = JSON.stringify(res.data[0]);
        //         localStorage.setItem('assets', jsonAssets);

        //     })
        // }
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
