import { Component, OnInit } from "@angular/core";
import { StatisticsService } from "src/app/components/howto/statistics.service";
import { Facts } from "./factsDataList";
import { Sources } from "./sourcesDataList";
import { Endpoint } from "./endpointDataList";
import { analytics } from "firebase";
import { TOUCH_BUFFER_MS } from "@angular/cdk/a11y";

@Component({
  selector: "app-howto",
  templateUrl: "./howto.component.html",
  styleUrls: ["./howto.component.css"],
})
export class HowtoComponent implements OnInit {
  nnTrainingTime: number;
  nnSetCount: number;
  trendingFacts: Facts[] = [];
  trendingSources: Sources[] = [];
  factsPopularity: Facts[] = [];
  sourcesPopularity: Sources[] = [];
  endpointHits: Endpoint[] = [];
  setFacts: boolean;
  setSources: boolean;
  setEndpoint: boolean;
  //trendingFacts: { name: string, value: number }[];

  /* For Sets per minute (SM) */
  SMgaugeType = "full";
  SMgaugeValue = 0;
  SMgaugeLabel = "Sets / Second";
  maxSM = 10;
  SMsize = 250;
  SMthresholdConfig = {
    "0": { color: "" },
    "4": { color: "orange" },
    "7.5": { color: "red" },
  };

  /* For training time per day (TD)*/
  TDgaugeType = "full";
  TDgaugeValue = 0;
  TDGaugeAppend = "min";
  TDgaugeLabel = "Training Hours / Day";
  maxTD = 24;
  TDsize = 250;

  /* For training time  (TT) exclusively */
  TTgaugeType = "semi";
  TTgaugevalue = this.nnTrainingTime;
  TTgaugeLabel = "Training Time in Minutes";
  maxTT = 1440; /*maximum minutes in a day */
  TTthresholdConfig = {
    "0": { color: "green" },
    "475.5": { color: "orange" },
    "950.4": { color: "red" },
  };

  /* For training sets  (TS) exclusively */
  TSgaugeType = "semi";
  TSgaugevalue = this.nnSetCount;
  TSgaugeLabel = "Training Sets";
  maxTS = 1000000; /*maximum minutes in a day */
  TSthresholdConfig = {
    "0": { color: "red" },
    "333333": { color: "orange" },
    "666666": { color: "green" },
  };

  /* For Facts report count Statistics Pie Chart*/
  Fview: any[] = [600, 600];
  Fgradient: boolean = true;
  FshowLegend: boolean = true;
  FshowLabels: boolean = true;
  FisDoughnut: boolean = false;
  FtrimLabel: boolean = false;
  FlegendPosition: string = "right";
  FlegendTitle: string = "Facts";
  FcolorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C"],
  };

<<<<<<< Updated upstream
    /* For Sources Report count Statistics Pie Chart*/
    Sview: any[] = [600, 600];
    Sgradient: boolean = true;
    SshowLegend: boolean = true;
    SshowLabels: boolean = true;
    SisDoughnut: boolean = false;
    StrimLabel: boolean = false;
    SlegendPosition: string = 'right';
    SlegendTitle: string = 'Sources';
    ScolorScheme = {
      domain: ['#5499C7', '#F7DC6F', '#8E44AD']
    };

    /* For sources popularity ratings  statistics*/
    SPview: any[] = [500, 500];
    SPshowXAxis = true;
    SPshowYAxis = true;
    SPgradient = true;
    SPshowLegend = true;
    SPshowXAxisLabel = true;
    SPxAxisLabel = 'Facts';
    SPshowYAxisLabel = true;
    SPlegendPosition: string = 'right';
    SPyAxisLabel = 'Popularity';
    SPlegendTitle: string = 'Sources';
  
    SPcolorScheme = {
      domain: ['#5499C7', '#F7DC6F', '#8E44AD']
    };

    /* for facts popularity ratings  statistics*/
    FPview: any[] = [500, 500];
    FPshowXAxis = true;
    FPshowYAxis = true;
    FPgradient = true;
    FPshowLegend = true;
    FPshowXAxisLabel = true;
    FPxAxisLabel = 'Sources';
    FPshowYAxisLabel = true;
    FPlegendPosition: string = 'right';
    FPyAxisLabel = 'Popularity';
    FPlegendTitle: string = 'Facts';
  
    FPcolorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C']
    };

    /* for endpoints hits statistics*/
    Eview: any[] = [700, 500];
    EshowXAxis = true;
    EshowYAxis = true;
    Egradient = true;
    EshowLegend = true;
    EshowXAxisLabel = true;
    ExAxisLabel = 'Hits';
    EshowYAxisLabel = true;
    ElegendPosition: string = 'right';
    EyAxisLabel = 'Endpoint';
    ElegendTitle: string = 'Endpoints';
  
    EcolorScheme = {
      domain: ['#808000', '#FFA500', '#C7B42C']
    };
  
