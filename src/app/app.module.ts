import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule, Routes } from '@angular/router';
import { VillageViewComponent } from './features/village-view/village-view.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { MapComponent } from './features/map/map.component';
import { MapModule } from './features/map/map.module';
import { MapStoreModule } from './features/map-store';
import { NoiseService } from './shared/services/noise.service';
import { SpritesService } from './features/sprites/sprites.service';
import { SpritesModule } from './features/sprites';
import { ObjectsModule } from './features/objects';
import { MouseService } from './shared/services/mouse.service';

const routes: Routes = [
  {
    path: 'village',
    component: VillageViewComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    RouterModule.forRoot(routes),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([]),
    MapModule,
    MapStoreModule,
    SpritesModule,
    ObjectsModule,
  ],
  providers: [
    NoiseService,
    SpritesService,
    MouseService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
