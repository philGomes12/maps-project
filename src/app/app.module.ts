import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { StorePolygonsService } from './core/storeLatLng.service';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAZBbrLPN7KatMqF_GIYtQ1uHYrsqv5Va4',
      libraries: ['places', 'drawing', 'geometry']
    }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatChipsModule
  ],
  providers: [HttpClientModule, StorePolygonsService],
  bootstrap: [AppComponent],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
