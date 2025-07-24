import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiInventoryComponent } from './kpi-inventory.component';

describe('KpiInventoryComponent', () => {
  let component: KpiInventoryComponent;
  let fixture: ComponentFixture<KpiInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiInventoryComponent]
    });
    fixture = TestBed.createComponent(KpiInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
