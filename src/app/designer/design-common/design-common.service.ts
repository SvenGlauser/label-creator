import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DesignCommonDirective} from "./design-common.directive";
import {Design} from "../design";

@Injectable({
  providedIn: 'root'
})
export class DesignCommonService {

  private listOfDesign: Design[] = [{
    name: "1",
    top: 10,
    left: 4,
    width: 50,
    height: 31,
    type: 'label',
    content: 'testeste',
    textAlign: 'left',
    align: 'left',
    linkedDirective: undefined
  },{
    name: "2",
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    type: 'label',
    content: 'testsetest',
    textAlign: 'left',
    align: 'left',
    linkedDirective: undefined
  },{
    name: "3",
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    type: 'label',
    content: 'Testsetest',
    textAlign: 'left',
    align: 'left',
    linkedDirective: undefined
  }]
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

  public getAll(): Design[] {
    return this.listOfDesign;
  }

  public registerNew(designCommonDirective: DesignCommonDirective, name: string): void {
    this.listOfDesign.find(design => design.name == name)!.linkedDirective = designCommonDirective;
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
    this.current = undefined;
    this.listOfDesign.forEach(designCommon => {
      if (designCommon.linkedDirective?._elementRef.nativeElement.contains(event.target)) {
        this.current = designCommon.linkedDirective;
        this.current.changeSelection(true);
      } else {
        designCommon.linkedDirective!.changeSelection(false);
      }
    });
    if (this.current) {
      this.unsubscribeMouseMove = this._renderer.listen(document, "mousemove", (event) => this.onMouseMove(event));
    }
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

  public update(newDesign: Design): void {
    let index = this.listOfDesign.findIndex(design => design.name == newDesign.name);

    if (index !== -1) {
      this.listOfDesign[index] = newDesign;
    }
  }
}
