
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Note } from '../models/note.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private customersNotesCollection: AngularFirestoreCollection<Note>;
  private notesCollection: AngularFirestoreCollection<Note>;

  constructor(private afs: AngularFirestore) {
    this.notesCollection = this.afs.collection(`customers/`);
  }

  getNotes(customerId: string): Observable<Note[]> {
    this.customersNotesCollection = this.afs.collection(`customers/${customerId}/notes`, ref => ref.orderBy('createdAt'));
    return this.customersNotesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  async addNote(note, customerId: string) {
    const addNote: Note = {
      text: note.text,
      title: note.title,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    return this.afs.collection(`customers/${customerId}/notes`).add(addNote).then(() => true).catch(() => false);
  }

  async updateNote(note: Note, customerId: string) {
    return this.notesCollection.doc(`${customerId}/notes/${note.id}`).update(note).then(() => true).catch((err) => false);
  }

  async deleteNote(noteId: string, customerId: string) {
    return this.notesCollection.doc(`${customerId}/notes/${noteId}`).delete().then(() => true).catch(() => false);
  }
}
