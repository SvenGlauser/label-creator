import {ElementRef, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {CommonFieldDirective} from "../fields/common-field/common-field.directive";
import {CommonField} from "../fields/common-field/common-field";
import {VersioningService} from "../versioning-service/versioning.service";
import {from} from "rxjs";
import {ImageField, ImageFieldExportable} from "../fields/image-field/image-field";
import {LabelField} from "../fields/label-field/label-field";

/**
 * Service de gestion des champs
 */
@Injectable({
  providedIn: 'root'
})
export class FieldService {

  private fields: CommonField[] = []
  private currentField?: CommonField;

  private _renderer: Renderer2;
  private editionZone?: ElementRef;
  private excludedZones: ElementRef[] = [];

  private unsubscribeMouseMove?: () => void;
  private unsubscribeMouseUp?: () => void;
  private unsubscribeMouseDown?: () => void;
  private unsubscribeKeyDown?: () => void;

  constructor(private rendererFactory2: RendererFactory2,
              private versioningService: VersioningService) {
    this._renderer = this.rendererFactory2.createRenderer(null, null);
  }

  /**
   * Initialise la gestion des événements
   * @param editionZone Zone sur laquelle sont lancés les événements
   * @param excludedZones Zones à exclure de certains événements
   */
  public initializeEvents(editionZone: ElementRef, excludedZones?: ElementRef[]): void {
    this.editionZone = editionZone;
    this.excludedZones = excludedZones || this.excludedZones;

    this.unsubscribeMouseUp = this._renderer.listen(this.editionZone.nativeElement, "mouseup", () => this.onMouseUp());
    this.unsubscribeMouseDown = this._renderer.listen(this.editionZone.nativeElement, "mousedown", (event) => this.onMouseDown(event));
    this.unsubscribeKeyDown = this._renderer.listen(document, "keydown", (event) => this.onKeydown(event));
  }

  /**
   * Récupère tous les champs
   */
  public getAll(): CommonField[] {
    return this.fields;
  }

  /**
   * Ajoute un nouveau champ
   * @param field Nouveau champs à ajouter
   */
  public addNew(field: CommonField): void {
    // La valeur Number.NEGATIVE_INFINITY est utilisée pour indiquer que le champ n'a pas encore d'index
    if (field.index == Number.NEGATIVE_INFINITY) {
      if (this.fields.length > 0) {
        // Récupère le plus grand index et lui ajoute 1
        field.index = this.fields.map(field => field.index)
                                 .sort((a, b) => (a - b))
                                 .reverse()[0] + 1;
      } else {
        field.index = 0;
      }
    }

    this.fields.push(field);
    this.currentField = field;
    this.makeAVersion();
  }

  /**
   * Lie un champ à sa directive associée
   * @param commonFieldDirective Directive
   * @param name Nom du champ
   */
  public registerNew(commonFieldDirective: CommonFieldDirective, name: string): void {
    this.fields.find(field => field.name == name)!.linkedDirective = commonFieldDirective;
    if (this.currentField?.name == name) {
      setTimeout(() => commonFieldDirective?.changeSelection(true));
    }
  }

  /**
   * Supprime le champ actuellement sélectionné
   */
  public deleteCurrent(): void {
    this.delete(this.currentField!);
    this.currentField = undefined;
  }

  /**
   * Supprime un champ
   * @param fieldToDelete Champ à supprimer
   */
  private delete(fieldToDelete: CommonField): void {
    let index = this.fields.findIndex(field => field.name == fieldToDelete.name);

    if (index !== -1) {
      this.fields.splice(index, 1);
    }

    if (this.currentField?.name == fieldToDelete.name) {
      this.currentField = undefined;
    }

    this.makeAVersion();
  }

  /**
   * Gestion de l'événement MouseMove
   * @param event Événement de déplacement de souris
   */
  private onMouseMove(event: MouseEvent): void {
    if (this.currentField) {
      if (this.currentField.linkedDirective!.currentlyResizing) {
        this.currentField.linkedDirective!.move(event);
      } else {
        // Si aucun champ n'est en cours de redimensionnement alors suppression de l'événement
        this.unsubscribeMouseMove!();
      }
    }
  }

  /**
   * Stop le redimensionnement du champ courant
   */
  private onMouseUp(): void {
    if (this.currentField) {
      this.currentField.linkedDirective!.stopResizing();
    }
  }

  /**
   * Gère la sélection du champ courant
   * @param event Événement
   */
  private onMouseDown(event: MouseEvent): void {
    // Si le clic a lieu en dehors de la zone
    let inForbiddenZone: boolean = false;
    for (const excludedZone of this.excludedZones) {
      if (excludedZone.nativeElement.contains(event.target)) {
        inForbiddenZone = true;
      }
    }
    if (inForbiddenZone) {
      return;
    }

    this.currentField = undefined;
    this.fields.forEach(commonField => {
      if (commonField.linkedDirective?._elementRef.nativeElement.contains(event.target)) {
        this.currentField = commonField;
        this.currentField.linkedDirective!.changeSelection(true);
      } else {
        // Suppression des champs de texte n'ayant plus de texte
        if (commonField.type == 'label' && (<LabelField>commonField).content == '') {
          this.delete(commonField);
        }
        commonField.linkedDirective!.changeSelection(false);
      }
    });

    // Démarre l'événement de gestion des mouvements de souris
    if (this.currentField) {
      this.unsubscribeMouseMove = this._renderer.listen(this.editionZone?.nativeElement, "mousemove", (event) => this.onMouseMove(event));
    }
  }

  /**
   * Gère les raccourcis claviers
   * @param event Événement
   */
  private onKeydown(event: KeyboardEvent): void {
    // Annule la gestion si l'utilisateur est en cours de saisie
    if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes((event.target as HTMLElement).tagName)) {
      return;
    }

    // Vérifie qu'un champ est bien sélectionné et que l'utilisateur n'est pas en train de le modifier
    if (this.currentField && !this.currentField.linkedDirective!.currentlyResizing) {
      switch (event.key) {
        case "ArrowLeft": {
          this.currentField.linkedDirective!.moveBy(-1, 0);
          break;
        }
        case "ArrowRight": {
          this.currentField.linkedDirective!.moveBy(1, 0);
          break;
        }
        case "ArrowUp": {
          this.currentField.linkedDirective!.moveBy(0, -1);
          break;
        }
        case "ArrowDown": {
          this.currentField.linkedDirective!.moveBy(0, 1);
          break;
        }
        case "Delete": {
          this.deleteCurrent();
          break;
        }
      }
    }
  }

  /**
   * Met à jour les informations d'un champ en le remplacent par un nouveau
   * @param newField Nouveau champ
   */
  public update(newField: CommonField): void {
    let index = this.fields.findIndex(design => design.name == newField.name);

    if (index !== -1) {
      this.fields[index] = newField;
    }

    this.makeAVersion();
  }

  /**
   * Vérifie si un champ est sélectionné
   */
  public hasCurrent(): boolean {
    return !!this.currentField;
  }

  /**
   * Récupère le champ courant
   */
  public getCurrent(): CommonField | undefined {
    return this.currentField;
  }

  /**
   * Diminue le z-index
   */
  public moveDownward(): void {
    if (this.currentField) {
      let currentIndex = this.currentField.index;
      let justBeforeIndex = -1;
      let justBeforeIndexOfField = Number.NEGATIVE_INFINITY;
      this.fields.forEach((field, index) => {
        if (field.index > justBeforeIndexOfField && field.index < currentIndex) {
          justBeforeIndexOfField = field.index;
          justBeforeIndex = index;
        }
      });

      if (justBeforeIndex != -1) {
        this.fields[justBeforeIndex].index = currentIndex;
        this.currentField.index = justBeforeIndexOfField;
      }
      this.makeAVersion();
    }
  }

  /**
   * Augmente le z-index
   */
  public moveUpward(): void {
    if (this.currentField) {
      let currentIndex = this.currentField.index;
      let justAfterIndex = -1;
      let justAfterIndexOfField = Number.MAX_VALUE;
      this.fields.forEach((field, index) => {
        if (field.index < justAfterIndexOfField && field.index > currentIndex) {
          justAfterIndexOfField = field.index;
          justAfterIndex = index;
        }
      });

      if (justAfterIndex !== -1) {
        this.fields[justAfterIndex].index = currentIndex;
        this.currentField.index = justAfterIndexOfField;
      }
      this.makeAVersion();
    }
  }

  /**
   * Versionne l'état actuel des champs
   */
  public makeAVersion(): void {
    this.versioningService.add(this.fields);
  }

  /**
   * Annule la dernière modification
   */
  public undo(): void {
    this.fields = this.versioningService.goBack();
    this.currentField?.linkedDirective!.changeSelection(false);
    this.currentField = undefined;
  }

  /**
   * Rejoue la dernière modification annulée
   */
  public redo(): void {
    this.fields = this.versioningService.redo();
    this.currentField?.linkedDirective!.changeSelection(false);
    this.currentField = undefined;
  }

  // TODO améliorer
  public getJson(): void {
    let listOfDesignToString = this.fields.map(design => ({...design}));

    let listOfImageTOString = listOfDesignToString
      .filter(design => design.type == 'image' && (<ImageField>design).image != undefined)
      .map(design => {
        return {
          indexOf: listOfDesignToString.indexOf(design),
          image: (<ImageField>design).image
        }
      }).filter(image => image.image != undefined);

    listOfImageTOString.forEach(image => {
      const reader = new FileReader();
      reader.onloadend = () => {
        let newDesign = <ImageFieldExportable>listOfDesignToString.at(image.indexOf);
        newDesign.image = <string>reader.result
        newDesign.imageName = <string>image.image!.name;
        listOfDesignToString[image.indexOf] = newDesign;
        const index = listOfImageTOString.indexOf(image);
        if (index > -1) {
          listOfImageTOString.splice(index, 1);
        }
        if (listOfImageTOString.length == 0) {
          navigator.clipboard.writeText(JSON.stringify(listOfDesignToString.map(design => {
            design.linkedDirective = undefined;
            return design;
          })));
        }
      };
      reader.readAsDataURL(<Blob>image.image);
    })

    if (listOfImageTOString.length == 0) {
      navigator.clipboard.writeText(JSON.stringify(listOfDesignToString.map(design => {
        design.linkedDirective = undefined;
        return design;
      })));
    }


  }

  // TODO améliorer
  public setJson(): void {
    navigator.clipboard.readText().then((event) => {
      let listOfDesignExported: CommonField[] = JSON.parse(event);
      let listOfImages: {index: number, image: string, imageName: string}[] = [];
      listOfDesignExported.forEach((design, index) => {
        if (design.type == 'image' && (<ImageFieldExportable>design).image) {
          listOfImages.push({
            index: index,
            image: <string>(<ImageFieldExportable>design).image,
            imageName: <string>(<ImageFieldExportable>design).imageName
          });
        }
      });

      listOfImages.forEach((image) => {
        from(
          fetch(image.image)
            .then(res => res.blob())
            .then(blob => {
              let newDesign = <ImageField>listOfDesignExported.at(image.index);
              newDesign.image = new File([blob], image.imageName);
              listOfDesignExported[image.index] = newDesign;
              const index = listOfImages.indexOf(image);
              if (index > -1) {
                listOfImages.splice(index, 1);
              }
              if (listOfImages.length == 0) {
                this.fields = listOfDesignExported;
              }
            })
        );
      });

      if (listOfImages.length == 0) {
        this.fields = listOfDesignExported;
      }
    })
  }

  /**
   * Désélectionne l'élément courant
   */
  public unSelectCurrent(): void {
    this.currentField?.linkedDirective?.changeSelection(false);
    this.currentField = undefined;
  }
}
