import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBillingComponent } from './new-billing.component';

describe('NewBillingComponent', () => {
  let component: NewBillingComponent;
  let fixture: ComponentFixture<NewBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
