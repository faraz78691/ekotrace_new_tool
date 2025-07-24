import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { openCloseAnimation, rotateAnimation } from './menu-item.animations';
import { ThemeService } from '@services/theme.service';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { CompanyService } from '@services/company.service';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    animations: [openCloseAnimation, rotateAnimation]
})
export class MenuItemComponent implements OnInit {
    public loginInfo: LoginInfo;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    isExpired: boolean;
    @Input() menuItem: any = null;
    excludedRole = 'Platform Admin';
    public isExpandable: boolean = false;
    @HostBinding('class.nav-item') isNavItem: boolean = true;
    @HostBinding('class.menu-open') isMenuExtended: boolean = false;
    public isMainActive: boolean = false;
    public isOneOfChildrenActive: boolean = false;
    updatedtheme: string;
    isDashboard:string;
    activeDahboard:boolean = false;

    constructor(
        private router: Router,
        private themeservice: ThemeService,
        public companyService: CompanyService
    ) {
        this.loginInfo = new LoginInfo();
    }

    ngOnInit(): void {
        if (
            this.menuItem &&
            this.menuItem.children &&
            this.menuItem.children.length > 0
        ) {
            this.isExpandable = true;
        }
       
        this.calculateIsActive(this.router.url); 
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
            
                this.calculateIsActive(event.url);
            });
          
        this.updatedtheme = localStorage.getItem('theme');
        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            // this.getTenantsById(Number(this.loginInfo.tenantID));
        }
    }


    async getTenantsById(id: number) {
        try {
            if (this.loginInfo.role === this.excludedRole) {
                return;
            }
            const response = await this.companyService
                .getTenantsDataById(Number(this.loginInfo.tenantID))
                .toPromise();
            this.companyDetails = response;
            const currentDate = new Date();
            const licenseExpiredDate = new Date(
                this.companyDetails.licenseExpired
            );
            this.isExpired = licenseExpiredDate < currentDate;

        } catch (error) {
            // Handle the error appropriately
        }
    }
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }

    public handleMainMenuAction() {
        if (this.isExpandable) {
            this.toggleMenu();
            return;
        }
        this.router.navigate(this.menuItem.path);
    }

    public toggleMenu() {
        this.isMenuExtended = !this.isMenuExtended;
    }

     calculateIsActive(url: string) {
       
      
        this.isMainActive = false;
        this.isOneOfChildrenActive = false;
        if (!this.isExpandable) {
            if ('/' + this.menuItem.path[0] === url) {
                this.isOneOfChildrenActive = true;
                this.isMenuExtended = true;
            }else if(url.includes(this.menuItem.path[0])){
              
               
                this.isOneOfChildrenActive = true;
                this.isMenuExtended = true;
            }
        } else if (this.menuItem.path[0] === url) {
          
            this.isMainActive = true;
        }
        if (!this.isMainActive && !this.isOneOfChildrenActive) {
     
            this.isMenuExtended = true;
        }
    }
}
