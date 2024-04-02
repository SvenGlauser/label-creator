import {AbstractControl} from "@angular/forms";
import {Field, ImageField} from "../field";

export interface FieldPersonalization {
  form?: AbstractControl;

  /**
   * Vérifie si le composant enfant à changer
   * @param field Valeurs actuelles
   * @param oldField Anciennes valeurs
   */
  hasChanged(field: Field, oldField: Field): boolean;

  /**
   * Récupère les nouvelles informations de champs
   * @param field Champs auquel ajouter les informations
   */
  getNew(field: Field): Field;

  /**
   * Met à jour les champs
   * @param field Nouvelles valeurs
   */
  updateForm(field: Field): void;
}
