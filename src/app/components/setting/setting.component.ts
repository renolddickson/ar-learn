import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {
settingForm!:FormGroup;
imgChangeEvt: any = '';
imageLoading=false
blob:any;
objectUrl:any;
isLoading=false;
constructor(private apiService:ApiService){}
ngOnInit(): void {
this.settingForm=new FormGroup({
  username : new FormControl(null,Validators.required),
  picture : new FormControl(null),
  lcusername : new FormControl(null,Validators.required),
  email : new FormControl(null),
  id : new FormControl(null),
  points : new FormControl(0),
  createdAt : new FormControl(null),
  uid : new FormControl(null)
})
this.apiService.getUserInfo().subscribe((res:any)=>{
this.settingForm.patchValue(res)
this.settingForm.get('email')?.disable()
})
}
onFileChange(event: any): void {
  this.imgChangeEvt = event;      
}
cropImg(e: ImageCroppedEvent) {
this.blob=e.blob
this.objectUrl=e.objectUrl
}
onSaveImage(){
this.settingForm.patchValue({picture:this.objectUrl})
this.imageLoading=true
this.apiService.uploadImage(this.blob,this.imgChangeEvt?.target?.files[0]?.name).then((res)=>{
  this.settingForm.patchValue({picture:res})
  this.imageLoading=false
})
this.imgChangeEvt=''
this.settingForm.get('picture')?.markAsTouched()
this.settingForm.get('picture')?.markAsDirty()
}
onSubmit() {
  if(this.settingForm.valid && this.settingForm.touched && this.settingForm.dirty){
    this.isLoading=true;
    let formData=this.settingForm.value
    this.apiService.updateDocument('userinfo','data',formData).then(() => {
      localStorage.setItem('userinfo', JSON.stringify(formData));
      this.settingForm.markAsPristine();
      this.settingForm.markAsUntouched();
    }).catch((err) => {
      this.isLoading=false
      alert('Err occured !')
    })
  }
}
}
