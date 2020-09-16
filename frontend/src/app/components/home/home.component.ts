import { Component, OnInit } from "@angular/core";
import { HomeSourceService } from "./home-source.service";
import { HomeNeuralService } from "./home-neural.service";
import { AuthService } from "../../services/auth/auth.service";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
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
    0: { color: "purple" },
    50: { color: "pink" },
  };
  nnPred: string;
  cardImgUrl: string;
  breakdown;
  user$: Observable<firebase.User> = this.auth.user$;
  textHit: boolean;
  urlHit: boolean;
  factHit: boolean;
  constructor(
    private search: HomeSourceService,
    private nn: HomeNeuralService,
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;
    this.confidenceGaugeValue = 0;
    this.cardImgUrl =
      "assets/img/unDraw/real/" +
      (Math.floor(Math.random() * 8) + 1).toString() +
      ".svg";
    this.nnPred = "real";
    this.textHit = false;
    this.urlHit = false;
    this.factHit = false;
  }
  clickTemp() {
    this.snackBar.open(`Source reported ( ಥ ʖ̫ ಥ)`, "Close", {
      duration: 4000,
    });
  }
  paste() {
    navigator.clipboard
      .readText()
      .then((text) => {
        this.textvalue = text;
      })
      .catch(() => {
        alert("Failed to read from clipboard.");
      });
  }
  checkText() {
    this.nn.verify(this.textvalue).subscribe((data) => {
      const message = data.message;
      console.log(data);
      const result = data.result;
      this.breakdown = result.breakdown;
      const overall = result.overall;
      // set up gauge
      this.nnPred = overall.prediction;
      if (this.nnPred === "real") {
        this.cardImgUrl =
          "assets/img/unDraw/real/" +
          (Math.floor(Math.random() * 8) + 1).toString() +
          ".svg";
      } else {
        this.cardImgUrl =
          "assets/img/unDraw/fake/" +
          (Math.floor(Math.random() * 8) + 1).toString() +
          ".svg";
      }
      this.confidenceGaugeValue = overall.confidence * 100;
      this.textHit = true;
    });
  }
  share(event: MouseEvent) {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: "ArtiFact Result",
          // prettier-ignore
          text: "Article: {"+this.textvalue+"}\n\n"+"Result: "+this.confidenceGaugeValue+"% confident, AI verdict: "+this.nnPred,
        })
        .then(() => {
          this.snackBar.open(`Thanks for sharing (◠﹏◠)`, "Close", {
            duration: 3000,
          });
        })
        .catch((error) => {} /*console.log("Error sharing", error)*/);
    } else {
      this.snackBar.open(`Web Share API not supported ( ಥ ʖ̫ ಥ)`, "Close", {
        duration: 3000,
      });
    }
  }
}
