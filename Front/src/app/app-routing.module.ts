import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './error-routing/not-found/not-found.component';
import { UncaughtErrorComponent } from './error-routing/error/uncaught-error.component';
import { ErrorRoutingModule } from './error-routing/error-routing.module';
import { StockProductsComponent } from './stock-products/stock-products.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { SoldProductsComponent } from './sold-products/sold-products.component';
import { CombosComponent } from './combos/combos.component';
import { EstablishmentComponent } from './establishment/establishment.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'stock-products', component: StockProductsComponent, data: { text: 'StockProducts' } },
      { path: 'discounts', component: DiscountsComponent, data: { text: 'Discounts' } },
      { path: 'sold-products', component: SoldProductsComponent, data: { text: 'SoldProducts' } },
      { path: 'combos', component: CombosComponent, data: { text: 'Combos' } },
      { path: 'establishment', component: EstablishmentComponent, data: { text: 'Establishment' } },
      { path: '', redirectTo: 'establishment', pathMatch: 'full' } ,// Default route within HomeComponent
      { path: '**', component: PageNotFoundComponent } // must always be last
    ]
  },
  { path: 'error', component: UncaughtErrorComponent },
  { path: '**', component: PageNotFoundComponent } // must always be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true }), ErrorRoutingModule],
  exports: [RouterModule, ErrorRoutingModule]
})
export class AppRoutingModule {
}
