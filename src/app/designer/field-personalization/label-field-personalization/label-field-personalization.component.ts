import {Component, Input, OnInit} from '@angular/core';
import {Design, DesignLabel} from "../../design";
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

  public hasChanged(field: Design, oldField: Design): boolean {
    return !(
      (<DesignLabel>field).content == (<DesignLabel>oldField).content &&
      (<DesignLabel>field).fontFamily == (<DesignLabel>oldField).fontFamily &&
      (<DesignLabel>field).fontSize == (<DesignLabel>oldField).fontSize &&
      (<DesignLabel>field).textAlign == (<DesignLabel>oldField).textAlign &&
      (<DesignLabel>field).verticalTextAlign == (<DesignLabel>oldField).verticalTextAlign &&
      (<DesignLabel>field).color == (<DesignLabel>oldField).color &&
      (<DesignLabel>field).backgroundColor == (<DesignLabel>oldField).backgroundColor
    );
  }

  public getNew(field: Design): DesignLabel {
    let newField = <DesignLabel>{...field}
    newField.content = this.form!.get('content')!.value;
    newField.fontSize = Number.parseInt(this.form!.get('fontSize')!.value);
    newField.fontFamily = this.form!.get('fontFamily')!.value;
    newField.textAlign = this.form!.get('textAlign')!.value;
    newField.verticalTextAlign = this.form!.get('verticalTextAlign')!.value;
    newField.color = this.form!.get('color')!.value;
    newField.backgroundColor = this.form!.get('backgroundColor')!.value;
    return newField;
  }

  public updateForm(field: Design): void {
    this.form!.get('content')!.setValue((<DesignLabel>field).content, { emitEvent: false })
    this.form!.get('fontSize')!.setValue((<DesignLabel>field).fontSize, { emitEvent: false })
    this.form!.get('fontFamily')!.setValue((<DesignLabel>field).fontFamily, { emitEvent: false })
    this.form!.get('textAlign')!.setValue((<DesignLabel>field).textAlign, { emitEvent: false })
    this.form!.get('verticalTextAlign')!.setValue((<DesignLabel>field).verticalTextAlign, { emitEvent: false })
    this.form!.get('color')!.setValue((<DesignLabel>field).color, { emitEvent: false })
    this.form!.get('backgroundColor')!.setValue((<DesignLabel>field).backgroundColor, { emitEvent: false })
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
