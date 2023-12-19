import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpritesListComponent } from './sprites-list.component';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SpriteItemComponent } from '../sprite-item';

const routes: Routes = [
  {
    path: '',
    component: SpritesListComponent,
  },
];

@NgModule({
  declarations: [
    SpritesListComponent
  ],
  imports: [
    CommonModule,
    VirtualScrollerModule,
    ButtonModule,
    RouterModule.forChild(routes),
    SpriteItemComponent,
  ],
})
export class SpritesListModule { }
