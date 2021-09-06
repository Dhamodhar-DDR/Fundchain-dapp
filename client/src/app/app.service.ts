import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }


  email: BehaviorSubject<string>  = new BehaviorSubject<string>('');
  uuid: BehaviorSubject<string>  = new BehaviorSubject<string>('');
  name: BehaviorSubject<string>  = new BehaviorSubject<string>('');
  profile_pic_number: BehaviorSubject<number>  = new BehaviorSubject<number>(0);
}
