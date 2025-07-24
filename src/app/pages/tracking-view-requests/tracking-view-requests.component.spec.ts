import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingViewRequestsComponent } from './tracking-view-requests.component';

describe('TrackingViewRequestsComponent', () => {
  let component: TrackingViewRequestsComponent;
  let fixture: ComponentFixture<TrackingViewRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingViewRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingViewRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
