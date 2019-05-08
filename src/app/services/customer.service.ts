import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentReference
} from '@angular/fire/firestore';
import { Customer } from '../models/customer.model';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersCollection: AngularFirestoreCollection<Customer>;
  private customers: Observable<Customer[]>;
  private user: User;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {

    this.user = this.authService.getCurrentUser();
    this.customersCollection = afs.collection<Customer>('customers');

    const thisUsersCustomerCollection = afs.collection<Customer>('customers', ref =>
      ref.where('userId', '==', this.user.uid)
    );

    this.customers = thisUsersCustomerCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCustomers() {
    return this.customers;
  }

  getCustomer(id: string): Observable<Customer> {
    return this.customersCollection
      .doc<Customer>(id)
      .valueChanges()
      .pipe(
        take(1), // Remove if concurrent users are editing the customers
        map(customer => {
          customer.id = id;
          return customer;
        })
      );
  }

  async updateCustomer(customer: Customer): Promise<void> {
    await this.customersCollection.doc(customer.id).update(customer);
  }

  addCustomer(customer: Customer): Promise<DocumentReference> {
    return this.customersCollection.add(customer);
  }

  removeCustomer(id: string): Promise<void> {
    return this.customersCollection.doc(id).delete();
  }
}
