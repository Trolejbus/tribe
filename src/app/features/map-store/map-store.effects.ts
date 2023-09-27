import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MapStoreState } from './map-store.state';
import { MapStoreActions } from './map-store.actions';
import { exhaustMap, map, of, tap } from 'rxjs';
import { MapGeneratorService } from './map-generator.service';

@Injectable()
export class MapStoreEffects {
    constructor(
        private actions$: Actions,
        private store: Store<MapStoreState>,
        private service: MapGeneratorService,
    ) { }

    generateInitMapParts$ = createEffect(() => this.actions$.pipe(
        ofType(MapStoreActions.generateInitMapParts),
        exhaustMap(() => of([-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]).pipe(
            map(([x, y]) => MapStoreActions.mapPartGenerated({ part: this.service.generateMapPart(x, y) })),
        )),
    ));
}
