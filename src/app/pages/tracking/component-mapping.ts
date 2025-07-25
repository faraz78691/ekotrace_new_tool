// component-map.ts


export async function loadComponentByCategoryId(categoryID: number, businessId?: number): Promise<any> {
  switch (categoryID) {
    case 1:
      return (await import('./scope1/stationary_combustion/stationary-combustion.component')).StationaryCombustionComponent;
    case 2:
      return (await import('./scope1/refrigerants/refrigerants.component')).RefrigerantsComponent;

    case 3:
      return (await import('./scope1/fire_exten/fire-entinguisher.component')).FireEntinguisherComponent;

    case 6:
      return (await import('./scope1/company_owned/company-owned-vehicles.component')).CompanyOwnedVehiclesComponent;

    case 5:
      return (await import('./scope2/Electricity/electricity.component')).ElectricityComponent;

    case 7:
      return (await import('./scope2/Heat&Steam/heat-steam.component')).HeatSteamComponent;

    case 8:
      return (await import('./scope3/purchased-goods-services/purchased-goods-services.component')).PurchasedGoodsServicesComponent;

    case 9:
      return (await import('./scope3/fuel-energy/fuel-energy.component')).FuelEnergyComponent;

    case 10:
      return (await import('./scope3/upstream-transportation/upstream-transportation.component')).UpstreamTransportationComponent;

    case 11:
      return (await import('./scope3/water-suply-treatment/water-suply-treatment.component')).WaterSuplyTreatmentComponent;

    case 12:
      return (await import('./scope3/waste-generated/waste-generated.component')).WasteGeneratedComponent;

    case 13:
      switch (businessId) {
        case 24:
          return (await import('./scope3/business_travel/flight/flight.component')).FlightComponent;

        case 25:
          return (await import('./scope3/business_travel/hotal-stay/hotal-stay.component')).HotalStayComponent;

        case 26:
          return (await import('./scope3/business_travel/other-mode-transport/other-mode-transport.component')).OtherModeTransportComponent;
      }

    case 14:
      return (await import('./scope3/employee-commuting/employee-commuting.component')).EmployeeCommutingComponent;

    case 15:
      return (await import('./scope3/home-office/home-office.component')).HomeOfficeComponent;

    case 16:
      return (await import('./scope3/upstream-leased/upstream-leased.component')).UpstreamLeasedComponent;

    case 17:
      return (await import('./scope3/downstream-transportation/downstream-transportation.component')).DownstreamTransportationComponent;

    case 18:
      return (await import('./scope3/processing-sold-products/processing-sold-products.component')).ProcessingSoldProductsComponent;

    case 19:
      return (await import('./scope3/use-sold-products/use-sold-products.component')).UseSoldProductsComponent;

    case 20:
      return (await import('./scope3/end-of-life-treatment/end-of-life-treatment.component')).EndOfLifeTreatmentComponent;

    case 21:
      return (await import('./scope3/downstream-leased/downstream-leased.component')).DownstreamLeasedComponent;

    case 22:
      return (await import('./scope3/franchises/franchises.component')).FranchisesComponent;

    default:
      throw new Error(`Component not found for category ID: ${categoryID}`);
  }
}
