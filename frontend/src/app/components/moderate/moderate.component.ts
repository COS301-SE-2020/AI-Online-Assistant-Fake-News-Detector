import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FactslistService } from 'src/app/factslist.service';
import { FactInputService } from 'src/app/fact-input.service';
import { SearchSourceService} from 'src/app/search-source.service';
import { Sources } from 'src/app/sources'
import { FactsList } from 'src/app/factslist';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable, Subscription } from 'rxjs';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { DeleteSourceService } from 'src/app/delete-source.service';
import {FormBuilder} from '@angular/forms';
import {AutocompleteService} from 'src/app/autocomplete.service';
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-moderate',
  templateUrl: './moderate.component.html',
  styleUrls: ['./moderate.component.css'],
  providers: [SearchSourceService]
})
export class ModerateComponent implements OnInit {
  sourcelist: any = {};
  SourceInputForm: FormGroup;
  FactInputForm: FormGroup;
  factslist: FactsList[];
  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<any[]>;

  dismiss: boolean;
  sourceDeleteResponse: boolean;
  insertFactResponse: boolean;
  searchResponse:boolean;

  //sourceID:string;
  receivedID:string;
  value: string;

  constructor(private factslistService: FactslistService, private _factinputService: FactInputService,
    private searchService: SearchSourceService ,public http: HttpClient, private _deleteService: DeleteSourceService,
    private autocompleteService: AutocompleteService) { 
    this.dismiss=false;
    this.sourceDeleteResponse=false;
    this.insertFactResponse=false;
    this.searchResponse=false;

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
            return this.filter(val || '')
       }) 
    )
  }
  
  

  ngOnInit(): void {
    /*autocomplete functionality*/

    /*end of autocomplete*/


    /* Fetching list of facts that populate bottom section on Moderator page */
    this.getFacts();
    /* End of fetch list */

    /* instance of form group */
    this.FactInputForm = new FormGroup({
      statement: new FormControl(),
      popularity: new FormControl()
    })

    /* End of instance of form group */


    /* instance of form group */
    this.SourceInputForm = new FormGroup({
      SourceName: new FormControl(),
    })

    /* End of instance of form group */


  }

      /*----------------fuzzy search---------*/

        filter(val: string): Observable<any[]> {
          // call the service which makes the http-request
          return this.autocompleteService.getData()
          .pipe(
            map( 
              response => response.sources.filter(option => { 
              return option.name.toLowerCase().indexOf(val.toLowerCase()) === 0
            }))
          )
        }  
      /*---------------end of fuzzy search ----------*/


        /*function that fetches source by name */
        Search(){
           
        this.sourceDeleteResponse=false;
        this.searchResponse=false;
        

        this.searchService.search(this.SourceInputForm.value.SourceName).
        subscribe((data: any={}) =>{
            this.sourcelist = data;
            this.dismiss=true;


            //this.testSearch=true;
           // this.sourceID = data.source._id;
           
        },
          error => {
            this.searchResponse=true;
            console.log("HTTP error ", error);
          }
           
        )
        
      }
       /*end of fetch source function */ 


      /*function that fetches list of facts */

        getFacts(){
          this.factslistService
          .getFactsList()
          .subscribe((data:any) => {
            console.log(data);
            this.factslist = data.facts;
          });
        }
      /* end of fetch list function */ 


      /* function that submits fact*/

      onSubmit() {
        console.log(this.FactInputForm.value);
        this._factinputService.SubmitFact(this.FactInputForm.value)
          .subscribe(
            response => console.log('Success!', response),
            error => console.error('Error!', error)
          );
      }
    /* End of fact input submit */

     /* function that deletes source*/

     DeleteSource(ID:string) {
      this.dismiss=false;
      this.sourceDeleteResponse= true;
      this._deleteService.SourceDeletion(ID)
        .subscribe(
          
          response => console.log('Success!', response),
          error => console.error('Error!', error)
        );
    }
  /* End of source delete function */    




}
