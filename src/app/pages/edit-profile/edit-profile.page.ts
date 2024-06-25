import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(private darkMode: DarkModeService) { }

  async ngOnInit() {

    const isDarkMode = this.darkMode.getDarkMode();
    this.darkMode.applyDarkMode(isDarkMode);

  }

}
