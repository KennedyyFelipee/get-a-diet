import { Component, ElementRef, OnInit} from '@angular/core';
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
    private toastController: ToastController,
    private elementRef:ElementRef
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
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // novo campo
    }, {
      validators: this.MatchPassword('password', 'confirmPassword')
    });
    
  }

  async onInputBlur(event: any) {
    console.log(event.target.value);
    const crn = event.target.value
    const response = await this.authService.getHttpClient().post("/verify/crn", {crn})
    console.log(response)
    const {crnInfo} = response.data 
    if (crnInfo === null || crnInfo.valid === false){
      const crnControl = this.registerForm.get('crn');
      if (crnControl && crnControl.value.length > 0) {
        crnControl.setErrors({ invalidSub: true });
        await this.presentToast('Numero de CRN inválido.');
      }
    }else {
      const crnControl = this.registerForm.get('crn');
      if (crnControl) {
        crnControl.setErrors(null);
      }
    }
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
      const { name, email, password } = this.registerForm.value;
      let { crn } = this.registerForm.value

      if(crn.length < 1) {
        crn = null
      }

      const registerResponse = await this.authService.register({ name, crn, email, password });
      console.log(registerResponse)
      if (registerResponse.status === 409 && registerResponse.data.message === 'E-mail already exists.') {
        
        await this.presentToast('Este email ja esta em uso. Por favor escolha outro.');

        const emailControl = this.registerForm.get('email');
        if (emailControl) {
          emailControl.setErrors({ emailAlreadyExist: true });
          Object.values(this.registerForm.controls).forEach(control => {
            control.markAsTouched();
          });
        }

      }

      if (registerResponse.status === 201) {
        await this.authService.authenticate({ email, password });
        this.router.navigateByUrl('/');
      }

    } else {

      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });

      if (this.registerForm.hasError('passwordMismatch')) {
        await this.presentToast('As senhas não coincidem. Por favor, verifique.');
      } else {
        await this.presentToast('Formulário inválido. Por favor, preencha todos os campos corretamente.');
      }
 
      console.error('Formulário inválido.');
    }
  }
 
    rua: string = '';

    async buscarCep() {
      const cep = this.registerForm.get('cep')?.value;
      if (!cep || cep.length !== 8) {
        this.rua = '';
        
        return;
      }

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          this.rua = 'CEP inválido';
        } else {
          this.rua = data.logradouro || 'Rua não encontrada';
        }

      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        this.rua = 'Erro ao buscar';
      }
    }
}
