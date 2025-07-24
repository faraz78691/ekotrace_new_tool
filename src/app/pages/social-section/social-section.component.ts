import {Component} from '@angular/core';
import {ThemeService} from '@services/theme.service';

@Component({
    selector: 'app-social-section',
    templateUrl: './social-section.component.html',
    styleUrls: ['./social-section.component.scss']
})
export class SocialSectionComponent {
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
