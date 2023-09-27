import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { SpriteModel } from "./sprite.model";

@Injectable()
export class SpritesService {
    
    private readonly packSpritesInRow = 16;
    private readonly packSpritesInColumn = 63;
    private sprites: ImageBitmap[] = [];
    private isLoadingSubject$ = new BehaviorSubject(true);
    public isLoading$ = this.isLoadingSubject$.asObservable();

    private spritesDefinition: SpriteModel[] = [
        {
            id: 0,
            animate: true,
            images: [
                { animationFrameDuration: 3, spriteId: 736 },
                { animationFrameDuration: 3, spriteId: 744 },
                { animationFrameDuration: 4, spriteId: 880 },
                { animationFrameDuration: 3, spriteId: 736 },
                { animationFrameDuration: 3, spriteId: 744 },
                { animationFrameDuration: 4, spriteId: 880 },

                /*{ animationFrameDuration: 1, spriteId: 736 },
                { animationFrameDuration: 1, spriteId: 737 },
                { animationFrameDuration: 1, spriteId: 738 },
                { animationFrameDuration: 1, spriteId: 739 },
                { animationFrameDuration: 1, spriteId: 740 },
                { animationFrameDuration: 1, spriteId: 741 },
                { animationFrameDuration: 1, spriteId: 742 },
                { animationFrameDuration: 1, spriteId: 743 },
                { animationFrameDuration: 1, spriteId: 744 },
                { animationFrameDuration: 1, spriteId: 745 },
                { animationFrameDuration: 1, spriteId: 746 },
                { animationFrameDuration: 1, spriteId: 747 },
                { animationFrameDuration: 1, spriteId: 748 },
                { animationFrameDuration: 1, spriteId: 749 },
                { animationFrameDuration: 1, spriteId: 750 },
                { animationFrameDuration: 1, spriteId: 751 },
                { animationFrameDuration: 1, spriteId: 752 },
                { animationFrameDuration: 1, spriteId: 753 },
                { animationFrameDuration: 1, spriteId: 754 },
                { animationFrameDuration: 1, spriteId: 755 },*/
            ],
        },
        ...([61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76].map((spriteId, index) => ({
            id: index + 1,
            animate: false,
            images: [ { spriteId } ], 
        }))),
    ]

    constructor(
        private httpClient: HttpClient,
        private dbService: NgxIndexedDBService,
    ) {

    }

    public async load(): Promise<void> {
        this.dbService.getAll('sprite').subscribe((sprites) => {
            this.sprites = sprites.map(s => (s as any).sprite);
        });
/*
        const data = await firstValueFrom(this.httpClient.get('/assets/sprites/otsp_tiles_01.png', {responseType: 'blob'}));
       /* for (let y = 0; y < this.packSpritesInColumn; y++) {
            for (let x = 0; x < this.packSpritesInRow; x++) {
                const sprite = await createImageBitmap(data, x * 32, y * 32, 32, 32);
                this.sprites.push(sprite);
            }
        }

       // this.dbService.bulkPut('sprite', this.sprites.map((sprite, index) => ({ id: index, sprite }))).subscribe();*/
        this.isLoadingSubject$.next(false);
    }

    public get(index: number): ImageBitmap {
        return this.sprites[index];
    }

    public getDefinition(id: number): SpriteModel {
        return this.spritesDefinition.find(s => s.id === id)!;
    }
}
