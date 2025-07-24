import {Component} from '@angular/core';
import {ThemeService} from '@services/theme.service';

@Component({
    selector: 'app-water-section',
    templateUrl: './water-section.component.html',
    styleUrls: ['./water-section.component.scss']
})
export class WaterSectionComponent {
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
