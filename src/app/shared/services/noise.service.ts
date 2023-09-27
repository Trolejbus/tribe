import { Injectable } from "@angular/core";
// @ts-ignore
import * as perlinNoise3d from 'perlin-noise-3d';

// Copied from https://github.com/josephg/noisejs/blob/master/perlin.js
@Injectable()
export class NoiseService {
    private noise = new perlinNoise3d();

    constructor() {
        this.noise.noiseSeed(Math.random() * 10000);
    }

    public get(x: number, y: number, z: number) {
        return this.noise.get(x, y, z);
    }
}
