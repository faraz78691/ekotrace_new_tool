import {Component} from '@angular/core';
import {ThemeService} from '@services/theme.service';

@Component({
    selector: 'app-governance-section',
    templateUrl: './governance-section.component.html',
    styleUrls: ['./governance-section.component.scss']
})
export class GovernanceSectionComponent {
    constructor(private themeservice: ThemeService) {}
    display = 'none';
    updatedtheme: string;
    ngOnInit() {}

    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }

    openModal() {
        this.display = 'block';
    }
    onCloseHandled() {
        this.display = 'none';
    }
}
