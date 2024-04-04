import {Component} from '@angular/core';
import {CalculatedFieldService} from "../calculated-field-service/calculated-field.service";
import {CalculatedField} from "../calculated-fields/calculated-field";
import {
  CommonCalculatedFieldPreferenceComponent
} from "../calculated-field-preference/common-calculated-field-preference/common-calculated-field-preference.component";
import {MatDivider} from "@angular/material/divider";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-calculated-fields-preferences',
  standalone: true,
  imports: [
    CommonCalculatedFieldPreferenceComponent,
    MatDivider,
    NgIf
  ],
  templateUrl: './calculated-fields-preferences.component.html',
  styleUrl: './calculated-fields-preferences.component.scss'
})
export class CalculatedFieldsPreferencesComponent {

  constructor(private calculatedFieldService: CalculatedFieldService) {}

  /**
   * Récupérer tous les champs personnalisables
   */
  public getAll(): CalculatedField[] {
    return this.calculatedFieldService.getAllCalculatedFields();
  }

  /**
   * Informe les autres services que la valeur d'un des composants a changé
   */
  public valueChange(): void {
    this.calculatedFieldService.valueChanges.emit();
  }
}
