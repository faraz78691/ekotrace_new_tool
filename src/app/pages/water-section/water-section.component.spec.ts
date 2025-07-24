import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterSectionComponent } from './water-section.component';

describe('WaterSectionComponent', () => {
  let component: WaterSectionComponent;
  let fixture: ComponentFixture<WaterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
