import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelReportComponent } from './business-travel-report.component';

describe('BusinessTravelReportComponent', () => {
  let component: BusinessTravelReportComponent;
  let fixture: ComponentFixture<BusinessTravelReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTravelReportComponent]
    });
    fixture = TestBed.createComponent(BusinessTravelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
