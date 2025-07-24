import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
import { BlankComponent } from '@pages/blank/blank.component';
import { LoginComponent } from '@modules/login/login.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { RegisterComponent } from '@modules/register/register.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { MainMenuComponent } from '@pages/main-menu/main-menu.component';
import { SubMenuComponent } from '@pages/main-menu/sub-menu/sub-menu.component';
import { EnergySectionComponent } from '@pages/refrigerants-section/refrigerants-section.component';
import { EmissionSectionComponent } from '@pages/stationary-combustion/stationary-combustion.component';
import { WasteSectionComponent } from '@pages/waste-section/waste-section.component';
import { WaterSectionComponent } from '@pages/water-section/water-section.component';
import { SocialSectionComponent } from '@pages/social-section/social-section.component';
import { GovernanceSectionComponent } from '@pages/governance-section/governance-section.component';
import { UserComponent } from '@pages/user/user.component';
import { ResetPasswordComponent } from '@modules/reset-password/reset-password.component';
import { FacilityComponent } from '@pages/facility/facility.component';
import { BillingComponent } from '@pages/billing/billing.component';

import { CompanyProfileComponent } from '@pages/company-profile/company-profile.component';
import { TrackingViewRequestsComponent } from '@pages/tracking-view-requests/tracking-view-requests.component';
import { ReportComponent } from '@pages/reports/report/report.component';
import { CustomReportComponent } from '@pages/reports/custom-report/custom-report.component';
import { ReportStatusComponent } from '@pages/reports/report-status/report-status.component';
import { EnergyCustomReportComponent } from '@pages/reports/energy-custom-report/energy-custom-report.component';
import { BrsrReportComponent } from '@pages/brsr-report/brsr-report.component';
import { RoleGuard } from '@guards/role.guard';
import { AdminDashboardComponent } from '@pages/admin-dashboard/admin-dashboard.component';
import { GroupComponent } from '@pages/group/group.component';
import { NotificationsComponent } from '@modules/main/header/notifications/notifications.component';
import { WaterCustomReportComponent } from '@pages/reports/water-custom-report/water-custom-report.component';
import { BrsrQaComponent } from '@modules/brsr-qa/brsr-qa.component';
import { ReportDocComponent } from '@pages/report-doc/report-doc.component';


