import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'two-factor',
    loadChildren: () => import('./pages/two-factor/two-factor.module').then( m => m.TwoFactorPageModule)
  },
  {
    path: 'alter-password',
    loadChildren: () => import('./pages/alter-password/alter-password.module').then( m => m.AlterPasswordPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
