import { Facility } from '@/models/Facility';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { Group } from '@/models/group';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, computed, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';

import { GroupService } from '@services/group.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '@services/user.service';

interface groupby {
    name: string;
};


@Component({
    selector: 'app-set-emission-inventory',
    templateUrl: './set-emission-inventory.component.html',
    styleUrls: ['./set-emission-inventory.component.scss']
})
export class SetEmissionInventoryComponent {
    isHowtoUse = false;
    @ViewChild('GroupForm', { static: false }) GroupForm: NgForm;
    @ViewChild('projectionForm', { static: false }) projectionForm: NgForm;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    public loginInfo: LoginInfo;
    public admininfo: UserInfo;
    public userdetails: UserInfo;
    public groupdetails: any;
    public groupMappingDetails: GroupMapping;
    public admininfoList: UserInfo[] = [];
    facilityList: Facility[] = [];
    RolesList: RoleModel[] = [];
    public groupsList: Group[] = [];
    display = 'none';
    visible: boolean;
    visible2: boolean;
    selectedRole = '';
    Alert: boolean = false;
    RoleIcon: string = '';
    FormEdit: boolean = false;
    usernameIsExist: boolean = false;
    emailIstExist: boolean = false;
    Roleaccess = environment.adminRoleId;
    searchData: '';
    isloading: boolean = false;
    maxCharacters: number = 8;
    facilitydata: boolean = false;
    updatedtheme: string;
    groupdata: boolean;
    rootUrl: string;
    uploadedImageUrl: string;
    Groupby: groupby[];
    countryData: Location[] = [];
    stateData: Location[] = [];
    selectedValue: string;
    selectedCountry: any[] = [];
    scope1: any[] = [];
    scope2: any[] = [];
    scope3: any[] = [];
    scopeList: any[] = [];
    editBindedCountry: any[] = [];
    targetType: any[] = [];
    id: any;
    isgroupExist: boolean = false;
    selectedFaciltiy: any;
    selectedState: any;
    GroupByValue: string;
    project_type: string;
    countryUnique: string[];
    stateUnique: string[];
    unlock: string = '';
    ischecked = true;
    selectedRowIndex = 0;
    filledgroup: any;
    project_details = '';
    carbon_offset = '';
    selectedScope: any;
    superAdminTenentID: any;
    carbon_credit_value: string;
    type: string;
    relationId: string;
    date3: string;
    standard: string;
    selectedFile: File;
    scope_1_emissions: number;
    scope_2_emissions: number;
    scope_3_emissions: number;
 
