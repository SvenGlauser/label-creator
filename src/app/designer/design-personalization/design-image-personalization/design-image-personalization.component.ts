import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Design, DesignImage} from "../../design";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgxColorsModule} from "ngx-colors";
import {MatMiniFabButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {DesignPersonalization} from "../design-personalization";

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
    ReactiveFormsModule,
    MatMiniFabButton,
    NgIf
  ],
  templateUrl: './design-image-personalization.component.html',
  styleUrl: './design-image-personalization.component.scss'
})
export class DesignImagePersonalizationComponent implements OnInit, DesignPersonalization {

  @Input()
  public form?: AbstractControl;
  protected fileName?: string;
  protected currentChoose: 'image' | 'url' = 'image';

  public hasChanged(design: Design, designOld: Design): boolean {
    return !(
      (<DesignImage>design).image == (<DesignImage>designOld).image &&
      (<DesignImage>design).imageUrl == (<DesignImage>designOld).imageUrl &&
      (<DesignImage>design).backgroundSize == (<DesignImage>designOld).backgroundSize
    );
  }

  public getNew(design: Design): DesignImage {
    let newDesign = <DesignImage>{...design}
    if (this.currentChoose == 'url') {
      newDesign.imageUrl = this.form!.get('imageUrl')!.value;
    } else {
      newDesign.imageUrl = undefined;
    }
    if (this.currentChoose == 'image') {
      newDesign.image = this.form!.get('image')!.value;
    } else {
      newDesign.image = undefined;
    }
    newDesign.backgroundSize = this.form!.get('backgroundSize')!.value;
    return newDesign;
  }

  public updateForm(design: Design): void {
    this.form!.get('image')!.setValue((<DesignImage>design).image)
    this.form!.get('imageUrl')!.setValue((<DesignImage>design).imageUrl)
    this.form!.get('backgroundSize')!.setValue((<DesignImage>design).backgroundSize)

    this.currentChoose = this.isCurrentURLOrImage();
  }

  public getForm(name: string): FormControl {
    return <FormControl>this.form?.get(name);
  }

  public onFileSelected(event: any): void {
    const file:File = event.target!.files[0];

    if (file) {
      this.fileName = file.name;
      this.form!.get('image')!.setValue(file);
    }
  }

  public ngOnInit(): void {
    (<FormGroup>this.form).addControl('image', new FormControl());
    (<FormGroup>this.form).addControl('imageUrl', new FormControl());
    (<FormGroup>this.form).addControl('backgroundSize', new FormControl());
  }

  public isCurrentURLOrImage(): 'image' | 'url' {
    if (!!this.form?.get('imageUrl')!.value) {
      return 'url'
    }
    if (!!this.form?.get('image')!.value) {
      console.log(this.form?.get('image')!.value)
      this.fileName = this.form?.get('image')!.value.name;
      return 'image'
    }
    return 'image'
  }
}
