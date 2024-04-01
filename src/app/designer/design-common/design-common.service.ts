import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DesignCommonDirective} from "./design-common.directive";
import {Design, DesignImage, DesignLabel} from "../design";

@Injectable({
  providedIn: 'root'
})
export class DesignCommonService {

  private listOfDesign: Design[] = [<DesignLabel>{
    name: "1",
    top: 10,
    left: 4,
    width: 75,
    height: 20,
    type: 'label',
    content: 'testeste',
    fontSize: 15,
    fontFamily: 'Helvetica',
    color: '#fff',
    textAlign: 'left',
    verticalTextAlign: 'flex-start',
    index: 0,
    align: 'left',
    linkedDirective: undefined
  },<DesignLabel>{
    name: "2",
    top: 0,
    left: 0,
    width: 100,
    height: 20,
    type: 'label',
    content: 'testsetest',
    fontSize: 15,
    fontFamily: 'Helvetica',
    color: '#eee',
    textAlign: 'left',
    verticalTextAlign: 'flex-start',
    index: 1,
    align: 'left',
    linkedDirective: undefined
  },<DesignLabel>{
    name: "3",
    top: 0,
    left: 0,
    width: 100,
    height: 20,
    type: 'label',
    content: 'Testsetest',
    fontSize: 15,
    fontFamily: 'Helvetica',
    color: 'red',
    textAlign: 'left',
    verticalTextAlign: 'flex-start',
    align: 'left',
    index: 3,
    linkedDirective: undefined
  },<DesignImage>{
    name: "4",
    top: 0,
    left: 0,
    width: 100,
    height: 20,
    type: 'image',
    index: -1,
    imageUrl: 'https://static.wixstatic.com/media/53d566_b68a3a188f724be98447d465a2cc5ad3~mv2.png/v1/fill/w_167,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/AGROCentre_Logo_01_Couleur.png',
    backgroundSize: 'contain'
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
    if (document.getElementById('zoom')!.contains(event.target as HTMLElement) ||
        document.getElementById('upDown')!.contains(event.target as HTMLElement)) {
      return;
    }

    this.current = undefined;
    this.listOfDesign.forEach(designCommon => {
      if (designCommon.linkedDirective?._elementRef.nativeElement.contains(event.target)) {
        this.current = designCommon;
        this.current.linkedDirective!.changeSelection(true);
      } else {
        if (designCommon.type == 'label' && (<DesignLabel>designCommon).content == '') {
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

  public down(): void {
    if (this.current) {
      let currentIndex = this.current.index;
      let justBeforeDesignIndex = Number.NEGATIVE_INFINITY;
      let justBeforeIndex = -1;
      this.listOfDesign.forEach((design, index) => {
        if (design.index > justBeforeDesignIndex && design.index < currentIndex) {
          justBeforeDesignIndex = design.index;
          justBeforeIndex = index;
        }
      });

      if (justBeforeIndex != -1) {
        this.listOfDesign[justBeforeIndex].index = currentIndex;
        this.current.index = justBeforeDesignIndex;
      }
    }
  }

  public up(): void {
    if (this.current) {
      let currentIndex = this.current.index;
      let justAfterDesignIndex = Number.MAX_VALUE;
      let justAfterIndex = -1;
      this.listOfDesign.forEach((design, index) => {
        if (design.index < justAfterDesignIndex && design.index > currentIndex) {
          justAfterDesignIndex = design.index;
          justAfterIndex = index;
        }
      });

      if (justAfterIndex !== -1) {
        this.listOfDesign[justAfterIndex].index = currentIndex;
        this.current.index = justAfterDesignIndex;
      }
    }
  }
}
