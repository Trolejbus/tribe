import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sprite-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sprite-item.component.html',
})
export class SpriteItemComponent implements AfterViewInit {

  @Input({ required: true })
  public image!: ImageBitmap;

  @ViewChild('canvas')
  public canvas!: ElementRef<HTMLCanvasElement>; 

  ngAfterViewInit(): void {
    const context = this.canvas.nativeElement.getContext("2d")!;
    context.drawImage(this.image, 0, 0);
  }
}
