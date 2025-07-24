import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteReportComponent } from './waste-report.component';

describe('WasteReportComponent', () => {
  let component: WasteReportComponent;
  let fixture: ComponentFixture<WasteReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WasteReportComponent]
    });
    fixture = TestBed.createComponent(WasteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
