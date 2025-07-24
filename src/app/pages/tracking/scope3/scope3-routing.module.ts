import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    // path: 'some-scope3-category',
    // loadComponent: () =>
    //   import('./some-scope3-category.component').then(
    //     (m) => m.SomeScope3CategoryComponent
    //   ),
  },
  // Add more scope3 categories here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Scope3RoutingModule {}
