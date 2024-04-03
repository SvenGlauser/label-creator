import {Component, Input} from '@angular/core';
import {CalculatedField} from "../../calculated-fields/calculated-field";
import {MatFormField, MatOption, MatSelect} from "@angular/material/select";
import {NgIf} from "@angular/common";
import {
  StringCalculatedFieldPreferenceComponent
} from "../string-calculated-field-preference/string-calculated-field-preference.component";
import {
  DateCalculatedFieldPreferenceComponent
} from "../date-calculated-field-preference/date-calculated-field-preference.component";
import {
  NumberCalculatedFieldPreferenceComponent
} from "../number-calculated-field-preference/number-calculated-field-preference.component";
import {
  DropdownCalculatedFieldPreferenceComponent
} from "../dropdown-calculated-field-preference/dropdown-calculated-field-preference.component";

/**
 * Gestion des préférences
 */
@Component({
  selector: 'app-common-calculated-field-preference',
  standalone: true,
  imports: [
    MatSelect,
    MatOption,
    NgIf,
    MatFormField,
    StringCalculatedFieldPreferenceComponent,
    DateCalculatedFieldPreferenceComponent,
    NumberCalculatedFieldPreferenceComponent,
    DropdownCalculatedFieldPreferenceComponent
  ],
  templateUrl: './common-calculated-field-preference.component.html',
  styleUrl: './common-calculated-field-preference.component.scss'
})
export class CommonCalculatedFieldPreferenceComponent {
  @Input()
  public calculatedField?: CalculatedField;

  /**
   * Actualise le type et reset les attributs spécifiques
   */
  protected typeChange(newType: 'string' | 'number' | 'dropdown' | 'date' | 'today-date'): void {
    this.calculatedField!.type = newType;
    this.calculatedField!.options = undefined;
    this.calculatedField!.preference = undefined;
  }
}
