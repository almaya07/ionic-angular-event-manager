import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public eventListRef: firebase.firestore.CollectionReference;
  constructor(private authService: AuthService) {}

  async getEventList(): Promise<firebase.firestore.QuerySnapshot> {
    const user: firebase.User = await this.authService.getUser();
    this.eventListRef = firebase
      .firestore()
      .collection(`userProfile/${user.uid}/eventList`);
    return this.eventListRef.get();
  }

  createEvent(
    eventName: string,
    eventDate: string,
    eventPrice: number,
    eventCost: number
  ): Promise<firebase.firestore.DocumentReference> {
    return this.eventListRef.add({
      name: eventName,
      date: eventDate,
      price: eventPrice * 1,
      cost: eventCost * 1,
      revenue: eventCost * -1
    });
  }

  getEventDetail(eventId: string): firebase.firestore.DocumentReference {
    return this.eventListRef.doc(eventId);
  }
}
