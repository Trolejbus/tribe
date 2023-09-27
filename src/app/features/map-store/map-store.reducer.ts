import { createFeature, createReducer, on } from '@ngrx/store';
import { MapStoreState } from './map-store.state';
import { MapStoreActions } from './map-store.actions';

const initialState: MapStoreState = {
    centerX: 0,
    centerY: 0,
    parts: [],
    mouse: null,
    mouseDowned: null,
};

const reducer = createReducer(
    initialState,
    on(MapStoreActions.mapPartGenerated, (state, { part }) => ({
        ...state,
        parts: [...state.parts, part],
    })),
    on(MapStoreActions.mouseMoved, (state, { x, y }) => ({
        ...state,
        mouse: { x, y },
    })),
    on(MapStoreActions.mouseDown, (state, { x, y }) => ({
        ...state,
        mouseDowned: { x, y },
    })),
    on(MapStoreActions.mouseUp, (state) => ({
        ...state,
        mouseDowned: null,
    })),
    on(MapStoreActions.mouseLeave, (state) => ({
        ...state,
        mouse: null,
    })),
);

export const mapStoreFeature = createFeature({
    name: 'mapStoreFeature',
    reducer,
});
