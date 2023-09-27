import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, interval, map } from 'rxjs';
import { MapStoreActions, MapStoreState } from '../map-store';
import { Store } from '@ngrx/store';
import { NoiseService } from 'src/app/shared/services/noise.service';
import { SpritesService } from 'src/app/features/sprites/sprites.service';
import { ObjectsService } from '../objects';
import { MouseService } from 'src/app/shared/services/mouse.service';
import { MapService } from '../map-store/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnInit {

  @ViewChild('canvas')
  public canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasLights')
  public canvasLights!: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasLightsTemp')
  public canvasLightsTemp!: ElementRef<HTMLCanvasElement>;

  private fpsSubject$ = new BehaviorSubject(0);
  public fps$ = this.fpsSubject$.pipe(
    map(fps => Math.floor(fps)),
    distinctUntilChanged(),
  );

  public showNet = false;
  public showShadow = false;

  public offsetX = 0;
  public offsetY = 0;

  private animationFps: number = 0;

  private mouseCords: { x: number, y: number } | null = null;
  private mouseDownCords: { x: number, y: number } | null = null;
  public currentCords: { x: number, y: number } | null = null;

  public firstTileX = 0;
  public firstTileY = 0;
  private readonly tilesInRow = 26 + 1 + 1;
  private readonly tilesInColumn = 20 + 1 + 1;
  public animationFrame = 0;

  constructor (
    private zone: NgZone,
    private store: Store<MapStoreState>,
    private noiseService: NoiseService,
    private spritesService: SpritesService,
    private objectService: ObjectsService,
    private mouseService: MouseService,
    private mapService: MapService,
  ) {

  }

  ngOnInit(): void {
    this.store.dispatch(MapStoreActions.generateInitMapParts());
    this.mouseService.mouseCords$.subscribe(mouseCords => {
      this.mouseCords = mouseCords;
    });

    this.mouseService.mouseDownCords$.subscribe(mouseDownCords => {
      this.mouseDownCords = mouseDownCords;
    });

    this.mapService.currentCords$.subscribe(currentCords => {
      this.currentCords = currentCords;
      this.firstTileX = Math.trunc(this.currentCords.x / 32) - Math.floor(this.tilesInRow / 2);
      this.firstTileY = Math.trunc(this.currentCords.y / 32) - Math.floor(this.tilesInColumn / 2);
      this.offsetX = this.currentCords.x % 32;
      this.offsetY = this.currentCords.y % 32;
    });

    interval(200).subscribe(_ => {
      this.animationFrame += 1;
      if(this.animationFrame >= 5 * 4) {
        this.animationFrame = 0;
      }
    });
  }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(() => {
      window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame || 
          (window as any).webkitRequestAnimationFrame   || 
          (window as any).mozRequestAnimationFrame      || 
          (window as any).oRequestAnimationFrame        || 
          (window as any).msRequestAnimationFrame       || 
          ((callback: any, element: any) => {
              window.setTimeout(() => {
                callback(+new Date);
              }, 1000 / 60);
          })
        })();
  
      const that = this;
      const fn = (window: any, document: any) => {
  
        var canvas       = that.canvas.nativeElement!,
            context      = canvas.getContext("2d")!,
            width        = canvas.width,
            height       = canvas.height,
            fps          = 0,
            game_running = true,
            oldtime = +new Date
  
        function gameLoop(time: any){
  
            //Clear screen
            context.beginPath();
            context.clearRect(0, 0, width, height);
  
            that.updateMap(context);
            that.drawNet(context);
            that.updateShaders();
            that.drawFpsAnimation(context);
            that.drawCursor(context);
  
            fps = 1000/(time-oldtime);
            that.fpsSubject$.next(fps);
            oldtime = time;
  
            if (game_running) requestAnimationFrame(gameLoop);
            
        }
        
        gameLoop(0);
      
      };
      fn(window as Window, document);
    });
    
  }

  public mouseMove(event: MouseEvent): void {
    this.mouseService.mouseMoved((event as any).layerX, (event as any).layerY, (event as any).movementX, (event as any).movementY);
  }

  public mouseLeave(): void {
    this.mouseService.mouseLeave();
  }

  public mouseDown(event: MouseEvent): void {
    this.mouseService.mouseDown((event as any).layerX, (event as any).layerY);
  }

  public mouseUp(): void {
    this.mouseService.mouseUp();
  }

  public resetCords(): void {
    this.mapService.setCords(0, 0);
  }

  public drawCursor(context: CanvasRenderingContext2D) {
    if (this.mouseCords != null) {
      context.beginPath();
      context.arc(this.mouseCords.x, this.mouseCords.y, 5, 0, 360);
      context.fillStyle = this.mouseDownCords != null ? 'orange' : 'white';
      context.fill();
      context.closePath();
    }

    if (this.mouseDownCords != null) {
      context.beginPath();
      context.arc(this.mouseDownCords.x, this.mouseDownCords.y, 5, 0, 360);
      context.fillStyle = 'blue';
      context.fill();
      context.closePath();
    }
  }

  private updateMap(ctx: CanvasRenderingContext2D): void {
    for (let y = 0; y < this.tilesInColumn; y++) {
      for (let x = 0; x < this.tilesInRow; x++) {
        const realX = this.firstTileX + x;
        const realY = this.firstTileY + y;

        const noise = this.noiseService.get(realX, realY, 1);
        const objectId = this.getObjectAt(realX, realY); 
        const object = this.objectService.getObject(objectId);
        const spriteDefinitionId = object.spriteDefinitions[Math.floor(noise * object.spriteDefinitions.length)];
        const definition = this.spritesService.getDefinition(spriteDefinitionId);
        const sprite = definition.animate ? definition.images.reduce((p, c) => {
          if (p.spriteId != null) {
            return p;
          }

          const spriteFrame = p.anim + c.animationFrameDuration!;
          if (spriteFrame > this.animationFrame) {
            return { spriteId: c.spriteId, anim: spriteFrame };
          }
          else {
            return { spriteId: null, anim: spriteFrame };
          }
        }, { anim: 0, spriteId: null } as { anim: number, spriteId: number | null }) : definition.images[0];
        const bg = this.spritesService.get(sprite.spriteId!);

        if (bg == null) {
          continue;
        }

        ctx.drawImage(bg, (x - 1) * 32 - this.offsetX, (y - 1) * 32 - this.offsetY, 32, 32);
      }
    }
  }

  private drawNet(ctx: CanvasRenderingContext2D): void {
    if (!this.showNet) {
      return;
    }

    ctx.beginPath();
    ctx.strokeStyle = "black";
    for (let x = -1; x < 27; x++) {
      for (let y = -1; y < 21; y++) {
        ctx.strokeRect(x * 32 + this.offsetX, y * 32 + this.offsetY, 32, 32);
      }
    }
  }

  private getObjectAt(x: number, y: number): number {
    if (x == 0 && y == 0) {
      return 1;
    }

    return 0;
  }

  private drawFpsAnimation(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(30, 13, this.animationFps / 10, 0, 360);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    this.animationFps += 1;
    if (this.animationFps > 50) {
      this.animationFps = 0;
    }
    ctx.closePath();
  }

  private updateShaders(): void {
    if (!this.showShadow) {
      return;
    }
  
    const canvas3 = this.canvasLightsTemp.nativeElement.getContext('2d')!;
    const width = this.canvasLightsTemp.nativeElement.width;
    const height = this.canvasLightsTemp.nativeElement.height;
    canvas3.clearRect(0, 0, width, height);
    const gradient = canvas3!.createRadialGradient(110, 90, 30, 100, 100, 70);

    // Add three color stops
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "transparent");
    canvas3!.fillStyle = gradient;
    canvas3!.fillRect(20, 20, 160, 160);

    const gradient2 = canvas3!.createRadialGradient(130, 130, 30, 130, 130, 70);
    gradient2.addColorStop(0, "black");
    gradient2.addColorStop(1, "transparent");
    canvas3!.fillStyle = gradient2;
    canvas3!.fillRect(70, 70, 240, 240);
    this.reverseAlphas(this.canvasLightsTemp.nativeElement, this.canvasLights.nativeElement)
  }

  private reverseAlphas(canvas: HTMLCanvasElement, to: HTMLCanvasElement) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const ctxTo = to.getContext('2d');
    const imgData = ctx!.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const index = 4 * (x + y * width);
        const alpha = data[index + 3];
        data[index + 3] = 255 - alpha;
      }
    }

    ctxTo!.putImageData(imgData, 0, 0);
  }
}
