import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
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
    LabelFieldComponent
  ],
  templateUrl: './edition-page.component.html',
  styleUrl: './edition-page.component.scss'
})
export class EditionPageComponent implements AfterViewInit, OnDestroy {

  protected scale: number = 1;

  @ViewChild('editionZone')
  private editionZone: ElementRef | undefined;

  @ViewChild('editionOptions', { read: ElementRef })
  private editionOptions: ElementRef | undefined;

  @ViewChild('zoomOptions', { read: ElementRef })
  private zoomOptions: ElementRef | undefined;

  constructor(private fieldService: FieldService) {}

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
