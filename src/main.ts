import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideRouter(routes), 
        provideClientHydration(), 
        provideAnimationsAsync()
        // Autres providers éventuels
      ],
})
    .catch((err) => console.error(err));