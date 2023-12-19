import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpritesService } from '../sprites/sprites.service';
import { Subject, combineLatest, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-sprites-list',
  templateUrl: './sprites-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpritesListComponent {
  
  private triggerLoadSubject$ = new Subject<void>();
  public vm$ = this.triggerLoadSubject$.pipe(
    switchMap(_ => of(this.spriteService.getAll())),
    map(items => items.map((image, index) => ({
      index,
      image,
    }))),
    map(items => ({ items })),
    tap(c => console.log(c)),
  );

  constructor (private spriteService: SpritesService) {
  }
  
  public reload(): void {
    this.triggerLoadSubject$.next();
  }
}
