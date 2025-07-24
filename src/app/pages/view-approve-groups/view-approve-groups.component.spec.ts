import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApproveGroupsComponent } from './view-approve-groups.component';

describe('ViewApproveGroupsComponent', () => {
  let component: ViewApproveGroupsComponent;
  let fixture: ComponentFixture<ViewApproveGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewApproveGroupsComponent]
    });
    fixture = TestBed.createComponent(ViewApproveGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
