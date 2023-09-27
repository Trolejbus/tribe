import { createFeatureSelector } from '@ngrx/store';
import { MapStoreState } from './map-store.state';

const getState = createFeatureSelector<MapStoreState>('mapStoreFeature');

export class MapStoreSelectors {
    /*public static getCreditCheck = createSelector(
        getState,
        state => Object.values(state.entity),
    );  */
}
