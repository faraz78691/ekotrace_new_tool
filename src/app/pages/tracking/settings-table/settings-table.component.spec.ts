import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTableComponent } from './settings-table.component';

describe('SettingsTableComponent', () => {
  let component: SettingsTableComponent;
  let fixture: ComponentFixture<SettingsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsTableComponent]
    });
    fixture = TestBed.createComponent(SettingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
