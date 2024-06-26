import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginform!: FormGroup

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private darkMode: DarkModeService) { }

  ngOnInit() {
    const isDarkMode = this.darkMode.getDarkMode();
    this.darkMode.applyDarkMode(isDarkMode);
    
    this.loginform = this.formBuilder.group({
      email: "",
      password: ""
    })
  }

  async onSubmit(): Promise<void> {
    const { email, password } = this.loginform.value

    const response = await this.authService.authenticate({ email, password })

    if (response === 200) {
      this.router.navigateByUrl('/').then(() => window.location.reload())
    }

  }

}
