import { createFeature, createReducer, on } from '@ngrx/store';
import { MapStoreState } from './map-store.state';
import { MapStoreActions } from './map-store.actions';

const initialState: MapStoreState = {
    currentPartX: 0,
    currentPartY: 0,
    parts: [],
};

const reducer = createReducer(
    initialState,
    /*on(MapStoreActions.mapPartGenerated, (state, { part }) => ({
        ...state,
        parts: 
    })),*/
);

export const mapStoreFeature = createFeature({
    name: 'mapStoreFeature',
    reducer,
});
