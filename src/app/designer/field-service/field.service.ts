import {ElementRef, Injectable, OnDestroy, Renderer2, RendererFactory2} from '@angular/core';
import {CommonFieldDirective} from "../fields/common-field/common-field.directive";
import {CommonField} from "../fields/common-field/common-field";
import {VersioningService} from "../versioning-service/versioning.service";
import {ImageField, ImageFieldExportable} from "../fields/image-field/image-field";
import {LabelField} from "../fields/label-field/label-field";
import {CalculatedFieldService} from "../calculated-field-service/calculated-field.service";
import {CalculatedField} from "../calculated-fields/calculated-field";
import {Subscription} from "rxjs";

/**
 * Service de gestion des champs
 */
@Injectable({
  providedIn: 'root'
})
export class FieldService implements OnDestroy {

  private fields: CommonField[] = []
  private currentField?: CommonField;

  private _renderer: Renderer2;
  private editionZone?: ElementRef;
  private excludedZones: ElementRef[] = [];

  private unsubscribeMouseMove?: () => void;
  private unsubscribeMouseUp?: () => void;
  private unsubscribeMouseDown?: () => void;
  private unsubscribeKeyDown?: () => void;
  private calculatedFieldServiceValueChangesSouscription?: Subscription;
  private currentFormID?: string;
  private currentName?: string;

  constructor(private rendererFactory2: RendererFactory2,
              private versioningService: VersioningService,
              private calculatedFieldService: CalculatedFieldService) {
    this._renderer = this.rendererFactory2.createRenderer(null, null);
  }

  /**
   * Détruit les listeners
   */
  public ngOnDestroy(): void {
    this.destroyEvents();
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
   * Détruit les listeners
   */
  public destroyEvents(): void {
    if (this.unsubscribeMouseDown) {
      this.unsubscribeMouseDown();
    }
    if (this.unsubscribeMouseMove) {
      this.unsubscribeMouseMove();
    }
    if (this.unsubscribeMouseUp) {
      this.unsubscribeMouseUp();
    }
    if (this.unsubscribeKeyDown) {
      this.unsubscribeKeyDown();
    }
    if (this.calculatedFieldServiceValueChangesSouscription) {
      this.calculatedFieldServiceValueChangesSouscription.unsubscribe();
    }
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
    this.makeAVersionAndRefreshPreferences();
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

    this.makeAVersionAndRefreshPreferences();
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

    this.makeAVersionAndRefreshPreferences();
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
      this.makeAVersionAndRefreshPreferences();
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
      this.makeAVersionAndRefreshPreferences();
    }
  }

  /**
   * Versionne l'état actuel des champs et met à jour les préférences
   */
  public makeAVersionAndRefreshPreferences(): void {
    this.versioningService.add(this.fields);

    this.calculatedFieldService.refreshCalculatedFields(this.getAll());
    this.save().then();
  }

  /**
   * Annule la dernière modification
   */
  public undoAndRefreshPreferences(): void {
    this.fields = this.versioningService.goBack();
    this.currentField?.linkedDirective!.changeSelection(false);
    this.currentField = undefined;

    this.calculatedFieldService.refreshCalculatedFields(this.getAll());
    this.save().then();
  }

  /**
   * Rejoue la dernière modification annulée
   */
  public redoAndRefreshPreferences(): void {
    this.fields = this.versioningService.redo();
    this.currentField?.linkedDirective!.changeSelection(false);
    this.currentField = undefined;

    this.calculatedFieldService.refreshCalculatedFields(this.getAll());
    this.save().then();
  }

  /**
   * Désélectionne l'élément courant
   */
  public unSelectCurrent(): void {
    this.currentField?.linkedDirective?.changeSelection(false);
    this.currentField = undefined;
  }

