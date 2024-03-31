import {Component, ElementRef, HostBinding, HostListener, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-design-common',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './design-common.component.html',
  styleUrl: './design-common.component.scss'
})
export class DesignCommonComponent {

  @HostBinding('class.selected')
  protected isSelected: boolean = false;

  @HostBinding('style.height.px')
  protected height = 100;
  @HostBinding('style.width.px')
  protected width = 100;
  @HostBinding('style.top.px')
  protected top = 100;
  @HostBinding('style.left.px')
  protected left = 100;

  private currentlyResizing = false;
  private currentX: number = 0;
  private currentY: number = 0;
  private reverseX = false;
  private reverseY = false;
  private MIN_WIDTH = 48;
  private MIN_HEIGHT = 15;
  private MAX_WIDTH = 250;
  private MAX_HEIGHT = 250;

  constructor(private _elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    this.isSelected = !!this._elementRef.nativeElement.contains(event.target);
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
    this.isSelected = true;
  }

  protected onMouseDown(event: MouseEvent, reverseX: boolean, reverseY: boolean) {
    this.currentlyResizing = true;
    this.currentX = event.x;
    this.currentY = event.y;
    this.reverseX = reverseX;
    this.reverseY = reverseY;
  }
}
