import { Component, OnInit } from '@angular/core';
import {DownloadPluginService} from 'src/app/download-plugin.service'

@Component({
  selector: 'app-download-plugin',
  templateUrl: './download-plugin.component.html',
  styleUrls: ['./download-plugin.component.css']
})
export class DownloadPluginComponent implements OnInit {

  constructor(private downloads: DownloadPluginService) {}

  download(): void {
    this.downloads
      .download('/assets/downloads/plugin.zip')
      .subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = 'archive.zip';
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
  }

  ngOnInit(): void {
  }

}
