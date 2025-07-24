import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonOffsettingComponent } from './carbon-offsetting.component';

describe('CarbonOffsettingComponent', () => {
  let component: CarbonOffsettingComponent;
  let fixture: ComponentFixture<CarbonOffsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarbonOffsettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarbonOffsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
