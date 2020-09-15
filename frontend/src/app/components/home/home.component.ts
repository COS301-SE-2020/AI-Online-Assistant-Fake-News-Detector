import { Component, OnInit } from "@angular/core";
import { HomeSearchSourceService } from "./home-search-source.service";
import { HomeNeuralService } from "./home-neural.service";
import { AuthService } from "../../services/auth/auth.service";
import { Observable } from "rxjs";
import { stringify } from "querystring";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  urlvalue: string;
  textvalue: string;
  factvalue: string;
  step1: boolean;
  step2: boolean;
  step3: boolean;
  confidenceGaugeValue: number;
  thresholdConfig = {
    "0": { color: "white" },
    "25": { color: "purple" },
    "50": { color: "pink" },
    "75": { color: "orange" },
    "90": { color: "red" },
  };
  nnPred: string;
  cardImgUrl: string;
  user$: Observable<firebase.User> = this.auth.user$;
  textHit:boolean;
  urlHit:boolean;
  factHit:boolean;
  constructor(
    private search: HomeSearchSourceService,
    private nn: HomeNeuralService,
    private readonly auth: AuthService
  ) {}
  ngOnInit(): void {
    this.step1 = false;
    this.step2 = false;
    this.step3 = false;
    this.confidenceGaugeValue = 0;
    this.cardImgUrl =
      "assets/img/unDraw/real/" +
      (Math.floor(Math.random()*8)+1).toString()+".svg";
    this.nnPred = "real";
    this.textHit=false;
    this.urlHit=false;
    this.factHit=false;
  }
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
  checkText() {
    this.nn.verify(this.textvalue).subscribe((data) => {
      console.log(data);
      const message = data.message;
      console.log("message :", message);
      const result = data.result;
      console.log("result :", result);
      const breakdown = result.breakdown;
      console.log("breakdown :", breakdown);
      const overall = result.overall;
      console.log("overall :", overall);
      // set up gauge
      this.nnPred = overall.prediction;
      if(this.nnPred=="real"){
        this.cardImgUrl =
      "assets/img/unDraw/real/" +
      (Math.floor(Math.random() * 8) + 1).toString() +
      ".svg";
      }
      else{
        this.cardImgUrl =
        "assets/img/unDraw/fake/" +
        (Math.floor(Math.random() * 8) + 1).toString() +
        ".svg";
      }
      this.confidenceGaugeValue = overall.confidence * 100;
      this.textHit=true;
    });
  }
}
