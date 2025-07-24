import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { HazardNonhazardComponent } from './hazard-nonhazard/hazard-nonhazard.component';

const routes: Routes = [
  {path: '', component: SettingsComponent },
  { path: 'hazardNonHazard', component: HazardNonhazardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
