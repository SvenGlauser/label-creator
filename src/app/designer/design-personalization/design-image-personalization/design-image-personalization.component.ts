import {Component, Input} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Design, DesignImage} from "../../design";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgxColorsModule} from "ngx-colors";

@Component({
  selector: 'app-design-image-personalization',
  standalone: true,
  imports: [
    MatButtonToggle,
    MatButtonToggleGroup,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    NgxColorsModule,
    ReactiveFormsModule
  ],
  templateUrl: './design-image-personalization.component.html',
  styleUrl: './design-image-personalization.component.scss'
})
export class DesignImagePersonalizationComponent {

  @Input()
  public form?: AbstractControl;

  public hasChanged(design: Design, designOld: Design): boolean {
    return !(
      (<DesignImage>design).image == (<DesignImage>designOld).image &&
      (<DesignImage>design).imageUrl == (<DesignImage>designOld).imageUrl &&
      (<DesignImage>design).backgroundSize == (<DesignImage>designOld).backgroundSize
    );
  }

  public getNew(design: Design): DesignImage {
    let newDesign = <DesignImage>{...design}
    newDesign.image = this.form!.get('image')!.value;
    newDesign.imageUrl = this.form!.get('imageUrl')!.value;
    newDesign.backgroundSize = this.form!.get('backgroundSize')!.value;
    return newDesign;
  }

  public updateForm(design: Design): void {
    this.form!.get('image')!.setValue((<DesignImage>design).image)
    this.form!.get('imageUrl')!.setValue((<DesignImage>design).imageUrl)
    this.form!.get('backgroundSize')!.setValue((<DesignImage>design).backgroundSize)
  }

  public getForm(name: string): FormControl {
    return <FormControl>this.form?.get(name);
  }

  public ngOnInit(): void {
    (<FormGroup>this.form).addControl('image', new FormControl());
    (<FormGroup>this.form).addControl('imageUrl', new FormControl());
    (<FormGroup>this.form).addControl('backgroundSize', new FormControl());
  }
}
