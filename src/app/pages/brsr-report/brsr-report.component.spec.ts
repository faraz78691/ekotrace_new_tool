import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrsrReportComponent } from './brsr-report.component';

describe('BrsrReportComponent', () => {
  let component: BrsrReportComponent;
  let fixture: ComponentFixture<BrsrReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrsrReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrsrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
