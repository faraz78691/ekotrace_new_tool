export class BrsrReport {
    Theme: string;
    Disclosures: string;
    //status:string;
    Standards: string;
    ReportType: string;
    Value: number;
    switchEnabled: boolean;
}

export class BRSR_Table14 {
    id: number;
    clientId: number;
    tenantId: number;
    descriptionOfMainActivity: string | null;
    descriptionOfBusinessActivity: string | null;
    percentageOfTurnoverOfTheEntity: number;
}
