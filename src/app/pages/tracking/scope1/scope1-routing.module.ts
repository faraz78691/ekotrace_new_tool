// src/app/tracking/scope1/scope1-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'stationary-combustion',
    loadComponent: () =>
      import('./stationary_combustion/stationary-combustion.component').then(
        (m) => m.StationaryCombustionComponent
      ),
  },
  {
    path: 'refrigerants',
    loadComponent: () =>
      import('./refrigerants/refrigerants.component').then((m) => m.RefrigerantsComponent),
  },
  {
    path: 'fire-extinguisher',
    loadComponent: () =>
      import('./fire_exten/fire-entinguisher.component').then(
        (m) => m.FireEntinguisherComponent
      ),
  },
  {
    path: 'company-vehicles',
    loadComponent: () =>
      import('./company_owned/company-owned-vehicles.component').then(
        (m) => m.CompanyOwnedVehiclesComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Scope1RoutingModule {}
