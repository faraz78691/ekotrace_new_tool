import { SendNotification } from '@/models/SendNotification';
import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { NotificationService } from '@services/notification.service';
import { environment } from 'environments/environment';
import { CompanyService } from '@services/company.service';
import { CompanyDetails } from '@/shared/company-details';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  sevenDaysAgo: Date;
  rootUrl: string;
  public companyDetails: CompanyDetails;
  uploadedImageUrl: string;
  expirationDate: Date;
  isExpired: boolean;
  public loginInfo: LoginInfo;
  AllNotifications: SendNotification[] = [];
  notificationCount: number;
  sendNotificationData: SendNotification;
  currentDate: Date;
  excludedRole = 'Platform Admin';
  constructor(private notification: NotificationService,
    private companyService: CompanyService) {
    this.AllNotifications = [];
    this.rootUrl = environment.baseUrl + 'uploads/';

  }
  ngOnInit() {
 
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    this.getTenantsById(Number(this.loginInfo.tenantID));
    this.getAllNotifications(
      this.loginInfo.facilityID,
      this.loginInfo.role
    );
    this.getQueryParams("BRSR");
  }


  getAllNotifications(facilityID, recipient) {
    if (this.loginInfo.role === this.excludedRole) {
      //return; // Exit the function for unauthorized acces
      this.notification.GetAllNotification(facilityID, this.loginInfo.role).subscribe({
        next: (response) => {
          this.AllNotifications = response;
          this.notificationCount = this.AllNotifications.length;
        }
      });
    }
    else if (this.loginInfo.role === environment.SuperAdmin) {
      this.notification.GetAllNotification(this.loginInfo.tenantID, recipient).subscribe({
        next: (response) => {
          this.AllNotifications = response;
          this.notificationCount = this.AllNotifications.length;
        }
      });
    }
    else {
      this.notification.GetAllNotification(facilityID, recipient).subscribe({
        next: (response) => {
          this.AllNotifications = response;
          this.notificationCount = this.AllNotifications.length;
        }
      });
    }

  }

  ClickNotification(notification) {
    notification.isRead = true;
    this.notification
      .UpdateNotification(notification.id, notification)
      .subscribe({
        next: (response) => {
          this.getAllNotifications(
            this.loginInfo.facilityID,
            this.loginInfo.role
          );
        }
      });
  }
  SendNotification(recipient, message, days) {
    
    this.sendNotificationData = new SendNotification();

    if (message == environment.expireMessage) {
      var msg = message + days + ' days!';
      this.sendNotificationData.message = msg;
    }
    else {
      let day = (-days);
      var msg = message + day + ' days ago!'
      this.sendNotificationData.message = msg;
    }

    this.currentDate = new Date();
    this.sendNotificationData.isRead = false;
    this.sendNotificationData.recipient = recipient;
    this.sendNotificationData.tenantID = this.loginInfo.tenantID;
    this.sendNotificationData.createdDate = this.currentDate;
    this.notification
      .SaveNotifications(this.sendNotificationData)
      .subscribe({
        next: (response) => {
          this.getAllNotifications(
            this.loginInfo.facilityID,
            this.loginInfo.role
          );
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => console.info('notification send')
      });
  }
  getRouterLink(notify: SendNotification): any[] {
    if (this.checkWordExistence(notify.message, "Request")) {
      return ['/tracking-view-requests'];
    }
    if (this.checkWordExistence(notify.message, "expire")) {
      return ['/billing'];
    }
    if (this.checkWordExistence(notify.message, "Approval")) {
      return ['/tracking-view-requests'];
    }
    else if (this.checkWordExistence(notify.message, "BRSR")) {
      return ['/brsr-qa'];
    }
  }

  getQueryParams(notify: any): any {

    if (this.checkWordExistence(notify.message, "Request")) {
      return { data: notify.facilityId };

    }
    else if (this.checkWordExistence(notify.message, "BRSR")) {
      return { data: notify.tenantID }
    }
  }

  checkWordExistence(sentence: string, word: string): boolean {
    return sentence.includes(word);
  }

  getTenantsById(id: number) {
    if (this.loginInfo.role === this.excludedRole) {
      return;
    }
    this.companyService.getTenantsDataById(id).subscribe((response) => {
      this.companyDetails = response;
      this.uploadedImageUrl =
        this.rootUrl +
        (response.logoName === '' || response.logoName === null
          ? 'defaultimg.png'
          : response.logoName);
      this.expirationDate = new Date(this.companyDetails.licenseExpired);

      this.expirationDate.setDate(this.expirationDate.getDate() - 1);
      const currentDate = new Date();
      const licenseExpiredDate = new Date(this.loginInfo.licenseExpired);
      this.isExpired = licenseExpiredDate < currentDate;

      // Calculate the difference in days
      const timeDifference =
        this.expirationDate.getTime() - currentDate.getTime();
      let leftDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

      //leftDays = -2;
      if (leftDays <= 7) {
        
        if (leftDays < 0) {
          var message = environment.expirMessageAgo;
        }
        else {
          var message = environment.expireMessage;
        }
        var recipient = environment.SuperAdmin;
        this.SendNotification(recipient, message, leftDays);
      }
      this.getAllNotifications(
        this.loginInfo.facilityID,
        this.loginInfo.role
      );
    });
  }
}
