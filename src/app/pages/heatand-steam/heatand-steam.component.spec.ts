import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatandSteamComponent } from './heatand-steam.component';

describe('HeatandSteamComponent', () => {
  let component: HeatandSteamComponent;
  let fixture: ComponentFixture<HeatandSteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatandSteamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatandSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
