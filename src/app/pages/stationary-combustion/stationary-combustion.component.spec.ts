import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionSectionComponent } from './stationary-combustion.component';

describe('EmissionSectionComponent', () => {
  let component: EmissionSectionComponent;
  let fixture: ComponentFixture<EmissionSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmissionSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmissionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
