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

  dismiss: boolean;
  sourceDeleteResponse: boolean;
  insertFactResponse: boolean;
  searchResponse:boolean;

  //sourceID:string;
  receivedID:string;

  constructor(private factslistService: FactslistService, private _factinputService: FactInputService,
    private searchService: SearchSourceService ,public http: HttpClient, private _deleteService: DeleteSourceService) { 
    this.dismiss=false;
    this.sourceDeleteResponse=false;
    this.insertFactResponse=false;
    this.searchResponse=false;
  }
  
  

  ngOnInit(): void {

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

        /*function that fetches source by name */
        Search(){
            
        this.searchService.search(this.SourceInputForm.value.SourceName).
        subscribe((data: any={}) =>{
            this.sourcelist = data;
            this.dismiss=true;
            this.sourceDeleteResponse=false;
            //this.testSearch=true;
           // this.sourceID = data.source._id;
           
        })
        
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
