import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFleetComponent } from './vehicle-fleet.component';

describe('VehicleFleetComponent', () => {
  let component: VehicleFleetComponent;
  let fixture: ComponentFixture<VehicleFleetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleFleetComponent]
    });
    fixture = TestBed.createComponent(VehicleFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
