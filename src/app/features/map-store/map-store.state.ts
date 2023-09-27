import { MapPartItem } from "./map-generator.service";

export interface MapStoreState {
    currentPartX: number;
    currentPartY: number;
    parts: MapPartState[];
}

export interface MapPartState {
    x: number;
    y: number;
    items: MapPartItem[][][];
}
