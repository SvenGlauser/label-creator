import {Component, Input} from '@angular/core';
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
}
