import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingSidebarComponent } from './reporting-sidebar.component';

describe('ReportingSidebarComponent', () => {
  let component: ReportingSidebarComponent;
  let fixture: ComponentFixture<ReportingSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
