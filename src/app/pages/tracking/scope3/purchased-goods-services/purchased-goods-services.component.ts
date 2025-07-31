import { Component, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '@/shared/submit-button/submit-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { DefaultTreeviewI18n, OrderDownlineTreeviewEventParser, TreeviewConfig, TreeviewEventParser, TreeviewI18n, TreeviewItem, TreeviewModule } from '@treeview/ngx-treeview';
import { LoginInfo } from '@/models/loginInfo';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { DownloadFileService } from '@services/download-file.service';
import { ToastModule } from 'primeng/toast';
import { environment } from 'environments/environment';
import { DialogModule } from "primeng/dialog";
declare var $: any;
@Component({
  selector: 'app-purchased-goods-services',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, SubmitButtonComponent, TabViewModule, TreeviewModule, FileUploadModule, ToastModule, DialogModule],
  providers: [
    { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    { provide: TreeviewI18n, useClass: DefaultTreeviewI18n },
    { provide: TreeviewConfig, useValue: TreeviewConfig.create({ hasFilter: true }) } // ✅ Add this
  ],
  templateUrl: './purchased-goods-services.component.html',
  styleUrls: ['./purchased-goods-services.component.scss']
})
export class PurchasedGoodsServicesComponent {
  APIURL: string = environment.baseUrl;
  @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  facilityID: number;
  facilityCountryCode: string;
  isHowtoUse = false;
  subCategoryID: number = 1;
  fuelType: [] = [];
  units: any[] = [];
  fuelId: number = 0;
  isSubmitting = false;
  year: any;
  months: string;
  singlePGSTab: boolean = true;
  progressPSGTab: boolean = false;
  productHSNSelect: any;
  purchaseProductTypes: any[] = [];
  purchaseHSNCode: any[] = [];
  annualMonths: boolean = false;
  annualEntry: any[] = [
    { name: 'Yes', value: 1 },
    { name: 'No', value: 0 },
  ];
  isAnnual: any
  rowsPurchased: any[] = [];
  multiLevelItems: TreeviewItem[] = [];
  purchaseGoodsUnitsGrid: any[] = [];
  vendorList: any[] = [];
  currency: any;
  newExcelData: any[] = []
  psg_ai_progress_data: any;
  public loginInfo: LoginInfo;
  selectedFile: File;
  dataEntriesPending: any[] = [];
  categoryId: number;
  convertedYear: string;
  jsonData: any[] = [];
  downloadExcelUrl: string;
  productID: any;
  visible2 = false;
  hideMatchButon: boolean = false;
  psg_product: any;
  productsExcelData = [
    { category: 'Sports Teams and Clubs', expiryDate: '25-10-2025', quantity: 50, currency: 'INR', brand: 'Samsung', price: 2.00, status: 'Matched', isEditing: false },
    { category: 'Electronics', expiryDate: '30-12-2025', quantity: 100, currency: 'USD', brand: 'Sony', price: 5.00, status: 'Unmatched', isEditing: false }
  ];
  uploadButton = false;
  superAdminID: number;
  allPRoducts: any;
  monthsTable: any[] = [
    { name: 'Jan', value: 'Jan' },
    { name: 'Feb', value: 'Feb' },
    { name: 'Mar', value: 'Mar' },
    { name: 'Apr', value: 'Apr' },
    { name: 'May', value: 'May' },
    { name: 'June', value: 'Jun' },
    { name: 'July', value: 'Jul' },
    { name: 'Aug', value: 'Aug' },
    { name: 'Sep', value: 'Sep' },
    { name: 'Oct', value: 'Oct' },
    { name: 'Nov', value: 'Nov' },
    { name: 'Dec', value: 'Dec' }
];
  constructor(private facilityService: FacilityService, private notification: NotificationService, private appService: AppService, private spinner: NgxSpinnerService, private downloadFileService: DownloadFileService) {
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

  ngOnInit(): void {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;

      let tenantID = this.loginInfo.tenantID;
      this.superAdminID = this.loginInfo.super_admin_id;
    }
    // this.loginInfo = this.facilityService.getLoginInfo();
    // this.getsubCategoryType(this.subCategoryID);
    // this.getUnit(this.subCategoryID);
    this.GetHSN();
    this.GetVendors();

    this.getPurchaseGoodsCurrency()
    this.downloadExcelUrl = this.APIURL + `/get-excelsheet?facility_id=${this.facilityID}&tenantID=${this.loginInfo.super_admin_id}`;
    // this.currency = this.facilityService.getCurrency();
  };


  EntrySave(dataEntryForm: NgForm) {


    if (this.singlePGSTab) {

      const filledRows = this.rowsPurchased.filter(row =>

        row.productType == null
      );

      if (filledRows.length > 0) {
        this.notification.showInfo(
          "Please select product service code",
          'Warning'
        );
        return;
      }
      if (this.isAnnual == undefined || this.isAnnual == null) {
        this.notification.showInfo(
          "Please select annual entry",
          'Warning'
        );
        return;
      }


      // Prepare the payload
      const payload = this.rowsPurchased.map(row => ({
        month: row.months,
        typeofpurchase: row.productService,
        valuequantity: row.quantity,
        unit: row.selectedUnit,
        vendorId: row.vendorName?.id,
        vendor: row.vendorName?.name,
        vendorunit: row.vendorspecificEFUnit,
        vendorspecificEF: row.vendorspecificEF,
        product_category: row.productType
      }));

      var purchaseTableStringfy = JSON.stringify(payload)

      var formData = new FormData();
      // formData.set('month', monthString);
      formData.set('year', this.year);
      formData.set('productcodestandard', this.productHSNSelect);
      formData.set('is_annual', this.isAnnual);
      formData.set('facilities', this.facilityID.toString());
      formData.set('jsonData', purchaseTableStringfy);
      formData.set('month', this.months);
      if (this.selectedFile) {
        formData.set('file', this.selectedFile, this.selectedFile.name);
      }

      this.appService.postAPI('/purchaseGoods', formData).subscribe({
        next: (response: any) => {

          if (response.success == true) {
            this.notification.showSuccess(
              response.message,
              'Success'
            );
            this.dataEntryForm.reset();
            // this.rowsPurchased.forEach(levels => {
            //     levels.productType = null
            //     this.deselectAllItems(levels.multiLevelItems)
            // })


            // this.rowsPurchased = [{
            //     id: 1,
            //     multiLevelItems: [],
            //     productService: null,
            //     productType: null,
            //     subVehicleCategory: [],  
            //     months: '',
            //     quantity: '',
            //     selectedUnit: '',
            //     vendorName: '',
            //     vendorspecificEF: '',
            //     vendorspecificEFUnit: `kgCO2e/${this.currency}` 
            // }];

            // this.GetHSN();
          } else {
            this.notification.showError(
              response.message,
              'Error'
            );

          }
        },
        error: (err) => {
          this.notification.showError(
            'Data entry added failed.',
            'Warning'
          );
          console.error('errrrrrr>>>>>>', err);
        },
        complete: () => { }
      });
    } else {

      const payload = this.newExcelData.filter(row => row.is_find == true && (row.productResult.other_category_flag == '0' || row.productResult.other_category_flag == '')).map(row => ({
        month: '',
        typeofpurchase: row.productResult.typeofpurchase,
        valuequantity: row['Value / Quantity'],
        unit: row['Unit'],
        vendorId: '',
        vendor: row['Vendor'],
        vendorunit: row['Vendor Specific Unit'],
        vendorspecificEF: row['Vendor Specific EF'],
        product_category: row.productResult?.id,
        product_description: row['Product / Service Description'],
        purchase_date: row['Purchase Date'],
        productcode: row.code,
        is_find: row.is_find,
        product_name: row.productResult?.product
      }))


      var purchaseTableStringfy = JSON.stringify(payload);
      var formData = new FormData();

      formData.set('productcodestandard', this.productHSNSelect);
      formData.set('facilities', this.facilityID.toString());
      formData.set('jsonData', purchaseTableStringfy);
      formData.set('is_annual', '0');
      formData.set('tenant_id', this.loginInfo.tenantID.toString());
      formData.set('super_tenant_id', this.superAdminID.toString());


      if (this.selectedFile) {
        formData.set('file', this.selectedFile, this.selectedFile.name);
      }
      this.appService.postAPI('/bulk-purchase-goods-upload', formData).subscribe({
        next: (response: any) => {

          if (response.success == true) {
            this.notification.showSuccess(
              response.message,
              'Success'
            );
            this.newExcelData = [];
            this.GetHSN();
            this.resetForm();


          } else {
            this.notification.showError(
              response.message,
              'Error'
            );

          }
        },
        error: (err) => {
          this.notification.showError(
            'Data entry added failed.',
            'Error'
          );
          console.error('errrrrrr>>>>>>', err);
        },
        complete: () => { }
      });
    }



  };

  bulkUploadPG() {
    this.progressPSGTab = false;
    this.singlePGSTab = !this.singlePGSTab
  }

  onProductHSNChange(event: any) {

    const selectedIndex = event.value;
    this.productHSNSelect = selectedIndex
    this.GetStandardType(this.productHSNSelect)
    // this.getSubEmployeeCommuTypes(selectedIndex, row)
  }

  GetStandardType(typeID) {

    this.appService.getApi(`/getTypesofpurchase/${typeID}`).subscribe({
      next: (response: any) => {
        if (response.success == true) {
          this.purchaseProductTypes = response.categories;
        }
      },
      error: (err) => {
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    });
  };


  onAnnualChange(event: any) {
    const selectedIndex = event.value;
    if (selectedIndex == '0') {
      this.annualMonths = false
    } else {
      this.annualMonths = true
    }
  }

  onProductStandardChange(event: any, row: any) {
    // // console.log(event.value);
    const selectedIndex = event.value;
    this.getProductPurchaseItems(selectedIndex, row)
    // this.getSubEmployeeCommuTypes(selectedIndex, row)
  }

  getProductPurchaseItems(standardType, row: any) {
    let formData = new URLSearchParams();

    formData.set('product_code_id', this.productHSNSelect);
    formData.set('typeofpurchase', standardType);
    formData.set('country_id', this.facilityCountryCode);
    formData.set('year', this.year.toString());

    this.appService.postAPI('/purchaseGoodsAllcategories', formData.toString()).subscribe({
      next: (response: any) => {

        if (response.success == true) {

          // row.multiLevelItems = this.getTreeData();
          row.multiLevelItems = response.categories.map(item => new TreeviewItem(item));
        }
      }
    })
  };

  onSelectedChange(event: any, row: any) {
    this.deselectAllItems(row.multiLevelItems);

    if (!event.children && event.length === 1) {
      event.checked = true;
      row.productType = event[0].item.value;
    } else {
      this.deselectAllItems(event);
      row.productType = null;

    }
    this.updatePlaceholder();
  }

  deselectAllItems(items: TreeviewItem[]) {
    items.forEach(item => {

      item.checked = false;
      if (item.children) {
        this.deselectAllItems(item.children);
      }
    });
  };

  updatePlaceholder() {
    const selectedItems = this.multiLevelItems.filter(item => item.checked);
    const placeholder = selectedItems.length > 0 ? `${selectedItems.length} options` : 'Choose product type';
    // // console.log('Placeholder:', placeholder);
  };

  onUnitChange(row) {
    row.vendorspecificEFUnit = 'kgCO2e/' + row.selectedUnit;
  }

  addPurchaseRows() {
    this.rowsPurchased.push({ id: this.rowsPurchased.length + 1, multiLevelItems: [], productService: null, productType: null, months: '', quantity: '', selectedUnit: '', vendorName: '', vendorspecificEF: '', vendorspecificEFUnit: `kgCO2e/${this.currency}` });
  };

  onProductHSNChange2(event: any) {

    const selectedIndex = event.value;
    this.productHSNSelect = selectedIndex
    if (this.productHSNSelect == 1) {
      this.newExcelData = this.newExcelData.map(items => ({
        ...items, // Keep all existing properties
        code: items.productResult?.HSN_code // Add new 'code' key, ensuring 'productResult' exists
      }));
    } else if (this.productHSNSelect == 2) {
      this.newExcelData = this.newExcelData.map(items => ({
        ...items, // Keep all existing properties
        code: items.productResult?.NAIC_code // Add new 'code' key, ensuring 'productResult' exists
      }));
    } else {
      this.newExcelData = this.newExcelData.map(items => ({
        ...items, // Keep all existing properties
        code: items.productResult?.ISIC_code // Add new 'code' key, ensuring 'productResult' exists
      }));
    }
    // this.GetStandardType(this.productHSNSelect)
    // this.getSubEmployeeCommuTypes(selectedIndex, row)
  }

  openProgresstab() {
    this.singlePGSTab = !this.singlePGSTab
    this.progressPSGTab = true;

    const formdata = new URLSearchParams();
    formdata.set('facilityID', this.facilityID.toString());
    formdata.set('userId', this.loginInfo.Id.toString());
    this.appService.postAPI('/get-purchase-good-data-using-user-facilityId', formdata).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.psg_ai_progress_data = (response.data).sort((a, b) => b.id - a.id);
        } else {
          this.psg_ai_progress_data = [];
          this.notification.showWarning(response.message, '');
        }
      }
    })

  };

  submitUnmatchWithAI() {
    if (this.newExcelData.length == 0) return
    this.spinner.show();
    const payload = this.newExcelData.map(row => ({
      month: '',
      product_description: row['Product Description'],
      product_category: row['Product Category'],
      value: row['Value / Quantity'],
      unit: row['Unit'],
      vendor_name: row['Vendor'],
      vendorunit: row['Vendor Specific Unit'],
      vendor_ef: row['Vendor Specific EF'],
      match_productCategory_Id: row.productResult?.id,
      purchase_date: row['Purchase Date'],
      product_code: row.code,
      is_find: row.is_find,
      facilityID: this.facilityID,
      product_name: row.productResult?.product
    }))
    console.log("payload", payload);
    var purchaseTableStringfy = JSON.stringify(payload);

    let formData = new URLSearchParams();

    // formData.set('productcodestandard', this.productHSNSelect);
    formData.set('facility_id', this.facilityID.toString());
    formData.set('jsonData', purchaseTableStringfy);
    formData.set('user_id', this.loginInfo.Id.toString());
    formData.append('filename', this.selectedFile.name); // Append file

    this.appService.postAPI('/add-purchase-goods-match-unmatch-data', formData).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.notification.showSuccess(
            response.message,
            'Success'
          );
          this.triggerAIProcess();
          this.openProgresstab();
          this.newExcelData = [];


          this.GetHSN();
          // this.deselectAllItems(this.rowsPurchased)

          this.resetForm();


        } else {
          this.notification.showError(
            response.message,
            'Error'
          );

        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.notification.showError(
          'Data entry added failed.',
          'Error'
        );
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    });
  };

  triggerAIProcess() {
    this.appService.getApi2('/trigger-call').subscribe({
      next: (Response) => {
        if (Response) {

        }
        else {

        }
      }
    })
  };

  GetHSN() {

    this.appService.getApi('/getpurchaseproduct_code').subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.purchaseHSNCode = response.categories;
          this.productHSNSelect = this.purchaseHSNCode[0].id;
          this.GetStandardType(this.productHSNSelect)
        }
      },
      error: (err) => {
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    });
  };

  resetForm() {
    this.dataEntryForm.resetForm();
    this.fileUpload.clear();
    this.selectedFile = null;
  }



  onPurchaseGoodsUpload(event: any, fileUpload: any) {

    const file = event[0];
    if (!file) return;
    this.spinner.show();
    this.selectedFile = event[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Read first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      this.jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Convert array to key-value pairs
      this.jsonData = this.convertToKeyValue(this.jsonData);
      const filteredJson = this.jsonData.filter((item: any) => item['Product Description'] !== '');

      if (filteredJson.length > 0) {
        this.newExcelData = filteredJson.map(items => ({
          ...items,
          is_find: false,
          code: '',
          productResult: {
            ...items.productResult,
            id: '',
            typeofpurchase: '',
            product: '',
            typesofpurchasename: '',
            HSN_code: '',
            NAIC_code: '',
            ISIC_code: ''
          }

        }));
        this.spinner.hide();
      } else {
        this.sendJSON(this.jsonData);
      }

      // setTimeout(() => {
      //     fileUpload.clear();
      // }, 1000);

    };
    reader.readAsArrayBuffer(file);
  };

  convertToKeyValue(data: any[]): any[] {
    if (data.length < 2) return [];

    const headers = data[0]; // Extract headers
    return data.slice(1).map((row) => {
      let obj: any = {};
      headers.forEach((header: string, index: number) => {
        let value = row[index] || '';

        // Convert Excel date serial number to readable date
        if (header.includes('Date') && typeof value === 'number') {
          value = XLSX.SSF.format('dd-mm-yyyy', value); // Converts to "dd-mm-yyyy"
        }

        obj[header] = value;
      });
      return obj;
    });
  }

  sendJSON(jsonData: any) {
    const json = jsonData.filter((item: any) => item['Product Description'] !== '');

    const jsonDataString = JSON.stringify(json);
    const formData = new URLSearchParams();
    formData.append('product', jsonDataString);
    formData.append('country_code', this.facilityCountryCode);
    formData.append('year', this.year.getFullYear().toString());

    this.appService.postAPI('/get-purchase-categories-ef', (formData)).subscribe({
      next: (response: any) => {
        if (response.success == true) {
          let res = response;
          const sortedArray = res.data.sort((a, b) => Number(b.is_find) - Number(a.is_find));
          // console.log(sortedArray);
          if (this.productHSNSelect == 1) {
            this.newExcelData = sortedArray.map(items => ({
              ...items, // Keep all existing properties
              code: items.productResult?.HSN_code // Add new 'code' key, ensuring 'productResult' exists
            }));
          } else if (this.productHSNSelect == 2) {
            this.newExcelData = sortedArray.map(items => ({
              ...items, // Keep all existing properties
              code: items.productResult?.NAIC_code // Add new 'code' key, ensuring 'productResult' exists
            }));
          } else {
            this.newExcelData = sortedArray.map(items => ({
              ...items, // Keep all existing properties
              code: items.productResult?.ISIC_code // Add new 'code' key, ensuring 'productResult' exists
            }));
          }


        }
        this.spinner.hide();

      },
      error: (err) => {
        this.spinner.hide();
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    });
  };

  downloadPurchaseGoodsExcel() {
    this.downloadFileService.downloadFile(this.downloadExcelUrl, 'Purchase Goods.xlsx');
  };

  toggleEdit(index: number, id: any, productmatch: any, finder: any) {
    this.getALlProducts();

    this.productID = id;
    this.visible2 = true;

    if (finder == '1' && productmatch == true) {
      this.hideMatchButon = true;
    }
    if (finder == 'delete') {
      this.deleteProduct(index);
    }
  }

  deleteProduct(index: number) {
    this.productsExcelData.splice(index, 1);
  }

  deletePSG(serialNo: number) {
    this.newExcelData = this.newExcelData.filter(item => item['S. No.'] !== serialNo);
  };

  getApproxTime(rows: number): string {
    const totalSeconds = rows * 2;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.ceil((totalSeconds % 3600) / 60); // round up minutes

    let timeString = '';
    if (hours > 0) timeString += `${hours} hr `;
    if (minutes > 0 || hours === 0) timeString += `${minutes} min`;

    return timeString.trim();
  };

  loadAIMatchData(id: any) {
    const formdata = new URLSearchParams();
    formdata.set('purchase_payload_id', id);
    this.appService.postAPI('/get-purchase-good-matched-data-using-payload-id', formdata).subscribe({
      next: (response: any) => {
        if (response.success == true) {

          this.newExcelData = response.data;
          this.progressPSGTab = false;
          this.singlePGSTab = !this.singlePGSTab;

        } else {
          this.newExcelData = [];
          this.notification.showWarning(response.message, '');
        }
      }
    })

  };

  refreshPSGStatus() {
    const formdata = new URLSearchParams();
    formdata.set('facilityID', this.facilityID.toString());
    formdata.set('userId', this.loginInfo.Id.toString());
    this.appService.postAPI('/get-purchase-good-data-using-user-facilityId', formdata).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.psg_ai_progress_data = (response.data).sort((a, b) => b.id - a.id);
          console.log(this.psg_ai_progress_data);

        } else {
          this.psg_ai_progress_data = [];
          this.notification.showWarning(response.message, '');
        }
      }
    })
  }

  onFileSelected(event: any) {

    const selectedFile = event[0];

    if (selectedFile) {
      //   this.uploadFiles(files); previous one 
      this.selectedFile = event[0];
      $(".browse-button input:file").change(function () {
        $("input[name='attachment']").each(function () {
          var fileName = $(this).val().split('/').pop().split('\\').pop();
          $(".filename").val(fileName);
          $(".browse-button-text").html('<i class="fa fa-refresh"></i> Change');
        });
      });
      this.uploadButton = true
    }
  };

  GetVendors() {

    this.appService.getApi(`/getVendorlist/${this.loginInfo.super_admin_id}`).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.vendorList = response.categories;
        }
      },
      error: (err) => {
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => { }
    });
  };

  getPurchaseGoodsCurrency() {
    this.purchaseGoodsUnitsGrid = [];
    const formdata = new URLSearchParams();
    formdata.set('facilities', this.facilityID.toString());
    this.appService.postAPI('/getcurrencyByfacilities', formdata).subscribe({
      next: (response: any) => {
        // // // console.log(response);
        if (response.success == true) {
          this.currency = response.categories;
          console.log(this.currency);
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

  getALlProducts() {
    const formData = new URLSearchParams();
    formData.set('country_code', this.facilityCountryCode);
    formData.set('year', this.year.toString());
    this.appService.postAPI('/get-all-purchase-categories-ef', formData).subscribe({
      next: (response: any) => {

        if (response.success == true) {
          this.allPRoducts = response.data;

        } else {
          this.allPRoducts = [];
        }
      }
    })
  };
  onAllProductChange() {


    this.newExcelData = this.newExcelData.map(item => {
      if (item['S. No.'] === this.productID) {
        // Determine the correct code value based on productHSNSelect
        let selectedCode;
        if (this.productHSNSelect === 1) {
          selectedCode = this.psg_product.HSN_code;
        } else if (this.productHSNSelect === 2) {
          selectedCode = this.psg_product.NAIC_code;
        } else {
          selectedCode = this.psg_product.ISIC_code;
        }

        return {
          ...item,
          code: selectedCode,
          is_find: true, // Assign the selected code
          productResult: {
            ...item.productResult, // Spread the existing productResult
            id: this.psg_product.id,
            typeofpurchase: this.psg_product.typeofpurchase,
            product: this.psg_product.product,
            typesofpurchasename: this.psg_product.typesofpurchasename,
            HSN_code: this.psg_product.HSN_code,
            NAIC_code: this.psg_product.NAIC_code,
            ISIC_code: this.psg_product.ISIC_code
          }
        };
      }
      return item;
    });


    setTimeout(() => {
      this.visible2 = false;
    }, 100);
  };

  changeStatus() {

    this.newExcelData = this.newExcelData.map(item => {
      if (item['S. No.'] === this.productID) {
        // Determine the correct code value based on productHSNSelect
        let selectedCode;

        return {
          ...item,
          code: '',
          is_find: false,
          productResult: {
            ...item.productResult, // Spread the existing productResult
            id: '',
            typeofpurchase: '',
            product: '',
            typesofpurchasename: '',
            HSN_code: '',
            NAIC_code: '',
            ISIC_code: ''
          }
        };
      }
      return item;
    });


    setTimeout(() => {
      this.visible2 = false;
    }, 100);
  };

  changeStatustoMatch() {

    this.newExcelData = this.newExcelData.map(item => {
      if (item['S. No.'] === this.productID) {
        // Determine the correct code value based on productHSNSelect
        let selectedCode;

        return {
          ...item,
          code: '',
          is_find: true,
          productResult: {
            ...item.productResult,
            other_category_flag: '0'

          }
        };
      }
      return item;
    });


    setTimeout(() => {
      this.visible2 = false;
      this.hideMatchButon = false;
    }, 100);
  };
}