=======
  /* For Sources Report count Statistics Pie Chart*/
  Sview: any[] = [600, 600];
  Sgradient: boolean = true;
  SshowLegend: boolean = true;
  SshowLabels: boolean = true;
  SisDoughnut: boolean = false;
  StrimLabel: boolean = false;
  SlegendPosition: string = "right";
  SlegendTitle: string = "Sources";
  ScolorScheme = {
    domain: ["#5499C7", "#F7DC6F", "#8E44AD"],
  };

  /* For sources popularity ratings  statistics*/
  SPview: any[] = [500, 500];
  SPshowXAxis = true;
  SPshowYAxis = true;
  SPgradient = true;
  SPshowLegend = true;
  SPshowXAxisLabel = true;
  SPxAxisLabel = "Facts";
  SPshowYAxisLabel = true;
  SPlegendPosition: string = "right";
  SPyAxisLabel = "Popularity";
  SPlegendTitle: string = "Sources";

  SPcolorScheme = {
    domain: ["#5499C7", "#F7DC6F", "#8E44AD"],
  };

  /* for facts popularity ratings  statistics*/
  FPview: any[] = [500, 500];
  FPshowXAxis = true;
  FPshowYAxis = true;
  FPgradient = true;
  FPshowLegend = true;
  FPshowXAxisLabel = true;
  FPxAxisLabel = "Sources";
  FPshowYAxisLabel = true;
  FPlegendPosition: string = "right";
  FPyAxisLabel = "Popularity";
  FPlegendTitle: string = "Facts";

  FPcolorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C"],
  };

  /* for endpoints hits statistics*/
  Eview: any[] = [700, 500];
  EshowXAxis = true;
  EshowYAxis = true;
  Egradient = true;
  EshowLegend = true;
  EshowXAxisLabel = true;
  ExAxisLabel = "Hits";
  EshowYAxisLabel = true;
  ElegendPosition: string = "below";
  EyAxisLabel = "Endpoint";
  ElegendTitle: string = "Endpoints";

  EcolorScheme = {
    domain: ["#808000", "#FFA500", "#C7B42C"],
  };
>>>>>>> Stashed changes

  constructor(private stats: StatisticsService) {
    //this.getFacts();
    this.setFacts = false;
    this.setSources = false;
    this.setEndpoint = false;


    //Object.assign(this.trendingFacts, this.trendingFacts);
  }

  ngOnInit(): void {
    this.getFacts();
  }

  getFacts() {
    this.stats.getStats().subscribe((data: any) => {
      this.nnTrainingTime = data.response.NeuralNetwork["Training Time"];
      this.nnSetCount = data.response.NeuralNetwork["Training Set Count"];
      this.SMgaugeValue = this.nnSetCount / (this.nnTrainingTime * 60);
      this.TDgaugeValue = this.nnTrainingTime / 60;
      this.TTgaugevalue = this.nnTrainingTime;
      this.TSgaugevalue = this.nnSetCount;

      for (let i = 0; i < data.response.Reports[0].Facts.Trending.length; i++) {
        this.trendingFacts.push({
          name: data.response.Reports[0].Facts.Trending[i].Statement,
          value: data.response.Reports[0].Facts.Trending[i]["Report Count"],
        });

        this.factsPopularity.push({
          name: data.response.Reports[0].Facts.Trending[i].Statement,
          value: data.response.Reports[0].Facts.Trending[i].Popularity,
        });
      }
      this.setFacts = true;

      for (
        let i = 0;
        i < data.response.Reports[1].Sources.Trending.length;
        i++
      ) {
        this.trendingSources.push({
          name: data.response.Reports[1].Sources.Trending[i].Name,
          value: data.response.Reports[1].Sources.Trending[i]["Report Count"],
        });

        this.sourcesPopularity.push({
          name: data.response.Reports[1].Sources.Trending[i].Name,
          value: data.response.Reports[1].Sources.Trending[i].Rating,
        });
      }
      this.setSources = true;

      this.endpointHits.push({
        name: "Facts",
        value: data.response.Reports[0].Facts["End Point Hits"],
      });
      this.endpointHits.push({
        name: "Sources",
        value: data.response.Reports[1].Sources["End Point Hits"],
      });
      this.setEndpoint = true;
    });
  }

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
<<<<<<< Updated upstream

  onResize(event) {
    this.Fview = [event.target.innerWidth / 1.35, 400];
    this.Sview = [event.target.innerWidth / 1.35, 400];
    this.SPview = [event.target.innerWidth / 1.35, 400];
    this.FPview = [event.target.innerWidth / 1.35, 400];
    this.Eview = [event.target.innerWidth / 1.35, 400];
}


=======
>>>>>>> Stashed changes
}
