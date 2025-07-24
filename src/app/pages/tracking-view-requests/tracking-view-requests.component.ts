import { DataEntry } from '@/models/DataEntry';
import { PendingDataEntries } from '@/models/PendingDataEntry';
import { SendNotification } from '@/models/SendNotification';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { TrackingTable } from '@/models/TrackingTable';
import { ViewrequestTable } from '@/models/ViewrequestTable';
import { LoginInfo } from '@/models/loginInfo';
import { months } from '@/models/months';
import { Component, computed, effect, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { ManageDataPointCategories } from '@/models/TrackingDataPointCategories';
import { ManageDataPointCategory } from '@/models/ManageDataPointCategory';
import { StationaryCombustionDE, selectedObjectEntry } from '@/models/StationaryCombustionDE';
import { RefrigerantsDE } from '@/models/RefrigerantsDE';
import { FireExtinguisherDE } from '@/models/FireExtinguisherDE';
import { VehicleDE } from '@/models/VehicleDE';
import { ElectricityDE } from '@/models/ElectricityDE';
import { HeatandSteamDE } from '@/models/HeatandSteamDE';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { stat } from 'fs';

@Component({
    selector: 'app-tracking-view-requests',
    templateUrl: './tracking-view-requests.component.html',
    styleUrls: ['./tracking-view-requests.component.scss']
})

export class TrackingViewRequestsComponent {
    @ViewChild('dt1') dt!: Table;
    allSelected: boolean = false;
    status: ViewrequestTable[];
    facilityID;
    flag;
    modeShow = false;
 
    dataEntriesPending: PendingDataEntries[] = [];
    selectedEntry: PendingDataEntries[] = [];
    selectedScEntry: StationaryCombustionDE;
    selectedObjectEntry: selectedObjectEntry;
    selectedSendEntry: any[] = [];
 
    sendEntries: DataEntry[] = [];
    sendSCEntries: StationaryCombustionDE[] = [];
    sendApprovalEntries: any[] = [];

    public loginInfo: LoginInfo;
    Approver = environment.Approver;
    Preparer = environment.Preparer;
    Admin = environment.Admin;
    SuperAdmin = environment.SuperAdmin;
    Manager = environment.Manager;
  
    Pending = environment.pending;
    Rejected = environment.rejected;
    Approved = environment.approved;
 
    visible: boolean = false;
    reason: string;
    issended: boolean=false;
    year: Date;
    convertedYear: string;
    filteredStatus: any;
    months: months;
    sortField: string = ''; // Initialize sortField property
    globalFilterValue: string;
    clonedProducts: { [n: string]: PendingDataEntries } = {};
    filterDropdownVisible: boolean;
    yearOptions: any[] = [];
    selectedCategory: any;
    AllCategory: ManageDataPointCategory[] = [];
    BusinessEntires: any[] = [];
    dataEntry: any;
    display = 'none'
    display2 = 'none'
    Modes: any[] = [];
    selectMode: number = 1;
    action = 'approve';
    computedFacilities = computed(() => {
        return this.facilityService.selectedfacilitiesSignal()
    })
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trackingService: TrackingService,
        private notification: NotificationService,
        private toastr: ToastrService,private appService: AppService,
        private facilityService: FacilityService
    ) {
        effect(() => {

            if (this.computedFacilities() != 0) {
                this.facilityID = this.computedFacilities();
                this.ALLEntries(this.facilityID);
               
            }
        });
        this.Modes =
            [

                {
                    "id": 1,
                    "modeType": "Flight"
                },
                {
                    "id": 2,
                    "modeType": "Hotel Stay"
                },
                {
                    "id": 3,
                    "modeType": "Other Modes"
                }

            ];
        this.reason = '';
        this.year = new Date();
        this.months = new months();
        this.globalFilterValue = '';
        this.AllCategory = [];
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 20;

        this.yearOptions.push({ label: 'All', value: null });

        for (let year = startYear; year <= currentYear; year++) {
            this.yearOptions.push({ label: year.toString(), value: year });
        }
    }
    statusOptions: any[] = [
        { label: 'All', value: null },
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];
    buttonOptions: any[] = [
      
        { label: 'Approve selected -Pending ', value: 'approve' },
        { label: 'Reject selected - Pending', value: 'reject' },
        { label: 'Delete selected - Approved', value: 'delete' },
    ];
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.route.queryParams.subscribe((params) => {
                this.facilityID = params['data']; // Access the passed data parameter
                this.getCat();
                // Use the data as needed

            });
        }

    };


    getAllDataentries(facilityID: any) {
        //this.getAllDataentries()
    }
    showDialog() {
        this.visible = true;
    };

    onUpdateUserStatus(data: any) {
        this.dataEntry = '';
        this.display = 'block';
        this.dataEntry = data
    };

    deleteAllPopUp() {
        
        this.display2 = 'block';
    }

    onClose2() {
        this.dataEntry = '';
        this.display = 'none';
        this.display2 = 'none';
    };

    sendEntires(type: any) {
       
        let url = '';
        if(type == 'delete'){
            url = '/deleteAllEntry'
        }else if(type == 'approve'){ 
            url = '/UpdateelecEntry'
        }else if(type == 'reject'){
            url = '/rejectAllEntry'
        }
       
        if (this.loginInfo.role == 'Auditor') {
            this.notification.showWarning('You are not Authorized', 'Warning');
            return
        }
        if (this.loginInfo.role == 'Preparer') {
            this.notification.showWarning(
                'You are not Authorized to approve entry',
                'Warning'
            );
            return false
        }
        if (this.selectedEntry.length === 0) {
            this.notification.showWarning('Please select any entry', 'Warning');
            return
        }
        if (this.selectedEntry[0].ID == undefined || this.selectedEntry[0].ID == null) {
            this.sendApprovalEntries = [];
            this.sendSCEntries = [];
            let status = '';
            this.selectedEntry.forEach((element) => {
                if(type == 'delete'){
                    status = 'Approved';
                }else if(type == 'approve'){
                    status = 'Pending';
                }else if(type == 'reject'){
                    status = 'Pending';
                }
                if (element.status === status) {
                    const selectedObject = {
                        id: element.id,
                        categoryID: element.categoryID,
                        tablename: element.tablename
                    };
                    this.sendApprovalEntries.push(selectedObject);
                }
            });
        } else {
            console.log(this.selectedEntry);
            this.sendSCEntries = [];

            this.sendApprovalEntries = [];
            let status = '';
            this.selectedEntry.forEach((element) => {
                if(type == 'delete'){
                    status = 'Approved';
                }else if(type == 'approve'){
                    status = 'Pending';
                }else if(type == 'reject'){
                    status = 'Pending';
                }
                if (element.status === status) {
                    const selectedObject = {
                        id: element.ID,
                        categoryID: element.categoryID,
                        tablename: element.tablename
                    };
                    this.sendApprovalEntries.push(selectedObject);
                }
            });
        }

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', this.selectedEntry[0].categoryID.toString());

        this.appService.postAPI(url, formURlData).subscribe({
            next: (response: any) => {

                if (response.success == true) {
                    this.notification.showSuccess(
                        response.message,
                        'Success'
                    );
                    this.ALLEntries(this.facilityID);
                    this.onClose2()
                    var recipient = environment.Approver;
                    var message = environment.SendEntryMessage;
                    var count = this.sendEntries.length;

                    this.sendApprovalEntries = [];
                    this.selectedEntry = [];
                    this.allSelected = false;
                }else{
                    this.notification.showError(
                        response.message,
                        ''
                    );
                    this.ALLEntries(this.facilityID);
                    this.onClose2()
                    var recipient = environment.Approver;
                    var message = environment.SendEntryMessage;
                    var count = this.sendEntries.length;

                    this.sendApprovalEntries = [];
                    this.selectedEntry = [];
                    this.allSelected = false;
                }
            },
            error: (err) => {
                this.notification.showError(
                    'Entries sent failed.',
                    'Error'
                );
                console.error('errrrrrr>>>>>>', err);
            }
        });


    };

    ALLEntries(facilityID: number) {
        this.modeShow = false;
        this.months = new months();
        this.convertedYear = this.trackingService.getYear(this.year);
        const formData = new URLSearchParams();
        formData.set('year', this.convertedYear)
        formData.set('facilities', facilityID.toString())
        formData.set('categoryID', this.selectedCategory)
        if (this.selectedCategory != 13) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
   
        if (this.selectedCategory == 13) {
            this.modeShow = true;
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.BusinessEntires = response.categories
                            if (this.selectMode == 1) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                            } else if (this.selectMode == 2) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                            } else if (this.selectMode == 3) {

                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                            } else {
                                this.dataEntriesPending = response.categories;
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
    
    };
    
   
   
    AcceptSingleEntry() {
        if (this.loginInfo.role == 'Preparer') {
            this.notification.showWarning(
                'You are not authorized to approve entry',
                'Warning'
            );
            return false
        }
        const entry = this.dataEntry;
        this.sendApprovalEntries = [];
        if (entry.ID == undefined || entry.ID == null) {
            this.selectedObjectEntry = {
                // Create a new object for each iteration
                id: entry.id,
                categoryID: entry.categoryID,
                tablename: entry.tablename
            };

        } else {
            this.selectedObjectEntry = {
                // Create a new object for each iteration
                id: entry.id,
                categoryID: entry.categoryID,
                tablename: entry.tablename
            };
        }
        this.sendApprovalEntries.push(this.selectedObjectEntry); // Add the new object to the sendEntries array

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', entry.categoryID);

        this.trackingService
            .newSendSCSingleDataforApprove(formURlData)
            .subscribe({
                next: (response) => {
                    // console.log(response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Entry Approved',
                            'Success'
                        );
                        this.ALLEntries(this.facilityID);
                        this.onClose2();
                        this.sendApprovalEntries = [];
                       

                        this.selectedEntry = [];
                    } else {
                        this.notification.showWarning(
                            'Entry not Approved',
                            'Warning'
                        );
                        this.onClose2();
                    }
                    this.sendApprovalEntries = [];
                },
                error: (err) => {
                    this.notification.showError(
                        'Entry Approval Failed.',
                        'Error'
                    );
                    this.onClose2();
                    console.error('errrrrrr>>>>>>', err);
                }
            });

    };

    RejectSingleEntry() {
        const entry = this.dataEntry;

        this.sendApprovalEntries = [];

        this.selectedObjectEntry = {
            // Create a new object for each iteration
            id: entry.id,

            categoryID: entry.categoryID,
            tablename: entry.tablename,
            Reason: entry.reason
        };
        this.sendApprovalEntries.push(this.selectedObjectEntry); // Add the new object to the sendEntries array

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', entry.categoryID);


        this.trackingService
            .newSendDeleteSingleDataforApprove(formURlData)
            .subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Entry Rejected',
                            'Success'
                        );
                        this.ALLEntries(this.facilityID);
                        this.visible = false;

                        this.onClose2();

                        this.selectedEntry = [];
                        this.sendApprovalEntries = [];
                    } else {
                        this.notification.showWarning(
                            'Entry not Rejected',
                            'Warning'
                        );
                    }
                    this.sendApprovalEntries = [];
                },
                error: (err) => {
                    this.notification.showError(
                        'Entry Rejection Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        return

    };


   
    FilterByYear() {
        this.ALLEntries(this.facilityID);

    }

    getCat() {
        this.trackingService.newgetCategory().subscribe({
            next: (response) => {

                // console.log(response);
                this.AllCategory = response;
                this.selectedCategory = this.AllCategory[0].id;
              
                if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                    // this.ALLEntries(this.loginInfo.facilityID);
                    this.ALLEntries(this.facilityID);

                } else {
                    this.ALLEntries(this.facilityID);
                }
            }
        })
    }
    getEntry() {
        this.ALLEntries(this.facilityID);
    }
   


    getModesEntry() {
        if (this.selectMode == 1) {
            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'flight_travel');
        } else if (this.selectMode == 2) {
            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'hotel_stay');
        } else if (this.selectMode == 3) {

            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'other_modes_of_transport');
        } else {
            this.dataEntriesPending = this.dataEntriesPending;
        }

    };


    sendAction(action:string) {
        console.log(action);
      if(action == 'approve'){
        this.sendEntires(action);
      }else if (action == 'reject'){
        this.sendEntires(action);
      }else{
        this.display2 = 'block';
      }
    };


   

    toggleSelectAll(event: any) {
        this.allSelected = event.target.checked;
      
        if (this.allSelected) {
          if (this.action === 'approve') {
            this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Pending');
          } else if(this.action === 'reject') {
            this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Pending');
          }else if(this.action == 'delete'){
            this.selectedEntry =  this.dataEntriesPending.filter(item => item.status === 'Approved');
          }
        } else {
          this.selectedEntry = [];
        }
      
       
      };


      changeHandler() {
        if(this.allSelected){
            if (this.action === 'approve') {
                this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Pending');
            } else if(this.action === 'reject') {
              this.selectedEntry = this.dataEntriesPending.filter(item => item.status === 'Pending');
            }else if(this.action == 'delete'){
              this.selectedEntry =  this.dataEntriesPending.filter(item => item.status === 'Approved');
            }
        }
       
      };
      



}
