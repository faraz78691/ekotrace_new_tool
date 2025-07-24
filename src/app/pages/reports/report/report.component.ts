import {Component} from '@angular/core';
import {ThemeService} from '@services/theme.service';

interface reports {
    heading: string;
    pera: string;
    button: string;
    route: string;
}
@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent {
    reports: reports[];
    updatedtheme: any;

    constructor(private themeservice: ThemeService) {
        this.reports = [
            {
                heading: 'GHG Data - Single Category and Facility',
                pera: 'Generate GHG  report focusing on one category for an individiual facility within a group',
                button: 'view',
                route: '/single-report'
            },
            {
                heading: 'GHG Emisisons Data - Mutiple Categories & Facilities',
                pera: 'Generate emissions report focusing on multiple categories for one or more facilities in monthly format or aggregated form for the selected time period',
                button: 'view',
                route: '/energy-custom-report'
            },
            {
                heading: 'GHG Emissions Data - Audit Report',
                pera: 'Generate GHG emissions for audit purpose encompassing EFs and their sources across mutiple facilities',
                button: 'view',
                route: '/audit-report'
            },
            {
                heading: 'Water Usage Report',
                pera: 'Generate comprehensive water report covering total usage, water discharged and it treatment across mutiple facilities ',
                button: 'view',
                route: '/water-supply-report'
            },
            {
                heading: 'Waste Report',
                pera: 'Generate detailed waste report covering different types of waste generated and related emisisons for a cetain facility',
                button: 'view',
                route: '/waste-report'
            },
            {
                heading: 'Business Travel Report',
                pera: 'Generate detailed business travel report analysing travel pattern and emissions across different travel modes for a certain facility',
                button: 'view',
                route: '/businessTravel-report'
            },
            {
                heading: 'Vendor Report',
                pera: 'Generare vendor report to analyse the emisisons from the set of vendors across different products and services',
                button: 'view',
                route: '/vendor-report'
            },
            {
                heading: 'Financed Emissions Report',
                pera: 'Generate financed emissions report to assess portfolio level emissions across the different investment products',
                button: 'view',
                route: '/financed-report'
            }
          
        ];
    }

    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }
}
