import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrsrQaComponent } from './brsr-qa.component';

describe('BrsrQaComponent', () => {
  let component: BrsrQaComponent;
  let fixture: ComponentFixture<BrsrQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrsrQaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrsrQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
