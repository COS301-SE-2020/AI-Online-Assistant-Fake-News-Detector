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
	checkFake: boolean
	checkValid: boolean
	reported: boolean

	constructor(private rsv: ReportService, private fsv: FindService, private csv: CheckService) {
		this.checkFake = false
		this.checkValid = false
		this.reported = false
	}

	clickCheck() {
		this.csv.check(this.value).subscribe(
			//   response => {
			// 	// You can access status:
			// 	console.log(response.status)
			// 	if (response.status == 200) {
			// 		console.log('not fake')
			// 	} else {
			// 		console.log('fake')
			// 		window.alert('fake news')
			// 	}
			// }

			res => (this.checkValid = true),
			err => (this.checkFake = true),
			() => console.log('HTTP request completed.')
		)
	}
	clickReport() {
		// // this.rsv.report(this.value).subscribe(data => {
		// // 	console.log(data)
		// })
		this.reported = true
	}
	clickFind() {
		this.fsv.find(this.value).subscribe(data => {
			console.log(data)
		})
	}
	ngOnInit(): void {}
}
