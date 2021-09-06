import{
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { AppService } from './../app.service';
import { Component, OnInit} from '@angular/core';
import Sawo from "sawo";
import {secret} from "../../environments/secret";
import { encode, decode } from 'js-base64';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { TaquitoService } from '../taquito.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class LoginComponent implements OnInit,CanActivate {

  public isLoader: boolean = false;
  title = 'angular-sawo-chander';
  Sawo: any;
  isLoggedIn:boolean = false;
  userPayload:any = {};
  greeting='';
  container_id=secret.CONTAINER_ID;

  email:string = '';
  uuid:string = '';
  name:string = '';
  profile_pic_number:number = 0;

  returnUrl:string='';

  constructor(
    //private cds: ChangeDetectorRef,
    private router: Router,
    private appservice: AppService,
    private taquito: TaquitoService
  ) { }

   canActivate(route, state: RouterStateSnapshot) {
    const check = sessionStorage.getItem("isLoggedin");
    if(check == "true"){
      return true;
    }
    this.router.navigate([''], { queryParams: { returnUrl: state.url} });
    return false;
  }



  async ngOnInit(): Promise<void> {
    this.isLoader = false;
    //this.cds.detectChanges();
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.setItem('isUpdate', 'true');
    console.log("hello");
    const sawoConfig = {
      containerID: this.container_id,
      identifierType: "email",
      // Secret
      apiKey: secret.API_KEY,
      onSuccess: async (payload: any) => {
        // var sawoContainer = document.getElementById("");
        // sawoContainer..remove();
        this.userPayload = payload;
        this.isLoggedIn = true;
        this.email=this.userPayload['identifier'];
        this.uuid=encode(this.email,true);
        // const uuid_decode=decode(uuid);
        this.name=(this.userPayload['customFieldInputValues']['Nickname']!='' ?this.userPayload['customFieldInputValues']['Nickname']:"Anonymous");
        this.profile_pic_number=this.name.length%7;
        // this.appservice.name.next(this.name);
        // this.appservice.email.next(this.email);
        // this.appservice.uuid.next(this.uuid);
        // this.appservice.profile_pic_number.next(this.profile_pic_number);
        sessionStorage.setItem('name', this.name);
        sessionStorage.setItem("isLoggedin", "true");
        sessionStorage.setItem("email", this.email);
        sessionStorage.setItem("uuid", this.uuid);
        sessionStorage.setItem("profilepicid",this.profile_pic_number.toString());
        this.isLoader = true;
        //this.cds.detectChanges();
        await this.taquito.set_contract();
        const x = await this.taquito.check_new_user(this.email);
        if(x)
        {
          await this.taquito.connect_wallet();
          await this.taquito.add_new_user(this.email);
        }
        if(this.isLoggedIn){
          this.isLoader = false;
          //this.cds.detectChanges();
          this.router.navigate(['/main']);
        }
      }
    };
    this.Sawo = new Sawo(sawoConfig);
  }

  ngAfterViewInit() {
    this.Sawo.showForm();

  }

}
