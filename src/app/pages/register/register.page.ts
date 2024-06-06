import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  private MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        return confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        return confirmPasswordControl.setErrors(null);
      }
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: '',
      crn: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  async onSubmit(): Promise<void> {
    const { name, crn, email, password } = this.registerForm.value

    await this.authService.register({ name, crn, email, password })

    await this.authService.authenticate({ email, password })

    this.router.navigateByUrl('/')
  }
}
