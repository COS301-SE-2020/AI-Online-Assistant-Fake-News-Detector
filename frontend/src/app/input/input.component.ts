import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { FindService } from '../find.service';
import { CheckService } from '../check.service';
//import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: [ './input.component.css' ]
})
export class InputComponent implements OnInit {
	value: string;
	checkFake: boolean;
	checkValid: boolean;
	reported: boolean;

	allSources;
	isSource: boolean;
	source;

	allFacts;
	isFact: boolean;
	fact;

	constructor(private rsv: ReportService, private fsv: FindService, private csv: CheckService) {
		this.checkFake = false;
		this.checkValid = false;
		this.reported = false;

		this.isSource = false;
	}

	clickCheck() {
		// this.csv.check(this.value).subscribe(
		// 	res => (this.checkValid = true),
		// 	err => (this.checkFake = true),
		// 	() => console.log('HTTP request completed.')
		// );

		//console.log(this.allSources);
		this.allSources.forEach(element => {
			if (element.name == this.value || element.tld == this.value) {
				this.isSource = true;
				this.source = element;
			}
		});

		//console.log(this.allFacts);
		this.allFacts.forEach(element => {
			if (element.statement == this.value) {
				this.isFact = true;
				this.fact = element;
			}
		});
	}
	clickReport() {
		// // this.rsv.report(this.value).subscribe(data => {
		// // 	console.log(data)
		// })
		this.reported = true;
	}

	clickFind() {
		this.fsv.find(this.value).subscribe(data => {
			console.log(data);
		});

		alert('coming soon o__X');
	}
	//this must be fixed hack for demo
	ngOnInit(): void {
		this.csv.getAllSources().subscribe(data => {
			this.allSources = data.body.sources;
		});

		this.csv.getAllFacts().subscribe(data => {
			this.allFacts = data.body.facts;
		});
	}
}
