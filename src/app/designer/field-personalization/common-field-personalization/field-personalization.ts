import {AbstractControl} from "@angular/forms";
import {CommonField} from "../../fields/common-field/common-field";

export interface FieldPersonalization {
  form?: AbstractControl;

  /**
   * Vérifie si le composant enfant à changer
   * @param field Valeurs actuelles
   * @param oldField Anciennes valeurs
   */
  hasChanged(field: CommonField, oldField: CommonField): boolean;

  /**
   * Récupère les nouvelles informations de champs
   * @param field Champs auquel ajouter les informations
   */
  getNew(field: CommonField): CommonField;

  /**
   * Met à jour les champs
   * @param field Nouvelles valeurs
   */
  updateForm(field: CommonField): void;
}
