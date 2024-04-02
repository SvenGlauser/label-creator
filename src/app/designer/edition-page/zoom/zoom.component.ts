import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-zoom',
  standalone: true,
    imports: [
        MatIcon,
        MatIconButton
    ],
  templateUrl: './zoom.component.html',
  styleUrl: './zoom.component.scss'
})
export class ZoomComponent implements AfterViewInit, OnDestroy {
  protected MAX_ZOOM: number = -1600;
  protected MIN_ZOOM: number = 1000;
  protected deltaY: number = 0;

  private unsubscribeWheelEvent?: () => void;

  @Input()
  public zoomZone?: HTMLDivElement;

  @Output()
  public scaleChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _render: Renderer2) {}

  /**
   * Initialise le zoom
   */
  public ngAfterViewInit(): void {
    this.unsubscribeWheelEvent = this._render.listen(this.zoomZone, "wheel", (event: WheelEvent) => {
      this.calculateScale(event.deltaY);
    });
  }

  /**
   * Détruit les listeners
   */
  public ngOnDestroy(): void {
    if (this.unsubscribeWheelEvent) {
      this.unsubscribeWheelEvent();
    }
  }

  /**
   * Permet de zoomer
   */
  protected zoomIn(): void {
    this.calculateScale(-200);
  }

  /**
   * Permet de dézoomer
   */
  protected zoomOut(): void {
    this.calculateScale(+200);
  }

  /**
   * Calcule le niveau de zoom
   * @param deltaY Le déplacement de la molette de souris
   */
  private calculateScale(deltaY: number): void {
    this.deltaY = this.deltaY + deltaY;
    if (this.deltaY > 1000) {
      this.deltaY = 1000;
    }
    if (this.deltaY < -1600) {
      this.deltaY = -1600;
    }

    this.scaleChange.emit(Math.pow(2, -this.deltaY / 1000));
  }
}
