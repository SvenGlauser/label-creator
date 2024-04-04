import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EditionOptionsComponent} from "./edition-options/edition-options.component";
import {ZoomComponent} from "./zoom/zoom.component";
import {FieldCreationComponent} from "../field-creation/field-creation.component";
import {NgIf} from "@angular/common";
import {
  CommonFieldPersonalizationComponent
} from "../field-personalization/common-field-personalization/common-field-personalization.component";
import {FieldService} from "../field-service/field.service";
import {CommonField} from "../fields/common-field/common-field";
import {ImageFieldComponent} from "../fields/image-field/image-field.component";
import {LabelFieldComponent} from "../fields/label-field/label-field.component";
import {PAGE_HEIGHT, PAGE_WIDTH} from "../dimensions";
import {
  CalculatedFieldsPreferencesComponent
} from "../calculated-fields-preferences/calculated-fields-preferences.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-edition-page',
  standalone: true,
  imports: [
    EditionOptionsComponent,
    ZoomComponent,
    FieldCreationComponent,
    NgIf,
    CommonFieldPersonalizationComponent,
    ImageFieldComponent,
    LabelFieldComponent,
    CalculatedFieldsPreferencesComponent,
    MatToolbar,
    MatFormField,
    MatInput,
    FormsModule
  ],
  templateUrl: './edition-page.component.html',
  styleUrl: './edition-page.component.scss'
})
export class EditionPageComponent implements OnInit, AfterViewInit, OnDestroy {

  protected readonly PAGE_WIDTH = PAGE_WIDTH;
  protected readonly PAGE_HEIGHT = PAGE_HEIGHT;

  protected scale: number = 1;

  @ViewChild('editionZone')
  private editionZone: ElementRef | undefined;

  @ViewChild('editionOptions', { read: ElementRef })
  private editionOptions: ElementRef | undefined;

  @ViewChild('zoomOptions', { read: ElementRef })
  private zoomOptions: ElementRef | undefined;

  private formId?: string;
  protected name: string = '';

  constructor(private fieldService: FieldService,
              private route: ActivatedRoute) {}

  /**
   * Charge le bon formulaire
   */
  public ngOnInit(): void {
    this.formId = <string>this.route.snapshot.params['id']

    this.fieldService.load(this.formId).then(() => {
      this.name = this.fieldService.getName();
    });
  }

  /**
   * Change le nom stocké
   * @param newName Nouveau nom
   */
  protected nameChange(newName: string): void {
    this.name = newName;
    this.fieldService.setName(this.name);
  }

  /**
   * Initialise les événements du service
   */
  public ngAfterViewInit(): void {
    this.fieldService.initializeEvents(this.editionZone!, [this.editionOptions!, this.zoomOptions!]);
  }

  /**
   * Détruit les listeners
   */
  public ngOnDestroy(): void {
    this.fieldService.destroyEvents();
  }

  /**
   * Vérifie si un champ est actuellement sélectionné
   */
  protected hasCurrent(): boolean {
    return this.fieldService.hasCurrent();
  }

  /**
   * Récupère le champ actuellement sélectionné
   */
  protected getCurrent(): CommonField | undefined {
    return this.fieldService.getCurrent();
  }

  /**
   * Met à jour le champ modifié
   */
  protected update(field: CommonField): void {
    this.fieldService.update(field);
  }

  /**
   * Met à jour l'échelle de zoom CSS
   * @param newScale Nouvelle échelle
   */
  protected updateScale(newScale: number): void {
    this.scale = newScale;
  }

  /**
   * Récupère tous les champs
   */
  protected getAll(): CommonField[] {
    return this.fieldService.getAll();
  }
}
