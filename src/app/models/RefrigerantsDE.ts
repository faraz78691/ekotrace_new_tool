export class RefrigerantsDE {
  id: number;
  refAmount: number;
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

  // cO2LeakagePerUnit: any;
  // capacity: any;
  // leakagePerOfCapacity: any;
  // airConnIDRef: string;
}