    constructor(
        private companyService: CompanyService,
        private UserService: UserService,
        private GroupService: GroupService,
        private notification: NotificationService,
        private facilityService: FacilityService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private themeservice: ThemeService
    ) {
        this.admininfo = new UserInfo();
        this.userdetails = new UserInfo();
        this.groupdetails = new Array();
        this.groupMappingDetails = new GroupMapping();
        this.loginInfo = new LoginInfo();
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';
        this.selectedValue = '';

        this.Groupby = [
            {
                name: 'Renewable Energy'
            },
            {
                name: 'Nature Based'
            },
            {
                name: 'Energy Efficiency'
            },
            {
                name: 'Community Project'
            },
            {
                name: 'Carbon Sequestration'
            },
            {
                name: 'Others'
            }
        ];


        this.scopeList = [
            {
                id: 1,
                name: 'Scope 1'
            },
            {
                id: 2,
                name: 'Scope 2'
            },
            {
                id: 3,
                name: 'Scope 3'
            }
        ];
        this.targetType = [
            {
                id: 1,
                name: 'Production output'
            },
            {
                id: 2,
                name: 'Economic output'
            }

        ];
    }
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            // this.facilityGet(this.loginInfo.tenantID);
        }

        // this.GetAllFacility();
        let tenantID = this.loginInfo.tenantID;
        this.superAdminTenentID = this.loginInfo.super_admin_id;
        this.GetEmissionInventory();
        this.updatedtheme = this.themeservice.getValue('theme');
    }




    GetEmissionInventory() {

        this.GroupService.getEmissionInventory(this.superAdminTenentID).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.groupsList = response.orders;

                    if (this.groupsList.length > 0) {
                        this.groupdetails = this.groupsList[0];
                        this.groupdata = true;
                    } else {
                        this.groupdata = false;
                    }
                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };

    GetEmissionProjections() {

        this.GroupService.getEmissionProjections().subscribe({
            next: (response) => {

                if (response.success == true) {

                    let obj = {
                        factor1: response.orders[0].factor1,
                        factor2: response.orders[0].factor2,
                        factor3: response.orders[0].factor3,

                    };

                    this.projectionForm.control.patchValue(obj);

                    // if (this.groupsList.length > 0) {
                    //     this.groupdetails = this.groupsList[0];
                    //     this.groupdata = true;
                    // } else {
                    //     this.groupdata = false;
                    // }


                }
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };

    //method to add new group
    saveOffset(data: NgForm) {

        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
      
        var dateYear = (data.value.year_added).getFullYear().toString();

        if (data.valid == false) {
            return
        }
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authorised to submit form', '')
            return
        }

    
        if (
            parseFloat(data.value.scope_1_emissions) <
            (parseFloat(data.value.company_vehicles) + parseFloat(data.value.refrigerants))
        ) {

            this.notification.showInfo('Scope 1 sub categories should be less or equal to Total Scope 1 emission', '');
            return
        }
        if (
            parseFloat(data.value.scope_2_emissions) <
            (parseFloat(data.value.location_based) + parseFloat(data.value.renewable))
        ) {

            this.notification.showInfo('Scope 2 sub categories should be less or equal to Total Scope 2 emission', '');
            return
        }
        if (
            parseFloat(data.value.scope_3_emissions) <
            (parseFloat(data.value.purchased_goods) + parseFloat(data.value.business_travel) + parseFloat(data.value.waste_generated) + parseFloat(data.value.waste))
        ) {

            this.notification.showInfo('Scope 3 sub categories should be less or equal to Total Scope 3 emission', '');
            return
        }
        if (
            parseFloat(data.value.carbonOffset) > 0
        ) {
            if ((parseFloat(data.value.allocatedScope1)) + (parseFloat(data.value.allocatedScope2)) + (parseFloat(data.value.allocatedScope3)) != 100) {
              
                this.notification.showInfo('Allocated emission should be total', '');
                return
            }
        }

        var scope1_items = [{ 'category': "Scope1 from Company Vehicles", "emission": Number(data.value.company_vehicles) }, { "category": "Scope1 from Refrigerants", "emission": Number(data.value.refrigerants) }]
        var scope2_items = [{ "category": "Scope2 Location Based Emissions", "emission": Number(data.value.location_based) }, { "category": "Scope2 Renewable Energy Use", "emission": Number(data.value.renewable) }];
        var scope3_items = [{ "category": "Scope3 Purchased goods and services", "emission": Number(data.value.purchased_goods) }, { "category": "Scope3 Business travel and employee commute", "emission": Number(data.value.business_travel) }, { "category": "Scope3 Waste generated in operations", "emission": Number(data.value.waste_generated) }, { "category": "Scope3 Water Usage", "emission": Number(data.value.waste) }];


        var scope_1_emissions = Number(data.value.company_vehicles) + Number(data.value.refrigerants);
        var scope_2_emissions = Number(data.value.location_based) + Number(data.value.renewable);
        var scope_3_emissions = Number(data.value.purchased_goods) + Number(data.value.business_travel) + Number(data.value.waste_generated) + Number(data.value.waste);

        let finalScope1 = data.value.scope_1_emissions
        let finalScope2 = data.value.scope_2_emissions
        let finalScope3 = data.value.scope_3_emissions
        if (data.value.carbonOffset) {
            const carbonOffset = data.value.carbonOffset;
            const allocatedScope1 = data.value.allocatedScope1
            const allocatedScope2 = data.value.allocatedScope2
            const allocatedScope3 = data.value.allocatedScope3

            const convertedScope1 = carbonOffset * (allocatedScope1 / 100);
            const convertedScope2 = carbonOffset * (allocatedScope2 / 100);
            const convertedScope3 = carbonOffset * (allocatedScope3 / 100);

            finalScope1 = data.value.scope_1_emissions - convertedScope1
            finalScope2 = data.value.scope_2_emissions - convertedScope2
            finalScope3 = data.value.scope_3_emissions - convertedScope3

        } else {

        }


        const formData = new URLSearchParams();
        formData.append('production_output', data.value.production_output || 1);
        formData.append('economic_output', data.value.economic_output || 1);
        formData.append('group_added', "Default");
        formData.append('year_added', dateYear);
        formData.append('scope1_emission', finalScope1);
        formData.append('scope2_emission', finalScope2);
        formData.append('scope3_emission', finalScope3);

        formData.append('scope1_items', JSON.stringify(scope1_items));
        formData.append('scope2_items', JSON.stringify(scope2_items));
        formData.append('scope3_items', JSON.stringify(scope3_items));
        formData.append('tenantId', this.superAdminTenentID);


        this.GroupService.AddEmissionInventory(formData.toString()).subscribe({
            next: (response) => {
                if (response.success == true) {
                    this.visible = false;
                    this.notification.showSuccess(
                        ' Inventory Added successfully',
                        'Success'
                    );
                    this.GetEmissionInventory();
                }
                // return
                this.GetEmissionInventory();
                this.visible = false;
                if (localStorage.getItem('FacilityGroupCount') != null) {
                    let fgcount = localStorage.getItem('FacilityGroupCount');
                    let newcount = Number(fgcount) + 1;
                    localStorage.setItem(
                        'FacilityGroupCount',
                        String(newcount)
                    );
                }
            },
            error: (err) => {
                this.notification.showError('Group added failed.', 'Error');
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };

    saveProjections(data: NgForm) {
        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authrised to submit form', '')
            return
        }

        const formData = new URLSearchParams();

        formData.append('factor1', data.value.factor1);
        formData.append('factor2', data.value.factor2);
        formData.append('factor3', data.value.factor3);


        this.GroupService.AddProjections(formData.toString()).subscribe({
            next: (response) => {
                if (response.success == true) {

                    this.notification.showSuccess(
                        ' Projection set successfully',
                        'Success'
                    );
                }
                // return

                this.visible2 = false;

            },
            error: (err) => {
                this.notification.showError('Group added failed.', 'Error');
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    };

    //method for update group detail by id
    updateGroup(id: any, data: NgForm) {
        if(this.loginInfo.role == 'Auditor'){
            this.notification.showInfo('You are not Authorized', '');
            return
        }
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authrised to submit form', '')
            return
        }
        // var dateYear = (data.value.year_added).getFullYear().toString();
 
        if (data.value.year_added.length > 4) {
            var dateYear = (data.value.year_added).getFullYear().toString();
        } else {
            var dateYear = data.value.year_added;
        }

        var scope1_items = [{ "emission": Number(data.value.company_vehicles) }, { "emission": Number(data.value.refrigerants) }]
        var scope2_items = [{ "emission": Number(data.value.location_based) }, { "emission": Number(data.value.renewable) }];
        var scope3_items = [{ "emission": Number(data.value.purchased_goods) }, { "emission": Number(data.value.business_travel) }, { "emission": Number(data.value.waste_generated) }, { "emission": Number(data.value.waste) }];
        // Merge the updateEmission into scope_1
        let mergedArrayScope1 = this.scope1.map((item, index) => ({
            ...item,
            ...scope1_items[index]
        }));
        let mergedArrayScope2 = this.scope2.map((item, index) => ({
            ...item,
            ...scope2_items[index]
        }));
        let mergedArrayScope3 = this.scope3.map((item, index) => ({
            ...item,
            ...scope3_items[index]
        }));
        let totalScopeEmision = [...mergedArrayScope1, ...mergedArrayScope2, ...mergedArrayScope3]


        var scope_1_emissions = Number(data.value.company_vehicles) + Number(data.value.refrigerants);
        var scope_2_emissions = Number(data.value.location_based) + Number(data.value.renewable);
        var scope_3_emissions = Number(data.value.purchased_goods) + Number(data.value.business_travel) + Number(data.value.waste_generated) + Number(data.value.waste);

        const formData = new URLSearchParams();

        formData.append('production_output', data.value.production_output);
        formData.append('economic_output', data.value.economic_output);

        formData.append('group_added', "Default");


        formData.append('scope1_emission', data.value.scope_1_emissions);
        formData.append('scope2_emission', data.value.scope_2_emissions);
        formData.append('scope3_emission', data.value.scope_3_emissions);

        formData.append('scope_items', JSON.stringify(totalScopeEmision));
        formData.append('relation_id', id);

        // formData.append('groupId', id);

        this.GroupService.updateInventory(formData.toString()).subscribe({
            next: (response) => {

                this.GetEmissionInventory();

                this.visible = false;
                this.notification.showSuccess(
                    'Group Edited successfully',
                    'Success'
                );
            },
            error: (err) => {
                this.notification.showError('Group edited failed.', 'Error');
                console.error(err);
            },
            complete: () => console.info('Group edited')
        });
    };


    viewDetails(id: any) {
        this.relationId = id;
        this.FormEdit = true;
        const formData = new URLSearchParams();
        this.scope1 = [];
        this.scope2 = [];
        this.scope3 = [];

        formData.append('relation_id', id);
        this.GroupService.GetInventoryByID(formData.toString()).subscribe({
            next: (response) => {
                if (response.success == true) {
                    const details = response.individualDetails;
                    const idCompany = details.find(items => items.category == 'Scope1 from Company Vehicles');
                    const idRefrigerants = details.find(items => items.category == 'Scope1 from Refrigerants');
                    const idLocation = details.find(items => items.category == 'Scope2 Location Based Emissions');
                    const idRenewable = details.find(items => items.category == 'Scope2 Renewable Energy Use');
                    const idPurchased = details.find(items => items.category == 'Scope3 Purchased goods and services');
                    const idBusiness = details.find(items => items.category == 'Scope3 Business travel and employee commute');
                    const idWaste = details.find(items => items.category == 'Scope3 Waste generated in operations');
                    const idWater = details.find(items => items.category == 'Scope3 Water Usage');
                    this.scope1.push({ "id": idCompany.id, "emission": 0 }, { "id": idRefrigerants.id, "emission": 0 });
                    this.scope2.push({ "id": idLocation.id, "emission": 0 }, { "id": idRenewable.id, "emission": 0 });
                    this.scope3.push({ "id": idPurchased.id, "emission": 0 }, { "id": idBusiness.id, "emission": 0 }, { "id": idWaste.id, "emission": 0 }, { "id": idWater.id, "emission": 0 });
                    this.visible = true;
                    let obj = {
                        group_added: response.details[0].group_added,
                        year_added: response.details[0].year_added,
                        company_vehicles: idCompany.emission,
                        refrigerants: idRefrigerants.emission,
                        location_based: idLocation.emission,
                        renewable: idRenewable.emission,
                        purchased_goods: idPurchased.emission,
                        business_travel: idBusiness.emission,
                        waste_generated: idWaste.emission,
                        waste: idWater.emission,
                        production_output: response.details[0].production_output,
                        economic_output: response.details[0].economic_output,
                        scope_1_emissions: response.details[0].total_scope1,
                        scope_2_emissions: response.details[0].total_scope2,
                        scope_3_emissions: response.details[0].total_scope3
                    };

                    this.GroupForm.control.patchValue(obj);

                    // this.notification.showSuccess(
                    //     ' Inventory Added successfully',
                    //     'Success'
                    // );
                }
            },
            error: (err) => {
                this.notification.showError('Group added failed.', 'Error');
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Group Added')
        });
    };

    //retrieves all facilities for a given tenant

    //handles the closing of a dialog
    onCloseHandled() {
        this.visible = false;
        this.visible2 = false;
        this.isloading = false;
        let tenantID = this.loginInfo.tenantID;

    }
    //display a dialog for editing a group

    //display a dialog for add a group.
    showAddGroupDialog2() {
        this.visible2 = true;
        this.groupdetails = new Group();
        this.FormEdit = false;
        this.GetEmissionProjections();
        // this.resetForm();
    };


    //display a dialog for add a group.
    showAddGroupDialog() {
        this.visible = true;
        this.groupdetails = new Group();
        this.FormEdit = false;
        this.resetForm();
    }
    //sets the selected group details
    selectGroup(group: Group, index: number) {
        this.selectedRowIndex = index;
        this.groupdetails = group;
     
    }
    //The removeCss function is used to remove CSS styles applied to the body element
    removeCss() {
        document.body.style.position = '';
        document.body.style.overflow = '';
    }

    //method for reset form
    resetForm() {
        this.GroupForm.resetForm();
    }
    //sets the value of the unlock variable to the provided groupId
    UnlockComplete(groupId) {
        this.unlock = groupId;
    }
    //method is used to check the existence of a group by its ID
    CheckGroupExist(id) {
        this.GroupService.CheckGroupExist(id).subscribe((result) => {
            this.isgroupExist = result;
        });
    }
    // checks if a country is selected based on its countryId.
    isCountrySelected(countryId: any): boolean {
        return this.selectedCountry.includes(countryId);
    }
    //method for delete a group by id
    deleteGroup(event: Event, id) {
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authrised to submit form', '')
            return
        }
        let tenantID = this.loginInfo.tenantID;
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let formData = new URLSearchParams();
                formData.set('groupId', id);

                this.GroupService.newdeleteGroups(formData.toString()).subscribe((result) => {
                    if (localStorage.getItem('FacilityGroupCount') != null) {
                        let fgcount =
                            localStorage.getItem('FacilityGroupCount');
                        let newcount = Number(fgcount) - 1;
                        localStorage.setItem(
                            'FacilityGroupCount',
                            String(newcount)
                        );
                    }
                    this.GetEmissionInventory();
                });

                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'Group Deleted Succesfully'
                });
            },
            reject: () => {
                this.GetEmissionInventory();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Group not Deleted'
                });
            }
        });
    };

}
