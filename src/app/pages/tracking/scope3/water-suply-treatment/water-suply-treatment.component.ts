import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DataEntry } from '@/models/DataEntry';
import { SubmitButtonComponent } from "@/shared/submit-button/submit-button.component";

@Component({
  selector: 'app-water-suply-treatment',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TabViewModule, SubmitButtonComponent],
  templateUrl: './water-suply-treatment.component.html',
  styleUrls: ['./water-suply-treatment.component.scss']
})
export class WaterSuplyTreatmentComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
  isHowtoUse = false;
  facilityID: number;
  facilityCountryCode: string;
  subCategoryID: number = 1;
  fuelType: [] = [];
  units: any[] = [];
  fuelId: number = 0;
  isSubmitting = false;
  year: string;
  months: string;
  selectMonths: any[] = [];
  waterSupplyUnit = 'kilo litres'
  dataEntry: DataEntry = new DataEntry();
  waterUsageLevel: any[] = [];
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.waterUsageLevel =
      [{
        "id": 1,
        "unitType": "Primary"
      },
      {
        "id": 2,
        "unitType": "Secondary"
      },
      {
        "id": 3,
        "unitType": "Tertiary"
      }

      ];
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

  EntrySave(form: NgForm) {
   

    if (form.value.water_supply <= form.value.water_treatment) {
      this.notification.showInfo(
        'Water withdrawn should be greater than or equal to water discharged',
        'Error'
      );
      return
    }

    if (form.value.water_supply < 0 || form.value.water_supply == null) {
      this.notification.showInfo(
        'Enter water withdrawn',
        'Error'
      );
      return
    }
    if (form.value.water_treatment < 0 || form.value.water_treatment == null) {
      this.notification.showInfo(
        'Enter water discharged',
        'Error'
      );
      return
    }
this.isSubmitting = true;

    if (this.waterSupplyUnit == 'kilo litres') {
      var allUnits = 1
    }
    if (this.waterSupplyUnit == 'cubic m') {
      var allUnits = 2
    }
  
    var waterobj1 = { "type": "Surface water", "kilolitres": form.value.surface_water };
    var waterobj2 = { "type": "Groundwater", "kilolitres": form.value.groundwater };
    var waterobj3 = { "type": "Third party water", "kilolitres": form.value.thirdParty };
    var waterobj4 = { "type": "Sea water / desalinated water", "kilolitres": form.value.seaWater };
    var waterobj5 = { "type": "Others", "kilolitres": form.value.others };

    const typoOfOffice = [waterobj1, waterobj2, waterobj3, waterobj4, waterobj5]
    var water_withdrawlStringfy = JSON.stringify(typoOfOffice);


    var waterDischargeonlyobj1 = { "type": "Surface water", "kilolitres": form.value.surface_water_dest };
    var waterDischargeonlyobj2 = { "type": "Groundwater", "kilolitres": form.value.groundwater_dest };
    var waterDischargeonlyobj3 = { "type": "Third party water", "kilolitres": form.value.thirdParty_dest };
    var waterDischargeonlyobj4 = { "type": "Sea water / desalinated water", "kilolitres": form.value.seaWater_dest };
    var waterDischargeonlyobj5 = { "type": "Others", "kilolitres": form.value.others_dest };

    const typoOfDischargeonlyOffice = [waterDischargeonlyobj1, waterDischargeonlyobj2, waterDischargeonlyobj3, waterDischargeonlyobj4, waterDischargeonlyobj5]
    var water_DischargeonlyStringfy = JSON.stringify(typoOfDischargeonlyOffice);

    var waterDischargeobj1 = { "type": "Into Surface water", "withthtreatment": form.value.surface_withTreatment, "leveloftreatment": form.value.surface_levelTreatment };
    var waterDischargeobj2 = { "type": "Into Ground water", "withthtreatment": form.value.ground_withTreatment, "leveloftreatment": form.value.ground_levelTreatment };
    var waterDischargeobj3 = { "type": "Into Seawater", "withthtreatment": form.value.seawater_withTreatment, "leveloftreatment": form.value.seawater_levelTreatment };
    var waterDischargeobj4 = { "type": "Send to third-parties", "withthtreatment": form.value.third_withTreatment, "leveloftreatment": form.value.third_levelTreatment };
    var waterDischargeobj5 = { "type": "Others", "withthtreatment": form.value.others_withTreatment, "leveloftreatment": form.value.others_levelTreatment };

    const dischargeWater = [waterDischargeobj1, waterDischargeobj2, waterDischargeobj3, waterDischargeobj4, waterDischargeobj5]
    var waterDischargeStringfy = JSON.stringify(dischargeWater)
    let formData = new URLSearchParams();

    formData.set('water_supply', form.value.water_supply);
    formData.set('water_treatment', form.value.water_treatment);
    formData.set('water_supply_unit', '1');
    formData.set('water_treatment_unit', '1');
    formData.set('water_withdrawl', water_withdrawlStringfy);
    formData.set('water_discharge_only', water_DischargeonlyStringfy);
    formData.set('water_discharge', waterDischargeStringfy);
    formData.set('facilities', this.facilityID.toString());
    formData.set('month', this.months);
    formData.set('year', this.year);
    formData.set('batch', '1');


    this.appService.postAPI('/AddwatersupplytreatmentCategory', formData.toString()).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );
          this.dataEntryForm.reset();
          this.waterSupplyUnit = 'kilo litres'

        } else {
          this.notification.showError(
            response.message,
            'Error'
          );
          this.dataEntryForm.reset();
          this.waterSupplyUnit = 'kilo litres'

        }
        this.isSubmitting = false;
        // this.ALLEntries();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.waterSupplyUnit = 'kilo litres'
        this.notification.showError(
          'Data entry added failed.',
          'Error'
        );
        this.dataEntryForm.reset();


        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    })
  }
}

