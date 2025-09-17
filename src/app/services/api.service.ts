import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(@Inject(DOCUMENT) private document: Document) {}

  updateFavicon(iconUrl: string) {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel*='icon']");
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'icon';
      this.document.head.appendChild(link);
    }
    link.href = iconUrl;
  }   
    }


