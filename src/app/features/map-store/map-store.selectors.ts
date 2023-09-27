import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MapStoreState } from './map-store.state';

const getState = createFeatureSelector<MapStoreState>('mapStoreFeature');

export class MapStoreSelectors {
    public static getMouse = createSelector(
        getState,
        state => state.mouse,
    );

    public static getMouseDowned = createSelector(
        getState,
        state => state.mouseDowned,
    );
}
