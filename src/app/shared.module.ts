// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TreeviewModule } from '@treeview/ngx-treeview';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollerModule } from 'primeng/scroller';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

// Add any others here...

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
  
      // PrimeNG and UI modules
      MultiSelectModule,
      MessagesModule,
      DialogModule,
      ButtonModule,
      FileUploadModule,
      DropdownModule,
      InputTextareaModule,
      TooltipModule,
      TableModule,
      ToastModule,
      ConfirmDialogModule,
      TabMenuModule,
      MenuModule,
      AccordionModule,
      CheckboxModule,
      ToggleButtonModule,
      RadioButtonModule,
      InputSwitchModule,
      ProgressSpinnerModule,
      TabViewModule,
      CalendarModule,
      CarouselModule,
      OverlayPanelModule,
      TriStateCheckboxModule,
  
      // Charts and documents
      NgxChartsModule,
      NgApexchartsModule,
      NgxExtendedPdfViewerModule,
      NgxDocViewerModule,
  
      // Captcha
      NgxCaptchaModule,
  
      // Scrolling
      ScrollerModule,
  
      // Treeview
      TreeviewModule,
      RouterModule,
      NgxSpinnerModule
      
    ],
    exports: [
    
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
  
      // PrimeNG and UI modules
      MultiSelectModule,
      MessagesModule,
      DialogModule,
      ButtonModule,
      FileUploadModule,
      DropdownModule,
      InputTextareaModule,
      TooltipModule,
      TableModule,
      ToastModule,
      ConfirmDialogModule,
      TabMenuModule,
      MenuModule,
      AccordionModule,
      CheckboxModule,
      ToggleButtonModule,
      RadioButtonModule,
      InputSwitchModule,
      ProgressSpinnerModule,
      TabViewModule,
      CalendarModule,
      CarouselModule,
      OverlayPanelModule,
      TriStateCheckboxModule,
  
      // Charts and documents
      NgxChartsModule,
      NgApexchartsModule,
      NgxExtendedPdfViewerModule,
      NgxDocViewerModule,
  
      // Captcha
      NgxCaptchaModule,
  
      // Scrolling
      ScrollerModule,
  
      // Treeview
      TreeviewModule,
      RouterModule,
      NgxSpinnerModule
    ]
  })
  export class SharedModule {}
  

