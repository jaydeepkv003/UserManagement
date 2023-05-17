import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '@app/Sevices/user.service';
import { environment } from '@app/environment/environment';
import { RootUser, User } from './user.data';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, ReactiveFormsModule, MatButtonModule, MatProgressSpinnerModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserService, HttpClientModule]
})

export class UsersComponent implements OnInit {
  public userData: User[] = [];
  public isContentReady: boolean = false;
  public userGroup: FormGroup;
  public isSpinner: boolean = false;

  @ViewChild('accordion') accordion: TemplateRef<any>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userGroup = new FormGroup({
      userGroupArray: new FormArray([])
    })
    this.getUserFromAPI();
  }
  getUserFromAPI() {
    this.userService.getUser(environment.userAPI).subscribe((resp: RootUser) => {
      this.userData = resp.users;
      for (let i = 0; i < this.userData.length; i++) {
        this.userArray.push(this.generateForm(resp.users[i]));
      }
      this.isContentReady = true;
    })
  }

  get userArray(): FormArray {
    return this.userGroup.get('userGroupArray') as FormArray;
  }

  generateForm(data: User): FormGroup {
    return new FormGroup({
      id: new FormControl(data.id),
      firstName: new FormControl(data.firstName),
      lastName: new FormControl(data.lastName),
      maidenName: new FormControl(data.maidenName),
      gender: new FormControl(data.gender),
    })
  }

  onSave(index: number) {
    const Payload = {
      ... this.userData[index],
      firstName: this.userArray.controls[index].get('firstName').value,
      lastName: this.userArray.controls[index].get('lastName').value,
      maidenName: this.userArray.controls[index].get('maidenName').value,
      gender: this.userArray.controls[index].get("gender").value
    }
    this.isSpinner = true;
    this.userService.updateUser(`${environment.userAPI}/${this.userArray.controls[index].get('id').value}`, Payload).subscribe((resp) => {
      this.isSpinner = false;
      this.isContentReady = false;
      this.userArray.clear();
      this.getUserFromAPI();
    })
  }
}
