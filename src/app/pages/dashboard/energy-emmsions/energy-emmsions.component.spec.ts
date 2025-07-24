import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyEmmsionsComponent } from './energy-emmsions.component';

describe('EnergyEmmsionsComponent', () => {
  let component: EnergyEmmsionsComponent;
  let fixture: ComponentFixture<EnergyEmmsionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyEmmsionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyEmmsionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
