import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfReportingComponent } from './pdf-reporting.component';

describe('PdfReportingComponent', () => {
  let component: PdfReportingComponent;
  let fixture: ComponentFixture<PdfReportingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfReportingComponent]
    });
    fixture = TestBed.createComponent(PdfReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
