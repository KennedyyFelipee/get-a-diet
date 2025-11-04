import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-alter-password',
  templateUrl: './alter-password.page.html',
  styleUrls: ['./alter-password.page.scss'],
})
export class AlterPasswordPage implements OnInit {
  form!: FormGroup;
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private cookies: CookieService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      old_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'danger', duration = 2500) {
    const t = await this.toast.create({ message, color, duration, position: 'top' });
    await t.present();
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return this.presentToast('Preencha os campos corretamente', 'warning');
    }

    const { old_password, new_password, confirm_password } = this.form.value;

    if (new_password !== confirm_password) {
      return this.presentToast('As senhas não coincidem', 'warning');
    }

    this.isLoading = true;
    const loading = await this.loadingCtrl.create({ message: 'Atualizando senha...' });
    await loading.present();

    try {
      // usa a instância axios do AuthService (já tem baseURL e interceptors)
      const http = this.auth.getHttpClient();

      // pega o access token salvo em cookie (se você usa cookie)
      const token = this.cookies.get('get-a-diet.access-token') || '';

      const response = await http.patch(
        '/users/password',
        { old_password, new_password },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      // Sucesso
      await loading.dismiss();
      this.isLoading = false;
      this.presentToast('Senha alterada com sucesso', 'success');
      this.form.reset();
    } catch (err: any) {
      await loading.dismiss();
      this.isLoading = false;

      // tenta extrair mensagem do backend
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Erro ao alterar senha. Verifique os dados.';

      // mostra mensagem detalhada para te ajudar a debugar
      this.presentToast(message, 'danger', 4000);
      console.error('Erro na alteração de senha:', err);
    }
  }
}
