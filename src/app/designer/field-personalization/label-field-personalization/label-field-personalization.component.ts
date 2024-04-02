import {Component, Input, OnInit} from '@angular/core';
import {Field, LabelField} from "../../field";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgxColorsModule} from "ngx-colors";
import {FieldPersonalization} from "../field-personalization";

/**
 * Composant pour la personnalisation des champs de saisie
 */
@Component({
  selector: 'app-label-field-personalization',
  standalone: true,
  imports: [
    MatButtonToggle,
    MatButtonToggleGroup,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgxColorsModule
  ],
  templateUrl: './label-field-personalization.component.html',
  styleUrl: './label-field-personalization.component.scss'
})
export class LabelFieldPersonalizationComponent implements OnInit, FieldPersonalization {

  @Input()
  public form?: AbstractControl;

  public hasChanged(field: Field, oldField: Field): boolean {
    return !(
      (<LabelField>field).content == (<LabelField>oldField).content &&
      (<LabelField>field).fontFamily == (<LabelField>oldField).fontFamily &&
      (<LabelField>field).fontSize == (<LabelField>oldField).fontSize &&
      (<LabelField>field).textAlign == (<LabelField>oldField).textAlign &&
      (<LabelField>field).verticalTextAlign == (<LabelField>oldField).verticalTextAlign &&
      (<LabelField>field).color == (<LabelField>oldField).color &&
      (<LabelField>field).backgroundColor == (<LabelField>oldField).backgroundColor
    );
  }

  public getNew(field: Field): LabelField {
    let newField = <LabelField>{...field}
    newField.content = this.form!.get('content')!.value;
    newField.fontSize = Number.parseInt(this.form!.get('fontSize')!.value);
    newField.fontFamily = this.form!.get('fontFamily')!.value;
    newField.textAlign = this.form!.get('textAlign')!.value;
    newField.verticalTextAlign = this.form!.get('verticalTextAlign')!.value;
    newField.color = this.form!.get('color')!.value;
    newField.backgroundColor = this.form!.get('backgroundColor')!.value;
    return newField;
  }

  public updateForm(field: Field): void {
    this.form!.get('content')!.setValue((<LabelField>field).content, { emitEvent: false })
    this.form!.get('fontSize')!.setValue((<LabelField>field).fontSize, { emitEvent: false })
    this.form!.get('fontFamily')!.setValue((<LabelField>field).fontFamily, { emitEvent: false })
    this.form!.get('textAlign')!.setValue((<LabelField>field).textAlign, { emitEvent: false })
    this.form!.get('verticalTextAlign')!.setValue((<LabelField>field).verticalTextAlign, { emitEvent: false })
    this.form!.get('color')!.setValue((<LabelField>field).color, { emitEvent: false })
    this.form!.get('backgroundColor')!.setValue((<LabelField>field).backgroundColor, { emitEvent: false })
  }

  /**
   * Ajoute les champs de formulaire au formulaire enfant
   */
  public ngOnInit(): void {
    (<FormGroup>this.form).addControl('content', new FormControl(), { emitEvent: false });
    (<FormGroup>this.form).addControl('fontSize', new FormControl(), { emitEvent: false });
    (<FormGroup>this.form).addControl('fontFamily', new FormControl(), { emitEvent: false });
    (<FormGroup>this.form).addControl('textAlign', new FormControl(), { emitEvent: false });
    (<FormGroup>this.form).addControl('verticalTextAlign', new FormControl(), { emitEvent: false });
    (<FormGroup>this.form).addControl('color', new FormControl(), { emitEvent: false });
    (<FormGroup>this.form).addControl('backgroundColor', new FormControl(), { emitEvent: false });
  }

  /**
   * Récupère le contrôle de formulaire
   * @param name Nom du champ
   */
  protected getForm(name: string): FormControl {
    return <FormControl>this.form?.get(name);
  }
}
