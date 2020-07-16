import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatToolbarModule } from '@angular/material/toolbar'
import { NgModule } from '@angular/core'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'

//import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet'

@NgModule({
	exports: [ MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBottomSheetModule ]
})
export class AiMaterialModule {}
