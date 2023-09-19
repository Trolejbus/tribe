import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {

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

  constructor (private zone: NgZone) {

  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      var bg = new Image();
      bg.src = 'http://www.pixeljoint.com/files/icons/full/testmap.gif';
  
      window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame || 
          (window as any).webkitRequestAnimationFrame   || 
          (window as any).mozRequestAnimationFrame      || 
          (window as any).oRequestAnimationFrame        || 
          (window as any).msRequestAnimationFrame       || 
          ((callback: any, element: any) => {
              window.setTimeout(() => {
                console.log('test');
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
            show_fps     = true,
            oldtime = +new Date
  
        function gameLoop(time: any){
  
            //Clear screen
            context.clearRect(0, 0, width, height);
  
            that.updateMap(bg);
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

  private updateMap(bg: any): void {
    var x = this.canvas.nativeElement.getContext('2d')!;
    x!.globalCompositeOperation = 'source-over';
    x!.drawImage(bg, 0, 0, 256, 256);
  }

  private updateShaders(): void {

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
/*
(

  /*ngAfterViewInit(): void {
    var c = document.getElementById('c');
    var x = this.canvas.nativeElement.getContext('2d')!;
    const canvas2 = this.canvasLights.nativeElement.getContext('2d')!;
    var fg = new Image();
    var bg = new Image();

    if (x == null) {
      throw new Error('Cannot be null');
    }

    const that = this;
  
    fg.addEventListener('load', function() { bg.addEventListener('load', () => {
      that.draw(x, canvas2, bg);
    }, false); }, false);
    fg.src = 'http://i.imgur.com/fWThnZy.png';
    bg.src = 'http://www.pixeljoint.com/files/icons/full/testmap.gif';
        
  }

  private draw(x: CanvasRenderingContext2D, canvas2: CanvasRenderingContext2D, bg: any)
  {

  }

  private reverseAlphas(canvas: HTMLCanvasElement) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx!.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const index = 4 * (x + y * width);
        const alpha = data[index + 3];
        data[index + 3] = 255 - alpha;
      }
    }

    ctx!.putImageData(imgData, 0, 0);
  }*/
}
function callback(arg0: number) {
  throw new Error('Function not implemented.');
}

