import { Injectable } from "@angular/core";
import { ObjectModel } from "./object.model";

@Injectable()
export class ObjectsService {
    private objects: ObjectModel[] = [
        {
            id: 0,
            spriteDefinitions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        },
        {
            id: 1,
            spriteDefinitions: [0],
        },
    ];

    public getObject(id: number): ObjectModel {
        return this.objects.find(o => o.id === id)!;
    }
}
