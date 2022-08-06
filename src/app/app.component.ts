import { Component } from '@angular/core';

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
    this.authService.login('josemnr@gmail.com','1234')
    .subscribe(rta => {
      console.log(rta)
      this.token = rta.access_token;
    })
  }

  getProfile() {
    this.authService.profile(this.token)
    .subscribe(profile => {
      console.log(profile);
    })
  }
}
