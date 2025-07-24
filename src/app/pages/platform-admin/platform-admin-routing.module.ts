import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformAdminComponent } from './platform-admin.component';

const routes: Routes = [{ path: '', component: PlatformAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformAdminRoutingModule { }
