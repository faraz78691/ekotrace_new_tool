import { KpiInventoryResponse } from '../../models/kpiInventory';
import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { AppService } from '@services/app.service';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-kpi-inventory',
  templateUrl: './kpi-inventory.component.html',
  styleUrls: ['./kpi-inventory.component.scss']
})
export class KpiInventoryComponent {

  // @ViewChild("chart") chart: ChartComponent;
  isHowtoUse =false;
  id: any;
  isgroupExist: boolean = false;
  selectedFaciltiy: any;
  selectedState: any;
  GroupByValue: string;
  project_type: string;
  countryUnique: string[];
  stateUnique: string[];
  unlock: string = '';
  ischecked = true;
  selectedRowIndex = 0;
  filledgroup: any;
  project_details = '';
  carbon_offset = '';
  selectedScope: any;
  superAdminId: any;
  vendorId: any;
  carbon_credit_value: string;
  type: string;
  date3: string;
  standard: string;
  selectedFile: File;
  dataProgress: any[] = [];
  facilityData: any[] = [];
  savedData: any[] = [];
  selectedScope1: any[] = [];
  selectedScope2: any[] = [];
  selectedScope3: any[] = [];
  facilities: any;
  merrgeProgress: any[] = [];
  dataPreparerCustom: any;
  dataPreparer: any;
  defaultScope = false;
  topFuels: any;
  scope3OrderCategories = [
    { index: 0, name: 'Purchased goods and services' },
    { index: 1, name: 'Fuel and Energy-related Activities' },
    { index: 2, name: 'Upstream Transportation and Distribution' },
    { index: 3, name: 'Water Supply and Treatment' },
    { index: 4, name: 'Waste generated in operations' },
    { index: 5, name: 'Business Travel' },
    { index: 6, name: 'Employee Commuting' },
    { index: 7, name: 'Home Office' },
    { index: 8, name: 'Upstream Leased Assets' },
    { index: 9, name: 'Downstream Transportation and Distribution' },
    { index: 10, name: 'Processing of Sold Products' },
    { index: 11, name: 'Use of Sold Products' },
    { index: 12, name: 'End-of-Life Treatment of Sold Products' },
    { index: 13, name: 'Downstream Leased Assets' },
    { index: 14, name: 'Franchises' }

  ]


  transformedData: any[] = [];
  fuelsTypes: any[] = [];

  public loginInfo: LoginInfo;
  selectedFacility: any;
  scopesEmissions: any;
  totalData: number[] = [];
  scope1: number[] = Array(12).fill(null);
  scope2: number[] = Array(12).fill(null);
  scope3: number[] = Array(12).fill(null);
  totalEmissions: number[] = Array(12).fill(0);
  totalEnergyConsumed: number[] = Array(12).fill(null);
  totalRevenue: number[] = Array(12).fill(null);
  totalOutput: number[] = Array(12).fill(null);
  totalFuelConsumed: number[] = Array(13).fill(null);
  grandOutput: number = 0
  grandRevenue: number = 0
  totalEnergyArea: number[] = Array(13).fill(0);
  scope1Total: number = 0
  scope2Total: number = 0
  scope3Total: number = 0
  totalAnually: number = 0;
  private totalUpdate$ = new Subject<number>();
  private inputSubjects: Subject<number>[] = Array(12).fill(null).map(() => new Subject<number>());
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  fuelData1: any[] = [];
  fuelData2: any[] = [];
  fuelData3: any[] = [];
  unitDropdown: any[] = [
    { label: 'KL', value: 1 },
    { label: 'Tonnes', value: 2 },
    { label: 'KL', value: 3 },
    { label: 'KL', value: 4 },
    { label: 'Tonnes', value: 5 },
    { label: 'KL', value: 6 },
  ]
  energyDataHeating: any[] = [];
  electricityData: any[] = [];
  renewElectricityData: any[] = [];
  fuelStationary: any[] = [];
  total_vehicle_passenger: any[] = [];
  selectedFuel1 = 2
  selectedFuel2 = 3
  selectedFuel3 = 4
  energyData: any;
  passengerPetrol: any;
  passenderDiesel: any;
  vehiclesOwnedEmission: any;
  vehiclesFreightEmission: any;
  businessTravelData: { [key: string]: number[] } = {};
  employeeData: { [key: string]: number[] } = {};
  waterData: { [key: string]: number[] } = {};
  generalData: { [key: string]: number[] } = {};

