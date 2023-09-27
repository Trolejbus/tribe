import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SpritesService } from './shared/services/sprites.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  constructor (private spritesService: SpritesService) {

  }

  ngOnInit(): void {
    this.spritesService.load();
  }
}
