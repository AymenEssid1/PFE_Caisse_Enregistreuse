import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


/*bootstrapApplication(AppComponent, {
    providers: [
        provideAnimationsAsync()
    ]
});*/


/*platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err));*/
