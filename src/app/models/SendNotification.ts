export class SendNotification {
    id: number;
    message: string;
    recipient: string;
    facilityID?: number;
    status: string;
    isRead: boolean;
    count: number;
    createdDate?:Date;
    tenantID?:number;
}