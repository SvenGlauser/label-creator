import {Directive, ElementRef, HostBinding, HostListener, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDesignCommon]',
  standalone: true,
})
export class DesignCommonDirective implements OnInit {

  private currentlyResizing = false;
  private currentX: number = 0;
  private currentY: number = 0;
  private reverseX = false;
  private reverseY = false;
  private MIN_WIDTH = 48;
  private MIN_HEIGHT = 15;
  private MAX_WIDTH = 250;
  private MAX_HEIGHT = 250;

  @HostBinding('class.selected')
  protected isSelected: boolean = false;
  @HostBinding('style.height.px')
  protected height = 100;
  @HostBinding('style.width.px')
  protected width = 100;
  @HostBinding('style.top.px')
  protected top = 0;
  @HostBinding('style.left.px')
  protected left = 0;
  private resizerBottomRight?: HTMLDivElement;
  private resizerBottomLeft?: HTMLDivElement;
  private resizerTopRight?: HTMLDivElement;
  private resizerTopLeft?: HTMLDivElement;

  constructor(private _elementRef: ElementRef,
              private _renderer : Renderer2) {}

  public ngOnInit() {
    this.initResizers();
    this._elementRef.nativeElement.style.display = "block";
    this._elementRef.nativeElement.classList.add("app-design-common");
  }

  private initResizers() {
    this.resizerBottomRight = this._renderer.createElement('div');
    this._renderer.setStyle(this.resizerBottomRight, "position", "absolute");
    this._renderer.setStyle(this.resizerBottomRight, "width", "6px");
    this._renderer.setStyle(this.resizerBottomRight, "height", "6px");
    this._renderer.setStyle(this.resizerBottomRight, "background-color", "blue");
    this._renderer.setStyle(this.resizerBottomRight, "border-radius", "50%");
    this._renderer.setStyle(this.resizerBottomRight, "bottom", "-3px");
    this._renderer.setStyle(this.resizerBottomRight, "right", "-3px");
    this._renderer.setStyle(this.resizerBottomRight, "cursor", "se-resize");
    this._renderer.setStyle(this.resizerBottomRight, "display", "none");
    this._renderer.listen(this.resizerBottomRight, "mousedown", ($event: MouseEvent) => this.onMouseDown($event, false, false));
    this._renderer.appendChild(this._elementRef.nativeElement, this.resizerBottomRight);
    this.resizerBottomLeft = this._renderer.createElement('div');
    this._renderer.setStyle(this.resizerBottomLeft, "position", "absolute");
    this._renderer.setStyle(this.resizerBottomLeft, "width", "6px");
    this._renderer.setStyle(this.resizerBottomLeft, "height", "6px");
    this._renderer.setStyle(this.resizerBottomLeft, "background-color", "blue");
    this._renderer.setStyle(this.resizerBottomLeft, "border-radius", "50%");
    this._renderer.setStyle(this.resizerBottomLeft, "bottom", "-3px");
    this._renderer.setStyle(this.resizerBottomLeft, "left", "-3px");
    this._renderer.setStyle(this.resizerBottomLeft, "cursor", "sw-resize");
    this._renderer.setStyle(this.resizerBottomLeft, "display", "none");
    this._renderer.listen(this.resizerBottomLeft, "mousedown", ($event: MouseEvent) => this.onMouseDown($event, true, false));
    this._renderer.appendChild(this._elementRef.nativeElement, this.resizerBottomLeft);
    this.resizerTopRight = this._renderer.createElement('div');
    this._renderer.setStyle(this.resizerTopRight, "position", "absolute");
    this._renderer.setStyle(this.resizerTopRight, "width", "6px");
    this._renderer.setStyle(this.resizerTopRight, "height", "6px");
    this._renderer.setStyle(this.resizerTopRight, "background-color", "blue");
    this._renderer.setStyle(this.resizerTopRight, "border-radius", "50%");
    this._renderer.setStyle(this.resizerTopRight, "top", "-3px");
    this._renderer.setStyle(this.resizerTopRight, "right", "-3px");
    this._renderer.setStyle(this.resizerTopRight, "cursor", "ne-resize");
    this._renderer.setStyle(this.resizerTopRight, "display", "none");
    this._renderer.listen(this.resizerTopRight, "mousedown", ($event: MouseEvent) => this.onMouseDown($event, false, true));
    this._renderer.appendChild(this._elementRef.nativeElement, this.resizerTopRight);
    this.resizerTopLeft = this._renderer.createElement('div');
    this._renderer.setStyle(this.resizerTopLeft, "position", "absolute");
    this._renderer.setStyle(this.resizerTopLeft, "width", "6px");
    this._renderer.setStyle(this.resizerTopLeft, "height", "6px");
    this._renderer.setStyle(this.resizerTopLeft, "background-color", "blue");
    this._renderer.setStyle(this.resizerTopLeft, "border-radius", "50%");
    this._renderer.setStyle(this.resizerTopLeft, "top", "-3px");
    this._renderer.setStyle(this.resizerTopLeft, "left", "-3px");
    this._renderer.setStyle(this.resizerTopLeft, "cursor", "nw-resize");
    this._renderer.setStyle(this.resizerTopLeft, "display", "none");
    this._renderer.listen(this.resizerTopLeft, "mousedown", ($event: MouseEvent) => this.onMouseDown($event, true, true));
    this._renderer.appendChild(this._elementRef.nativeElement, this.resizerTopLeft);
  }

