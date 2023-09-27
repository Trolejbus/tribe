import { createAction, props } from '@ngrx/store';
import { MapPart } from './map-generator.service';

export class MapStoreActions {

    public static generateInitMapParts = createAction(
        '[Map Store] Generate Init Map Parts',
    );

    public static mapPartGenerated = createAction(
        '[Map Store] Map Part Generated',
        props<{ part: MapPart }>(),
    );
}
