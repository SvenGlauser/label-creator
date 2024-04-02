import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FieldService} from "../field-service/field.service";
import {v4 as uuidv4} from 'uuid';
import {ImageField} from "../fields/image-field/image-field";
import {LabelField} from "../fields/label-field/label-field";

/**
 * Composant s'occupant de la création des nouveaux champs
 */
@Component({
  selector: 'app-field-creation',
  standalone: true,
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './field-creation.component.html',
  styleUrl: './field-creation.component.scss'
})
export class FieldCreationComponent {

  constructor(private fieldService: FieldService) {}

  /**
   * Crée un nouveau champ texte
   */
  public addTextArea(): void {
    let field: LabelField = {
      name: uuidv4(),
      type: 'label',
      color: '#000000',
      backgroundColor: '',
      content: 'Texte',
      fontFamily: 'Helvetica',
      fontSize: 12,
      height: 20,
      width: 50,
      index: Number.NEGATIVE_INFINITY,
      left: 0,
      top: 0,
      textAlign: 'left',
      verticalTextAlign: 'flex-start',
      linkedDirective: undefined
    }

    this.fieldService.addNew(field);
  }

  /**
   * Crée un nouveau champ image
   */
  public addImage(): void {
    let field: ImageField = {
      name: uuidv4(),
      type: 'image',
      height: 300,
      width: 300,
      index: Number.NEGATIVE_INFINITY,
      left: 0,
      top: 0,
      backgroundSize: 'contain',
      linkedDirective: undefined
    }

    this.fieldService.addNew(field);
  }
}
