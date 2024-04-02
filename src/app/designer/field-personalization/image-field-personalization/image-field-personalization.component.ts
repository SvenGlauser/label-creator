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
import {FieldPersonalization} from "../field-personalization";

/**
 * Composant pour la personnalisation des champs contenant des images
 */
@Component({
  selector: 'app-image-field-personalization',
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
  templateUrl: './image-field-personalization.component.html',
  styleUrl: './image-field-personalization.component.scss'
})
export class ImageFieldPersonalizationComponent implements OnInit, FieldPersonalization {

  @Input()
  public form?: AbstractControl;
  protected fileName?: string;
  protected currentChoose: 'image' | 'url' = 'image';

  /**
   * Ajoute les champs de formulaire au formulaire enfant
   */
  public ngOnInit(): void {
    (<FormGroup>this.form).addControl('image', new FormControl(), { emitEvent: false });
    (<FormGroup>this.form).addControl('imageUrl', new FormControl(), { emitEvent: false });
    (<FormGroup>this.form).addControl('backgroundSize', new FormControl(), { emitEvent: false });
  }

  public hasChanged(design: Design, designOld: Design): boolean {
    return !(
      (<DesignImage>design).image == (<DesignImage>designOld).image &&
      (<DesignImage>design).imageUrl == (<DesignImage>designOld).imageUrl &&
      (<DesignImage>design).backgroundSize == (<DesignImage>designOld).backgroundSize
    );
  }

  public getNew(field: Design): DesignImage {
    let newField = <DesignImage>{...field}
    if (this.currentChoose == 'url') {
      newField.imageUrl = this.form!.get('imageUrl')!.value;
    } else {
      newField.imageUrl = undefined;
    }
    if (this.currentChoose == 'image') {
      newField.image = this.form!.get('image')!.value;
    } else {
      newField.image = undefined;
    }
    newField.backgroundSize = this.form!.get('backgroundSize')!.value;
    return newField;
  }

  public updateForm(design: Design): void {
    this.form!.get('image')!.setValue((<DesignImage>design).image, { emitEvent: false })
    this.form!.get('imageUrl')!.setValue((<DesignImage>design).imageUrl, { emitEvent: false })
    this.form!.get('backgroundSize')!.setValue((<DesignImage>design).backgroundSize, { emitEvent: false })

    this.updateCurrentChoose();
  }

  /**
   * Récupère le contrôle de formulaire
   * @param name Nom du champ
   */
  public getForm(name: string): FormControl {
    return <FormControl>this.form?.get(name);
  }

  /**
   * Enregistre la nouvelle image
   * @param event Événement d'ajout de fichier
   */
  public onFileSelected(event: any): void {
    const file:File = event.target!.files[0];

    if (file) {
      this.fileName = file.name;
      this.form!.get('image')!.setValue(file);
    }
  }

  /**
   * Vérifie si l'image actuelle est fournie sous forme d'URL ou de fichier
   */
  public updateCurrentChoose(): void {
    if (this.form?.get('imageUrl')!.value) {
      this.currentChoose = 'url'
    } else if (this.form?.get('image')!.value) {
      this.fileName = this.form?.get('image')!.value.name;
      this.currentChoose = 'image'
    } else {
      // Valeur par défaut si aucune sélectionnée
      this.currentChoose = 'image'
    }
  }
}
