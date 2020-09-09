import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FactslistService } from "src/app/factslist.service";
import { FactInputService } from "src/app/fact-input.service";
import { SourceInputService } from "src/app/source-input.service";
import { SearchSourceService } from "src/app/search-source.service";
import { Sources } from "src/app/sources";
import { FactsList } from "src/app/factslist";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Subject } from "rxjs/Subject";
import { Observable, Subscription } from "rxjs";
import { stringToKeyValue } from "@angular/flex-layout/extended/typings/style/style-transforms";
import { DeleteSourceService } from "src/app/delete-source.service";
import { FormBuilder } from "@angular/forms";
import { AutocompleteService } from "../../services/autocomplete.service";

import {
  tap,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from "rxjs/operators";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-moderate",
  templateUrl: "./moderate.component.html",
  styleUrls: ["./moderate.component.css"],
  providers: [SearchSourceService],
})
export class ModerateComponent implements OnInit {
  sourcelist: any = {};
  SourceInputForm: FormGroup;
  FactInputForm: FormGroup;
  InsertSourceForm: FormGroup;
  factslist: FactsList[];
  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<any[]>;

  dismiss: boolean;
  sourceDeleteResponse: boolean;
  insertFactResponse: boolean;
  insertSourceResponse: boolean;
  searchNotFound: boolean;
  checked: boolean;

  //sourceID:string;
  receivedID: string;
  clearSearchSourceName: string;
  clearInsertSourceName: string;
  clearUrl: string;
  clearInsertFactStatement: string;
  ratingString: string;

  constructor(
    private factslistService: FactslistService,
    private _factinputService: FactInputService,
    private _sourceinputService: SourceInputService,
    private searchService: SearchSourceService,
    public http: HttpClient,
    private _deleteService: DeleteSourceService,
    private autocompleteService: AutocompleteService,
    public auth: AuthService
  ) {
    this.dismiss = false;
    this.sourceDeleteResponse = false;
    this.insertFactResponse = false;
    this.insertSourceResponse = false;
    this.searchNotFound = false;

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val) => {
        return this.filter(val || "");
      })
    );
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
      popularity: new FormControl(),
    });

    /* End of instance of form group */

    /* instance of search form group */
    this.SourceInputForm = new FormGroup({
      SourceName: new FormControl(),
    });

    /* End of instance search of form group */

    /* instance of insert source form group */
    this.InsertSourceForm = new FormGroup({
      name: new FormControl(),
      tld: new FormControl(),
      rating: new FormControl(),
    });

    /* End of instance of insert source form group */
  }

  /*----------------fuzzy search---------*/

  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.autocompleteService.getData().pipe(
      map((response) =>
        response.Sources.filter((option) => {
          return option.Name.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })
      )
    );
  }
  /*---------------end of fuzzy search ----------*/

  /*function that fetches source by name */
  Search() {
    this.sourceDeleteResponse = false;
    this.searchNotFound = false;

    this.searchService.search(this.SourceInputForm.value.SourceName).subscribe(
      (data: any = {}) => {
        this.sourcelist = data.response.Source;
        this.dismiss = true;

        //this.testSearch=true;
        // this.sourceID = data.source._id;
      },
      (error) => {
        if (this.SourceInputForm.valid) {
          this.searchNotFound = true;
        }

        console.log("HTTP error ", error);
      }
    );
  }
  /*end of fetch source function */

  /*function that fetches list of facts */

  getFacts() {
    this.factslistService.getFactsList().subscribe((data: any) => {
      //console.log(data);
      this.factslist = data.response.Facts;
    });
  }
  /* end of fetch list function */

  /* function that submits source*/

  onSourceSubmit() {
    console.log(this.InsertSourceForm.value);
    this._sourceinputService
      .SubmitSource(this.InsertSourceForm.value)
      .subscribe(
        (response) => {
          if (this.InsertSourceForm.valid) {
            this.insertSourceResponse = true;
          }
          console.log("Success!", response);
        },
        (error) => {
          if (this.InsertSourceForm.valid) {
            this.insertSourceResponse = false;
          }
          console.error("Error!", error);
        }
      );
  }
  /* End of source input submit */

  /* function that submits fact*/

  onSubmit() {
    console.log(this.FactInputForm.value);
    this._factinputService.SubmitFact(this.FactInputForm.value).subscribe(
      (response) => {
        if (this.FactInputForm.valid) {
          this.insertFactResponse = true;
        }
        console.log("Success!", response);
      },
      (error) => {
        if (this.FactInputForm.valid) {
          this.insertFactResponse = true;
        }
        console.error("Error!", error);
      }
    );
  }
  /* End of fact input submit */

  /* function that deletes source*/

  DeleteSource(ID: string) {
    this.dismiss = false;
    this.sourceDeleteResponse = true;
    this._deleteService.SourceDeletion(ID).subscribe(
      (response) => console.log("Success!", response),
      (error) => console.error("Error!", error)
    );
  }
  /* End of source delete function */

  /* Function that clears response cards */
  ResetResponseCards() {
    if (this.SourceInputForm.valid) {
      this.SourceInputForm.reset();
      this.sourcelist = "";
      this.searchNotFound = false;
    }

    if (this.sourceDeleteResponse) {
      this.sourceDeleteResponse = false;
    }

    if (this.FactInputForm.valid) {
      this.FactInputForm.reset();
      this.insertFactResponse = false;
    }

    if (this.InsertSourceForm.valid) {
      this.InsertSourceForm.reset();
      this.insertSourceResponse = false;
    }
  }
  /* End of function that clears response cards */

  /* Checks the rating of a fact's popularity and determines the class*/
  checkRatingHigh(rating: number) {
    if (rating > 70) {
      return true;
    } else {
      return false;
    }
  }

  checkRatingMed(rating: number) {
    if (rating > 40 && rating < 70) {
      return true;
    } else {
      return false;
    }
  }

  checkRatingLow(rating: number) {
    if (rating < 40 && rating > 0) {
      return true;
    } else {
      return false;
    }
  }

  /* End of rating checker*/

  /* Convert passed in fact popularity plain number to string */
  convertRating(rating: number) {
    this.ratingString = rating.toString() + "%";
    return this.ratingString;
  }
  /* end of rating conversion */
}
