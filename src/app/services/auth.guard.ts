import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private apiService: ApiService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      if(navigator.onLine){
        if (this.apiService.isAuth()) {
          return true;
        } else {
          alert('you are not login yet!');
          this.router.navigate(['/login']);
          return false;
        }
      }
      else{
        this.router.navigate(['/404']);
        return false
      }
  }
}
