import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {FieldService} from "../../field-service/field.service";
import {VersioningService} from "../../versioning-service/versioning.service";

@Component({
  selector: 'app-edition-options',
  standalone: true,
    imports: [
        MatIcon,
        MatIconButton,
        NgIf
    ],
  templateUrl: './edition-options.component.html',
  styleUrl: './edition-options.component.scss'
})
export class EditionOptionsComponent {

  constructor(private fieldService: FieldService,
              private versioningService: VersioningService) {}

  /**
   * Annule la dernière modification
   */
  protected undo(): void {
    this.fieldService.undoAndRefreshPreferences();
  }

  /**
   * Rejoue la dernière modification
   */
  protected redo(): void {
    this.fieldService.redoAndRefreshPreferences();
  }

  /**
   * Vérifie si l'opération "Undo" peut être effectuée
   */
  protected cannotUndo(): boolean {
    return !this.versioningService.canUndo();
  }

  /**
   * Vérifie si l'opération "Redo" peut être effectuée
   */
  protected cannotRedo(): boolean {
    return !this.versioningService.canRedo();
  }

  /**
   * Vérifie si un champ est sélectionné
   */
  protected hasCurrent(): boolean {
    return this.fieldService.hasCurrent();
  }

  /**
   * Augmente le z-index
   */
  protected moveUpward(): void {
    return this.fieldService.moveUpward();
  }

  /**
   * Diminue le z-index
   */
  protected moveDownward(): void {
    return this.fieldService.moveDownward();
  }

  /**
   * Supprime l'élément courant
   */
  protected delete(): void {
    return this.fieldService.deleteCurrent();
  }
}
