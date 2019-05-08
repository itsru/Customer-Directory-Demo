import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Components
import { LoginComponent } from '../components/login/login.component';
import { CustomersComponent } from '../components/customers/customers.component';
import { CustomerDetailsComponent } from '../components/customers/customer-details.component';

// Import guard services
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuard] },
  { path: 'customer-details',
    component: CustomerDetailsComponent,
    canActivate: [AuthGuard] },
  { path: 'customer-details/:id',
    component: CustomerDetailsComponent,
    canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
