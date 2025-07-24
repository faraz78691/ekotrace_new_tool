import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import FamilyTree from '@balkangraph/familytree.js';
import { FamilyService } from '@services/family.service';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss']
})
export class TreeListComponent {
  treeList$ = new Observable();
  displayBasic: boolean;
  selectedTree: any;
  public loginInfo: LoginInfo;
  @ViewChild('GroupForm') form: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public familyService_: FamilyService,
    private notification: NotificationService,
  ) {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    this.treeList$ = familyService_.getTreeList(this.loginInfo);
  };

  showBasicDialog() {
    this.displayBasic = true;
  };

  onSubmit(data: any) {

    const formData = new URLSearchParams();
    formData.set('tenant_id',  this.loginInfo.tenantID.toString());
    formData.set('family_name', data.value.treename);
    formData.set('total_members', data.value.totalMembers);
    formData.set('main_name', data.value.rootName);
    formData.set('name', data.value.name);
    this.familyService_.createTree(formData).subscribe({
      next: (response) => {

        if (response.success == true) {
          this.notification.showSuccess(
            'Data entry added successfully',
            'Success'
          );
          this.displayBasic = false
          this.treeList$ = this.familyService_.getTreeList(this.loginInfo);
          this.form.reset();
        }
      },
      error: (err) => {
        this.notification.showError(
          'Data entry added failed.',
          'Error'
        );
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Data entry Added')
    });
  };

  viewTree(family_id){
this.router.navigateByUrl(`tree/${family_id}`,)
  };

}
