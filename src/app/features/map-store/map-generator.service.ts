import { Injectable } from "@angular/core";

@Injectable()
export class MapGeneratorService {
    private readonly PartWidth = 30;
    private readonly PartHeight = 30;

    public generateMapPart(x: number, y: number): MapPart {
        const items = new Array<MapPartItem[][]>(this.PartWidth);
        const itemId = Math.floor(Math.random() * 5);
        for (let rowIndex = 0; rowIndex < this.PartWidth; rowIndex++) {
            items[rowIndex] = new Array<MapPartItem[]>(this.PartHeight);
            for (let colIndex = 0; colIndex < this.PartHeight; colIndex++) {
                items[rowIndex][colIndex] = [
                    { itemId },
                ];
            }
        }

        return { x, y, items };
    }
}

export interface MapPart {
    x: number;
    y: number;
    items: MapPartItem[][][];
}

export interface MapPartItem {
    itemId: number;
}
