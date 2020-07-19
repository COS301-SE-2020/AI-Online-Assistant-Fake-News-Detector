import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FactslistService } from 'src/app/factslist.service';
import { FactInputService } from 'src/app/fact-input.service';
import { FactsList } from 'src/app/factslist';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';


@Component({
  selector: 'app-moderate',
  templateUrl: './moderate.component.html',
  styleUrls: ['./moderate.component.css']
})
export class ModerateComponent implements OnInit {

  FactInputForm: FormGroup;
  factslist: FactsList[];

  constructor(private factslistService: FactslistService, private _factinputService: FactInputService, public http: HttpClient) { }
  
  

  ngOnInit(): void {

    /* Fetching list of facts that populate bottom section on Moderator page */
    this.getFacts();

    /* End of fetch list */

    /* Setting number of facts that can be displayed */
    
    /* end of number of facts */


    /* instance of form group */
    this.FactInputForm = new FormGroup({
      statement: new FormControl(),
      popularity: new FormControl()
    })

    /* End of instance of form group */

  }

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

}
