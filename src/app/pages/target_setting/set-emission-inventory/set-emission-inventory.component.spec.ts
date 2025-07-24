import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEmissionInventoryComponent } from './set-emission-inventory.component';

describe('SetEmissionInventoryComponent', () => {
  let component: SetEmissionInventoryComponent;
  let fixture: ComponentFixture<SetEmissionInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetEmissionInventoryComponent]
    });
    fixture = TestBed.createComponent(SetEmissionInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
