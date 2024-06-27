import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginform!: FormGroup

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private darkMode: DarkModeService,private toastController: ToastController) { }

  ngOnInit() {
    const isDarkMode = this.darkMode.getDarkMode();
    this.darkMode.applyDarkMode(isDarkMode);
    
    this.loginform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    
    const passwordControl = this.loginform.get('password');

    if (passwordControl && passwordControl.hasError('incorrectCredentials')) {
      passwordControl.setErrors(null);
    }

    if (this.loginform.valid) {
      try {
        const { email, password } = this.loginform.value;
        const response = await this.authService.authenticate({ email, password });
  
        if (response === 200) {
          this.router.navigateByUrl('/').then(() => window.location.reload());
        }
      } catch(error) {

        const passwordControl = this.loginform.get('password');
        if (passwordControl) {
          passwordControl.setErrors({ incorrectCredentials: true });
        }

        Object.values(this.loginform.controls).forEach(control => {
          control.markAsTouched();
        });
        await this.presentToast('Email ou senha incorretos. Verifique suas credenciais.');
       
      }
    } else {
      await this.presentToast('Formulário inválido. Por favor, preencha todos os campos corretamente.');
      Object.values(this.loginform.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

}
