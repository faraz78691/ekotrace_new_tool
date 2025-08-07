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

  
    public getAllDataEntries() {
        return this.http.get(environment.baseUrl + 'Tracking');
    }

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
        )
    };

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


  
    public postNotification(data): Observable<any> {
        return this.http.post(environment.baseUrl + 'Notification', data);
    }
 
    getMonthName(month: Date): string {
        const datePipe = new DatePipe('en-US');
        const selectedDate = new Date(month);
        return datePipe.transform(selectedDate, 'MMM');
    }
    getYear(year: Date): string {
        const datePipe = new DatePipe('en-US');
        const selectedDate = new Date(year);
        return datePipe.transform(selectedDate, 'yyyy');
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

    public newPostRegrigerantDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addrefrigerant',
            data
        );
    }
    public newPostFireExtinguisherDataEntry(data): Observable<any> {
        return this.http.post(
             environment.baseUrl + '/Addfireextinguisher',
            data
        );
    }
  
    public newPostVehicleDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addcompanyownedvehicles',
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

    public newPostHeatandSteamDataEntry(data): Observable<any> {
        return this.http.post(
            environment.baseUrl + '/Addheatandsteam',
            data
        );
    }
    public newgetUnits(subcatID: number): Observable<Units[]> {
        return this.http.get<Units[]>(environment.baseUrl +'/GetUnits/' + subcatID)
    }
  

    public newGetDeliveryVehicleType(id , year): Observable<any> {
        return this.http.get(environment.baseUrl +'/Getdeliveryvehicletypes?facilityId=' + id + '&year=' + year)
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
 
    public newgetSCpendingDataEntries(data): Observable<any> {
        return this.http.post<any>(environment.baseUrl + '/GetpendingDataEnteries',data)
    }
    public newgetSCpendingDataEntriesForFuels(data): Observable<any> {
        return this.http.post<any>(environment.baseUrl + '/GetpendingDataEnteriesFuelType',data)
    }
  

  
    public newgetsubCatType(subCatID , facility_id,year): Observable<any> {
        return this.http.get<any>(environment.baseUrl + '/GetSubCategoryTypes/' + subCatID + '?facilityId=' + facility_id + '&year=' + year)
    }
    public newGetRegionType(facility): Observable<any> {
        return this.http.post<any>(environment.baseUrl + '/electricitygridType', facility )
    }
   

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
