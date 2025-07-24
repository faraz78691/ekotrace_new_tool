import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterCustomReportComponent } from './water-custom-report.component';

describe('WaterCustomReportComponent', () => {
  let component: WaterCustomReportComponent;
  let fixture: ComponentFixture<WaterCustomReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterCustomReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterCustomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
