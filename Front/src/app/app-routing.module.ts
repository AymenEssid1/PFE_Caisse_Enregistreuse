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
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'sign-in',
   
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component'),
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
        path: 'establishments',component: EstablishmentsComponent
        
      },
      {
        path: 'addestablishments',component: AddestabComponent
        
      },
      
      {
        path: 'caissiers',component: CashiersComponent
        
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
