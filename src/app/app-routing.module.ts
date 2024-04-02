import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NonetComponent } from './components/nonet/nonet.component';
import { AuthGuard } from './services/auth.guard';
import { logoutGuard } from './services/logout.guard';
import { SettingComponent } from './components/setting/setting.component';

const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'login',component:LoginComponent,canActivate:[logoutGuard]},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard]},
  {path:'404',component:NonetComponent},
  {path:'settings',component:SettingComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
