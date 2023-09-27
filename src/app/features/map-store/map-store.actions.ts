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
    
    public static mouseMoved = createAction(
        '[Map Store] Mouse Moved',
        props<{ x: number; y: number; }>(),
    );

    public static mouseDown = createAction(
        '[Map Store] Mouse Down',
        props<{ x: number; y: number; }>(),
    );

    public static mouseUp = createAction(
        '[Map Store] Mouse Up',
    );

    public static mouseLeave = createAction(
        '[Map Store] Mouse Leave',
    );
}
