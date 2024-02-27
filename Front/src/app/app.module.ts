import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { StockProductsComponent } from './stock-products/stock-products.component';
import { IgxInputGroupModule, IgxButtonModule, IgxRippleModule, IgxToggleModule, IgxDialogModule, IgxNavbarModule, IgxIconModule, IgxNavigationDrawerModule, IgxListModule } from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { DiscountsComponent } from './discounts/discounts.component';
import { SoldProductsComponent } from './sold-products/sold-products.component';
import { CombosComponent } from './combos/combos.component';
import { EstablishmentComponent } from './establishment/establishment.component';
import { HomeComponent } from './home/home.component';
import { AddsoldproductComponent } from './stock-products/addsoldproduct/addsoldproduct.component';


@NgModule({
  declarations: [
    HomeComponent,
    StockProductsComponent,
    DiscountsComponent,
    SoldProductsComponent,
    CombosComponent,
    EstablishmentComponent,
    AddsoldproductComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    IgxInputGroupModule,
    IgxButtonModule,
    IgxRippleModule,
    IgxToggleModule,
    IgxDialogModule,
    FormsModule,
    IgxNavbarModule,
    IgxIconModule,
    IgxNavigationDrawerModule,
    IgxListModule
  ],
  providers: [],
})
export class AppModule {
}
