import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private darkMode: DarkModeService,
    private toastController: ToastController
  ) { }

  private MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
  
      if (!passwordControl || !confirmPasswordControl) {
        return null; // Retorna null se os controles não estiverem presentes
      }
      const passwordsMatch = passwordControl.value === confirmPasswordControl.value;
  
      if (confirmPasswordControl.value === "") {
        confirmPasswordControl.setErrors({ passwordEmpty: true });
        return { passwordEmpty: true }; // Retorna um objeto com o erro passwordMismatch
      }else if (!passwordsMatch) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true }; // Retorna um objeto com o erro passwordMismatch
      } else {
        confirmPasswordControl.setErrors(null);
        return null; // Retorna null se as senhas coincidirem
      }
    };
  }
  
  

  ngOnInit() {
    const isDarkMode = this.darkMode.getDarkMode();
    this.darkMode.applyDarkMode(isDarkMode);

    this.registerForm = this.formBuilder.group({
      name: [''],
      crn: [''],
      email: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.MatchPassword('password', 'confirmPassword')
    });
    
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  
  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const { name, crn, email, password } = this.registerForm.value;

      await this.authService.register({ name, crn, email, password });

      await this.authService.authenticate({ email, password });

      this.router.navigateByUrl('/');

    } else {

      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });

      if (this.registerForm.hasError('passwordMismatch')) {
        await this.presentToast('As senhas não coincidem. Por favor, verifique.');
      } else {
        await this.presentToast('Formulário inválido. Por favor, preencha todos os campos corretamente.');
      }

      //await this.presentToast('Formulário inválido. Por favor, preencha todos os campos corretamente.');
      console.error('Formulário inválido.');
    }
  }
}
