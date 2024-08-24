import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './app/services/auth.guard';

const appConfig: ApplicationConfig = {
    providers: [
      provideHttpClient(),
      provideRouter(routes),
      importProvidersFrom(
        BrowserAnimationsModule,
        AuthGuard,
        ToastrModule.forRoot()
      ),
      // Autres providers éventuels
    ],
  };

bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));