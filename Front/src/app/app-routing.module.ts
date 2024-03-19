import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './guard/auth.guard';
import { EstablishmentsComponent } from './demo/extra/establishments/establishments.component';
import { CashiersComponent } from './demo/extra/cashiers/cashiers.component';
import AuthSigninComponent from './demo/pages/authentication/auth-signin/auth-signin.component';
import AuthSignupComponent from './demo/pages/authentication/auth-signup/auth-signup.component';
import { SignInGuard } from './guard/sign-in.guard';
import { AddestabComponent } from './demo/extra/establishments/addestab/addestab.component';
import { StockComponent } from './demo/extra/Stock/stock/stock.component';
import { StockFormComponent } from './demo/extra/Stock/stock-form/stock-form.component';
import { SoldProductsComponent } from './demo/extra/SoldProducts/sold-products/sold-products.component';
import { SoldproductFormComponent } from './demo/extra/SoldProducts/soldproduct-form/soldproduct-form.component';
import { ComboComponent } from './demo/extra/combo/combo.component';
import { ComboFormComponent } from './demo/extra/combo/combo-form/combo-form.component';
import { ForgotPasswordComponent } from './demo/pages/authentication/forgot-password/forgot-password.component';
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'sign-in',
   
  },
  {
    path: 'reset-pwd',component: ForgotPasswordComponent
    
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'basic',
        loadChildren: () =>
          import('./demo/ui-elements/ui-basic/ui-basic.module').then(
            (m) => m.UiBasicModule,
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./demo/pages/form-elements/form-elements.module').then(
            (m) => m.FormElementsModule,
          ),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./demo/pages/tables/tables.module').then(
            (m) => m.TablesModule,
          ),
      },
      {
        path: 'apexchart',
        loadComponent: () =>
          import('./demo/chart/apex-chart/apex-chart.component'),
      },
      {
        path: 'sample-page',
        loadComponent: () =>
          import('./demo/extra/sample-page/sample-page.component'),
      },
      {
        path: 'establishments',component: EstablishmentsComponent,
        canActivate: [AuthGuard]

        
      },
      {
        path: 'addestablishments',component: AddestabComponent
        
      },
      
      {
        path: 'caissiers',component: CashiersComponent
        
      },
      
      {
        path: 'stock',component: StockComponent
        
      },
      {
        path: 'stockF',component: StockFormComponent
        
      },

      {
        path: 'sold',component: SoldProductsComponent
        
      },
      {
        path: 'soldF',component: SoldproductFormComponent
        
      },
      {
        path: 'combo',component: ComboComponent,
        canActivate: [AuthGuard]
        
      },
      {
        path: 'comboF',component: ComboFormComponent,
        canActivate: [AuthGuard]
        
      },
      
    ],
  },
  {
    path: 'sign-in',
    component: AuthSigninComponent,
    canActivate: [SignInGuard] // Prevent accessing sign-in page if already authenticated

  },
  {
    path: 'sign-up',
    component: AuthSignupComponent,

   
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
