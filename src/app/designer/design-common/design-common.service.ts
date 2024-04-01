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
    width: 75,
    height: 20,
    type: 'label',
    content: 'testeste',
    fontSize: 15,
    textAlign: 'left',
    align: 'left',
    linkedDirective: undefined
  },{
    name: "2",
    top: 0,
    left: 0,
    width: 100,
    height: 20,
    type: 'label',
    content: 'testsetest',
    fontSize: 15,
    textAlign: 'left',
    align: 'left',
    linkedDirective: undefined
  },{
    name: "3",
    top: 0,
    left: 0,
    width: 100,
    height: 20,
    type: 'label',
    content: 'Testsetest',
    fontSize: 15,
    textAlign: 'left',
    align: 'left',
    linkedDirective: undefined
  }]
  private current?: Design;
  private _renderer: Renderer2;

  private unsubscribeMouseMove?: () => void;
  private unsubscribeMouseUp?: () => void;
  private unsubscribeMouseDown?: () => void;
  private unsubscribeKeyDown?: () => void;

  constructor(private rendererFactory2: RendererFactory2) {
    this._renderer = this.rendererFactory2.createRenderer(null, null);
    setTimeout(()=> {
      this.unsubscribeMouseUp = this._renderer.listen(document.getElementById('edition-zone'), "mouseup", (event) => this.onMouseUp(event));
      this.unsubscribeMouseDown = this._renderer.listen(document.getElementById('edition-zone'), "mousedown", (event) => this.onMouseDown(event));
      this.unsubscribeKeyDown = this._renderer.listen(document, "keydown", (event) => this.onKeydown(event));
    }, 100)
  }

  public getAll(): Design[] {
    return this.listOfDesign;
  }

  public registerNew(designCommonDirective: DesignCommonDirective, name: string): void {
    this.listOfDesign.find(design => design.name == name)!.linkedDirective = designCommonDirective;
    if (this.current?.name == name) {
      setTimeout(() => designCommonDirective?.changeSelection(true));
    }
  }

  public deleteCurrent(): void {
    this.delete(this.current);
    this.current = undefined;
  }

  public delete(designToDelete?: Design): void {
    let index = this.listOfDesign.findIndex(design => design.name == designToDelete?.name);

    if (index !== -1) {
      this.listOfDesign.splice(index, 1);
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.current) {
      if (!this.current.linkedDirective!.currentlyResizing) {
        this.unsubscribeMouseMove!();
      }
      this.current.linkedDirective!.move(event);
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.current) {
      this.current.linkedDirective!.stopResizing(event);
    }
  }

  private onMouseDown(event: MouseEvent): void {
    this.current = undefined;
    this.listOfDesign.forEach(designCommon => {
      if (designCommon.linkedDirective?._elementRef.nativeElement.contains(event.target)) {
        this.current = designCommon;
        this.current.linkedDirective!.changeSelection(true);
      } else {
        if (designCommon.type == 'label' && designCommon.content == '') {
          this.delete(designCommon);
        }
        designCommon.linkedDirective!.changeSelection(false);
      }
    });
    if (this.current) {
      this.unsubscribeMouseMove = this._renderer.listen(document.getElementById('edition-zone'), "mousemove", (event) => this.onMouseMove(event));
    }
  }

  private onKeydown(event: KeyboardEvent): void {
    if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes((event.target as HTMLElement).tagName)) {
      return;
    }
    if (this.current && !this.current.linkedDirective!.currentlyResizing) {
      switch (event.key) {
        case "ArrowLeft": {
          this.current.linkedDirective!.moveBy(-1, 0);
          break;
        }
        case "ArrowRight": {
          this.current.linkedDirective!.moveBy(1, 0);
          break;
        }
        case "ArrowUp": {
          this.current.linkedDirective!.moveBy(0, -1);
          break;
        }
        case "ArrowDown": {
          this.current.linkedDirective!.moveBy(0, 1);
          break;
        }
        case "Delete": {
          this.deleteCurrent();
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


  public getCurrent(): Design | undefined {
    return this.current;
  }
}
