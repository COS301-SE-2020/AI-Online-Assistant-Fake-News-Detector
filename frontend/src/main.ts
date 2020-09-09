import "./polyfills";
import "hammerjs";
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

const bootstrap = () =>
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.log(err));

if (environment.production) {
  enableProdMode();
}

bootstrap();
