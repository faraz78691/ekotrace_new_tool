import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhgEmmissionsComponent } from './ghg-emmissions.component';

describe('GhgEmmissionsComponent', () => {
  let component: GhgEmmissionsComponent;
  let fixture: ComponentFixture<GhgEmmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhgEmmissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GhgEmmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
