import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergySectionComponent } from './refrigerants-section.component';

describe('EnergySectionComponent', () => {
  let component: EnergySectionComponent;
  let fixture: ComponentFixture<EnergySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
