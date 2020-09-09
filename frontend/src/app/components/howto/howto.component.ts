import { Component, OnInit } from '@angular/core';
import {StatisticsService} from 'src/app/components/howto/statistics.service'


@Component({
  selector: 'app-howto',
  templateUrl: './howto.component.html',
  styleUrls: ['./howto.component.css']
})
export class HowtoComponent implements OnInit {

  nnTrainingTime : number;
  nnSetCount: number;

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

  

  constructor(private stats: StatisticsService) { }

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
 
    });
  }
}
