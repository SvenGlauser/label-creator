import {Component, Input, OnInit} from '@angular/core';
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

  /**
   * Initialise les options
   */
  public ngOnInit(): void {
    console.log("Test")
    this.calculatedField!.options = [];
  }

  /**
   * Ajoute une option
   */
  public add(): void {
    this.calculatedField!.options!.push({name: '', id: uuidv4()});
  }

  /**
   * Supprime une option
   */
  public remove(index: number): void {
    this.calculatedField!.options!.splice(index, 1);
  }
}
