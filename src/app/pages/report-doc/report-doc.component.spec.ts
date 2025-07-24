import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDocComponent } from './report-doc.component';

describe('ReportDocComponent', () => {
  let component: ReportDocComponent;
  let fixture: ComponentFixture<ReportDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
