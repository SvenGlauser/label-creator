import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DesignCommonDirective} from "./design-common.directive";
import {Design, DesignLabel} from "../design";
import {VersionningService} from "../versionning-service/versionning.service";

@Injectable({
  providedIn: 'root'
})
export class DesignCommonService {

  private listOfDesign: Design[] = []
  private current?: Design;
  private _renderer: Renderer2;

  private unsubscribeMouseMove?: () => void;
  private unsubscribeMouseUp?: () => void;
  private unsubscribeMouseDown?: () => void;
  private unsubscribeKeyDown?: () => void;

  constructor(private rendererFactory2: RendererFactory2,
              private versionningService: VersionningService) {
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

  public addNew(design: Design): void {
    if (design.index == Number.NEGATIVE_INFINITY) {
      let biggerIndex = this.listOfDesign.length > 0 ? this.listOfDesign.map(design => design.index).sort().reverse()[0] : 0;
      design.index = biggerIndex + 1;
    }

    this.listOfDesign.push(design);
    this.current = design;
    this.makeAVersion();
  }

  public registerNew(designCommonDirective: DesignCommonDirective, name: string): void {
    this.listOfDesign.find(design => design.name == name)!.linkedDirective = designCommonDirective;
    if (this.current?.name == name) {
      setTimeout(() => designCommonDirective?.changeSelection(true));
    }
  }

  public deleteCurrent(): void {
    this.delete(this.current!);
    this.current = undefined;
  }

  public delete(designToDelete: Design): void {
    let index = this.listOfDesign.findIndex(design => design.name == designToDelete?.name);

    if (index !== -1) {
      this.listOfDesign.splice(index, 1);
    }
    this.makeAVersion();
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
    if (document.getElementById('zoom')?.contains(event.target as HTMLElement) ||
        document.getElementById('options')?.contains(event.target as HTMLElement)) {
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

    this.makeAVersion();
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
      this.makeAVersion();
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
      this.makeAVersion();
    }
  }

  public makeAVersion(): void {
    this.versionningService.add(this.listOfDesign);
  }

  public goBack(): void {
    this.listOfDesign = this.versionningService.goBack();
    this.current?.linkedDirective!.changeSelection(false);
    this.current = undefined;
  }

  public goNext(): void {
    this.listOfDesign = this.versionningService.goNext();
    this.current?.linkedDirective!.changeSelection(false);
    this.current = undefined;
  }
}
