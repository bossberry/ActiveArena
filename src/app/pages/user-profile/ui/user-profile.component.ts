import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../shared/data-access/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../shared/models/users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/data-access/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Timestamp } from '@angular/fire/firestore';
import { take, switchMap } from 'rxjs';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatToolbarModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatButtonModule, 
    MatInputModule, 
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  currentUser: any = {};
  profileForm: FormGroup;
  user: User | null = null;
  editMode: boolean = false;

  constructor(
  ) {
    this.profileForm = this.fb.group({
      displayName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      height: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.editMode = params['editMode'] === 'true';
    });

    this.authService.getUserProfile().pipe(
      take(1),
      switchMap(userAuth => {
        if (userAuth) {
          return this.userService.getUser(userAuth.uid).pipe(
            take(1),
            switchMap(user => {
              this.user = { ...userAuth, ...user };
              this.profileForm.patchValue({
                displayName: this.user?.displayName || '',
                height: this.user?.height || null,
                mobileNo: this.user?.mobileNo || null,
                dateOfBirth: this.user?.dateOfBirth ? this.user.dateOfBirth.toDate() : '',
              });
              return []; 
            })
          );
        } else {
          return [];
        }
      })
    ).subscribe({
      error: err => console.error('Error fetching user data', err)
    });
  }
  
  saveProfile() {
    if (this.profileForm.valid && this.user) {
      const updatedUser: Partial<User> = {
        displayName: this.profileForm.value.displayName,
        dateOfBirth: Timestamp.fromDate(new Date(this.profileForm.value.dateOfBirth)),
        height: parseInt(this.profileForm.value.height, 10),
        mobileNo: this.profileForm.value.mobileNo,
        profileCompleted: true
      };

      this.userService.updateUser(this.user.uid, updatedUser).subscribe({
        next: () => console.log('go to dashboard'),
        error: (error) => console.error('Update failed:', error)
      });
    }
  }
  
  logout() {
    this.authService.logout().then((res) => {
      this.router.navigate(['/login'])
    }).catch(error => {
      console.error('Logout failed:', error);
    });
  }
}