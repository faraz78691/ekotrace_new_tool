import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelComponent } from './business-travel.component';

describe('BusinessTravelComponent', () => {
  let component: BusinessTravelComponent;
  let fixture: ComponentFixture<BusinessTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTravelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
