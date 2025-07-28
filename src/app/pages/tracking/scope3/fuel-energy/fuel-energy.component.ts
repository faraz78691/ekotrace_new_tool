import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityService } from '@services/facility.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { NotificationService } from '@services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-fuel-energy',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TabViewModule, FileUploadModule],
  templateUrl: './fuel-energy.component.html',
  styleUrls: ['./fuel-energy.component.scss']
})
export class FuelEnergyComponent {
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  fuelType: [] = [];
  units: any[] = [];
  fuelId: number = 0;
  isSubmitting = false;
  year: string;
  months: string;
  selectedFile: any;
  uploadButton: boolean;
  templateLinks: string;

  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.templateLinks = 'assets/FireExtinguisher_Template.xlsx'
    effect(() => {
      this.subCategoryID = this.facilityService.subCategoryId();
      this.year = this.facilityService.yearSignal();
      this.months = this.facilityService.monthSignal();
      if (this.facilityService.selectedfacilitiesSignal() != 0) {
        this.facilityID = this.facilityService.selectedfacilitiesSignal();
        this.facilityCountryCode = this.facilityService.countryCodeSignal();

      }
    });
  };

  EntrySave(dataEntryForm: NgForm) { }
}
