import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public userProfile: firebase.firestore.DocumentReference;
  public currentUser: firebase.User;
  constructor(private authService: AuthService) {}

  async getUserProfile(): Promise<firebase.firestore.DocumentReference> {
    const user: firebase.User = await this.authService.getUser();
    this.currentUser = user;
    this.userProfile = firebase.firestore().doc(`userProfile/${user.uid}`);
    return this.userProfile;
  }

  updateName(firstName: string, lastName: string): Promise<void> {
    return this.userProfile.update({ firstName, lastName });
  }

  updateDOB(birthDate: string): Promise<any> {
    return this.userProfile.update({ birthDate });
  }

  async updateEmail(newEmail: string, password: string): Promise<void> {
    try {
      const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
        this.currentUser.email,
        password
      );

      await this.currentUser.reauthenticateWithCredential(credential);
      await this.currentUser.updateEmail(newEmail);
      return this.userProfile.update({ email: newEmail });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(
    newPassword: string,
    oldPassword: string
  ): Promise<void> {
    try {
      const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
        this.currentUser.email,
        oldPassword
      );

      await this.currentUser.reauthenticateWithCredential(credential);
      return this.currentUser.updatePassword(newPassword);
    } catch (error) {
      console.error(error);
    }
  }
}
