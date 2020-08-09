import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-accountbutton',
  templateUrl: './user-accountbutton.component.html',
  styleUrls: ['./user-accountbutton.component.css']
})
export class UserAccountbuttonComponent implements OnInit {
  signIn: boolean;
  signUp: boolean;



  constructor() { 
    this.signIn=true;
    this.signUp=false;
  }

  ngOnInit(): void {
  
  }

  toggleForm(){

    //$event.stopPropagation();
    if(this.signIn){
      this.signUp=true;
      this.signIn=false;
    }
    else if(this.signUp){
      this.signIn=true;
      this.signUp=false;
    }
  }
  
}
