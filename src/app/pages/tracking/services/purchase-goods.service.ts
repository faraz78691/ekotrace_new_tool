import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { AppService } from '@services/app.service';
import { TreeviewItem } from '@treeview/ngx-treeview';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class PurchaseGoodsService {

  constructor(private appService: AppService) { }

  deselectAllItems(items: TreeviewItem[]) {
    console.log(items);
    items.forEach(item => {

      item.checked = false;
      if (item.children) {
        this.deselectAllItems(item.children);
      }
    });
  }

  getApproxTime(rows: number): string {
    const totalSeconds = rows * 2;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.ceil((totalSeconds % 3600) / 60); // round up minutes

    let timeString = '';
    if (hours > 0) timeString += `${hours} hr `;
    if (minutes > 0 || hours === 0) timeString += `${minutes} min`;

    return timeString.trim();
  }

  triggerAIProcess() {
    this.appService.getApi2('/trigger-call').subscribe({
      next: (Response) => {
        if (Response) {

        }
        else {

        }
      }
    })
  };

  convertToKeyValue(data: any[]): any[] {
    if (data.length < 2) return [];

    const headers = data[0]; // Extract headers
    return data.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        let value = row[index] || '';

        // Convert Excel date serial number to readable date
        if (header.includes('Date') && typeof value === 'number') {
          value = XLSX.SSF.format('dd-mm-yyyy', value); // Converts to "dd-mm-yyyy"
        }

        obj[header] = value;
      });
      return obj;
    });
  };



}
