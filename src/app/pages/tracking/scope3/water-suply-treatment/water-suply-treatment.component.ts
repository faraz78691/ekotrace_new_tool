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
import { getMonthsData } from '@pages/tracking/months';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-water-suply-treatment',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TabViewModule, SubmitButtonComponent, InputSwitchModule, MultiSelectModule, DialogModule],
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
  isWaterWithdrawal: boolean = false
  isWaterDischarge: boolean = false;
  annualEntry: boolean = false;
  monthsData: any[] = [];
  visible: boolean = false;
  convertToKilo: any = [];
  dischargeToKilo: any = [];
  treatmentToKilo: any = [];
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
    this.monthsData = getMonthsData();
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

  async EntrySave(form: NgForm) {
    let formData = new URLSearchParams();
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


    var waterDischargeonlyobj1 = { "type": "Surface water", "kilolitres": form.value.surface_water_dest || 0 };
    var waterDischargeonlyobj2 = { "type": "Groundwater", "kilolitres": form.value.groundwater_dest || 0 };
    var waterDischargeonlyobj3 = { "type": "Sea water / desalinated water", "kilolitres": form.value.seaWater_dest || 0 };
    var waterDischargeonlyobj4 = { "type": "Third party water", "kilolitres": form.value.thirdParty_dest || 0 };
    var waterDischargeonlyobj5 = { "type": "Others", "kilolitres": form.value.others_dest || 0 };

    const typoOfDischargeonlyOffice = [waterDischargeonlyobj1, waterDischargeonlyobj2, waterDischargeonlyobj3, waterDischargeonlyobj4, waterDischargeonlyobj5]
    var water_DischargeonlyStringfy = JSON.stringify(typoOfDischargeonlyOffice);

    var waterDischargeobj1 = { "type": "Into Surface water", "withthtreatment": form.value.surface_withTreatment || 0, "leveloftreatment": form.value.surface_levelTreatment };
    var waterDischargeobj2 = { "type": "Into Ground water", "withthtreatment": form.value.ground_withTreatment || 0, "leveloftreatment": form.value.ground_levelTreatment };
    var waterDischargeobj3 = { "type": "Into Seawater", "withthtreatment": form.value.seawater_withTreatment || 0, "leveloftreatment": form.value.seawater_levelTreatment };
    var waterDischargeobj4 = { "type": "Send to third-parties", "withthtreatment": form.value.third_withTreatment || 0, "leveloftreatment": form.value.third_levelTreatment };
    var waterDischargeobj5 = { "type": "Others", "withthtreatment": form.value.others_withTreatment || 0, "leveloftreatment": form.value.others_levelTreatment };

    const dischargeWater = [waterDischargeobj1, waterDischargeobj2, waterDischargeobj3, waterDischargeobj4, waterDischargeobj5]
    var waterDischargeStringfy = JSON.stringify(dischargeWater);

    formData.set('water_supply_unit', '1');
    formData.set('water_treatment_unit', '1');
    formData.set('water_withdrawl', water_withdrawlStringfy);
    formData.set('water_discharge_only', water_DischargeonlyStringfy);
    formData.set('water_discharge', waterDischargeStringfy);
    formData.set('facilities', this.facilityID.toString());
    formData.set('year', this.year);
    formData.set('batch', '1');

    if (this.annualEntry) {
      const selectedMonths = this.monthsData.filter(item => item.selected);
      if (selectedMonths.length == 0) {
        this.notification.showWarning('Please select at least one month', 'Warning');
        this.isSubmitting = false;
        return
      }
      this.isSubmitting = true;

      for (let index = 0; index < this.monthsData.length; index++) {
        const item = this.monthsData[index];

        if (item.selected) {
          formData.set('water_supply', JSON.stringify([item.readingValue1]));
          formData.set('water_treatment', JSON.stringify([item.readingValue2]));
          formData.set('month', JSON.stringify([item.value]));
          try {
            const response: any = await firstValueFrom(
              this.appService.postAPI('/UploadWaterSupplyDE', formData)
            )

            if (response.success === true) {
              if (index === selectedMonths.length - 1) {
                this.notification.showSuccess('Data entry added successfully', 'Success');
                this.isSubmitting = false;
                console.log(this.convertToKilo);
                for (let i = 0; i < this.convertToKilo.length; i++) {
                  this.convertToKilo[i] = null; // or 0
                }
                for (let i = 0; i < this.dischargeToKilo.length; i++) {
                  this.dischargeToKilo[i] = null;
                }
                for (let i = 0; i < this.treatmentToKilo.length; i++) {
                  this.treatmentToKilo[i] = null;
                }
                // dataEntryForm.reset();

                this.monthsData = getMonthsData();

                this.annualEntry = false;
                this.appService.sendData(false);
              }
            } else {
              if (index === selectedMonths.length - 1) {
                this.notification.showError(response.message, 'Error');
                this.isSubmitting = false;
                this.appService.sendData(false);
              }
            }
          } catch (err) {
            if (index === selectedMonths.length - 1) {
              this.notification.showError('Data entry failed.', 'Error');
              this.isSubmitting = false;
              console.error('Error while submitting form:', err);
            }
          }

          // optional: wait 1 second before next request
          await new Promise(res => setTimeout(res, 200));
        }
      }

    } else {
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

      formData.set('water_supply', form.value.water_supply);
      formData.set('water_treatment', form.value.water_treatment);
      formData.set('month', this.months);
      this.appService.postAPI('/UploadWaterSupplyDE', formData.toString()).subscribe({
        next: (response: any) => {

          if (response.success == true) {
            this.notification.showSuccess(
              response.message,
              'Success'
            );
            for (let i = 0; i < this.convertToKilo.length; i++) {
              this.convertToKilo[i] = null; // or 0
            }
            for (let i = 0; i < this.dischargeToKilo.length; i++) {
              this.dischargeToKilo[i] = null;
            }
            for (let i = 0; i < this.treatmentToKilo.length; i++) {
              this.treatmentToKilo[i] = null;
            }
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












    // this.appService.postAPI('/AddwatersupplytreatmentCategory', formData.toString()).subscribe({

  }

  onAnnualChange(event: any) {
    this.appService.sendData(event);

  };

  selectAll(event: any) {
    this.monthsData.forEach(item => {
      item.selected = event.target.checked
    })
  }

  onInput(event: any, type: any) {
    this.convertToKilo[type] = (event.target.value * this.dataEntryForm.value.water_supply) / 100
  };

  onWaterWithdrawalChange(event: any) {
    const selectedIndex = event.target.value;
    this.convertToKilo[0] = (this.dataEntryForm.value.surface_water * selectedIndex) / 100
    this.convertToKilo[1] = (this.dataEntryForm.value.groundwater * selectedIndex) / 100
    this.convertToKilo[2] = (this.dataEntryForm.value.thirdParty * selectedIndex) / 100
    this.convertToKilo[3] = (this.dataEntryForm.value.seaWater * selectedIndex) / 100
    this.convertToKilo[4] = (this.dataEntryForm.value.others * selectedIndex) / 100
  }
  onWaterDischargeChange(event: any) {
    const selectedIndex = event.target.value;
    this.dischargeToKilo[0] = (this.dataEntryForm.value.surface_water_dest * selectedIndex) / 100
    this.dischargeToKilo[1] = (this.dataEntryForm.value.groundwater_dest * selectedIndex) / 100
    this.dischargeToKilo[2] = (this.dataEntryForm.value.thirdParty_dest * selectedIndex) / 100
    this.dischargeToKilo[3] = (this.dataEntryForm.value.seaWater_dest * selectedIndex) / 100
    this.dischargeToKilo[4] = (this.dataEntryForm.value.others_dest * selectedIndex) / 100

    this.treatmentToKilo[0] = (this.dataEntryForm.value.surface_withTreatment * this.dischargeToKilo[0]) / 100

    this.treatmentToKilo[1] = (this.dataEntryForm.value.ground_withTreatment * this.dischargeToKilo[1]) / 100
    this.treatmentToKilo[2] = (this.dataEntryForm.value.third_withTreatment * this.dischargeToKilo[2]) / 100
    this.treatmentToKilo[3] = (this.dataEntryForm.value.seawater_withTreatment * this.dischargeToKilo[3]) / 100
    this.treatmentToKilo[4] = (this.dataEntryForm.value.others_withTreatment * this.dischargeToKilo[4]) / 100
  }

  onInputDischarge(event: any, type: any) {
    this.dischargeToKilo[type] = (event.target.value * this.dataEntryForm.value.water_treatment) / 100

    this.treatmentToKilo[0] = (this.dataEntryForm.value.surface_withTreatment * this.dischargeToKilo[0]) / 100

    this.treatmentToKilo[1] = (this.dataEntryForm.value.ground_withTreatment * this.dischargeToKilo[1]) / 100
    this.treatmentToKilo[2] = (this.dataEntryForm.value.third_withTreatment * this.dischargeToKilo[2]) / 100
    this.treatmentToKilo[3] = (this.dataEntryForm.value.seawater_withTreatment * this.dischargeToKilo[3]) / 100
    this.treatmentToKilo[4] = (this.dataEntryForm.value.others_withTreatment * this.dischargeToKilo[4]) / 100
  };

  onInputTreatment(event: any, type: any) {
    this.treatmentToKilo[type] = (event.target.value * this.dischargeToKilo[type]) / 100
  };

  ngOnDestroy(): void {
    this.appService.sendData(false);
  }
}

