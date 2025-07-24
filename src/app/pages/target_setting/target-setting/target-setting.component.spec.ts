import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSettingComponent } from './target-setting.component';

describe('TargetSettingComponent', () => {
  let component: TargetSettingComponent;
  let fixture: ComponentFixture<TargetSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TargetSettingComponent]
    });
    fixture = TestBed.createComponent(TargetSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
