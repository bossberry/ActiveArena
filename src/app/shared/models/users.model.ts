import { Timestamp } from '@angular/fire/firestore';

export interface User {
  uid: string;
  email: string;
  mobileNo: string;
  displayName: string;
  dateOfBirth?: Timestamp;
  height: number;
  photoURL: string;
  createdAt: Date;
  lastLoginAt: Date;
  roles: string;
  profileCompleted: boolean;
}