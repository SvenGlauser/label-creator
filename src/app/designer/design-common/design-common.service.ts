import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DesignCommonDirective} from "./design-common.directive";

@Injectable({
  providedIn: 'root'
})
export class DesignCommonService {

  private listOfDesignCommons: DesignCommonDirective[] = []
  private current?: DesignCommonDirective;
  private _renderer: Renderer2;

  private unsubscribeMouseMove?: () => void;
  private unsubscribeMouseUp?: () => void;
  private unsubscribeMouseDown?: () => void;
  private unsubscribeKeyDown?: () => void;

  constructor(private rendererFactory2: RendererFactory2) {
    this._renderer = this.rendererFactory2.createRenderer(null, null);
    this.unsubscribeMouseUp = this._renderer.listen(document, "mouseup", (event) => this.onMouseUp(event));
    this.unsubscribeMouseDown = this._renderer.listen(document, "mousedown", (event) => this.onMouseDown(event));
    this.unsubscribeKeyDown = this._renderer.listen(document, "keydown", (event) => this.onKeydown(event));
  }

  public registerNew(designCommonDirective: DesignCommonDirective): void {
    this.listOfDesignCommons.push(designCommonDirective);
  }

  public unregister(designCommonDirective: DesignCommonDirective): void {
    const index = this.listOfDesignCommons.indexOf(designCommonDirective);
    if (index > -1) { // only splice array when item is found
      this.listOfDesignCommons = this.listOfDesignCommons.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.current) {
      if (!this.current.currentlyResizing) {
        this.unsubscribeMouseMove!();
      }
      this.current.move(event);
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.current) {
      this.current.stopResizing(event);
    }
  }

  private onMouseDown(event: MouseEvent): void {
    this.listOfDesignCommons.forEach(designCommon => {
      if (designCommon._elementRef.nativeElement.contains(event.target)) {
        designCommon.changeSelection(true);
        this.current = designCommon;
      } else {
        designCommon.changeSelection(false);
      }
    });
    this.unsubscribeMouseMove = this._renderer.listen(document, "mousemove", (event) => this.onMouseMove(event));
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.current && !this.current.currentlyResizing) {
      switch (event.key) {
        case "ArrowLeft": {
          this.current.moveBy(-1, 0)
          break;
        }
        case "ArrowRight": {
          this.current.moveBy(1, 0)
          break;
        }
        case "ArrowUp": {
          this.current.moveBy(0, -1)
          break;
        }
        case "ArrowDown": {
          this.current.moveBy(0, 1)
          break;
        }
      }
    }
  }
}
