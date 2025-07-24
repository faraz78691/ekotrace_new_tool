// component-map.ts


export async function loadComponentByCategoryId(categoryID: number): Promise<any> {
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
  
      default:
        throw new Error(`Component not found for category ID: ${categoryID}`);
    }
  }