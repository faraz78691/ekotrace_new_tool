import {LoginInfo} from '@/models/loginInfo';
import {CompanyDetails} from '@/shared/company-details';
import {CompanyService} from '@services/company.service';
import {Component, OnInit} from '@angular/core';
import {Customer, Representative} from './customer';
import {CustomerService} from './customerservice';
import { brsR_Q_As } from '@/models/brsrQA';
@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
    customers: Customer[];
    id:any;
    selectedCustomers: Customer[];

    representatives: Representative[];

    statuses: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    public loginInfo: LoginInfo;
    public brsrqaDetails: brsR_Q_As;
    public CompaniesList: CompanyDetails[];
    constructor(
        private companyService: CompanyService,
        private customerService: CustomerService
    ) {
        this.CompaniesList = [];
    }
    ngOnInit() {
        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
        }
        this.getAllCompaniesList();
        
       
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

            this.customers.forEach(
                (customer) => (customer.date = new Date(customer.date))
            );

           
        });

        this.representatives = [
            {name: 'Amy Elsner', image: 'amyelsner.png'},
            {name: 'Anna Fali', image: 'annafali.png'},
            {name: 'Asiya Javayant', image: 'asiyajavayant.png'},
            {name: 'Bernardo Dominic', image: 'bernardodominic.png'},
            {name: 'Elwin Sharvill', image: 'elwinsharvill.png'},
            {name: 'Ioni Bowcher', image: 'ionibowcher.png'},
            {name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png'},
            {name: 'Onyama Limba', image: 'onyamalimba.png'},
            {name: 'Stephen Shaw', image: 'stephenshaw.png'},
            {name: 'Xuxue Feng', image: 'xuxuefeng.png'}
        ];

        this.statuses = [
            {label: 'Unqualified', value: 'unqualified'},
            {label: 'Qualified', value: 'qualified'},
            {label: 'New', value: 'new'},
            {label: 'Negotiation', value: 'negotiation'},
            {label: 'Renewal', value: 'renewal'},
            {label: 'Proposal', value: 'proposal'}
        ];
    }

    getAllCompaniesList() {
        this.companyService.getCompaniesList().subscribe((res) => {
            if (res) {
                this.CompaniesList = res;
            }
        });
    }
    

    
    getSeverity(status) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    }
}
