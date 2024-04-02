import { Component } from '@angular/core';
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
export class EditionPageComponent {

  protected scale: number = 1;

  constructor(private fieldService: FieldService) {}

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