import { Component, OnInit } from '@angular/core'
import { ReportService } from '../report.service'
import { FindService } from '../find.service'
import { CheckService } from '../check.service'

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: [ './input.component.css' ]
})
export class InputComponent implements OnInit {
	value: string
	checkReturn: boolean

	constructor(private rsv: ReportService, private fsv: FindService, private csv: CheckService) {
		this.checkReturn = false
	}

	clickCheck() {
		this.csv.check(this.value).subscribe(data => {
			console.log(data)
			this.checkReturn = true
		})
	}
	clickReport() {
		this.rsv.report(this.value).subscribe(data => {
			console.log(data)
		})
	}
	clickFind() {
		this.fsv.find(this.value).subscribe(data => {
			console.log(data)
		})
	}
	ngOnInit(): void {}
}
