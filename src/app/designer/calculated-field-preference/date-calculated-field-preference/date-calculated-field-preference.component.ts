import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CalculatedField} from "../../calculated-fields/calculated-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatIcon} from "@angular/material/icon";

/**
 * Gestion des préférences des champs date
 */
@Component({
  selector: 'app-date-calculated-field-preference',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    NgIf,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    FormsModule,
    MatSuffix,
    MatLabel,
    MatHint,
    MatIcon,
  ],
  templateUrl: './date-calculated-field-preference.component.html',
  styleUrl: './date-calculated-field-preference.component.scss'
})
export class DateCalculatedFieldPreferenceComponent {
  @Input()
  public calculatedField?: CalculatedField;

  @Output()
  public valueChange: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Informe le parent qu'une des valeurs à changer
   */
  protected modified(newPreference: Date): void {
    this.calculatedField!.preference = newPreference;
    this.valueChange.emit();
  }
}
