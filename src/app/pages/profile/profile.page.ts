import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/@types/index.';
import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public userName: string = '';
  public email: string = '';
  public crn: string = '';

  public loading: boolean = true;
  public editing: boolean = false;

  constructor(
    private authService: AuthService,
    private darkMode: DarkModeService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const isDarkMode = this.darkMode.getDarkMode();
    this.darkMode.applyDarkMode(isDarkMode);

    try {
      const responseStatus = await this.authService.fetchUser();

      if (responseStatus === 200) {
        this.authService.getUser().subscribe((user: User | null) => {
          if (user) {
            this.userName = user.name
            this.email = user.email
            this.crn = user.crn || "CRN não cadastrado!"
          }
          this.loading = false;
        });
      } else {
        this.router.navigateByUrl('/login');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      this.router.navigateByUrl('/login');
    }
    
  }

  async logout() {
    try {
      const loggedOut = await this.authService.logout();
      if (loggedOut) {
        this.router.navigateByUrl('/login', {replaceUrl : true});
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  
  async editOn() {
   this.editing = this.editing ? false : true
  }

}
