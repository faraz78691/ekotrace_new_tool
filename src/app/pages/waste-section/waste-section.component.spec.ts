import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteSectionComponent } from './waste-section.component';

describe('WasteSectionComponent', () => {
  let component: WasteSectionComponent;
  let fixture: ComponentFixture<WasteSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WasteSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
