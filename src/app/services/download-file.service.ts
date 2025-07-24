import { LoginInfo } from '@/models/loginInfo';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
  loginInfo: LoginInfo;
  constructor( private router: Router, private toastr: ToastrService) {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;

    }
   }

  downloadFile(url: string, filename: string) {
    if (this.loginInfo.token != null) {
    fetch(url, {
      method: 'GET',
      headers: {
        'auth': `Bearer ${this.loginInfo.token}`,
        'Authorization': `Bearer ${this.loginInfo.token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      return response.blob();
    })
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('Download error:', error);
    });
  }else{
    this.toastr.error('Please login to download the file');
    this.router.navigate(['/login']);
  }
  };


}
