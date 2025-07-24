import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTreeComponent } from './main-tree.component';

describe('MainTreeComponent', () => {
  let component: MainTreeComponent;
  let fixture: ComponentFixture<MainTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainTreeComponent]
    });
    fixture = TestBed.createComponent(MainTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
