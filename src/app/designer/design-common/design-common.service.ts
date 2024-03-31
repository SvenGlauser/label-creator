import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DesignCommonDirective} from "./design-common.directive";

@Injectable({
  providedIn: 'root'
})
export class DesignCommonService {

  private listOfDesignCommons: DesignCommonDirective[] = []
  private current?: DesignCommonDirective;
  private _renderer: Renderer2;
  private elementEvent = document;

  private unsubscribeMouseMove?: () => void;
  private unsubscribeMouseUp?: () => void;
  private unsubscribeMouseDown?: () => void;
  private unsubscribeKeyDown?: () => void;

  constructor(private rendererFactory2: RendererFactory2) {
    this._renderer = this.rendererFactory2.createRenderer(null, null);
    console.log("elementEvent")
    // TODO a tester "elementEvent"
    this.unsubscribeMouseUp = this._renderer.listen(this.elementEvent, "mouseup", (event) => this.onMouseUp(event));
    this.unsubscribeMouseDown = this._renderer.listen(this.elementEvent, "mousedown", (event) => this.onMouseDown(event));
    this.unsubscribeKeyDown = this._renderer.listen(this.elementEvent, "keydown", (event) => this.onKeydown(event));
  }

  public registerNew(designCommonDirective: DesignCommonDirective) {
    this.listOfDesignCommons.push(designCommonDirective);
  }

  public onMouseMove(event: MouseEvent) {
    if (this.current) {
      if (!this.current.currentlyResizing) {
        this.unsubscribeMouseMove!();
      }
      this.current.onMouseMove(event);
    }
  }

  public onMouseUp(event: MouseEvent) {
    if (this.current) {
      this.current.onMouseUp(event);
    }
  }

  public onMouseDown(event: MouseEvent) {
    this.listOfDesignCommons.forEach(designCommon => {
      if (!!designCommon._elementRef.nativeElement.contains(event.target)) {
        designCommon.setSelected(true);
        this.current = designCommon;
      } else {
        designCommon.setSelected(false);
      }
    });
    this.unsubscribeMouseMove = this._renderer.listen(this.elementEvent, "mousemove", (event) => this.onMouseMove(event));
  }

  public onKeydown(event: KeyboardEvent): void {
    if (this.current && !this.current.currentlyResizing) {
      switch (event.key) {
        case "ArrowLeft": {
          this.current.left = this.current.left - 1;
          console.log(this.current.left)
          break;
        }
        case "ArrowRight": {
          this.current.left = this.current.left + 1;
          console.log(this.current.left)
          break;
        }
        case "ArrowUp": {
          this.current.top = this.current.top - 1;
          console.log(this.current.left)
          break;
        }
        case "ArrowDown": {
          this.current.top = this.current.top + 1;
          console.log(this.current.left)
          break;
        }
      }
    }
  }
}
