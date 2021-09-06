import { HealthComponent } from './health/health.component';
import { OthersComponent } from './other/other.component';
import { FarmingComponent } from './farming/farming.component';
import { NatureComponent } from './nature/nature.component';
import { RuraldevComponent } from './ruraldev/rural.component';
import { OldagehomeComponent } from './oldagehome/oldagehome.component';
import { StartupComponent } from './startups/startup.component';
import { EducationComponent } from './education/education.component';
import { ViewpostComponent } from './viewpost/viewpost.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserinfoComponent } from './userinfo/userinfo.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AddorgComponent } from './addorg/addorg.component';
//import { LoginComponent } from './login/login.component';
import { IpfsComponent } from './ipfs/ipfs.component';
import { LoginComponent } from '../login/login.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,canActivate:[LoginComponent],
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path:'user-profile',
      component: UserinfoComponent,
    },
    {
      path:'viewpost/:id',
      component: ViewpostComponent,
    },
    {
      path:'raise-fund',
      component: AddorgComponent,
    },
    {
      path: 'ipfs',
      component: IpfsComponent,
    },
    {
      path: 'education',
      component: EducationComponent,
    },
    {
      path: 'startup',
      component: StartupComponent
    },
    {
      path: 'oldagehome',
      component: OldagehomeComponent
    },
    {
      path: 'health',
      component: HealthComponent
    },
    {
      path: 'ruraldevelopment',
      component: RuraldevComponent
    },
    {
      path: 'nature',
      component: NatureComponent
    },
    {
      path: 'farming',
      component: FarmingComponent
    },
    {
      path: 'others',
      component: OthersComponent
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
