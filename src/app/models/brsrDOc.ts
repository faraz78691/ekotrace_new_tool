import { brsR_Q_As } from './brsrQA';

export class BRSR_Doc {
    id: number;
    docName?: string;
    docPath?: string;
    isAccept?: boolean;
    isVisible?: boolean;
    isLock?: boolean;
    brsR_Q_As?: brsR_Q_As[];
    tenantID?: number;
    reason: string;
}

export class BRSR_Questions {
    id: number;
    question: string;
    tenantId: number;
    principleID: number;
}
