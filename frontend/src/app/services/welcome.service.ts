import { Inject, Injectable } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";
@Injectable()
export class WelcomeService {
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}
  public store(val: boolean): void {
    this.storage.set("local_hasBeenHere", val);
    // console.log(this.storage.get("local_hasBeenHere") || 'LocaL storage is empty');
  }
  public hasBeenHere(): boolean {
    return this.storage.get("local_hasBeenHere") || false;
  }
}