  wasteDisposed: any;
  waste_emissions: any;
  diverted_emssion: any;
  year: any;
  currentYear = new Date().getFullYear();
  inputDisabled: boolean = false;
  selectedYear = new Date()
  user_name: string = ''
  convertedFuel1: any;
  convertedFuel3: any;
  convertedFuel2: any;
  updated_at: any;
  unitDropdown1: any;
  unitDropdown3: any;
  unitDropdown2: any;
  stationaryFuel1: any;
  stationaryFuel2: any;
  stationaryFuel3: any;
  facilityUnit: any;
  constructor(
    private companyService: CompanyService,
    private notification: NotificationService,
    private facilityService: FacilityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private themeservice: ThemeService,
    private appService: AppService,
    private spinner: NgxSpinnerService
  ) {




  }
  ngOnInit() {



    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;

    }
    let tenantID = this.loginInfo.tenantID;
    this.superAdminId = this.loginInfo.super_admin_id;
    this.year = this.selectedYear.getFullYear();
    if (this.year == this.currentYear) {
      this.inputDisabled = true;
    } else {
      this.inputDisabled = false;
    }

    this.GetFacilityList(tenantID);
    this.getFuelsTypes();
    // this.getKPiScopes();
    // this.getFuelEmissions1(2);
    // this.getFuelEmissions2(3);
    // this.getFuelEmissions3(4);
    // this.getEnergyEmissions();
    // this.getPassengerTypeEmissions();
    // this.getVehiclesEmissions();
    // this.getBusinessTravel();
    // this.getEmployeeComminuty();
    // this.getWasteGeneration();
    // this.getWaterSupply();
    // this.getGeneralData();

  }



  GetFacilityList(tenantID: any) {
    this.facilityService
      .newGetFacilityByTenant(tenantID)
      .subscribe((res) => {
        if (res.length > 0) {

          this.facilityData = res;
          this.selectedFacility = this.facilityData[0].id;
          this.getFacilityUnit(this.selectedFacility)
          this.retrieveSavedData()

        }
      });
  };
  getFacilityUnit(facilityId: any) {
    const formData = new URLSearchParams();
    formData.append('facilities', facilityId);
    this.appService.postAPI(`/getcurrencyByfacilities`, formData).subscribe((res: any) => {
      this.facilityUnit = res.categories

    });
  };

  onFacilitySelect($event: any) {
    throw new Error('Method not implemented.');
  };


  getFuelsTypes() {
    this.appService.getApi(`/GhgSubcategoryTypes`).subscribe((response: any) => {
      this.fuelsTypes = response.data;
    })
  };

  getKPiScopes() {
    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    this.appService.postAPI(`/kpiInventory`, formData).subscribe((response: any) => {
      if (response && response.series) {
        this.scope1 = response.series[0].data;
        this.scope2 = response.series[1].data;
        this.scope3 = response.series[2].data;

        this.months.forEach((month, index) => {
          this.onInput(index)
        })

        this.sumScops()



      }
    })
  };
  getEnergyEmissions() {

    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);

    this.appService.postAPI(`/kpiInventoryEnergyUse`, formData).subscribe((response: any) => {

      this.energyDataHeating = response.data.heatingCooling;
      this.electricityData = response.data.electricity;
      this.renewElectricityData = response.data.renewableElectricity;

    })
  };
  getPassengerTypeEmissions() {

    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);

    this.appService.postAPI(`/kpiInventoryPassengerVehicleEmission`, formData).subscribe((response: any) => {
      this.passenderDiesel = response.data.vehicle_diesel;
      this.passengerPetrol = response.data.vehicle_petrol;
      this.total_vehicle_passenger = response.data.total_vehicle

    })
  };
  getFuelEmissions1(event) {
    console.log(this.selectedFuel1);
    console.log(event);
    const typeId = event;
    this.unitDropdown1 = this.fuelsTypes.find(x => x.ID == typeId).SubCatID;
    console.log(this.unitDropdown1);
    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData1 = response.data;
      this.convertedFuel1 = response.statuinary_fuel
      this.stationaryFuel1 = response.statuinary_fuel2

    })
  };
  onChangeFuelEmissions1(event) {
    console.log(this.selectedFuel1);
    console.log(event);
    const typeId = event;
    this.unitDropdown1 = this.fuelsTypes.find(x => x.ID == typeId).SubCatID;
    console.log(this.unitDropdown1);
    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData1 = response.data;
      this.convertedFuel1 = response.statuinary_fuel
      this.stationaryFuel1 = response.statuinary_fuel2

      setTimeout(() => {
        this.fuelData3.forEach((month, index) => {
          this.totalFuelConsumed[index] =
            (Number(this.convertedFuel1[index]) || 0) +
            (Number(this.convertedFuel2[index]) || 0) +
            (Number(this.convertedFuel3[index]) || 0)
          this.fuelStationary[index] =
            (Number(this.stationaryFuel1[index]) || 0) +
            (Number(this.stationaryFuel2[index]) || 0) +
            (Number(this.stationaryFuel3[index]) || 0)
        })

      }, 300)
      setTimeout(() => {
        this.fuelData3.forEach((month, index) => {
          this.totalEnergyConsumed[index] =
            (Number(this.energyDataHeating[index]) || 0) +
            (Number(this.electricityData[index]) || 0) +
            (Number(this.fuelStationary[index]) || 0)
        })
      }, 500)
    })
  };

  getFuelEmissions2(event) {
    const typeId = event;
    this.unitDropdown2 = this.fuelsTypes.find(x => x.ID == typeId).SubCatID;
    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData2 = response.data;
      this.convertedFuel2 = response.statuinary_fuel;
      this.stationaryFuel2 = response.statuinary_fuel2;

    })
  };
  onChangeFuelEmissions2(event) {
    const typeId = event;
    this.unitDropdown2 = this.fuelsTypes.find(x => x.ID == typeId).SubCatID;
    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData2 = response.data;
      this.convertedFuel2 = response.statuinary_fuel;
      this.stationaryFuel2 = response.statuinary_fuel2;

      setTimeout(() => {
        this.fuelData3.forEach((month, index) => {
          this.totalFuelConsumed[index] =
            (Number(this.convertedFuel1[index]) || 0) +
            (Number(this.convertedFuel2[index]) || 0) +
            (Number(this.convertedFuel3[index]) || 0)
          this.fuelStationary[index] =
            (Number(this.stationaryFuel1[index]) || 0) +
            (Number(this.stationaryFuel2[index]) || 0) +
            (Number(this.stationaryFuel3[index]) || 0)
        })

      }, 300)
      setTimeout(() => {
        this.fuelData3.forEach((month, index) => {
          this.totalEnergyConsumed[index] =
            (Number(this.energyDataHeating[index]) || 0) +
            (Number(this.electricityData[index]) || 0) +
            (Number(this.fuelStationary[index]) || 0)
        })
      }, 500)
    })
  };
  getFuelEmissions3(event) {
    const typeId = event;
    this.unitDropdown3 = this.fuelsTypes.find(x => x.ID == typeId).SubCatID;
    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData3 = response.data;
      this.convertedFuel3 = response.statuinary_fuel;
      this.stationaryFuel3 = response.statuinary_fuel2

      setTimeout(() => {
        this.fuelData3.forEach((month, index) => {
          this.totalFuelConsumed[index] =
            (Number(this.convertedFuel1[index]) || 0) +
            (Number(this.convertedFuel2[index]) || 0) +
            (Number(this.convertedFuel3[index]) || 0)
          this.fuelStationary[index] =
            (Number(this.stationaryFuel1[index]) || 0) +
            (Number(this.stationaryFuel2[index]) || 0) +
            (Number(this.stationaryFuel3[index]) || 0)
        })

      }, 2500)
      setTimeout(() => {
        this.fuelData3.forEach((month, index) => {
          this.totalEnergyConsumed[index] =
            (Number(this.energyDataHeating[index]) || 0) +
            (Number(this.electricityData[index]) || 0) +
            (Number(this.fuelStationary[index]) || 0)
        })
        this.spinner.hide()
      }, 2800)

    })


  };

  getTopsFuels(facilityID , year) {


    const formdata = new URLSearchParams();
    formdata.set('facilities', facilityID);
    formdata.set('year', year);
    this.appService.postAPI('/getKpiInventoryStationaryCombustionde', formdata).subscribe({
        next: (response: any) => {

            if (response.success == true) {
              this.topFuels = response.data;
              this.selectedFuel1 = this.topFuels[0]?.TypeID || 1;
              this.selectedFuel2 = this.topFuels[1]?.TypeID || 2;
              this.selectedFuel3 = this.topFuels[2]?.TypeID || 3;
              this.getFuelEmissions1( this.selectedFuel1);
              this.getFuelEmissions2(  this.selectedFuel2);
              this.getFuelEmissions3(this.selectedFuel3);
            } else {
              
            
            }
        }
    })

};
  onChangeFuelEmissions3(event) {
    const typeId = event;
    this.unitDropdown3 = this.fuelsTypes.find(x => x.ID == typeId).SubCatID;
    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData3 = response.data;
      this.convertedFuel3 = response.statuinary_fuel;
      this.stationaryFuel3 = response.statuinary_fuel2

      setTimeout(() => {
        this.fuelData3.forEach((month, index) => {
          this.totalFuelConsumed[index] =
            (Number(this.convertedFuel1[index]) || 0) +
            (Number(this.convertedFuel2[index]) || 0) +
            (Number(this.convertedFuel3[index]) || 0)
          this.fuelStationary[index] =
            (Number(this.stationaryFuel1[index]) || 0) +
            (Number(this.stationaryFuel2[index]) || 0) +
            (Number(this.stationaryFuel3[index]) || 0)
        })

      }, 300)
      setTimeout(() => {
        this.fuelData3.forEach((month, index) => {
          this.totalEnergyConsumed[index] =
            (Number(this.energyDataHeating[index]) || 0) +
            (Number(this.electricityData[index]) || 0) +
            (Number(this.fuelStationary[index]) || 0)
        })
      }, 500)

    })


  };
  getVehiclesEmissions() {

    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    this.appService.postAPI(`/kpiInventoryTransportVehicle`, formData).subscribe((response: any) => {
      this.vehiclesOwnedEmission = response.data.owend_transport;
      this.vehiclesFreightEmission = response.data.freight_transport;

    })
  };
  getBusinessTravel() {

    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    this.appService.postAPI(`/kpiInventoryBusinessTravel`, formData).subscribe((response: any) => {
      this.businessTravelData = response.data

    })
  };
  getEmployeeComminuty() {

    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    this.appService.postAPI(`/kpiInventoryEmployeeCommute`, formData).subscribe((response: any) => {
      this.employeeData = response.data

    })
  };
  getWasteGeneration() {

    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    this.appService.postAPI(`/kpiInventoryWasteGenerated`, formData).subscribe((response: any) => {
      this.wasteDisposed = response.waste_disposed;
      this.waste_emissions = response.waste_emissions;
      this.diverted_emssion = response.diverted_emssion;

    })
  };
  getWaterSupply() {

    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    this.appService.postAPI(`/kpiInventoryWaterUsage`, formData).subscribe((response: any) => {
      this.waterData = response.data

    })
  };
  getGeneralData() {

    const formData = new URLSearchParams();
    formData.append('facilities', this.selectedFacility);
    formData.append('year', this.year);
    this.appService.postAPI(`/kpiInventoryGeneralData`, formData).subscribe((response: any) => {
      this.generalData = response.data;


    })
  };

  onInput(index: number) {
    const total =
      (Number(this.scope1[index]) || 0) +
      (Number(this.scope2[index]) || 0) +
      (Number(this.scope3[index]) || 0);

    this.totalEmissions[index] = parseFloat(total.toFixed(3));
    this.sumScops()
  };
  onInputOutPut(index: number) {
    this.grandOutput = this.totalOutput.reduce((sum, num) => sum + (Number(num) || 0), 0);
    this.grandRevenue = this.totalRevenue.reduce((sum, num) => sum + (Number(num) || 0), 0);

  };



  sumScops() {
    this.scope1Total = parseFloat(
      this.scope1.reduce((sum, num) => sum + (Number(num) || 0), 0).toFixed(3)
    );

    this.scope2Total = parseFloat(
      this.scope2.reduce((sum, num) => sum + (Number(num) || 0), 0).toFixed(3)
    );

    this.scope3Total = parseFloat(
      this.scope3.reduce((sum, num) => sum + (Number(num) || 0), 0).toFixed(3)
    );

    this.totalAnually = parseFloat(
      (this.scope1Total + this.scope2Total + this.scope3Total).toFixed(3)
    );
  }



  trackByIndex(index: number, item: any): number {
    return index;
  }

  // Calculate the total row initially

  saveData() {


    const kpiData = {
      "Scope 1": {
        annual: this.scope1Total,
        monthly: this.scope1
      },
      "Scope 2": {
        annual: this.scope2Total,
        monthly: this.scope2
      },
      "Scope 3": {
        annual: this.scope3Total,
        monthly: this.scope3
      },
      "Total Emissions": {
        annual: this.totalAnually,
        monthly: this.totalEmissions
      },
      "Owned Passenger Vehicle Emiss. - Diesel": {
        annual: this.passenderDiesel[0],
        monthly: this.passenderDiesel.slice(1)
      },
      "Owned Passenger Vehicle Emiss. - Petrol": {
        annual: this.passengerPetrol[1],
        monthly: this.passengerPetrol.slice(1)
      }, "Total Owned Passenger Vehicle Emiss.": {
        annual: this.vehiclesOwnedEmission[2],
        monthly: this.vehiclesOwnedEmission.slice(1)
      },
      "Owned Transport Vehicle Emiss.": {
        annual: this.vehiclesOwnedEmission[0],
        monthly: this.vehiclesOwnedEmission.slice(1)
      },
      "Owned Freight Vehicle Emiss.": {
        annual: this.vehiclesFreightEmission[0],
        monthly: this.vehiclesFreightEmission.slice(1)
      },
      "Emissions in Flight travel": {
        annual: this.businessTravelData?.flightTravelDetails[0],
        monthly: this.businessTravelData?.flightTravelDetails.slice(1)
      },
      "Emissions in Other mode of travel": {
        annual: this.businessTravelData?.othermodesOfTransportDetails[0],
        monthly: this.businessTravelData?.othermodesOfTransportDetails.slice(1)

      }, "Emissions in Hotel stay": {
        annual: this.businessTravelData?.hotelstayDetails[0],
        monthly: this.businessTravelData?.hotelstayDetails.slice(1)
      },
      "Emissions in Employee commute": {
        annual: this.employeeData?.employeeCommutingEmission[0],
        monthly: this.employeeData?.employeeCommutingEmission.slice(1)
      },
      "Total no. of working days": {
        annual: this.employeeData?.employeeCommutingWorkingDays[0],
        monthly: this.employeeData?.employeeCommutingWorkingDays.slice(1)
      },
      "Emissions in waste treatment": {
        annual: this.waste_emissions[0],
        monthly: this.waste_emissions.slice(1)
      }, "Waste Generated": {
        annual: this.wasteDisposed[0],
        monthly: this.wasteDisposed.slice(1)

      }, "Waste Diverted": {
        annual: this.diverted_emssion[0],
        monthly: this.diverted_emssion.slice(1)
      },
      "Water Discharged": {
        annual: this.waterData?.waterDischarge[0],
        monthly: this.waterData?.waterDischarge.slice(1)
      },
      "Water Usage": {
        annual: this.waterData?.waterWithdrawal[0],
        monthly: this.waterData?.waterWithdrawal.slice(1)
      },
      "Water Treated": {
        annual: this.waterData?.waterTreatment[0],
        monthly: this.waterData?.waterTreatment.slice(1)
      }, "Emissions in water treatment": {
        annual: this.waterData?.waterEmission[0],
        monthly: this.waterData?.waterEmission.slice(1)
      },
      "Heating + Cooling": {
        annual: this.energyDataHeating[0],
        monthly: this.energyDataHeating.slice(1)
      }, "Electricity": {
        annual: this.electricityData[0],
        monthly: this.electricityData.slice(1)
      },
      "Total Energy Consumed": {
        annual: this.totalEnergyConsumed[0],
        monthly: this.totalEnergyConsumed.slice(1)
      },
      "Renewable Electricity": {
        annual: this.renewElectricityData[0],
        monthly: this.renewElectricityData.slice(1)
      }, "fuel1": {
        id: this.selectedFuel1,
        annual: this.fuelData1[0],
        monthly: this.fuelData1.slice(1)
      },
      "fuel2": {
        id: this.selectedFuel2,
        annual: this.fuelData2[0],
        monthly: this.fuelData2.slice(1)
      },
      "fuel3": {
        id: this.selectedFuel3,
        annual: this.fuelData3[0],
        monthly: this.fuelData3.slice(1)
      },
      "Total Fuel Consumption": {
        annual: this.totalFuelConsumed[0],
        monthly: this.totalFuelConsumed.slice(1)
      },
      "Fuel Stationary": {
        annual: this.fuelStationary[0],
        monthly: this.fuelStationary.slice(1)
      },
      "Total Output": {
        annual: this.grandOutput,
        monthly: this.totalOutput
      },
      "Total Revenue (in Mn)": {
        annual: this.grandRevenue,
        monthly: this.totalRevenue
      },
      "No. of Employees": {
        annual: this.generalData?.noOfEmployee[0] || null,
        monthly: this.generalData?.noOfEmployee.slice(1)
      },
      "No. of vehicles (Diesel)": {
        annual: this.generalData?.noOfDieselVehicles[0],
        monthly: this.generalData?.noOfDieselVehicles.slice(1)
      },
      "No. of vehicles (Petrol)": {
        annual: this.generalData?.noOfDieselVehicles[0],
        monthly: this.generalData?.noOfDieselVehicles.slice(1)
      }, "Total vehicles": {
        annual: this.generalData?.totalVehicles[0],
        monthly: this.generalData?.totalVehicles.slice(1)
      },
      "Total Emission Purchase Goods & Services": {
        annual: this.generalData?.purchaseGoodsAndServices[0],
        monthly: this.generalData?.purchaseGoodsAndServices.slice(1)
      }, "Total Area": {
        annual: this.generalData?.total_area[0],
        monthly: this.generalData?.total_area.slice(1)
      }, "Energy Ref Area": {
        annual: this.generalData?.energy_ref_area[0],
        monthly: this.generalData?.energy_ref_area.slice(1)
      }, "Total Emission Purchase Items Per Amount": {
        annual: this.generalData?.purchaseGoodsAndServicesValueQuantity[0],
        monthly: this.generalData?.purchaseGoodsAndServicesValueQuantity.slice(1)
      }

    }
    const formData = new URLSearchParams();
    formData.append('facility_id', this.selectedFacility);
    formData.append('year', this.year);
    formData.append('jsonData', JSON.stringify(kpiData));


    this.appService.postAPI(`/addKpiInventory`, formData).subscribe((response: any) => {
      if (response.success) {
        this.notification.showSuccess(
          'Inventory saved successfully',
          'Success'
        );
        // this.generalData = response.data

      }
    })

  };

  retrieveFreshData() {
    this.spinner.show();
    if (!this.year) {
      return
    }
    if (!this.selectedFacility) {
      return
    }
    this.selectedFuel1 = 2;
    this.selectedFuel2 = 3;
    this.selectedFuel3 = 4;
    this.getTopsFuels(this.selectedFacility, this.year);
    this.getKPiScopes();
  
    this.getEnergyEmissions();
    this.getPassengerTypeEmissions();
    this.getVehiclesEmissions();
    this.getBusinessTravel();
    this.getEmployeeComminuty();
    this.getWasteGeneration();
    this.getWaterSupply();
    this.getGeneralData();

  };



  retrieveSavedData() {
    this.spinner.show()
    if (!this.year) {
      return
    }
    if (!this.selectedFacility) {
      return
    }
    const formData = new URLSearchParams();
    formData.append('facility_id', this.selectedFacility);
    formData.append('year', this.year);

    this.appService.postAPI(`/getKpiInventoryByFacilityIdAndYear`, formData).subscribe((response: KpiInventoryResponse) => {
      if (response.success == true) {
        this.spinner.hide();
        this.user_name = response.user_name;
        this.updated_at = response.updated_at;
        this.scope1 = response.data['Scope 1']?.monthly || [];
        this.scope2 = response.data['Scope 2']?.monthly;
        this.scope3 = response.data['Scope 3']?.monthly;
        this.scope1Total = response.data['Scope 1'].annual;
        this.scope2Total = response.data['Scope 2'].annual;
        this.scope3Total = response.data['Scope 3'].annual;
        this.totalEmissions = response.data['Total Emissions'].monthly;
        this.totalAnually = response.data['Total Emissions'].annual;
        this.energyDataHeating = [response.data['Heating + Cooling'].annual, ...response.data['Heating + Cooling'].monthly];
        this.electricityData = [response.data['Electricity'].annual, ...response.data['Electricity'].monthly];
        this.renewElectricityData = [response.data['Renewable Electricity'].annual, ...response.data['Renewable Electricity'].monthly];
        this.passenderDiesel = [response.data['Owned Passenger Vehicle Emiss. - Diesel'].annual, ...response.data['Owned Passenger Vehicle Emiss. - Diesel'].monthly];
        this.passengerPetrol = [response.data['Owned Passenger Vehicle Emiss. - Petrol'].annual, ...response.data['Owned Passenger Vehicle Emiss. - Petrol'].monthly];
        this.total_vehicle_passenger = [response.data['Total Owned Passenger Vehicle Emiss.'].annual, ...response.data['Total Owned Passenger Vehicle Emiss.'].monthly];
        this.vehiclesOwnedEmission = [response.data['Owned Transport Vehicle Emiss.'].annual, ...response.data['Owned Transport Vehicle Emiss.'].monthly];
        this.vehiclesFreightEmission = [response.data['Owned Freight Vehicle Emiss.'].annual, ...response.data['Owned Freight Vehicle Emiss.'].monthly]
        this.businessTravelData['flightTravelDetails'] = [response.data['Emissions in Flight travel'].annual, ...response.data['Emissions in Flight travel'].monthly]
        this.businessTravelData['othermodesOfTransportDetails'] = [response.data['Emissions in Other mode of travel'].annual, ...response.data['Emissions in Other mode of travel'].monthly]
        this.businessTravelData['hotelstayDetails'] = [response.data['Emissions in Hotel stay'].annual, ...response.data['Emissions in Hotel stay'].monthly]
        this.employeeData.employeeCommutingEmission = [response.data['Emissions in Employee commute'].annual, ...response.data['Emissions in Hotel stay'].monthly]
        this.employeeData.employeeCommutingWorkingDays = [response.data['Total no. of working days'].annual, ...response.data['Total no. of working days'].monthly]
        this.wasteDisposed = [response.data['Water Discharged'].annual, ...response.data['Water Discharged'].monthly]
        this.diverted_emssion = [response.data['Waste Diverted'].annual, ...response.data['Waste Diverted'].monthly]
        this.waste_emissions = [response.data['Waste Generated'].annual, ...response.data['Waste Generated'].monthly]
        this.waterData.waterDischarge = [response.data['Water Discharged'].annual, ...response.data['Water Discharged'].monthly];
        this.waterData.waterWithdrawal = [response.data['Water Usage'].annual, ...response.data['Water Usage'].monthly];
        this.waterData.waterTreatment = [response.data['Water Treated'].annual, ...response.data['Water Treated'].monthly];
        this.waterData.waterEmission = [response.data['Emissions in water treatment'].annual, ...response.data['Emissions in water treatment'].monthly];
        this.totalOutput = [...response.data['Total Output'].monthly];
        this.totalRevenue = [...response.data['Total Revenue (in Mn)'].monthly];
        this.generalData.noOfEmployee = [response.data['No. of Employees'].annual, ...response.data['No. of Employees'].monthly];

        this.grandOutput = response.data['Total Output'].annual;
        this.grandRevenue = response.data['Total Revenue (in Mn)'].annual;
        this.selectedFuel1 = response.data['fuel1'].id;
        this.selectedFuel2 = response.data['fuel2'].id;
        this.selectedFuel3 = response.data['fuel3'].id;
        this.fuelData1 = [response.data['fuel1'].annual, ...response.data['fuel1'].monthly];
        this.fuelData2 = [response.data['fuel2'].annual, ...response.data['fuel2'].monthly];
        this.fuelData3 = [response.data['fuel3'].annual, ...response.data['fuel3'].monthly];
        this.totalFuelConsumed = [response.data['Total Fuel Consumption'].annual, ...response.data['Total Fuel Consumption'].monthly];
        this.fuelStationary = [response.data['Fuel Stationary'].annual, ...response.data['Fuel Stationary'].monthly];
        this.generalData.noOfDieselVehicles = [response.data['No. of vehicles (Diesel)'].annual, ...response.data['No. of vehicles (Diesel)'].monthly];
        this.generalData.noOfPetrolVehicles = [response.data['No. of vehicles (Petrol)'].annual, ...response.data['No. of vehicles (Petrol)'].monthly];
        this.generalData.totalVehicles = [response.data['Total vehicles'].annual, ...response.data['Total vehicles'].monthly];
        this.generalData.purchaseGoodsAndServices = [response.data['Total Emission Purchase Goods & Services'].annual, ...response.data['Total Emission Purchase Goods & Services'].monthly];
        this.generalData.total_area = [response.data['Total Area'].annual, ...response.data['Total Area'].monthly];
        this.generalData.energy_ref_area = [response.data['Energy Ref Area'].annual, ...response.data['Energy Ref Area'].monthly];
        this.generalData.purchaseGoodsAndServicesValueQuantity = [response.data['Total Emission Purchase Items Per Amount'].annual, ...response.data['Total Emission Purchase Items Per Amount'].monthly];
        // this.generalData.waterEmission = [response.data['Waste Generated'].annual , ...response.data['Waste Generated'].monthly];
        // this.totalEnergyArea = [response.data['tot'].annual , ...response.data['Waste Generated'].monthly];

        // this.generalData = response.data

      } else {
        this.spinner.hide()
        this.notification.showInfo('Saved Data Not Found', '')
        this.scope1 = [];
        this.scope2 = [];
        this.scope3 = [];
        this.scope1Total = 0;
        this.scope2Total = 0;
        this.scope3Total = 0;
        this.totalEmissions = Array(12).fill(0);
        this.totalAnually = 0;
        this.energyDataHeating = [];
        this.electricityData = [];
        this.renewElectricityData = [];
        this.passenderDiesel = [];
        this.passengerPetrol = [];
        this.total_vehicle_passenger = [];
        this.vehiclesOwnedEmission = [];
        this.vehiclesFreightEmission = []
        this.businessTravelData['flightTravelDetails'] = []
        this.businessTravelData['othermodesOfTransportDetails'] = []
        this.businessTravelData['hotelstayDetails'] = []
        this.employeeData.employeeCommutingEmission = []
        this.employeeData.employeeCommutingWorkingDays = []
        this.wasteDisposed = []
        this.diverted_emssion = []
        this.waste_emissions = []
        this.waterData.waterDischarge = [];
        this.waterData.waterWithdrawal = [];
        this.waterData.waterTreatment = [];
        this.waterData.waterEmission = [];
        this.totalOutput = Array(12).fill(null);;
        this.totalRevenue = Array(12).fill(null);;
        this.grandOutput = 0;
        this.grandRevenue = 0;
        this.generalData.noOfEmploye = [];
        this.generalData.noOfDieselVehicles = [];
        this.generalData.noOfPetrolVehicles = [];
        this.generalData.totalVehicles = [];
        this.generalData.purchaseGoodsAndServices = [];
        this.generalData.total_area = [];
        this.generalData.energy_ref_area = [];
        this.generalData.purchaseGoodsAndServicesValueQuantity = [];
        this.selectedFuel1 = null;
        this.selectedFuel2 = null;
        this.selectedFuel3 = null;
        this.fuelData1 = [];
        this.fuelData2 = [];
        this.fuelData3 = [];
      }
    })

  };


  onYearChange(event: any) {
    this.year = event.getFullYear();
    if (this.year == this.currentYear) {
      this.inputDisabled = true;
    } else {
      this.inputDisabled = false;
    }

  };

}



