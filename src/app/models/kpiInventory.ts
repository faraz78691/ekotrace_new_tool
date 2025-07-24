export interface KpiInventoryResponse {
    error: boolean;
    message: string;
    success: boolean;
    data: KpiInventoryData;
    user_name:string
    updated_at:string
}

export interface KpiInventoryData {
    ["Scope 1"]: KpiCategory;
    ["Scope 2"]: KpiCategory;
    ["Scope 3"]: KpiCategory;
    ["Total Emissions"]: KpiCategory;
    ["Owned Passenger Vehicle Emiss. - Diesel"]: KpiCategory;
    ["Owned Passenger Vehicle Emiss. - Petrol"]: KpiCategory;
    ["Total Owned Passenger Vehicle Emiss."]: KpiCategory;
    ["Owned Transport Vehicle Emiss."]: KpiCategory;
    ["Owned Freight Vehicle Emiss."]: KpiCategory;
    ["Emissions in Flight travel"]: KpiCategory;
    ["Emissions in Other mode of travel"]: KpiCategory;
    ["Emissions in Hotel stay"]: KpiCategory;
    ["Emissions in Employee commute"]: KpiCategory;
    ["Total no. of working days"]: KpiCategory;
    ["Waste Generated"]: KpiCategory;
    ["Waste Diverted"]: KpiCategory;
    ["Water Discharged"]: KpiCategory;
    ["Water Usage"]: KpiCategory;
    ["Water Treated"]: KpiCategory;
    ["Emissions in water treatment"]: KpiCategory;
    ["Heating + Cooling"]: KpiCategory;
    ["Electricity"]: KpiCategory;
    ["Renewable Electricity"]: KpiCategory;
    ["fuel1"]: KpiCategory;
    ["fuel2"]: KpiCategory;
    ["fuel3"]: KpiCategory;
    ["Total Output"]: KpiCategory;
    ["Total Revenue (in Mn)"]: KpiCategory;
    ["No. of Employees"]: KpiCategory;
    ["No. of vehicles (Diesel)"]: KpiCategory;
    ["No. of vehicles (Petrol)"]: KpiCategory;
    ["Total vehicles"]: KpiCategory;

}

export interface KpiCategory {
    annual: number;
    monthly: number[];
    ID?:number
    id?:number
}

// Example usage

