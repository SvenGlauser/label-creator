import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {DesignCommonService} from "../field-service/design-common.service";
import {DesignImage, DesignLabel} from "../design";
import { v4 as uuidv4 } from 'uuid';


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

  constructor(private fieldService: DesignCommonService) {}

  public addTextArea(): void {
    let field: DesignLabel = {
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

  public addImage(): void {
    let field: DesignImage = {
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
