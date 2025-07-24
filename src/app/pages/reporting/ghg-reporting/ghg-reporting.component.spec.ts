import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhgReportingComponent } from './ghg-reporting.component';

describe('GhgReportingComponent', () => {
  let component: GhgReportingComponent;
  let fixture: ComponentFixture<GhgReportingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GhgReportingComponent]
    });
    fixture = TestBed.createComponent(GhgReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
