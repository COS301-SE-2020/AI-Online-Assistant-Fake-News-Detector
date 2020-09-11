import { Component, OnInit,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-togglebutton',
  templateUrl: './togglebutton.component.html',
  styleUrls: ['./togglebutton.component.css']
})
export class TogglebuttonComponent implements OnInit {
  @Output() changed = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit(): void {
  }

}
