import { Component } from '@angular/core';
import { User } from './models/user.model';

import { AuthService } from './services/auth.service'
import { UsersService } from './services/users.service'
import { FilesService } from './services/files.service';


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
  imgRta = '';

  constructor(
    private authService: AuthService,
    private filesService: FilesService,
    private usersService: UsersService,
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

  downloadPdf() {
    this.filesService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if(file) {
      this.filesService.uploadFile(file)
      .subscribe(rta => {
        this.imgRta = rta.location;
      });
    }
  }
}
