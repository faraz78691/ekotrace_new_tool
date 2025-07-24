import {Component} from '@angular/core';
import {ThemeService} from '@services/theme.service';

@Component({
    selector: 'app-waste-section',
    templateUrl: './waste-section.component.html',
    styleUrls: ['./waste-section.component.scss']
})
export class WasteSectionComponent {
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
