import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-processing-sold-products',
  standalone: true,
 imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, FileUploadModule],
  templateUrl: './processing-sold-products.component.html',
  styleUrls: ['./processing-sold-products.component.scss']
})
export class ProcessingSoldProductsComponent {
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  isSubmitting = false;
  year: string;
  months: string;
  intermediateGoods: any[] = [];
goodsId: number;
  selectedGoodsCategory: any;
  onActivitySelected: boolean;
  onIndustrySelected: boolean;
  OthersSecledted: boolean;
  productActivitySubTypes: any;
processing_acitivity: any;
  activitySubTypes: any;
sub_sector: any;
  rowsPurchased: {
    id: number; multiLevelItems: any[]; productService: any; productType: any; subVehicleCategory: any[]; // Add any other nested dropdown arrays here if needed
    months: string; quantity: string; selectedUnit: string; vendorName: string; vendorspecificEF: string; vendorspecificEFUnit: string; // Make sure to initialize this as well
  }[];
  currency: any;
  purchaseGoodsUnitsGrid: any;
processingUnit: any;
franchiseMethod: any;
calculationPurchaseGrid =
            [
                {
                    "id": 1,
                    "calculationmethod": "Average data method"
                },
                {
                    "id": 2,
                    "calculationmethod": "Site Specific method"
                }
            ]
calculationMethod: any;
  franchiseMethodValue: any;
  averageMethod: boolean = true;


    constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService) {
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

    ngOnInit() {
        this.getIntermediateCategory();
        this.getCurrency();
    }

        getIntermediateCategory() {
        this.appService.getApi('/getintermediateCategory').subscribe({
            next: (response) => {
                // // // console.log(response);
                if (response.success == true) {
                    this.intermediateGoods = response.categories;
                    

                }
            }
        })
    };

    
    onpurchaseGoodsCategoryChange(event: any) {
      
        const energyMethod = event.value;
        this.selectedGoodsCategory = event.value
        this.onActivitySelected = false;
        if (energyMethod == 'Other') {
            this.onIndustrySelected = false;
            this.OthersSecledted = true;
            return;
        }

        this.onIndustrySelected = true;
        this.getProcessingActivityCategory(energyMethod);
    };

      getProcessingActivityCategory(industry: any) {
        let formData = new URLSearchParams();

        formData.set('industry', industry);
        this.appService.postAPI('/getsectorCategory', formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.productActivitySubTypes = response.categories;

                }
            }
        })
    };

    
    onpurchaseActivityChange(event: any) {
        const energyMethod = event.value;
        this.onActivitySelected = true;
        this.getActivitySubCategory(energyMethod);

    };
    getActivitySubCategory(sector: any) {
        let formData = new URLSearchParams();

        formData.set('sector', sector);
        this.appService.postAPI('/getsubsectorCategory', formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.activitySubTypes = response.categories;

                }
            }
        })
    };

      getCurrency() {
        this.purchaseGoodsUnitsGrid = [];
        const formdata = new URLSearchParams();
        formdata.set('facilities', this.facilityID.toString());
        this.appService.postAPI('/getcurrencyByfacilities', formdata).subscribe({
            next: (response) => {
                // // // console.log(response);
                if (response.success == true) {
                    this.currency = response.categories;
                    this.purchaseGoodsUnitsGrid.push({ id: 1, units: this.currency })
                    const concatUnits =
                        [
                            {
                                "id": 2,
                                "units": "kg"
                            },
                            {
                                "id": 3,
                                "units": "tonnes"
                            },
                            {
                                "id": 4,
                                "units": "litres"
                            }
                        ]

                    this.purchaseGoodsUnitsGrid = this.purchaseGoodsUnitsGrid.concat(concatUnits);
                };
                this.rowsPurchased = [{
                    id: 1,
                    multiLevelItems: [],
                    productService: null,
                    productType: null,
                    subVehicleCategory: [],  // Add any other nested dropdown arrays here if needed
                    months: '',
                    quantity: '',
                    selectedUnit: '',
                    vendorName: '',
                    vendorspecificEF: '',
                    vendorspecificEFUnit: `kgCO2e/${this.currency}` // Make sure to initialize this as well
                }];
            }
        })
    };

    
    onCalculationPurchaseMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;
        if (calMethod == 'Site Specific method') {
            this.franchiseMethod = true;
            this.averageMethod = false
        } else {
            this.franchiseMethod = false;
            this.averageMethod = true
        }
    };

  EntrySave(form: any) {
 
            
    this.isSubmitting = true;
            let formData = new URLSearchParams();
            if (this.selectedGoodsCategory == 'Other') {
                if (this.averageMethod == true) {
                    formData.set('month', this.months);
                    formData.set('year', this.year);
                    formData.set('intermediate_category', this.selectedGoodsCategory);
                    formData.set('processing_acitivity', this.processing_acitivity);
                    formData.set('sub_activity', this.sub_sector);
                    formData.set('other_emission', form.value.emission_factor);
                    formData.set('other', '1');
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    // formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', '1');
                    formData.set('facilities', this.facilityID.toString());

                } else if (this.franchiseMethod == true) {
                    formData.set('month', this.months);
                    formData.set('year', this.year);
                    formData.set('intermediate_category', this.selectedGoodsCategory);
                    formData.set('processing_acitivity', this.processing_acitivity);
                    formData.set('sub_activity', this.sub_sector);
                    formData.set('other_emission', form.value.emission_factor);
                    formData.set('other', '1');
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('scope1emissions', form.value.scope1_emission);
                    formData.set('scope2emissions', form.value.scope2_emission);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', '1');
                    formData.set('facilities', this.facilityID.toString());
                }

            } else if (this.selectedGoodsCategory != 'Other') {
                if (this.averageMethod == true) {
                  console.log('average method');
                    formData.set('month', this.months);
                    formData.set('year', this.year);
                    formData.set('intermediate_category', this.selectedGoodsCategory);
                    formData.set('processing_acitivity', this.processing_acitivity);
                    formData.set('sub_activity', this.sub_sector);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    // formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', '1');
                    formData.set('facilities', this.facilityID.toString());

                } else if (this.franchiseMethod == true) {
                    formData.set('month', this.months);
                    formData.set('year', this.year);
                    formData.set('intermediate_category', this.selectedGoodsCategory);
                    formData.set('processing_acitivity', this.processing_acitivity);
                    formData.set('sub_activity', this.sub_sector);
                    formData.set('calculation_method', this.franchiseMethodValue);
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('scope1emissions', form.value.scope1_emission);
                    formData.set('scope2emissions', form.value.scope2_emission);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', '1');
                    formData.set('facilities', this.facilityID.toString());

                }
            }



            this.appService.postAPI('/Addprocessing_of_sold_productsCategory', formData).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();



                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );


                    }
                    this.isSubmitting = false;
                   
                },
                error: (err) => {
                    this.isSubmitting = false;
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => { }
            })
        
  };



  
}

