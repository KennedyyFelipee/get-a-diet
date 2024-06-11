import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  isDarkMode : boolean = false 

  constructor(private darkMode: DarkModeService) { }

  async ngOnInit() {

    this.isDarkMode = this.darkMode.getDarkMode()
    this.darkMode.applyDarkMode(this.isDarkMode)

  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.darkMode.setDarkMode(this.isDarkMode)
  }

}
