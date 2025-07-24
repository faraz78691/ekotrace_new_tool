import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs/internal/Observable';
import { savedDataPoint } from '@/models/savedDataPoint';
import { environment } from 'environments/environment';
import { ManageDataPoint } from '@/models/ManageDataPoint';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { DataEntrySetting } from '@/models/DataEntrySettings';
import { DataEntry } from '@/models/DataEntry';
import { env } from 'process';
import { EmissionFactor } from '@/models/EmissionFactorALL';
import { DatePipe } from '@angular/common';
import { BlendType } from '@/models/BlendType';
import { VehicleDEmode } from '@/models/VehicleDEmode';
import { ElectricitySource } from '@/models/ElectricitySource';
import { StationaryCombustionDE } from '@/models/StationaryCombustionDE';
import { RefrigerantsDE } from '@/models/RefrigerantsDE';
import { FireExtinguisherDE } from '@/models/FireExtinguisherDE';
import { VehicleDE } from '@/models/VehicleDE';
import { ElectricityDE } from '@/models/ElectricityDE';
import { Units } from '@/models/Units';
import { VehicleType } from '@/models/VehicleType';
import { ManageDataPointCategory } from '@/models/ManageDataPointCategory';
import { PendingDataEntries } from '@/models/PendingDataEntry';
import { HeatandSteamDE } from '@/models/HeatandSteamDE';
import { ElectricityGrid } from '@/models/ElectricityGrid';

