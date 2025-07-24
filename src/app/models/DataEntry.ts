export class DataEntry {
    id: number;
    readingValue: number;
    unit: string;
    note: string;
    submissionDate: Date;
    statusDate: Date;
    status: string;
    year: string;
    month: string;
    fileName: string;
    filePath: string;
    gHGEmission: any;
    energy?: any;
    tenantID: number;
    sendForApproval: boolean;
    manageDataPointSubCategoriesID: number;
    reason: string;
    typeID: number;
}
