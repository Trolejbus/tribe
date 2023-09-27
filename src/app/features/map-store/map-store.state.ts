import { MapPartItem } from "./map-generator.service";

export interface MapStoreState {
    centerX: number;
    centerY: number;
    parts: MapPartState[];
    mouse: { x: number, y: number } | null;
    mouseDowned: { x: number, y: number } | null;
}

export interface MapPartState {
    x: number;
    y: number;
    items: MapPartItem[][][];
}
