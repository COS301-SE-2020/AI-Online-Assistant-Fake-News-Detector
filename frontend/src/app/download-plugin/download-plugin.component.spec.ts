import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPluginComponent } from './download-plugin.component';

describe('DownloadPluginComponent', () => {
  let component: DownloadPluginComponent;
  let fixture: ComponentFixture<DownloadPluginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadPluginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