@Injectable({
    providedIn: 'root'
})
export class TrackingService {
    public dataEntry: any;
    constructor(
        private http: HttpClient,
        private notification: NotificationService
    ) { }
    public getSavedDataPointforTracking(facilityID: any): Observable<any> {
        return this.http.get<any>(
            'http://192.168.1.31:4003' +
            'Tracking/getAssignedDataPointbyfacility/' +
            facilityID
        );
    };
    public getDataPointsByFacility(facilityID: any): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            '/getAllcategoryByfacility/' +
            facilityID
        );
    };
    public newgetSavedDataPointforTracking(facilityID: any): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl + '/getAssignedDataPointbyfacility/' +
            facilityID
        );
    };
    public getExcelSheet(facilityID: any): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl + `/get-excelsheet?facility_id=${facilityID}`
            
        );
    };


    public getfacilitybyId(facilityID: any): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl + 'Facilities/' + facilityID
        );
    }
    public postDataEntrySetting(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/DataEntrySetting',
            data
        );
    }
    public getdataEntrySetting(subCatid): Observable<DataEntrySetting> {
        return this.http.get<DataEntrySetting>(
            environment.baseUrl + 'Tracking/DataEntrySetting/' + subCatid
        );
    }
    public getdataEntry(subCatid): Observable<DataEntry[]> {
        return this.http.get<DataEntry[]>(
            environment.baseUrl + 'Tracking/' + subCatid
        );
    }
    public putDataEntrySetting(id, data): Observable<any> {
        return this.http.put(
            environment.baseUrl + 'Tracking/DataEntrySetting/' + id,
            data
        );
    }
    public postDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/SaveDataEntry',
            data
        );
    }
    public getAllDataEntries() {
        return this.http.get(environment.baseUrl + 'Tracking');
    }
    public getpendingDataEntries(facilityID: any, year): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            'Tracking/getpendingDataEntries/' +
            facilityID +
            '/' +
            year
        );
    }
    public checkEntry(month, year, subCatId): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            'Tracking/checkEntry/' +
            month +
            '/' +
            year +
            '/' +
            subCatId
        );
    }
    public UpdateEntry(Entries: DataEntry[]) {
        return this.http.put(
            environment.baseUrl + 'Tracking/UpdateDataEntries',
            Entries
        );
    }
    public UpdateSCEntry(Entries: StationaryCombustionDE[]) {
        return this.http.put(
            environment.baseUrl + 'Tracking/UpdateSCDataEntries',
            Entries
        );
    };

    public newUpdateSCEntry(Entries:any) {
        return this.http.post(
            environment.baseUrl + '/UpdateelecEntry',
            Entries
        );
    };
    public uploadBRSRCS(Entries:any) {
        return this.http.post(
            environment.baseUrl + '/updatebrsrReport',
            Entries
        );
    };
    public uploadBRSRHR(Entries:any) {
        return this.http.post(
            environment.baseUrl + '/uploadHrreport',
            Entries
        );
    };
    public uploadBRSRFD(Entries:any) {
        return this.http.post(
            environment.baseUrl + '/uploadFdreport',
            Entries
        );
    };

    public UpdaterefEntry(Entries: RefrigerantsDE[]) {
        return this.http.put(
            environment.baseUrl + 'Tracking/UpdaterefDataEntries',
            Entries
        );
    }
    public UpdatefireEntry(Entries: FireExtinguisherDE[]) {
        return this.http.put(
            environment.baseUrl + 'Tracking/UpdatefireDataEntries',
            Entries
        );
    }
    public UpdatevehicleEntry(Entries: VehicleDE[]) {
        return this.http.put(
            environment.baseUrl + 'Tracking/UpdatevehicleDataEntries',
            Entries
        );
    }
    public UpdateelecEntry(Entries: ElectricityDE[]) {
        return this.http.put(
            environment.baseUrl + 'Tracking/UpdateelecDataEntries',
            Entries
        );
    }
    public UpdateHSEntry(Entries: HeatandSteamDE[]) {
        return this.http.put(
            environment.baseUrl + 'Tracking/UpdateHSDataEntries',
            Entries
        );
    }

    public DeleteEntry(id: number, CatID: number) {
        return this.http.delete(
            environment.baseUrl + 'Tracking/EntryDelete/' + id + '/' + CatID
        );
    }
    public getSendforApprovalSCDataEntries(
        facilityID: any,
        year
    ): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            'Tracking/SendforApprovalSCDataPoint/' +
            facilityID +
            '/' +
            year
        );
    }
    public getSendforApprovalrefDataEntries(
        facilityID: any,
        year
    ): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            'Tracking/SendforApprovalrefDataPoint/' +
            facilityID +
            '/' +
            year
        );
    }
    public getSendforApprovalFireDataEntries(
        facilityID: any,
        year
    ): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            'Tracking/SendforApprovalfireDataPoint/' +
            facilityID +
            '/' +
            year
        );
    }
    public getSendforApprovalVehicleDataEntries(
        facilityID: any,
        year
    ): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            'Tracking/SendforApprovalVehicleDataPoint/' +
            facilityID +
            '/' +
            year
        );
    }
    public getSendforApprovalelecDataEntries(
        facilityID: any,
        year
    ): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            'Tracking/SendforApprovalElecDataPoint/' +
            facilityID +
            '/' +
            year
        );
    }
    public getSendforApprovalHSDataEntries(
        facilityID: any,
        year
    ): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
            'Tracking/SendforApprovalHSDataPoint/' +
            facilityID +
            '/' +
            year
        );
    }
    public sendSingleDataforApprove(id, dataentry): Observable<any> {
        return this.http.put<any>(
            environment.baseUrl + 'Tracking/UpdateEntry/' + id,
            dataentry
        );
    }
    public sendSCSingleDataforApprove(id, dataentry): Observable<any> {
        return this.http.put<any>(
            environment.baseUrl + 'Tracking/UpdateSCEntry/' + id,
            dataentry
        );
    }
    public newSendDeleteSingleDataforApprove(dataentry): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl + '/UpdateelecEntryReject' ,
            dataentry
        );
    };
    public newSendSCSingleDataforApprove(dataentry): Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type','application/json')
        
        ; 
        return this.http.post<any>(
            environment.baseUrl + '/UpdateelecEntry',
            dataentry,{'headers':headers}
        );
    }
    public sendrefSingleDataforApprove(id, dataentry): Observable<any> {
        return this.http.put<any>(
            environment.baseUrl + 'Tracking/UpdaterefEntry/' + id,
            dataentry
        );
    };
    public sendfireSingleDataforApprove(id, dataentry): Observable<any> {
        return this.http.put<any>(
            environment.baseUrl + 'Tracking/UpdatefireEntry/' + id,
            dataentry
        );
    }
    public sendvehicleSingleDataforApprove(id, dataentry): Observable<any> {
        return this.http.put<any>(
            environment.baseUrl + 'Tracking/UpdatevehicleEntry/' + id,
            dataentry
        );
    }
    public sendelecSingleDataforApprove(id, dataentry): Observable<any> {
        return this.http.put<any>(
            environment.baseUrl + 'Tracking/UpdateelecEntry/' + id,
            dataentry
        );
    }
    public sendHSSingleDataforApprove(id, dataentry): Observable<any> {
        return this.http.put<any>(
            environment.baseUrl + 'Tracking/UpdateHSEntry/' + id,
            dataentry
        );
    }
    public postNotification(data): Observable<any> {
        return this.http.post(environment.baseUrl + 'Notification', data);
    }
    public getEmissionFactorHistory(): Observable<EmissionFactor[]> {
        return this.http.get<EmissionFactor[]>(
            environment.baseUrl + 'Tracking/GetEmissionFactoryHistory'
        );
    }
    public GetEmissionFactorStationarybyID(seedID): Observable<EmissionFactor[]> {
        return this.http.get<EmissionFactor[]>(
            environment.baseUrl +
            'Tracking/GetEmissionFactorStationarybyID/' +
            seedID
        );
    }
    public GetEmissionFactorFirebyID(seedID): Observable<EmissionFactor[]> {
        return this.http.get<EmissionFactor[]>(
            environment.baseUrl +
            'Tracking/GetFireEmissionFactor/' +
            seedID
        );
    }
    public GetEmissionFactorRefrigerantsbyID(
        seedID
    ): Observable<EmissionFactor[]> {
        return this.http.get<EmissionFactor[]>(
            environment.baseUrl +
            'Tracking/GetEmissionFactorRefrigerantsbyID/' +
            seedID
        );
    }
    public GetEmissionFactorElectricitybyID(
        seedID
    ): Observable<EmissionFactor[]> {
        return this.http.get<EmissionFactor[]>(
            environment.baseUrl +
            'Tracking/GetElectricityEmissionFactor/' +
            seedID
        );
    }
    public GetEmissionFactorHeatandSteambyID(
        seedID
    ): Observable<EmissionFactor[]> {
        return this.http.get<EmissionFactor[]>(
            environment.baseUrl +
            'Tracking/GetHeatAndSteamEmissionFactor/' +
            seedID
        );
    }
    public GetEmissionFactorVehiclebyID(
        seedID
    ): Observable<EmissionFactor[]> {
        return this.http.get<EmissionFactor[]>(
            environment.baseUrl +
            'Tracking/GetVehicleEmissionFactor/' +
            seedID
        );
    }
    UploadFile(formData: FormData): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/UploadFile',
            formData
        );
    }
    downloadFile(fileName: string): Observable<Blob> {
        return this.http.get(
            environment.baseUrl + 'Tracking/DownloadFile/' + fileName,
            { responseType: 'blob' }
        );
    }

    getMonthName(month: Date): string {
        const datePipe = new DatePipe('en-US');
        const selectedDate = new Date(month);
        return datePipe.transform(selectedDate, 'MMMM');
    }
    getYear(year: Date): string {
        const datePipe = new DatePipe('en-US');
        const selectedDate = new Date(year);
        return datePipe.transform(selectedDate, 'yyyy');
    }
    getBlend(): Observable<BlendType[]> {
        return this.http.get<BlendType[]>(environment.baseUrl +
            'Tracking/getBlendType')
    }
    getVehicleDEMode(): Observable<VehicleDEmode[]> {
        return this.http.get<VehicleDEmode[]>(environment.baseUrl +
            'Tracking/GetVehicleDEMode')
    }
    getElectricitySource(): Observable<ElectricitySource[]> {
        return this.http.get<ElectricitySource[]>(environment.baseUrl +
            'Tracking/GetElectricitySource')
    }
    getElectricityGrid(): Observable<ElectricityGrid[]> {
        return this.http.get<ElectricityGrid[]>(environment.baseUrl +
            'Tracking/GetElectricityGrid')
    }
    public PostSCDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/SaveSCDataEntry',
            data
        );
    }

    public newPostSCDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/stationaryCombustionEmission',
            data
        );
    }
    public stationaryFuels(data): Observable<any> {
        return this.http.get(
            environment.baseUrl + '/GhgSubcategoryTypesByCategoryId?category_id=' + data
            
        );
    }
    public PostRegrigerantDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/SaveRefrigerantDataEntry',
            data
        );
    }
    public newPostRegrigerantDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addrefrigerant',
            data
        );
    }
    public PostFireExtinguisherDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/SaveFireExtiguisherDataEntry',
            data
        );
    }
    public newPostFireExtinguisherDataEntry(data): Observable<any> {
        return this.http.post(
             environment.baseUrl + '/Addfireextinguisher',
            data
        );
    }
    public PostVehicleDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/SaveVehicleDataEntry',
            data
        );
    }
    public newPostVehicleDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addcompanyownedvehicles',
            data
        );
    }
    public PostElectricityDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/SaveElectricityDataEntry',
            data
        );
    }
    public newPostElectricityDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addelectricity',
            data
        );
    };
    public newPostElectricityMarket(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addrenewableelectricity',
            data
        );
    };
    public PostHeatandSteamDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + 'Tracking/SaveHeatandSteamDataEntry',
            data
        );
    }
    public newPostHeatandSteamDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addheatandsteam',
            data
        );
    }
    public getSCdataentry(subcatID: number, tenantID: number): Observable<StationaryCombustionDE[]> {
        return this.http.get<StationaryCombustionDE[]>(environment.baseUrl +
            'Tracking/getSCDataEntry/' + subcatID + '/' + tenantID)
    }
    public getrefdataentry(subcatID: number, tenantID: number): Observable<RefrigerantsDE[]> {
        return this.http.get<RefrigerantsDE[]>(environment.baseUrl +
            'Tracking/getrefDataEntry/' + subcatID + '/' + tenantID)
    }
    public getfiredataentry(subcatID: number, tenantID: number): Observable<FireExtinguisherDE[]> {
        return this.http.get<FireExtinguisherDE[]>(environment.baseUrl +
            'Tracking/getfireDataEntry/' + subcatID + '/' + tenantID)
    }
    public getvehicledataentry(subcatID: number, tenantID: number): Observable<VehicleDE[]> {
        return this.http.get<VehicleDE[]>(environment.baseUrl +
            'Tracking/getvehicleDataEntry/' + subcatID + '/' + tenantID)
    }
    public getHeatandSteamdataentry(subcatID: number, tenantID: number): Observable<VehicleDE[]> {
        return this.http.get<VehicleDE[]>(environment.baseUrl +
            'Tracking/getHeatandSteamDataEntry/' + subcatID + '/' + tenantID)
    }
    public getElectricdataentry(subcatID: number, tenantID: number): Observable<ElectricityDE[]> {
        return this.http.get<ElectricityDE[]>(environment.baseUrl +
            'Tracking/getElectricDataEntry/' + subcatID + '/' + tenantID)
    }
    public getUnits(subcatID: number): Observable<Units[]> {
        return this.http.get<Units[]>(environment.baseUrl +
            'Tracking/GetUnits/' + subcatID)
    }
    public newgetUnits(subcatID: number): Observable<Units[]> {
        return this.http.get<Units[]>(environment.baseUrl +'/GetUnits/' + subcatID)
    }
    public getDeliveryVehicleType(): Observable<VehicleType[]> {
        return this.http.get<VehicleType[]>(environment.baseUrl +
            'Tracking/GetDeliveryVehicleType')
    };

    public newGetDeliveryVehicleType(id , year): Observable<any> {
        return this.http.get(environment.baseUrl +'/Getdeliveryvehicletypes?facilityId=' + id + '&year=' + year)
    }
    public getPassengerVehicleType(): Observable<VehicleType[]> {
        return this.http.get<VehicleType[]>(environment.baseUrl +
            'Tracking/GetPassengerVehicleType')
    }
    public newGetPassengerVehicleType(id , year): Observable<any> {
        return this.http.get(environment.baseUrl +'/Getpassengervehicletypes?facilityId=' + id + '&year=' + year)
    }
    public getCategory(): Observable<ManageDataPointCategory[]> {
        return this.http.get<ManageDataPointCategory[]>(environment.baseUrl + 'Tracking/GetCategory')
    }
    public newgetCategory(): Observable<ManageDataPointCategory[]> {
        return this.http.get<ManageDataPointCategory[]>(environment.baseUrl + '/GetAllcategoryByScope')
    }
    public getSCpendingDataEntries(facilityID, year): Observable<any> {
        return this.http.get<any>(environment.baseUrl + 'Tracking/getSCpendingDataEntries/' + facilityID +
            '/' +
            year)
    }
    public newgetSCpendingDataEntries(data): Observable<any> {
        return this.http.post<any>(environment.baseUrl + '/GetpendingDataEnteries',data)
    }
    public newgetSCpendingDataEntriesForFuels(data): Observable<any> {
        return this.http.post<any>(environment.baseUrl + '/GetpendingDataEnteriesFuelType',data)
    }
    public getrefpendingDataEntries(facilityID, year): Observable<any> {
        return this.http.get<any>(environment.baseUrl + 'Tracking/getrefpendingDataEntries/' + facilityID +
            '/' +
            year)
    }
    public getfirependingDataEntries(facilityID, year): Observable<any> {
        return this.http.get<any>(environment.baseUrl + 'Tracking/getfirependingDataEntries/' + facilityID +
            '/' +
            year)
    }
    public getvehiclependingDataEntries(facilityID, year): Observable<any> {
        return this.http.get<any>(environment.baseUrl + 'Tracking/getvehiclependingDataEntries/' + facilityID +
            '/' +
            year)
    }
    public getElectricitypendingDataEntries(facilityID, year): Observable<any> {
        return this.http.get<any>(environment.baseUrl + 'Tracking/getElectricitypendingDataEntries/' + facilityID +
            '/' +
            year)
    }
    public getHeatandSteampendingDataEntries(facilityID, year): Observable<any> {
        return this.http.get<any>(environment.baseUrl + 'Tracking/getHeatandSteampendingDataEntries/' + facilityID +
            '/' +
            year)
    }
    public getsubCatType(subCatID): Observable<any> {
        return this.http.get<any>(environment.baseUrl + 'Tracking/GetSubCategoryTypes/' + subCatID)
    }
    public newgetsubCatType(subCatID , facility_id,year): Observable<any> {
        return this.http.get<any>(environment.baseUrl + '/GetSubCategoryTypes/' + subCatID + '?facilityId=' + facility_id + '&year=' + year)
    }
    public newGetRegionType(facility): Observable<any> {
        return this.http.post<any>(environment.baseUrl + '/electricitygridType', facility )
    }
   


    // Scope threee apis Routes starts ------->

   
    UploadTemplate(formData: FormData): Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type','application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*');  
        ; 
        return this.http.post(
            environment.baseUrl + '/uploadTemplate',
            formData
        );
    };
   
    submitPurchaseGoods(formData: any): Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type','application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        ;  
        ; 
        return this.http.post(
            environment.baseUrl + '/purchaseGoods',
            formData
        );
    };

    submitPurchaseGoods2(formData: any): Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type','application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        ;  
        ; 
        return this.http.post(
            environment.baseUrl + '/bulk-purchase-goods-upload',
            formData
        );
    };

    submitPurchaseGoodsAI(formData: any): Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type','application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*');  

        return this.http.post(
            environment.baseUrl + '/add-purchase-goods-match-unmatch-data',
            formData
        );  
    };

    triggerAIPRocess(): Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type','application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*');

        return this.http.get(environment.baseUrl2 + '/trigger-call');  
    };

    // http://http://13.200.247.29/:4000/getAllBatches
    getBatches(): Observable<any> {
        return this.http.get(
            environment.baseUrl + '/getAllBatches',
            
        )
    };

    getAirportCodes(): Observable<any> {
        return this.http.get(environment.baseUrl + '/getflightairportcode');
    };

    getEmployeeType(facilityId): Observable<any> {
        return this.http.get(environment.baseUrl + `/employeeCommunityCategory?facility_id=${facilityId}`)
    };
    getPurchaseCategorires(formData: any): Observable<any> {
        return this.http.post(environment.baseUrl + '/purchaseGoodsAllcategories', formData)
    };
    getEmployeeSubVehicleCat(id:any, facility_id:any,year): Observable<any> {
        return this.http.get(environment.baseUrl + `/employeeCommunitysubCategory/${id}/${facility_id}/${year}`)
    };
    getVehicleType(): Observable<any> {
        return this.http.get(environment.baseUrl + '/vehicleCategories')
    };
    getAllProductsPG(form): Observable<any> {
        return this.http.post(environment.baseUrl + '/get-all-purchase-categories-ef', form)
    };
    getVehicleTypeLease(): Observable<any> {
        return this.http.get(environment.baseUrl + '/vehicleCategories_lease')
    };
    getSubVehicleCat(id:any, facility_id:any): Observable<any> {
        return this.http.get(environment.baseUrl + `/vehicleSubCategories?id=${id}&facility_id=${facility_id}`)
    };
    getSubVehicleCatLease(id:any, facility_id:any): Observable<any> {
        return this.http.get(environment.baseUrl + `/vehicleSubCategories_lease?id=${id}&facility_id=${facility_id}`)
    };

    upStreamTransportation(formData: any): Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type','application/x-www-form-urlencoded')
        // .set('Access-Control-Allow-Origin', '*');  
        ; 
        return this.http.post(
            environment.baseUrl + '/upStreamTransportation',
            formData,{'headers':headers}
        );
    };

    downStreamTransportation(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/downStreamTransportation',
            formData
        );
    };
    calculateInvestmentEmission(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/calculateInvestmentEmission',
            formData
        );
    };
    uploadFranchise(formData: any): Observable<any> {
        console.log(formData);
        return this.http.post(
            environment.baseUrl + '/franchiseEmissionCalculate',
            formData
        );
    };
    uploadflightTravel(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/flightTravel',
            formData
        );
    };

    uploadHotelStay(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/hotelStay',
            formData
        );
    };
    uploadOtherModes(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Othermodes_of_transport',
            formData
        );
    };
    uploadupLeaseEmissionCalculate(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/upLeaseEmissionCalculate',
            formData
        );
    };
    downstreamLeaseEmissionCalculate(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/downLeaseEmissionCalculate',
            formData
        );
    };
    uploadHomeOffice(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/AddhomeofficeCategory',
            formData
        );
    };
    uploadEmployeeCommunity(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/AddemployeeCommuting',
            formData
        );
    };
    AddwatersupplytreatmentCategory(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/AddwatersupplytreatmentCategory',
            formData
        );
    };
    AddSoldProductsCategory(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/AddSoldProductsCategory',
            formData
        );
    };
    Addprocessing_of_sold_productsCategory(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addprocessing_of_sold_productsCategory',
            formData
        );
    };
    AddendoflifeCategory(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/AddendoflifeCategory',
            formData
        );
    };
    wasteGeneratedEmission(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/wasteGeneratedEmission',
            formData
        );
    };

    
    getFranchiseType(): Observable<any> {
        return this.http.get(environment.baseUrl + '/franchiseCategories')
    };
    getWasteType(facility_id): Observable<any> {
        return this.http.get(environment.baseUrl + '/getendoflife_waste_type?facility_id=' + facility_id)
    };

    getflight_types(): Observable<any> {
        return this.http.get(environment.baseUrl + '/flight_types')
    };
    getInvestmentCategories(): Observable<any> {
        return this.http.get(environment.baseUrl + '/getAllCategories')
    };
    getBusinessUnit(): Observable<any> {
        return this.http.get(environment.baseUrl + '/getAllbussinessUnit')
    };
    getFlightTimes(): Observable<any> {
        return this.http.get(environment.baseUrl + '/flight_types')
    };

    getSubFranchiseCat(categoryName:any,facility_id:any, year:any): Observable<any> {
        return this.http.get(environment.baseUrl + `/franchiseSubCategories?category=${categoryName}&facility_id=${facility_id}&year=${year}`)
    };
    
    getInvestmentSubCategory(categoryName:any): Observable<any> {
        return this.http.get(environment.baseUrl + `/getInvestmentSubCategory?category=${categoryName}`)
    };
    

    getStatus(url:any):Observable<any>{
       
        return this.http.get(environment.baseUrl + `/${url}`);
      };

      getPurchaseGoodEmissions(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/getPurchaseGoodEmissions',
            formData
        );
    };
      getProductsEnergy(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/getsoldproductCategory',
            formData
        );
    };
      getPurchaseGoodsActivity(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/getsectorCategory',
            formData
        );
    };
      getWasteSubCategory(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/getendoflife_waste_type_subcategory',
            formData
        );
    };
    getsubsectorCategory(formData: any): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/getsubsectorCategory',
            formData
        );
    };

    getEnergyFuelType(): Observable<any> {
        return this.http.get(environment.baseUrl + '/getsoldproductFuelType')
    };
    getPurchaseGoodsType(): Observable<any> {
        return this.http.get(environment.baseUrl + '/getintermediateCategory')
    };
    getPurchaseGoodsCurrency(data): Observable<any> {
        return this.http.post(environment.baseUrl + '/getcurrencyByfacilities', data)
    };
    getrefrigents(): Observable<any> {
        return this.http.get(environment.baseUrl + '/getrefrigents')
    };
}
