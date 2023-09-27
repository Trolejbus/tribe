import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { mapStoreFeature } from './map-store.reducer';
import { MapStoreEffects } from './map-store.effects';
import { MapGeneratorService } from './map-generator.service';
import { MapService } from './map.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(mapStoreFeature),
    EffectsModule.forFeature([MapStoreEffects]),
  ],
  providers: [
    MapGeneratorService,
    MapService,
  ],
})
export class MapStoreModule { }
