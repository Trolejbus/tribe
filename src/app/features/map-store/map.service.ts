import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, filter, withLatestFrom } from "rxjs";
import { MouseService } from "src/app/shared/services/mouse.service";

@Injectable()
export class MapService {
    private currentCordsSubject$ = new BehaviorSubject<{ x: number; y: number }>({ x: 0, y: 0 });
    public currentCords$ = this.currentCordsSubject$.asObservable();

    constructor (private mouseService: MouseService) {
        combineLatest([
            this.mouseService.mouseMoved$,
            this.mouseService.mouseDownCords$,
        ]).pipe(
            filter(([mouseCords, mouseDownCords]) => mouseCords != null && mouseDownCords != null),
            withLatestFrom(this.currentCordsSubject$),
        ).subscribe(([[mouseMoved, mouseDownCords], currentCords]) => {
            this.currentCordsSubject$.next({ x: currentCords.x - mouseMoved.x, y: currentCords.y - mouseMoved.y });
        });     
    }

    public setCords(x: number, y: number): void {
        this.currentCordsSubject$.next({ x, y });
    }
}
