import { Component } from '@angular/core';
import { User } from './models/user.model';

import { AuthService } from './services/auth.service'
import { UsersService } from './services/users.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token = '';
  profile: User | null = null;

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {

  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService.create(
      {
        name: 'Jose',
        email: 'josemnr@gmail.com',
        password: '1234'
      }
    )
    .subscribe(rta => {
      console.log(rta);
    });
  }

  login() {
    this.authService.loginAndGet('josemnr@gmail.com', '1234')
    .subscribe(user => {
      this.profile = user;
    });
  }

  getProfile() {
    this.authService.getProfile()
    .subscribe(user => {
      this.profile = user;
    })
  }
}
