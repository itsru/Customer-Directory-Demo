import { Component, OnInit, NgZone, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers: any[];
  customersOriginal: any[];
  searchQuery = '';
  unsubscribe = new Subject<void>();

  constructor(
    private customerService: CustomerService,
    public authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.customerService.getCustomers().pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.customersOriginal = res;
      this.initializeItems();
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  @HostListener ('input') oninput() {
    this.filterList();
  }

  initializeItems(): void {
    this.customers = this.customersOriginal;
  }

  filterList() {
    this.initializeItems();

    const searchTerm = this.searchQuery;

    if (!searchTerm) {
      return;
    }

    this.customers = this.customers.filter(customer => {
      if (customer.name && searchTerm) {
        if (
          (
            `${customer.name} ${customer.city} ${customer.phone} ${customer.email} ${customer.country} ${customer.status}`
          ).toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        ) {
          return true;
        }
        return false;
      }
    });
  }

  changingValue(evt, customer) {
    this.customerService.updateCustomer(customer).then(
      () => {
        this.toastr.success(`Updated status for ${customer.name}`);
      }).catch(
     () => {
        this.toastr.error(`Failed to update. Try again`);
      });
  }

}
