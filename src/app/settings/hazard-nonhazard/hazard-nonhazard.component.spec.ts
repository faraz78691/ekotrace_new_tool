import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HazardNonhazardComponent } from './hazard-nonhazard.component';

describe('HazardNonhazardComponent', () => {
  let component: HazardNonhazardComponent;
  let fixture: ComponentFixture<HazardNonhazardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HazardNonhazardComponent]
    });
    fixture = TestBed.createComponent(HazardNonhazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
