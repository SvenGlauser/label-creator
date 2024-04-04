import {
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import {CdkDrag, CdkDragEnd, CdkDragMove} from "@angular/cdk/drag-drop";
import {FieldService} from "../../field-service/field.service";
import {CommonField} from "./common-field";
import {MAX_HEIGHT, MAX_WIDTH, MIN_HEIGHT, MIN_WIDTH} from "../../dimensions";
import {Utils} from "../../utils";

/**
 * Directive gérer les propriétés communes à tous les champs
 */
@Directive({
  selector: '[appDesignCommon]',
  standalone: true,
  hostDirectives: [{
    directive: CdkDrag,
    outputs: ['cdkDragEnded', 'cdkDragMoved']
  }]
})
export class CommonFieldDirective implements OnInit, DoCheck, OnDestroy {

  // Dimensions MIN et MAX du champ
  private readonly MIN_WIDTH = MIN_WIDTH;
  private readonly MIN_HEIGHT = MIN_HEIGHT;
  private readonly MAX_WIDTH = MAX_WIDTH;
  private readonly MAX_HEIGHT = MAX_HEIGHT;

  public currentlyResizing: boolean = false;
  private currentX: number = 0;
  private currentY: number = 0;
  private reverseX: boolean = false;
  private reverseY: boolean = false;

  private resizeButtonBottomRight?: HTMLDivElement;
  private resizeButtonBottomLeft?: HTMLDivElement;
  private resizeButtonTopRight?: HTMLDivElement;
  private resizeButtonTopLeft?: HTMLDivElement;

  private unsubscribeResizeButtonBottomRight?: () => void;
  private unsubscribeResizeButtonBottomLeft?: () => void;
  private unsubscribeResizeButtonTopRight?: () => void;
  private unsubscribeResizeButtonTopLeft?: () => void;

  private needToRegisterField: boolean = false;

  @Input('field') set setField(field: CommonField) {
    this.field = field;
    this.top = this.field.top;
    this.left = this.field.left;
    this.width = this.field.width;
    this.height = this.field.height;
    this.zIndex = this.field.index;

    this.needToRegisterField = true;
  }
  private field?: CommonField;
  @Output()
  public fieldChange = new EventEmitter<CommonField>();

  @Input()
  public zoomLevel: number = 1;

  // Lie les propriétés CSS au composant
  @HostBinding('style.height.px')
  private height = 100;
  @HostBinding('style.width.px')
  private width = 100;
  @HostBinding('style.top.px')
  private top = 0;
  @HostBinding('style.left.px')
  private left = 0;
  @HostBinding('style.z-index')
  private zIndex = 0;

  constructor(public _elementRef: ElementRef,
              private _renderer : Renderer2,
              private fieldService: FieldService) {}

  /**
   * Initialise les champs avec les styles communs et les boutons de redimensionnement (resizeButton)
   */
  public ngOnInit(): void {
    this.initResizeButtons();
    this._elementRef.nativeElement.style.display = "block";
    this._elementRef.nativeElement.classList.add("app-common-field");
  }

  /**
   * Détruit les listeners
   */
  public ngOnDestroy(): void {
    if (this.unsubscribeResizeButtonBottomRight) {
      this.unsubscribeResizeButtonBottomRight();
    }
    if (this.unsubscribeResizeButtonBottomLeft) {
      this.unsubscribeResizeButtonBottomLeft();
    }
    if (this.unsubscribeResizeButtonTopRight) {
      this.unsubscribeResizeButtonTopRight();
    }
    if (this.unsubscribeResizeButtonTopLeft) {
      this.unsubscribeResizeButtonTopLeft();
    }
  }

  /**
   * Corrige la transformation CSS pour prendre le niveau de zoom en compte
   */
  @HostListener('cdkDragMoved', ['$event'])
  public onDragMove(event: CdkDragMove): void {
    event.source.element.nativeElement.style.transform = `translate3d(${event.distance.x/this.zoomLevel}px, ${event.distance.y/this.zoomLevel}px, 0)`
  }

  /**
   * Lors de l'événement CdkDragEnd, transforme le CSS en pixel de déplacement de haut en bas et bas en haut
   * @param event Événement
   */
  @HostListener('cdkDragEnded', ['$event'])
  protected onDragEnd(event: CdkDragEnd): void {
    this.top = this.top + event.distance.y/this.zoomLevel;
    this.left = this.left + event.distance.x/this.zoomLevel;

    // Supprime le CSS
    event.source.reset();

    this.updateDesign();
  }

  /**
   * Initialise les boutons de redimensionnement
   */
  private initResizeButtons(): void {
    this.resizeButtonBottomRight = this._renderer.createElement('div');
    this._renderer.setStyle(this.resizeButtonBottomRight, "position", "absolute");
    this._renderer.setStyle(this.resizeButtonBottomRight, "width", "6px");
    this._renderer.setStyle(this.resizeButtonBottomRight, "height", "6px");
    this._renderer.setStyle(this.resizeButtonBottomRight, "background-color", "blue");
    this._renderer.setStyle(this.resizeButtonBottomRight, "border-radius", "50%");
    this._renderer.setStyle(this.resizeButtonBottomRight, "bottom", "-3px");
    this._renderer.setStyle(this.resizeButtonBottomRight, "right", "-3px");
    this._renderer.setStyle(this.resizeButtonBottomRight, "cursor", "se-resize");
    this._renderer.setStyle(this.resizeButtonBottomRight, "display", "none");
    this._renderer.setAttribute(this.resizeButtonBottomRight, "draggable", "false");
    this.unsubscribeResizeButtonBottomRight = this._renderer.listen(
      this.resizeButtonBottomRight,
      "mousedown",
      ($event: MouseEvent) => this.startResizing($event, false, false)
    );
    this._renderer.appendChild(this._elementRef.nativeElement, this.resizeButtonBottomRight);
    this.resizeButtonBottomLeft = this._renderer.createElement('div');
    this._renderer.setStyle(this.resizeButtonBottomLeft, "position", "absolute");
    this._renderer.setStyle(this.resizeButtonBottomLeft, "width", "6px");
    this._renderer.setStyle(this.resizeButtonBottomLeft, "height", "6px");
    this._renderer.setStyle(this.resizeButtonBottomLeft, "background-color", "blue");
    this._renderer.setStyle(this.resizeButtonBottomLeft, "border-radius", "50%");
    this._renderer.setStyle(this.resizeButtonBottomLeft, "bottom", "-3px");
    this._renderer.setStyle(this.resizeButtonBottomLeft, "left", "-3px");
    this._renderer.setStyle(this.resizeButtonBottomLeft, "cursor", "sw-resize");
    this._renderer.setStyle(this.resizeButtonBottomLeft, "display", "none")
    this._renderer.setAttribute(this.resizeButtonBottomLeft, "draggable", "false");
    this.unsubscribeResizeButtonBottomLeft = this._renderer.listen(
      this.resizeButtonBottomLeft,
      "mousedown",
      ($event: MouseEvent) => this.startResizing($event, true, false)
    );
    this._renderer.appendChild(this._elementRef.nativeElement, this.resizeButtonBottomLeft);
    this.resizeButtonTopRight = this._renderer.createElement('div');
    this._renderer.setStyle(this.resizeButtonTopRight, "position", "absolute");
    this._renderer.setStyle(this.resizeButtonTopRight, "width", "6px");
    this._renderer.setStyle(this.resizeButtonTopRight, "height", "6px");
    this._renderer.setStyle(this.resizeButtonTopRight, "background-color", "blue");
    this._renderer.setStyle(this.resizeButtonTopRight, "border-radius", "50%");
    this._renderer.setStyle(this.resizeButtonTopRight, "top", "-3px");
    this._renderer.setStyle(this.resizeButtonTopRight, "right", "-3px");
    this._renderer.setStyle(this.resizeButtonTopRight, "cursor", "ne-resize");
    this._renderer.setStyle(this.resizeButtonTopRight, "display", "none");
    this._renderer.setAttribute(this.resizeButtonTopRight, "draggable", "false");
    this.unsubscribeResizeButtonTopRight = this._renderer.listen(
      this.resizeButtonTopRight,
      "mousedown",
      ($event: MouseEvent) => this.startResizing($event, false, true)
    );
    this._renderer.appendChild(this._elementRef.nativeElement, this.resizeButtonTopRight);
    this.resizeButtonTopLeft = this._renderer.createElement('div');
    this._renderer.setStyle(this.resizeButtonTopLeft, "position", "absolute");
    this._renderer.setStyle(this.resizeButtonTopLeft, "width", "6px");
    this._renderer.setStyle(this.resizeButtonTopLeft, "height", "6px");
    this._renderer.setStyle(this.resizeButtonTopLeft, "background-color", "blue");
    this._renderer.setStyle(this.resizeButtonTopLeft, "border-radius", "50%");
    this._renderer.setStyle(this.resizeButtonTopLeft, "top", "-3px");
    this._renderer.setStyle(this.resizeButtonTopLeft, "left", "-3px");
    this._renderer.setStyle(this.resizeButtonTopLeft, "cursor", "nw-resize");
    this._renderer.setStyle(this.resizeButtonTopLeft, "display", "none");
    this._renderer.setAttribute(this.resizeButtonTopLeft, "draggable", "false");
    this.unsubscribeResizeButtonTopLeft = this._renderer.listen(
      this.resizeButtonTopLeft,
      "mousedown",
      ($event: MouseEvent) => this.startResizing($event, true, true)
    );
    this._renderer.appendChild(this._elementRef.nativeElement, this.resizeButtonTopLeft);
  }

  /**
   * Configuration du redimensionnement lorsque l'utilisateur clique sur un bouton de redimensionnement
   * @param event Événement de clic
   * @param reverseX Renverser l'axe x (Taille diminue en allant de gauche à droite)
   * @param reverseY Renverser l'axe x (Taille diminue en allant de haut en bas)
   */
  private startResizing(event: MouseEvent, reverseX: boolean, reverseY: boolean): void {
    this.currentlyResizing = true;
    this.currentX = event.x;
    this.currentY = event.y;
    this.reverseX = reverseX;
    this.reverseY = reverseY;
  }

  /**
   * Permet le redimensionnement en suivant les mouvements de souris
   * @param event Événement de déplacement de la souris
   */
  public move(event: MouseEvent): void {
    if (!this.currentlyResizing) {
      return;
    }

    // Calcule les décalages X et Y en prenant en compte le zoom
    let x =  (event.x - this.currentX)/this.zoomLevel;
    let y =  (event.y - this.currentY)/this.zoomLevel;

    // Calcule le redimensionnement de l'axe X
    if (x != 0) {
      if (this.reverseX && this.width - x >= this.MIN_WIDTH && this.width - x <= this.MAX_WIDTH) {
        this.width = this.width - x;
        this.left = this.left + x;
      } else if (!this.reverseX && this.width + x >= this.MIN_WIDTH && this.width + x <= this.MAX_WIDTH) {
        this.width = this.width + x;
      }
      this.currentX = event.x;
    }

    // Calcule le redimensionnement de l'axe Y
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

  /**
   * Met à jour le champ en arrondissant les dimensions en pixel
   */
  private updateDesign(): void {
    this.field!.top = Utils.roundPixel(this.top);
    this.field!.left = Utils.roundPixel(this.left);
    this.field!.height = Utils.roundPixel(this.height);
    this.field!.width = Utils.roundPixel(this.width);
    this.fieldChange.emit(this.field);
  }

  /**
   * Déplace le champ de X et Y pixels
   * @param changeX Nombre de pixel sur l'axe X
   * @param changeY Nombre de pixel sur l'axe Y
   */
  public moveBy(changeX: number, changeY: number): void {
    this.top = this.top + changeY;
    this.left = this.left + changeX;

    this.updateDesign();
  }

  /**
   * Termine le redimensionnement du champ
   */
  public stopResizing(): void {
    if (!this.currentlyResizing) {
      return;
    }

    this.currentlyResizing = false;
    this.changeSelection(true);

    this.updateDesign();
  }

  /**
   * Affiche le champ comme étant sélectionné ou non
   * @param isSelected Définit si le champ est sélectionné
   */
  public changeSelection(isSelected: boolean): void {
    if (isSelected) {
      this._elementRef.nativeElement.style.outline = "1px solid blue";
      this.resizeButtonBottomRight!.style.display = "block";
      this.resizeButtonBottomLeft!.style.display = "block";
      this.resizeButtonTopRight!.style.display = "block";
      this.resizeButtonTopLeft!.style.display = "block";
    } else {
      this._elementRef.nativeElement.style.outline = "none";
      this.resizeButtonBottomRight!.style.display = "none";
      this.resizeButtonBottomLeft!.style.display = "none";
      this.resizeButtonTopRight!.style.display = "none";
      this.resizeButtonTopLeft!.style.display = "none";
    }
  }

  /**
   * Vérifie si l'index du champ a été modifié
   */
  public ngDoCheck(): void {
    if (this.needToRegisterField) {
      // Enregistre le composant dans le service
      this.fieldService.registerNew(this, this.field!.name)
      this.needToRegisterField = false;
    }

    if (this.field && this.field.index != this.zIndex) {
      this.zIndex = this.field.index;
    }
  }
}
