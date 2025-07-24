export class DashboardModel {
    dataPointName: string;
    totalCombustion: number;
    unit: string;
}

export class TopCarbonConsumingModel {
    name: string;
    value: number;
}
export interface TopCarbonConsumingByMonthModel {
    name: string | null;
    series: TopCarbonConsumingByMonthValue[];
}

export interface TopCarbonConsumingByMonthValue {
    name: string | null;
    value: number | null;
}