import { GhgEmmissionsComponent } from '@pages/dashboard/ghg-emmissions/ghg-emmissions.component';
import { EnergyEmmsionsComponent } from '@pages/dashboard/energy-emmsions/energy-emmsions.component';
import { BusinessTravelComponent } from '@pages/dashboard/business-travel/business-travel.component';
import { NewBillingComponent } from '@pages/new-billing/new-billing.component';
import { WaterUsageComponent } from '@pages/dashboard/water-usage/water-usage.component';
import { CarbonOffsettingComponent } from '@pages/carbon-offsetting/carbon-offsetting.component';
import { WasteComponent } from '@pages/dashboard/waste/waste.component';
import { TreeComponent } from '@pages/tree/tree.component';
import { TreeListComponent } from '@pages/tree/tree-list/tree-list.component';
import { MainTreeComponent } from '@pages/tree/main-tree/main-tree.component';
import { GhgTemplateComponent } from '@pages/ghg-template/ghg-template.component';
import { FinanceEmissionsComponent } from '@pages/finance-emissions/finance-emissions.component';
import { SetEmissionInventoryComponent } from '@pages/target_setting/set-emission-inventory/set-emission-inventory.component';
import { TargetSettingComponent } from '@pages/target_setting/target-setting/target-setting.component';
import { ActionsComponent } from '@pages/target_setting/actions/actions.component';
import { VendorsComponent } from '@pages/vendors/vendors.component';
import { FinanceDashboardComponent } from '@pages/finance-dashboard/finance-dashboard.component';
import { SubgroupComponent } from '@pages/subgroup/subgroup.component';
import { WaterSupplyComponent } from '@pages/reports/water-supply/water-supply.component';
import { WasteReportComponent } from '@pages/reports/waste-report/waste-report.component';
import { BusinessTravelReportComponent } from '@pages/reports/business-travel-report/business-travel-report.component';
import { VendorReportComponent } from '@pages/reports/vendor-report/vendor-report.component';
import { FinancedEmissionReportComponent } from '@pages/reports/financed-emission-report/financed-emission-report.component';
import { SingleReportComponent } from '@pages/reports/single-report/single-report.component';
import { AuditReportComponent } from '@pages/reports/audit-report/audit-report.component';
import { VendorDashboardComponent } from '@pages/vendor-dashboard/vendor-dashboard.component';
import { CostCentreComponent } from '@pages/cost-centre/cost-centre.component';
import { DataProgressComponent } from '@pages/data-progress/data-progress.component';
import { VehicleComponent } from '@pages/vehicle/vehicle.component';
import { VehicleFleetComponent } from '@pages/vehicle-fleet/vehicle-fleet.component';
import { PdfReportingComponent } from '@pages/pdf-reporting/pdf-reporting.component';
import { GhgReportingComponent } from '@pages/reporting/ghg-reporting/ghg-reporting.component';
import { KpiDashboardComponent } from '@pages/kpi-dashboard/kpi-dashboard.component';
import { KpiInventoryComponent } from '@pages/kpi-inventory/kpi-inventory.component';
import { AttachmentsComponent } from '@pages/attachments/attachments.component';
import { ViewApproveGroupsComponent } from '@pages/view-approve-groups/view-approve-groups.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard/ghgEmission', pathMatch: 'full' },
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],

        //canActivateChild: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver',
                        'Platform Admin',
                        'Auditor'
                    ]
                },
            },
            {
                path: 'financeDash',
                canActivate: [RoleGuard],
                component: FinanceDashboardComponent,
                data: {
                    roles: ['Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver',
                        'Auditor']
                }
            },
            {
                path: 'attachments',
                canActivate: [RoleGuard],
                component: AttachmentsComponent,
                data: {
                    roles: ['Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver',
                        'Auditor']
                }
            },
            {
                path: 'company-register',
                canActivate: [RoleGuard],
                component: BlankComponent,
                data: { roles: ['Platform Admin'] }
            },
            {
                path: 'finance_emission',
                canActivate: [RoleGuard],
                component: FinanceEmissionsComponent,
                data: {
                    roles: ['Platform Admin', 'Super Admin',
                        'Admin', 'Auditor']
                }
            },
            {
                path: 'finance-view-approve-groups/:groupId',
                canActivate: [RoleGuard],
                component: ViewApproveGroupsComponent,
                data: {
                    roles: ['Platform Admin', 'Super Admin',
                        'Admin', 'Auditor']
                }
            },
            {
                path: 'kpiDashboard',
                canActivate: [RoleGuard],
                component: KpiDashboardComponent,
                data: {
                    roles: ['Platform Admin', 'Super Admin',
                        'Admin', 'Auditor', 'Preparer']
                }
            },
            {
                path: 'company-register',
                canActivate: [RoleGuard],
                component: AdminDashboardComponent,
                data: { roles: ['Platform Admin', 'Auditor'] }
            },
            {
                path: 'brsr-qa',
                canActivate: [RoleGuard],
                component: BrsrQaComponent,
                data: { roles: ['Platform Admin', 'Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] }
            },
            {
                path: 'finance_emissions',
                canActivate: [RoleGuard],
                component: FinanceEmissionsComponent,
                data: { roles: ['Platform Admin', 'Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] }
            },
            {
                path: 'setGhgTemplate',
                canActivate: [RoleGuard],
                component: GhgTemplateComponent,
                data: { roles: ['Platform Admin', 'Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] }
            },
            {
                path: 'vendors',
                canActivate: [RoleGuard],
                component: VendorsComponent,
                data: { roles: ['Platform Admin', 'Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] }
            },
            {
                path: 'cost_centre',
                canActivate: [RoleGuard],
                component: CostCentreComponent,
                data: { roles: ['Platform Admin', 'Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] }
            },
            {
                path: 'dataProgress',
                canActivate: [RoleGuard],
                component: DataProgressComponent,
                data: { roles: ['Platform Admin', 'Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] }
            },
            {
                path: 'vendorDashboard',
                canActivate: [RoleGuard],
                component: VendorDashboardComponent,
                data: { roles: ['Platform Admin', 'Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] }
            },
            {
                path: 'main_tree',
                canActivate: [RoleGuard],
                component: MainTreeComponent,
                data: { roles: ['Platform Admin', 'Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] },
                children: [
                    { path: '', redirectTo: 'view', pathMatch: 'full' },
                    { path: 'view', component: TreeComponent },
                    { path: 'facility', component: FacilityComponent },
                    { path: 'subgroup', component: SubgroupComponent },
                    { path: 'group', component: GroupComponent }
                ]
            },
            {
                path: 'vehicle-fleet',
                component: VehicleFleetComponent
            },
            {
                path: 'emission-section',
                component: EmissionSectionComponent
            },
            {
                path: 'waste-section',
                component: WasteSectionComponent
            },
            {
                path: 'water-section',
                component: WaterSectionComponent
            },
            {
                path: 'single-report',
                component: SingleReportComponent
            },
            {
                path: 'audit-report',
                component: AuditReportComponent,
                canActivate: [RoleGuard],
                data: { roles: ['Platform Admin', 'Auditor', 'Super Admin'] }
            },
            {
                path: 'social-section',
                component: SocialSectionComponent
            },
            {
                path: 'governance-section',
                component: GovernanceSectionComponent
            },
            {
                path: 'energy-section',
                component: EnergySectionComponent
            },
            {
                path: 'user',
                component: UserComponent,
                canActivate: [RoleGuard],
                data: { roles: ['Super Admin', 'Admin', 'Manager', 'Preparer', 'Auditor'] }
            },
            {
                path: 'tree/:id',
                component: TreeComponent,
                canActivate: [RoleGuard],
                data: { roles: ['Super Admin', 'Admin', 'Auditor'] }
            },
            {
                path: 'treeList',
                component: TreeListComponent,
                canActivate: [RoleGuard],
                data: { roles: ['Super Admin', 'Admin', 'Auditor'] }
            },

            {
                path: 'billing',
                canActivate: [RoleGuard],
                component: BillingComponent,
                data: {
                    roles: ['Super Admin', 'Admin', 'Manager',
                        'Preparer',
                        'Approver', 'Auditor']
                }
            },
            {
                path: 'adminBilling',
                canActivate: [RoleGuard],
                component: NewBillingComponent,
                data: { roles: ['Super Admin', 'Auditor'] }
            },
            {
                path: 'carbonOffset',
                canActivate: [RoleGuard],
                component: CarbonOffsettingComponent,
                data: {
                    roles: ['Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor']
                }
            },
            {
                path: 'tracking', canActivate: [RoleGuard], data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }, loadChildren: () => import('./pages/tracking/tracking.module').then(m => m.TrackingModule)
            },

            {
                path: 'GhgReporting', canActivate: [RoleGuard], data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }, loadChildren: () => import('./pages/reporting/reporting.module').then(m => m.ReportingModule)
            },
            {
                path: 'platformAdmin', canActivate: [RoleGuard], data: {
                    roles: [
                        'Platform Admin'
                    ]
                }, loadChildren: () => import('./pages/platform-admin/platform-admin.module').then(m => m.PlatformAdminModule)
            },
            {
                path: 'notification',
                canActivate: [RoleGuard],
                component: NotificationsComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'company-profile',
                component: CompanyProfileComponent,
                data: { roles: ['Super Admin'] }
            },
            {
                path: 'tracking-view-requests',
                canActivate: [RoleGuard],
                component: TrackingViewRequestsComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'setEmissionInventory',
                canActivate: [RoleGuard],
                component: SetEmissionInventoryComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'targetSetting',
                canActivate: [RoleGuard],
                component: TargetSettingComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'kpi_inventory',
                canActivate: [RoleGuard],
                component: KpiInventoryComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'actions',
                canActivate: [RoleGuard],
                component: ActionsComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'report',
                component: ReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'custom-report',
                component: CustomReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'report-status',
                component: ReportStatusComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'energy-custom-report',
                component: EnergyCustomReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'water-custom-report',
                component: WaterCustomReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'water-supply-report',
                component: WaterSupplyComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'waste-report',
                component: WasteReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'businessTravel-report',
                component: BusinessTravelReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'vendor-report',
                component: VendorReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'financed-report',
                component: FinancedEmissionReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'brsrReport',
                component: BrsrReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin', 'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'pdfReport',
                component: PdfReportingComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin', 'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },
            {
                path: 'ghgReport',
                component: GhgReportingComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin', 'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }
            },

            {
                path: 'report-doc',
                component: ReportDocComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver', 'Auditor'
                    ]
                }

            }
        ]
    },
    // {
    //     path: 'tracking',
    //     loadChildren: () => import('./pages/tracking/tracking.module').then(m => m.TrackingModule)
    //   },

    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password/{userId}',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [NonAuthGuard]
    },

    {
        path: 'reset-password/{email}',
        component: ResetPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },

    { path: '**', redirectTo: '/dashboard/ghgEmission' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
