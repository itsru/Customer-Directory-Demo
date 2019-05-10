import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { NotesService } from '../../services/notes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ModalDirective) modal: ModalDirective;
  customerId: string;
  customer: Customer;
  notes: Note[];
  unsubscribe = new Subject<void>();
  noteForm: FormGroup;
  modalTitle: string;
  editingNote: Note;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private notesService: NotesService,
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.noteForm = this.fb.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      text: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.loadCustomer();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async loadCustomer() {
    this.customerService
      .getCustomer(this.customerId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.customer = res;
      });

    this.notesService
      .getNotes(this.customerId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.notes = res;
      });
  }

  async saveCustomer() {
    if (!this.customer.id) {
      return this.toastr.error('No valid customer found');
    }
    this.customerService
      .updateCustomer(this.customer)
      .then(() => this.router.navigate(['/customers']));
  }

  setModalTitle(title: string) {
    this.modalTitle = title;
  }

  cancelAddEdit() {
    this.editingNote = null;
    this.noteForm.reset();
  }

  editNote(note: Note) {
    this.setModalTitle('Editing a Note');
    this.editingNote = note;
    this.noteForm.controls.title.setValue(note.title);
    this.noteForm.controls.text.setValue(note.text);
  }

  updateNote() {
    const tempNote: Note = {
      id: this.editingNote.id,
      title: this.noteForm.controls.title.value,
      text: this.noteForm.controls.text.value,
      createdAt: this.editingNote.createdAt
    };
    this.editingNote = null;
    this.notesService
      .updateNote(tempNote, this.customerId)
      .then(res => {
        if (res) {
          this.toastr.success('Edited Note');
          this.noteForm.reset();
        } else {
          this.toastr.warning('Error editing the note');
        }
      });
  }

  addNote() {
    const tempNote: Note = {
      title: this.noteForm.controls.title.value,
      text: this.noteForm.controls.text.value
    };
    this.noteForm.reset();
    this.notesService.addNote(tempNote, this.customerId).then(res => {
      if (res) {
        this.toastr.success(`Added Note: ${tempNote.title}`);
      } else {
        this.toastr.warning(`Error adding the note: ${tempNote.title}`);
      }
    });
  }

  deleteNote(noteId: string) {
    this.notesService
      .deleteNote(noteId, this.customer.id)
      .then(res =>
        res
          ? this.toastr.success('Deleted Note')
          : this.toastr.warning('Error deleting the note')
      );
  }

  changingValue(evt, customer: Customer) {
    this.customerService
      .updateCustomer(customer)
      .then(() => {
        this.toastr.success(`Updated status for ${customer.name}`);
      })
      .catch(() => {
        this.toastr.error(`Failed to update. Try again`);
      });
  }
}
