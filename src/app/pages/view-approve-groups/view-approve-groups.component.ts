import { LoginInfo } from '@/models/loginInfo';
import { months } from '@/models/months';
import { PendingDataEntries } from '@/models/PendingDataEntry';
import { selectedObjectEntry, StationaryCombustionDE } from '@/models/StationaryCombustionDE';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-approve-groups',
  templateUrl: './view-approve-groups.component.html',
  styleUrls: ['./view-approve-groups.component.scss']
})
export class ViewApproveGroupsComponent {
  yearOptions: any[] = [];
  issended: boolean;
  year: Date;
  convertedYear: string;
  filteredStatus: any;
  months: months;
  AssignedDataPoint: TrackingDataPoint[] = [];;
  dataEntriesPending: PendingDataEntries[] = [];
  selectedEntry: PendingDataEntries[] = [];
  selectedScEntry: StationaryCombustionDE;
  selectedObjectEntry: selectedObjectEntry;
  loginInfo
  sendApprovalEntries: any[] = [];
  selectedGroupId: any;
  selectedCategory = 23;
  dataEntry: any;
  display = 'none';
  visible = false;
  Approver = environment.Approver;
  Preparer = environment.Preparer;
  Admin = environment.Admin;
  SuperAdmin = environment.SuperAdmin;
  Manager = environment.Manager;
  Pending = environment.pending;
  Rejected = environment.rejected;
  Approved = environment.approved;
  groupsList: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trackingService: TrackingService,
    private toastr: ToastrService,
    private notification: NotificationService,
    private facilityService: FacilityService
  ) {


    this.year = new Date();
    this.months = new months();


    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 20;



    for (let year = startYear; year <= currentYear; year++) {
      this.yearOptions.push({ label: year.toString(), value: year });
    }
  };

  statusOptions: any[] = [
    { label: 'All', value: null },
    { label: 'Approved', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' }
  ];
  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
      this.route.paramMap.subscribe((params) => {
        this.selectedGroupId = Number(params.get('groupId'));
        this.GetSubGroupList(this.loginInfo.tenantID);
        this.ALLEntries(this.selectedGroupId);
      });
    }

  };
  ALLEntries(groupId: number) {

    this.months = new months();
    this.convertedYear = this.trackingService.getYear(this.year);
    const formData = new URLSearchParams();
    formData.set('year', this.convertedYear)
    formData.set('facilities', groupId.toString())
    formData.set('categoryID', this.selectedCategory.toString())

    if (this.selectedCategory == 23) {
      this.trackingService
        .newgetSCpendingDataEntries(formData)
        .subscribe({
          next: (response) => {
            if (response.success === false) {
              this.dataEntriesPending = null;
            } else {
              this.dataEntriesPending = response.categories;

            }
            if (this.loginInfo.role != environment.Approver) {
              if (Array.isArray(this.dataEntriesPending)) {
                  this.issended =
                      this.dataEntriesPending.every(
                          (category) =>
                              category.status ===
                              "Approved"
                      );
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
  GetSubGroupList(tenantID) {
    this.groupsList = []
   
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantID)
    this.facilityService
      .getActualSubGroups(formData.toString())
      .subscribe((res) => {
        if (res.success == true) {
          this.groupsList = res.categories;
         
        }
      });
  };

  sendEntryForApproval() {
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
      return
    }
    if (this.selectedEntry[0].ID == undefined || this.selectedEntry[0].ID == null) {

      this.sendApprovalEntries = [];
      this.selectedEntry.forEach((element) => {
        if (element.status === 'Pending') {
            const selectedObject = {
                id: element.id,
                categoryID: element.categoryID,
                tablename: element.tablename
            };
            this.sendApprovalEntries.push(selectedObject);
        }
    });
      } else {

        this.sendApprovalEntries = [];
        this.selectedEntry.forEach((element) => {
          if (element.status === 'Pending') {
              const selectedObject = {
                  id: element.id,
                  categoryID: element.categoryID,
                  tablename: element.tablename
              };
              this.sendApprovalEntries.push(selectedObject);
          }
      });
      }


      let stringfyUrlData = JSON.stringify(this.sendApprovalEntries);
      const formURlData = new URLSearchParams();
      formURlData.set('updateJson', stringfyUrlData);
      formURlData.set('categoryID', this.selectedEntry[0].categoryID.toString());

      this.trackingService.newUpdateSCEntry(formURlData).subscribe({
        next: (response: any) => {

          if (response.success == true) {
            this.notification.showSuccess(
              'Entries approved',
              'Success'
            );
            this.ALLEntries(this.selectedGroupId);
            // var recipient = environment.Approver;
            // var message = environment.SendEntryMessage;
            // var count = this.sendEntries.length;

            this.sendApprovalEntries = [];
            this.selectedEntry = []
          }
        },
        error: (err) => {
          this.notification.showError(
            'Entries sent for approval Failed.',
            'Error'
          );
          console.error('errrrrrr>>>>>>', err);
        }
      });


    
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
    this.sendApprovalEntries.push(this.selectedObjectEntry);

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
            this.ALLEntries(this.selectedGroupId);
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
      id: entry.id,
      categoryID: entry.categoryID,
      tablename: entry.tablename,
      Reason: entry.reason
    };
    this.sendApprovalEntries.push(this.selectedObjectEntry); 

    let stringfyUrlData = JSON.stringify(this.sendApprovalEntries);
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
            this.ALLEntries(this.selectedGroupId);
            this.visible = false;

            this.onClose2();

            this.selectedEntry = [];
          } else {
            this.toastr.error(
              'Entry not Rejected',
              'Warning'
            );
          }
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

  }
  showDialog() {
    this.visible = true;
  };


  onClose2() {
    this.dataEntry = '';
    this.display = 'none';
  };

  onUpdateUserStatus(data: any) {
    this.dataEntry = '';

    this.display = 'block';
    this.dataEntry = data

  };


  getEntry() {
    this.ALLEntries(this.selectedGroupId);
  };

  FilterByYear() {
    this.ALLEntries(this.selectedGroupId);

  };


  AcceptAllEntry() {
    if (this.selectedEntry.length === 0) {
      this.notification.showWarning('Please select any entry', 'Warning');
      return;
    }
    // if (this.selectedCategory == 1) {
    //     this.sendSCEntries = []; 
    //     this.selectedEntry.forEach((element) => {
    //         this.sendSCelement = {

    //             id: element.dataEntryID,
    //             manageDataPointSubCategoriesID: element.subcategoryID,
    //             month: element.month,
    //             note: element.note,
    //             readingValue: element.readingValue,
    //             sendForApproval: element.sendForApproval,
    //             status: environment.approved,
    //             statusDate: new Date(),
    //             submissionDate: element.submissionDate,
    //             unit: element.unit,
    //             year: element.year,
    //             fileName: element.fileName,
    //             filePath: element.filePath,
    //             tenantID: element.tenantID,
    //             gHGEmission: element.ghgEmission,
    //             reason: this.sendSCelement.reason,
    //             blendID: element.blendID,
    //             blendPercent: element.blendPercent,
    //             blendType: element.blendType,
    //             typeID: element.typeID,
    //             calorificValue: element.calorificValue
    //         };
    //         if (element.status == 'pending') {
    //             this.sendSCEntries.push(this.sendSCelement); // Add the new object to the sendEntries array
    //         }
    //     });

    //     this.trackingService.UpdateSCEntry(this.sendSCEntries).subscribe({
    //         next: (response) => {
    //             if (response == environment.EntrySended) {
    //                 this.notification.showSuccess(
    //                     'Entries Approved',
    //                     'Success'
    //                 );
    //                 if (this.loginInfo.role == environment.Approver) {
    //                     this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
    //                 }
    //                 if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
    //                     this.ALLEntries(this.loginInfo.facilityID);

    //                 } else {
    //                     this.ALLEntries(this.facilityID);
    //                 }
    //                 var count = this.sendSCEntries.length;
    //                 var recipient = environment.Preparer;
    //                 var message = environment.SendAcceptMessage;

    //             } else {
    //                 this.notification.showWarning(
    //                     'Entries not Approved',
    //                     'Warning'
    //                 );
    //             }
    //         },
    //         error: (err) => {
    //             this.notification.showError(
    //                 'Entries Approval Failed.',
    //                 'Error'
    //             );
    //             console.error('errrrrrr>>>>>>', err);
    //         }
    //     });
    // }


  }


}
