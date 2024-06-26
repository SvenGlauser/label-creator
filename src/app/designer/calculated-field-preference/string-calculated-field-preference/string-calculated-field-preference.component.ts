import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CalculatedField} from "../../calculated-fields/calculated-field";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";

/**
 * Gestion des préférences des champs de texte
 */
@Component({
  selector: 'app-string-calculated-field-preference',
  standalone: true,
  imports: [
    MatFormField,
    MatOption,
    MatSelect,
    FormsModule,
    NgIf,
    MatInput,
    MatLabel
  ],
  templateUrl: './string-calculated-field-preference.component.html',
  styleUrl: './string-calculated-field-preference.component.scss'
})
export class StringCalculatedFieldPreferenceComponent {
  @Input()
  public calculatedField?: CalculatedField;

  @Output()
  public valueChange: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Informe le parent qu'une des valeurs à changer
   */
  protected modified(newPreference: string): void {
    this.calculatedField!.preference = newPreference;
    this.valueChange.emit();
  }
}
