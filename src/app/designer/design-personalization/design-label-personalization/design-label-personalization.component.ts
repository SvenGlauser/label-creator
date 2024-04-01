import {Component, Input, OnInit} from '@angular/core';
import {Design, DesignLabel} from "../../design";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgxColorsModule} from "ngx-colors";
import {DesignPersonalization} from "../design-personalization";

@Component({
  selector: 'app-design-label-personalization',
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
  templateUrl: './design-label-personalization.component.html',
  styleUrl: './design-label-personalization.component.scss'
})
export class DesignLabelPersonalizationComponent implements OnInit, DesignPersonalization {

  @Input()
  public form?: AbstractControl;

  public hasChanged(design: Design, designOld: Design): boolean {
    return !(
      (<DesignLabel>design).content == (<DesignLabel>designOld).content &&
      (<DesignLabel>design).fontFamily == (<DesignLabel>designOld).fontFamily &&
      (<DesignLabel>design).fontSize == (<DesignLabel>designOld).fontSize &&
      (<DesignLabel>design).textAlign == (<DesignLabel>designOld).textAlign &&
      (<DesignLabel>design).verticalTextAlign == (<DesignLabel>designOld).verticalTextAlign &&
      (<DesignLabel>design).color == (<DesignLabel>designOld).color &&
      (<DesignLabel>design).backgroundColor == (<DesignLabel>designOld).backgroundColor
    );
  }

  public getNew(design: Design): DesignLabel {
    let newDesign = <DesignLabel>{...design}
    newDesign.content = this.form!.get('content')!.value;
    newDesign.fontSize = Number.parseInt(this.form!.get('fontSize')!.value);
    newDesign.fontFamily = this.form!.get('fontFamily')!.value;
    newDesign.textAlign = this.form!.get('textAlign')!.value;
    newDesign.verticalTextAlign = this.form!.get('verticalTextAlign')!.value;
    newDesign.color = this.form!.get('color')!.value;
    newDesign.backgroundColor = this.form!.get('backgroundColor')!.value;
    return newDesign;
  }

  public updateForm(design: Design): void {
    this.form!.get('content')!.setValue((<DesignLabel>design).content)
    this.form!.get('fontSize')!.setValue((<DesignLabel>design).fontSize)
    this.form!.get('fontFamily')!.setValue((<DesignLabel>design).fontFamily)
    this.form!.get('textAlign')!.setValue((<DesignLabel>design).textAlign)
    this.form!.get('verticalTextAlign')!.setValue((<DesignLabel>design).verticalTextAlign)
    this.form!.get('color')!.setValue((<DesignLabel>design).color)
    this.form!.get('backgroundColor')!.setValue((<DesignLabel>design).backgroundColor)
  }

  public getForm(name: string): FormControl {
    return <FormControl>this.form?.get(name);
  }

  public ngOnInit(): void {
    (<FormGroup>this.form).addControl('content', new FormControl());
    (<FormGroup>this.form).addControl('fontSize', new FormControl());
    (<FormGroup>this.form).addControl('fontFamily', new FormControl());
    (<FormGroup>this.form).addControl('textAlign', new FormControl());
    (<FormGroup>this.form).addControl('verticalTextAlign', new FormControl());
    (<FormGroup>this.form).addControl('color', new FormControl());
    (<FormGroup>this.form).addControl('backgroundColor', new FormControl());
  }
}
