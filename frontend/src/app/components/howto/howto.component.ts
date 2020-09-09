import { Component, OnInit } from '@angular/core';
import {StatisticsService} from 'src/app/components/howto/statistics.service'
import { Facts } from './factsDataList';
import { Sources } from './sourcesDataList';
import { analytics } from 'firebase';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';


@Component({
  selector: 'app-howto',
  templateUrl: './howto.component.html',
  styleUrls: ['./howto.component.css']
})
export class HowtoComponent implements OnInit {

  nnTrainingTime : number;
  nnSetCount: number;
  trendingFacts: Facts[] = [];
  trendingSources: Sources[] = [];
  setFacts: boolean;
  setSources: boolean;
  //trendingFacts: { name: string, value: number }[];

  /* For Sets per minute (SM) */
  SMgaugeType = "full";
  SMgaugeValue = 0;
  SMgaugeLabel = "Sets / Second";
  maxSM = 10;
  SMsize = 250;
  SMthresholdConfig= {
    '0': {color: ''},
    '4': {color: 'orange'},
    '7.5': {color: 'red'}
};


  /* For training time per day (TD)*/
  TDgaugeType = "full";
  TDgaugeValue = 0;
  TDGaugeAppend = "min"
  TDgaugeLabel = "Training Hours / Day"
  maxTD = 24;
  TDsize = 250;

  /* For training time  (TT) exclusively */
  TTgaugeType = "semi";
  TTgaugevalue = this.nnTrainingTime;
  TTgaugeLabel = "Training Time in Minutes"
  maxTT = 1440; /*maximum minutes in a day */
  TTthresholdConfig= {
    '0': {color: 'green'},
    '475.5': {color: 'orange'},
    '950.4': {color: 'red'}
};

  /* For training sets  (TS) exclusively */
  TSgaugeType = "semi";
  TSgaugevalue = this.nnSetCount;
  TSgaugeLabel = "Training Sets"
  maxTS = 1000000; /*maximum minutes in a day */
  TSthresholdConfig= {
    '0': {color: 'red'},
    '333333': {color: 'orange'},
    '666666': {color: 'green'}
};

  /* For Facts Statistics Pie Chart*/
  Fview: any[] = [500, 500];
  Fgradient: boolean = true;
  FshowLegend: boolean = true;
  FshowLabels: boolean = true;
  FisDoughnut: boolean = false;
  FtrimLabel: boolean = false;
  FlegendPosition: string = 'below';
  FlegendTitle: string = 'Trending Facts';
  FcolorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

    /* For Sources Statistics Pie Chart*/
    Sview: any[] = [500, 500];
    Sgradient: boolean = true;
    SshowLegend: boolean = true;
    SshowLabels: boolean = true;
    SisDoughnut: boolean = false;
    StrimLabel: boolean = false;
    SlegendPosition: string = 'below';
    SlegendTitle: string = 'Trending Sources';
    ScolorScheme = {
      domain: ['#5499C7', '#F7DC6F', '#8E44AD']
    };
  

  constructor(private stats: StatisticsService) {
    //this.getFacts();
    this.setFacts = false;
    this.setSources = false;

    //Object.assign(this.trendingFacts, this.trendingFacts);
  
   }

  ngOnInit(): void {
    this.getFacts();   
  }


  getFacts() {
 
    this.stats.getStats().subscribe((data: any) => {

      this.nnTrainingTime = data.response.NeuralNetwork['Training Time'];
      this.nnSetCount = data.response.NeuralNetwork['Training Set Count'];
      this.SMgaugeValue = this.nnSetCount / (this.nnTrainingTime * 60);
      this.TDgaugeValue = this.nnTrainingTime / 60;
      this.TTgaugevalue = this.nnTrainingTime;
      this.TSgaugevalue = this.nnSetCount;
      
    
      for (let i = 0; i < data.response.Reports[0].Facts.Trending.length; i++) {

              this.trendingFacts.push({
                  name: data.response.Reports[0].Facts.Trending[i].Statement,
                  value: data.response.Reports[0].Facts.Trending[i]['Report Count']
              }
              ); 
      }
      this.setFacts = true;

      for (let i = 0; i < data.response.Reports[1].Sources.Trending.length; i++) {

        this.trendingSources.push({
            name: data.response.Reports[1].Sources.Trending[i].Name,
            value: data.response.Reports[1].Sources.Trending[i]['Report Count']
        }
        ); 
      }
      this.setSources = true;
 
    });
  
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


}
