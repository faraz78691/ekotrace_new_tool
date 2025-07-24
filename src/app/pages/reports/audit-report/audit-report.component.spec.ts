import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReportComponent } from './audit-report.component';

describe('AuditReportComponent', () => {
  let component: AuditReportComponent;
  let fixture: ComponentFixture<AuditReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditReportComponent]
    });
    fixture = TestBed.createComponent(AuditReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
