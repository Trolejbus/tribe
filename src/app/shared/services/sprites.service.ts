import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, firstValueFrom } from "rxjs";

@Injectable()
export class SpritesService {
    
    private readonly packSpritesInRow = 16;
    private readonly packSpritesInColumn = 63;
    private sprites: ImageBitmap[] = [];
    private isLoadingSubject$ = new BehaviorSubject(true);
    public isLoading$ = this.isLoadingSubject$.asObservable();

    constructor(private httpClient: HttpClient) {

    }

    public async load(): Promise<void> {
        const data = await firstValueFrom(this.httpClient.get('/assets/sprites/otsp_tiles_01.png', {responseType: 'blob'}));
        for (let y = 0; y < this.packSpritesInColumn; y++) {
            for (let x = 0; x < this.packSpritesInRow; x++) {
                const sprite = await createImageBitmap(data, x * 32, y * 32, 32, 32);
                this.sprites.push(sprite);
            }
        }

        this.isLoadingSubject$.next(false);
    }

    public get(index: number): ImageBitmap {
        return this.sprites[index];
    }
}
