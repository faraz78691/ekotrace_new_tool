import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyCustomReportComponent } from './energy-custom-report.component';

describe('EnergyCustomReportComponent', () => {
  let component: EnergyCustomReportComponent;
  let fixture: ComponentFixture<EnergyCustomReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyCustomReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyCustomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
