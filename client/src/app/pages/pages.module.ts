import { CommonModule } from '@angular/common';
import { FarmingModule } from './farming/farming.module';
import { NatureModule } from './nature/nature.module';
import { OldagehomeModule } from './oldagehome/oldagehome.module';
import { OthersModule } from './other/other.module';
import { RuraldevModule } from './ruraldev/rural.module';
import { HealthModule } from './health/health.module';
import { HealthComponent } from './health/health.component';
import { StartupModule } from './startups/startup.module';
import { EducationModule } from './education/education.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserinfoModule } from './userinfo/userinfo.module';
import { NgModule } from '@angular/core';
import { NbMenuModule, NbCardModule, NbIconModule, NbButtonModule, NbInputModule, NbDialogModule, NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AddorgModule } from './addorg/addorg.module';
import { ViewpostComponent } from './viewpost/viewpost.component';
import { OrgpicsComponent } from './viewpost/orgpics/orgpics.component';
//import { LoginComponent } from './login/login.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import {ClipboardModule} from 'ngx-clipboard';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { IpfsComponent } from './ipfs/ipfs.component';
import { LoginComponent } from '../login/login.component';
import { FluidMeterComponent } from './viewpost/fluid-meter/fluid-meter.component';
import { ConfirmationDialogComponent } from './viewpost/confirmation-dialog/confirmation-dialog.component';
import { ConditionalFundDialogComponent } from './viewpost/conditional-fund-dialog/conditional-fund-dialog.component';
import { UserinfoService } from './userinfo/userinfo.service';



@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbSelectModule,
    UserinfoModule,
    DashboardModule,
    MiscellaneousModule,
    ClipboardModule,
    AddorgModule,
    NgxQRCodeModule,
    NbInputModule,
    NbDialogModule.forChild(),
    EducationModule,
    StartupModule,
    HealthModule,
    RuraldevModule,
    OthersModule,
    OldagehomeModule,
    NatureModule,
    FarmingModule
  ],
  declarations: [
    PagesComponent,
    ViewpostComponent,
    OrgpicsComponent,
    //LoginComponent,
    QrcodeComponent,
    IpfsComponent,
    FluidMeterComponent,
    ConfirmationDialogComponent,
    ConditionalFundDialogComponent,
  ],
  providers: [
    LoginComponent,
    UserinfoService
  ]
})
export class PagesModule {
}
