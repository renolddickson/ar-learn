import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  topic!:any;
  userSettings: any;
  uid:any;
  isLoading=false;
  points!:number;
  constructor(private apiService: ApiService,) { }
  ngOnInit(): void {
    const currentUser = this.apiService.getToken();
    this.uid=this.apiService.getUid()
    if (currentUser) {
      this.apiService.getUserInfo().subscribe((res) => {
        this.userSettings = res;
      })
    }
  }
  saveStorename() {
      this.isLoading=true;
      this.userSettings.points = this.points
      this.apiService.updateDocument('userinfo', 'data', this.userSettings).then(() => {
        localStorage.setItem('userinfo', JSON.stringify(this.userSettings))
        this.isLoading=false
      }).catch((err: any) => {
        alert("Error occured");
        this.isLoading=false
      })
    }
}
