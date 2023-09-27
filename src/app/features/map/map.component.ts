import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { MapStoreActions, MapStoreState } from '../map-store';
import { Store } from '@ngrx/store';
import { NoiseService } from 'src/app/shared/services/noise.service';
import { HttpClient } from '@angular/common/http';
import { SpritesService } from 'src/app/shared/services/sprites.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private offsetX = 0;
  private offsetY = 0;

  constructor (
    private zone: NgZone,
    private store: Store<MapStoreState>,
    private noiseService: NoiseService,
    private httpClient: HttpClient,
    private spritesService: SpritesService,
  ) {

  }

  ngOnInit(): void {
    this.store.dispatch(MapStoreActions.generateInitMapParts());
    console.log(this.noiseService.get(50, 200, 1));

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

  private updateMap(ctx: CanvasRenderingContext2D): void {
    for (let x = -1; x < 27; x++) {
      for (let y = -1; y < 21; y++) {
        const noise = this.noiseService.get(x, y, 1);
        const bg = this.spritesService.get(Math.floor(noise * 16) + 61);
        if (bg == null) {
          continue;
        }

        ctx.drawImage(bg, x * 32 + this.offsetX, y * 32 + this.offsetY, 32, 32);
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
