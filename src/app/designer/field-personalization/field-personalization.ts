import {AbstractControl} from "@angular/forms";
import {Design, DesignImage} from "../design";

export interface FieldPersonalization {
  form?: AbstractControl;

  /**
   * Vérifie si le composant enfant à changer
   * @param field Valeurs actuelles
   * @param oldField Anciennes valeurs
   */
  hasChanged(field: Design, oldField: Design): boolean;

  /**
   * Récupère les nouvelles informations de champs
   * @param field Champs auquel ajouter les informations
   */
  getNew(field: Design): Design;

  /**
   * Met à jour les champs
   * @param field Nouvelles valeurs
   */
  updateForm(field: Design): void;
}
