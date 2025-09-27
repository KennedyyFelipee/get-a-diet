import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Diet, User } from 'src/app/@types/index.';

import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public showToast: boolean = false;

  private user!: User | null 
  public userNameFormatted: string = ""
  public days_in_offensive: number = 0
  public orientations: string[] | null = null
  public hasDiet: boolean = false
  
  public greeting!: String
  public loading: boolean = true
  
  private dietsList: Diet[] = []

  public filteredList: Diet[] | null = []


  constructor(private authService: AuthService, private darkMode: DarkModeService, private router: Router, private cookies: CookieService) { }

  generateGreeting() {
    const timeOfDay = new Date().getHours()

    if (timeOfDay < 12) {
      return 'Bom dia'
    } else if (timeOfDay < 18) {
      return 'Boa tarde'
    } else {
      return 'Boa noite'
    }
  }



  handleInput(event: any) {
    const query: string = event.target.value.toLowerCase();

    this.filteredList = this.dietsList.filter(diet => {
      if(diet.title.toLowerCase().includes(query)) {
        return true
      } else if (diet.id.toLowerCase() === query.toLowerCase()) {
        return true
      }
      return null
    })    
  }

  async handleSetDietToUser(dietId: string) {
    const accessToken = this.cookies.get('get-a-diet.access-token')
    await this.authService.getHttpClient().put('/set-new-diet', {dietId} , 
    { headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    this.showToast = true; // Exibe o aviso
    
    // Aguarda o toast aparecer antes de atualizar os dados
    setTimeout(async () => {
      await this.loadData();
    }, 1000);
  }

  async ngOnInit(): Promise<void> {

    const isDarkMode = this.darkMode.getDarkMode();
    this.darkMode.applyDarkMode(isDarkMode);

    this.loading = true
    this.greeting = this.generateGreeting()

    const responseStatus = await this.authService.fetchUser()

    if (responseStatus === 200) {
      this.authService.getUser().subscribe(data => this.user = data)
      const getDietsListResponse = await this.authService.getHttpClient().get('/diets')

      this.dietsList = getDietsListResponse.data.diets

      if (this.user) {
        this.userNameFormatted = this.user.name.split(" ")[0];
        this.days_in_offensive = this.user.days_in_offensive;

          // Correção rápida: log para verificar se o valor está vindo
          console.log('Dias em ofensiva: ', this.days_in_offensive);

        if (this.user.diet) {
          this.hasDiet = true
          this.orientations = this.user.diet.orientations
        }
      }

      this.loading = false
    } else {
      this.router.navigateByUrl('/login')
    }

    await this.loadData(); //metodo para recarregar os dados apos trocar uma dieta

  }
  // metodo para recarregar os dados apos trocar uma dieta
  async loadData(): Promise<void> {
    this.loading = true;
    this.greeting = this.generateGreeting();

    const responseStatus = await this.authService.fetchUser();

    if (responseStatus === 200) {
      this.authService.getUser().subscribe(data => this.user = data);
      const getDietsListResponse = await this.authService.getHttpClient().get('/diets');
      this.dietsList = getDietsListResponse.data.diets;

      if (this.user) {
        this.userNameFormatted = this.user.name.split(" ")[0];
        this.days_in_offensive = this.user.days_in_offensive;

        if (this.user.diet) {
          this.hasDiet = true;
          this.orientations = this.user.diet.orientations;
        } else {
          this.hasDiet = false;
          this.orientations = null;
        }
      }

      this.loading = false;
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}