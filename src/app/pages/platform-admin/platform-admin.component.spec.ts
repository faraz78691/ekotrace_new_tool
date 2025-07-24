import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAdminComponent } from './platform-admin.component';

describe('PlatformAdminComponent', () => {
  let component: PlatformAdminComponent;
  let fixture: ComponentFixture<PlatformAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformAdminComponent]
    });
    fixture = TestBed.createComponent(PlatformAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
