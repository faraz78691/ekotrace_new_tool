import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancedEmissionReportComponent } from './financed-emission-report.component';

describe('FinancedEmissionReportComponent', () => {
  let component: FinancedEmissionReportComponent;
  let fixture: ComponentFixture<FinancedEmissionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancedEmissionReportComponent]
    });
    fixture = TestBed.createComponent(FinancedEmissionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
