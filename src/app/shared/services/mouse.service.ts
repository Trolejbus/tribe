import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable()
export class MouseService {
    private mouseCordsSubject$ = new BehaviorSubject<{ x: number, y: number } | null>(null);
    public mouseCords$ = this.mouseCordsSubject$.asObservable();

    private mouseDownCordsSubject$ = new BehaviorSubject<{ x: number, y: number } | null>(null);
    public mouseDownCords$ = this.mouseDownCordsSubject$.asObservable();

    private mouseMovedSubject$ = new Subject<{ x: number, y: number }>();
    public mouseMoved$ = this.mouseMovedSubject$.asObservable();
    
    public mouseMoved(layerX: number, layerY: number, movementX: number, movementY: number): void {
        this.mouseCordsSubject$.next({ x: layerX, y: layerY });
        this.mouseMovedSubject$.next({ x: movementX, y: movementY });
    }

    public mouseLeave(): void {
        this.mouseCordsSubject$.next(null);
    }

    public mouseDown(x: number, y: number): void {
        this.mouseDownCordsSubject$.next({ x, y });
    }

    public mouseUp(): void {
        this.mouseDownCordsSubject$.next(null);
    }
}
