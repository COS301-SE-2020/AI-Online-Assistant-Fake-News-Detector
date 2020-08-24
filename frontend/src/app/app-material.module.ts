import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  exports: [ MatButtonModule,
            MatIconModule,
            MatMenuModule,
            MatToolbarModule,
            MatBottomSheetModule,
            MatTabsModule,
            MatInputModule,
            MatDividerModule,
          ]
})
export class AiMaterialModule {}
