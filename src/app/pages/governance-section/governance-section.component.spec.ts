import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceSectionComponent } from './governance-section.component';

describe('GovernanceSectionComponent', () => {
  let component: GovernanceSectionComponent;
  let fixture: ComponentFixture<GovernanceSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernanceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
