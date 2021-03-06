import { Component, OnInit } from "@angular/core";
import { HomeNeuralService } from "./home-neural.service";
import { AuthService } from "../../services/auth/auth.service";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HomeSourceService } from "./home-source.service";
import { FactslistService } from '../../factslist.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  found: boolean;
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
  breakdown: any;
  user$: Observable<firebase.User> = this.auth.user$;
  textHit: boolean;
  urlHit: boolean;
  factHit: boolean;
  constructor(
    private nn: HomeNeuralService,
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly sources: HomeSourceService,
    private readonly facts: FactslistService,
    private readonly reports: ReportService
  ) { }
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
      this.confidenceGaugeValue = Math.round(overall.confidence * 100);
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
          // tslint:disable-next-line: max-line-length
          text: "Article: {" + this.textvalue + "}\n\n" + "Result: " + this.confidenceGaugeValue + "% confident, AI verdict: " + this.nnPred,
        })
        .then(() => {
          this.snackBar.open(`Thanks for sharing (◠﹏◠)`, "Close", {
            duration: 3000,
          });
        })
        .catch((error) => { 'Could not share :( ' } /*console.log("Error sharing", error)*/);
    } else {
      this.snackBar.open(`Web Share API not supported ( ಥ ʖ̫ ಥ)`, "Close", {
        duration: 3000,
      });
    }
  }
  checkURL() {
    const tld = this.urlvalue.substring(0, this.urlvalue.indexOf('/', 8) + 1);
    const forwardSlashCount = (tld.match(/\//g) || []).length;
    if (forwardSlashCount === 0) {
      this.snackBar.open(`Please enter a valid URL ಠ_ಠ`, "Close", {
        duration: 3000,
      });
    } else {
      this.sources.getSources().subscribe(data => {
        /* tslint:disable:no-string-literal */
        data['response']['Sources'].forEach(source => {
          if (source['Domain Name'] === tld) {
            if (this.found === false) {
              this.snackBar.open(`Probably fake ಥ_ಥ`, "Close", {
                duration: 3000,
              });
            }
          }
        });
        if (this.found === false) {
          this.snackBar.open(`This source seems reputable V•ᴥ•V`, "Close", {
            duration: 3000,
          });
        }
      });
    }

  }
  checkFact() {

  }
  reportSource() {
    this.reports.reportSource(this.urlvalue).subscribe(data =>
      this.snackBar.open(`Sourece reported! ಠ_ಠ`, "Close", {
        duration: 4000,
      })
    );
  }
  reportFact() {
    this.reports.reportFact(this.factvalue).subscribe(data =>
      this.snackBar.open(`Fact reported! ʘ̅ㅈʘ̅`, "Close", {
        duration: 4000,
      })
    );
  }
  fix(val: number): number {
    return Math.floor(val * 100);
  }
}
