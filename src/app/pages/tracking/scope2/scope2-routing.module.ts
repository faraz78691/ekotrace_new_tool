import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
//   {
//     path: 'some-scope2-category',
//     loadComponent: () =>
//       import('./some-scope2-category.component').then(
//         (m) => m.SomeScope2CategoryComponent
//       ),
//   },
  // Add more scope2 categories here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Scope2RoutingModule {}
