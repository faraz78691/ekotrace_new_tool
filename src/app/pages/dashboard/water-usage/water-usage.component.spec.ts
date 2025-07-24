import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterUsageComponent } from './water-usage.component';

describe('WaterUsageComponent', () => {
  let component: WaterUsageComponent;
  let fixture: ComponentFixture<WaterUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterUsageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
