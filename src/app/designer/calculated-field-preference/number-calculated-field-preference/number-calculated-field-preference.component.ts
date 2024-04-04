import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalculatedField} from "../../calculated-fields/calculated-field";

/**
 * Gestion des préférences des champs nombre
 */
@Component({
  selector: 'app-number-calculated-field-preference',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatLabel
  ],
  templateUrl: './number-calculated-field-preference.component.html',
  styleUrl: './number-calculated-field-preference.component.scss'
})
export class NumberCalculatedFieldPreferenceComponent {
  @Input()
  public calculatedField?: CalculatedField;

  @Output()
  public valueChange: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Informe le parent qu'une des valeurs à changer
   */
  protected modified(newPreference: number): void {
    this.calculatedField!.preference = newPreference;
    this.valueChange.emit();
  }
}
