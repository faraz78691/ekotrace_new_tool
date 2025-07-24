import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Location } from '@/models/Location';
import {
    DashboardModel,
    TopCarbonConsumingByMonthModel,
    TopCarbonConsumingModel
} from '@/models/Dashboard';
import { facilities } from '@/models/dashboardFacilities';
@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    apiURL = environment.baseUrl;
    // apiURL = 'http://192.168.1.31:4003';
    constructor(private http: HttpClient) { }

    public GetDataForEnvironment(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForEnvironment/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForEnvironment(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForEnvironment/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForEnvironment(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForEnvironment/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    // StationaryCombustion

    public GetDataForStationaryCombustion(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForStationaryCombustion/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }

    public GetTopCarbonConsumingForStationaryCombustion(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForStationaryCombustion/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForStationaryCombustion(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForStationaryCombustion/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    // Refrigerants
    public GetDataForRefrigerants(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForRefrigerants/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForRefrigerants(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForRefrigerants/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForRefrigerants(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForRefrigerants/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    //fire Extinguisher
    public GetDataForFireExtinguishers(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForFireExtinguishers/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }

    public GetTopCarbonConsumingForFireExtinguishers(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForaFireExtinguishers/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForFireExtinguishers(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForFireExtinguishers/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    //vehicle
    public GetDataForVehicles(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForVehicles/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForVehicles(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForVehicles/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForVehicles(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForVehicles/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    //Electricity
    public GetDataForElectricity(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForElectricity/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForElectricity(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForElectricity/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForElectricity(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForElectricity/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }

    //Heat n Steam
    public GetDataForHeatnSteam(
        tenantID,
        gobalFilterID
    ): Observable<DashboardModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<DashboardModel[]>(
            environment.baseUrl +
            'Dashboard/GetDataForHeatnSteam/' +
            tenantID +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingForHeatnSteam(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingForHeatandSteam/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    }
    public GetTopCarbonConsumingByMonthForHeatnSteam(
        tenantID,
        dataPointName,
        gobalFilterID
    ): Observable<TopCarbonConsumingByMonthModel[]> {
        gobalFilterID = gobalFilterID == undefined ? '0' : gobalFilterID;
        return this.http.get<TopCarbonConsumingByMonthModel[]>(
            environment.baseUrl +
            'Dashboard/GetTopCarbonConsumingByMonthForHeatandSteam/' +
            tenantID +
            '/' +
            dataPointName +
            '/' +
            gobalFilterID
        );
    };

    public getdashboardfacilities(admininfo):Observable<facilities> {
        return this.http.post<facilities>(this.apiURL + '/getdashboardfacilities', admininfo);
    };
    
    public GScopeWiseEimssion(admininfo) {
        return this.http.post(this.apiURL + '/dashboardScope', admininfo);
    };
    public updownWasteTotal(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWasteTotal', admininfo);
    };
    public GEByTravel(admininfo) {
        return this.http.post(this.apiURL + '/businessdashboardemssionByTravel', admininfo);
    };
    public GEByFuelType(admininfo) {
        return this.http.post(this.apiURL + '/dashboardenergyConsumption', admininfo);
    };
    public getFinanceIndustry(admininfo) {
        return this.http.post(this.apiURL + '/financedashboardtop5emission', admininfo);
    };
    public financeEmissionDashType(admininfo) {
        return this.http.post(this.apiURL + '/financedashboardemission', admininfo);
    };
    public GEByActivity(admininfo) {
        return this.http.post(this.apiURL + '/dashboardenergyConsumptionWellTank', admininfo);
    };
    public Waterwithdrawnby_source(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWaterwithdrawnby_source', admininfo);
    };
    public waterWaste(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWaterTotal', admininfo);
    };
    public WaterDischargedbydestination(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWaterDischargedbydestination', admininfo);
    };
    public dashboardWaterTreated_nonTreated(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWaterTreated_nonTreated', admininfo);
    };
    public waterTreatedByLevel(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWaterTreatedbylevel', admininfo);
    };
    public WaterEmision(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWaterEmission', admininfo);
    };
    public waterTreatedDestination(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWaterTreatedbydestination', admininfo);
    };
    public businessdashboardemssionByAir(admininfo) {
        return this.http.post(this.apiURL + '/businessdashboardemssionByAir', admininfo);
    };
    public dashboardenergyConsumptionWellTank(admininfo) {
        return this.http.post(this.apiURL + '/dashboardenergyConsumptionWellTank', admininfo);
    };
    public BygroundTravel(admininfo) {
        return this.http.post(this.apiURL + '/businessdashboardemssionBygroundTravel', admininfo);
    };
    public BycostTravel(admininfo) {
        return this.http.post(this.apiURL + '/dashboardCostcentreBreakdown', admininfo);
    };
    public ByEnergyRenewable(admininfo) {
        return this.http.post(this.apiURL + '/dashboardenergyConsumptionRenewable', admininfo);
    };
    public businessTravelByMonth(admininfo) {
        return this.http.post(this.apiURL + '/businessdashboardemssion', admininfo);
    };
    public EnergyByMonth(admininfo) {
        return this.http.post(this.apiURL + '/dashboardenergyConsumptionMonth', admininfo);
    };
    public GTopWiseEimssion(admininfo) {
        return this.http.post(this.apiURL + '/dashboardTopEmssion', admininfo);
    };
    public wasteTopFive(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWastetop5', admininfo);
    };
    public GemissionActivity(admininfo) {
        return this.http.post(this.apiURL + '/dashboardEmssionByactivities', admininfo);
    };
    public getPathNet(admininfo) {
        return this.http.post(this.apiURL + '/dashboardnetZero', admininfo);
    };
    public GVEndorActivity(admininfo) {
        return this.http.post(this.apiURL + '/dashboardEmssionByVendors', admininfo);
    };
    public getScopeDonutsER(admininfo) {
        return this.http.post(this.apiURL + '/ScopewiseEmssion', admininfo);
    };
    public wasteTypeEmission(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWasteEmission', admininfo);
    };
    public WasteUpDownwiseEmssion(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWasteUpDownwiseEmssion', admininfo);
    };
    public BreakDownEmssion(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWasteBreakdown', admininfo);
    };
    public hazardGRash(admininfo) {
        return this.http.post(this.apiURL + '/dashboardWasteEmissionhaz', admininfo);
    };

}
