export interface SpriteModel {
    id: number;
    animate: boolean,
    images: SpriteImageModel[];
}

export interface SpriteImageModel {
    animationFrameDuration?: number;
    spriteId: number;
}
