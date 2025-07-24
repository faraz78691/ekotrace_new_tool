export class StationaryCombustionDE {
  id: number;
  readingValue: number;
  unit: string;
  typeID: number;
  calorificValue: number;

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
  blendType: string;
  blendID: number;
  blendPercent: number;
}
export class selectedObjectEntry {
  id: number;
  categoryID: number;
 tablename:string;
 Reason?:string;
}