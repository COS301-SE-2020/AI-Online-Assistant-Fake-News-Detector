import { Component, OnInit } from "@angular/core";
import { HomeSearchSourceService } from "./home-search-source.service";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  urlvalue: string;
  textvalue: string;
  factvalue: string;
  constructor(search: HomeSearchSourceService) {}

  ngOnInit(): void {}

  clickTemp() {
    alert("coming soon [o_o]");
  }

  paste() {
    navigator.clipboard
      .readText()
      .then((text) => {
        // (<HTMLInputElement>document.getElementById('AItext')).value = text;
        this.textvalue = text;
        // document.getElementById('AItext').value = text;
        // console.log("Text pasted.");
      })
      .catch(() => {
        alert("Failed to read from clipboard.");
      });
  }
}
