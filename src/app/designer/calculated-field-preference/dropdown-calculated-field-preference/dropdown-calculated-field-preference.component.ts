import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalculatedField} from "../../calculated-fields/calculated-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton, MatIconButton} from "@angular/material/button";
import {v4 as uuidv4} from 'uuid';

/**
 * Gestion des préférences des listes déroulantes
 */
@Component({
  selector: 'app-dropdown-calculated-field-preference',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatSelect,
    MatOption,
    MatIcon,
    MatIconButton,
    MatFabButton,
    MatSuffix
  ],
  templateUrl: './dropdown-calculated-field-preference.component.html',
  styleUrl: './dropdown-calculated-field-preference.component.scss'
})
export class DropdownCalculatedFieldPreferenceComponent implements OnInit {
  @Input()
  public calculatedField?: CalculatedField;

  @Output()
  public valueChange: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Initialise les options
   */
  public ngOnInit(): void {
    this.calculatedField!.options = [];
  }

  /**
   * Ajoute une option
   */
  protected add(): void {
    this.calculatedField!.options!.push({name: '', id: uuidv4()});
    this.valueChange.emit();
  }

  /**
   * Supprime une option
   */
  protected remove(index: number): void {
    this.calculatedField!.options!.splice(index, 1);
    this.valueChange.emit();
  }

  /**
   * Informe le parent qu'une des valeurs à changer
   */
  protected optionModified(index: number, newName: string): void {
    this.calculatedField!.options![index].name = newName;
    this.valueChange.emit();
  }

  /**
   * Informe le parent qu'une des valeurs à changer
   */
  protected preferenceModified(newPreference: number): void {
    this.calculatedField!.preference = newPreference;
    this.valueChange.emit();
  }
}
