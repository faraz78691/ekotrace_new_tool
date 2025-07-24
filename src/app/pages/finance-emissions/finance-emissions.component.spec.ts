import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceEmissionsComponent } from './finance-emissions.component';

describe('FinanceEmissionsComponent', () => {
  let component: FinanceEmissionsComponent;
  let fixture: ComponentFixture<FinanceEmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceEmissionsComponent]
    });
    fixture = TestBed.createComponent(FinanceEmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
