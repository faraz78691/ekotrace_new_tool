import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDashboardComponent } from './kpi-dashboard.component';

describe('KpiDashboardComponent', () => {
  let component: KpiDashboardComponent;
  let fixture: ComponentFixture<KpiDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiDashboardComponent]
    });
    fixture = TestBed.createComponent(KpiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