  @HostListener('document:mousedown', ['$event'])
  public onClick(event: MouseEvent): void {
    this.setSelected(!!this._elementRef.nativeElement.contains(event.target));
  }

  @HostListener('document:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    if (!this.currentlyResizing) {
      return;
    }

    let x =  event.x - this.currentX;
    let y =  event.y - this.currentY;

    if (x != 0) {
      if (this.reverseX && this.width - x >= this.MIN_WIDTH && this.width - x <= this.MAX_WIDTH) {
        this.width = this.width - x;
        this.left = this.left + x;
      } else if (!this.reverseX && this.width + x >= this.MIN_WIDTH && this.width + x <= this.MAX_WIDTH) {
        this.width = this.width + x;
      }
      this.currentX = event.x;
    }
    if (y != 0) {
      if (this.reverseY && this.height - y >= this.MIN_HEIGHT && this.height - y <= this.MAX_HEIGHT) {
        this.height = this.height - y;
        this.top = this.top + y
      } else if (!this.reverseY && this.height + y >= this.MIN_HEIGHT && this.height + y <= this.MAX_HEIGHT) {
        this.height = this.height + y;
      }
      this.currentY = event.y;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  public onMouseUp(event: MouseEvent): void {
    if (!this.currentlyResizing) {
      return;
    }
    this.currentlyResizing = false;
    this.setSelected(true);
  }

  private setSelected(isSelected: boolean) {
    this.isSelected = isSelected;
    if (isSelected) {
      this._elementRef.nativeElement.style.outline = "1px solid blue";
      this.resizerBottomRight!.style.display = "block";
      this.resizerBottomLeft!.style.display = "block";
      this.resizerTopRight!.style.display = "block";
      this.resizerTopLeft!.style.display = "block";

    } else {
      this._elementRef.nativeElement.style.outline = "none";
      this.resizerBottomRight!.style.display = "none";
      this.resizerBottomLeft!.style.display = "none";
      this.resizerTopRight!.style.display = "none";
      this.resizerTopLeft!.style.display = "none";
    }
  }

  protected onMouseDown(event: MouseEvent, reverseX: boolean, reverseY: boolean) {
    this.currentlyResizing = true;
    this.currentX = event.x;
    this.currentY = event.y;
    this.reverseX = reverseX;
    this.reverseY = reverseY;
  }
}
