import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhgTemplateComponent } from './ghg-template.component';

describe('GhgTemplateComponent', () => {
  let component: GhgTemplateComponent;
  let fixture: ComponentFixture<GhgTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GhgTemplateComponent]
    });
    fixture = TestBed.createComponent(GhgTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