  /**
   * Transforme l'étiquette actuelle en JSON
   */
  public transformToJSON(): Promise<string> {
    let fields: CommonField[] = this.getAll().map(field => ({...field}));
    let promises: Promise<void>[] = [];
    let listOfImages: {name: string, image: string, imageName: string}[] = [];

    for (const field of fields) {
      field.linkedDirective = undefined;

      if (field.type == 'image' && (<ImageField>field).image) {
        const reader: FileReader = new FileReader();

        promises.push(new Promise((resolve): void => {
          reader.onload = (): void => {
            listOfImages.push({
              name: field.name,
              image: <string>reader.result,
              imageName: (<ImageField>field).image!.name
            })
            resolve();
          };
          reader.readAsDataURL(<Blob>(<ImageField>field).image);
        }));
      }
    }

    return Promise.all(promises).then(() => {
      for (const image of listOfImages) {
        let oldImage = <ImageFieldExportable>fields.find(commonField => commonField.name == image.name)!;
        let index = fields.findIndex(commonField => commonField.name == image.name);

        oldImage.image = image.image;
        oldImage.imageName = image.name;

        fields[index] = oldImage;
      }

      return JSON.stringify(fields);
    });
  }

  /**
   * Transforme l'étiquette actuelle en objets
   */
  public transformToObjects(json: string): Promise<CommonField[]> {
    let fields: CommonField[] = JSON.parse(json);
    let promises: Promise<void>[] = [];
    let listOfImages: {name: string, image: File}[] = [];

    for (const field of fields) {
      if (field.type == 'image' && (<ImageFieldExportable>field).image) {
        let jsonImage: string = (<ImageFieldExportable>field).image!;

        promises.push(
          fetch(jsonImage)
            .then(res => res.blob())
            .then<void>(blob => {
              listOfImages.push({
                name: field.name,
                image: new File([blob], (<ImageFieldExportable>field).imageName!)
              });
            })
        );
      }
    }

    return Promise.all(promises).then<CommonField[]>(() => {
      for (const image of listOfImages) {
        let oldImage = <ImageField>fields.find(commonField => commonField.name == image.name)!;
        let index = fields.findIndex(commonField => commonField.name == image.name);

        oldImage.image = image.image;

        fields[index] = oldImage;
      }

      return fields;
    });
  }

  /**
   * Charge l'étiquette depuis le stockage
   * @param formId ID de l'étiquette
   */
  public async load(formId: string): Promise<void> {
    let informationsJSON = localStorage.getItem(formId);
    this.currentFormID = formId;

    if (informationsJSON == null) {
      console.error("Impossible de charger : " + formId);
      return Promise.resolve();
    } else {
      let informations: { name: string, fields: string, preferences: CalculatedField[] } = JSON.parse(informationsJSON);
      this.currentName = informations.name;
      this.calculatedFieldService.pushFromStorage(informations.preferences);
      this.initCalculatedFieldValueChange();
      this.fields = await this.transformToObjects(informations.fields);
      this.versioningService.initFields(this.fields);
    }
  }

  /**
   * Initialise la souscription au changement de valeur des préférences
   */
  private initCalculatedFieldValueChange(): void {
    if (this.calculatedFieldServiceValueChangesSouscription) {
      this.calculatedFieldServiceValueChangesSouscription.unsubscribe();
    }
    this.calculatedFieldServiceValueChangesSouscription = this.calculatedFieldService.valueChanges.subscribe((): void => {
      this.save().then();
    });
  }

  /**
   * Sauvegarde l'étiquette dans le stockage
   */
  public async save(): Promise<void> {
    if (!this.currentFormID) {
      console.error("Aucun ID de formulaire stocké");
      return;
    }

    let informations: { name: string, fields: string, preferences: CalculatedField[] } = {
      name: this.currentName!,
      preferences: this.calculatedFieldService.getAllCalculatedFields(),
      fields: await this.transformToJSON(),
    };

    localStorage.setItem(this.currentFormID, JSON.stringify(informations));
  }

  /**
   * Récupère le nom de l'étiquette
   */
  public getName(): string {
    return this.currentName!
  }

  /**
   * Modifie le nom de l'étiquette
   */
  public setName(newName: string): void {
    this.currentName = newName;
    this.save().then();
  }
}
