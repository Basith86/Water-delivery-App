import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, Params, PRIMARY_OUTLET } from "@angular/router";
import { LocalStorageService } from '../local-storage.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../environments/environment'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  username: any;
  password:any;
  opened: boolean = false;
  showBackdrop: boolean = true;
  mode: any;
  position:any;
  logIn: boolean;

  constructor(private toastr: ToastrService, private http: HttpClient, private router: Router, private activatedroute: ActivatedRoute, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.position='top';
    this.mode = 'over';
    this.showBackdrop = true;
    var ls = this.localStorageService.getLocalStorage();
    if(ls && ls.login){
      this.logIn= true;
    }
    // console.log(this.localStorageService.getLocalStorage());
  }

  ngAfterViewChecked() {
    var ls = this.localStorageService.getLocalStorage();
    if(ls && ls.login){
      this.logIn= true;
    }
  }

  login(){

      var data = this.http.get(environment.apiUrl + '/get?email='+ this.username).subscribe(
        res =>{ 
          
          if( res[0].email == this.username && res[0].password == this.password){
          console.log(res[0].email, res[0].password)
          this.logIn = true;
          var ls = this.localStorageService.storeOnLocalStorage(this.logIn, res[0].email);
          if(ls && ls.login){
                this.logIn = true;
              } else {
                this.logIn = false;
              }
          this.opened = false;    
        }
        
        else if(res[0].error || res[0].email == this.username || res[0].password == this.password ){
          this.toastr.error('Incorrect Username or Password','Error', {
            positionClass: 'toast-top-center',
            progressBar: true,
            timeOut: 5000
          });
        }
       },
        err =>{
          if(err){
            this.toastr.error('Our server is down at this moment, please try agin after some time.','Error', {
              positionClass: 'toast-top-center',
              progressBar: true,
              timeOut: 5000
            });
            
          }
        }
      )


    // if(this.username == 'basith' && this.password == 'basith'){
    //   this.logIn = true;
    //   var ls = this.localStorageService.storeOnLocalStorage(this.logIn);
    //   if(ls && ls.login){
    //     this.logIn = true;
    //   } else {
    //     this.logIn = false;
    //   }
    //   this.router.navigate(['/'])
    //   this.opened = false;
    // }
  }
 
  _toggleSidebar() {
    this.opened = !this.opened;
    this.mode = 'slide';
    this.position = 'top';
    this.showBackdrop = true;
  }

  stopBD(e){    
    e.stopPropagation();
    e.preventDefault();
  }

  closeBD(){
    this.opened = false;
  }

  drop() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  logOut(){
    this.logIn = false;
    this.localStorageService.storeOnLocalStorage(false,"");
    document.getElementById("myDropdown").classList.toggle("show");
  }

  register(){
    window.location.href="/register"
  }
}
