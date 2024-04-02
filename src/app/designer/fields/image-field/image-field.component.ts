import {Component, DoCheck, Input} from '@angular/core';
import {CommonFieldDirective} from "../common-field/common-field.directive";
import {Field, ImageField} from "../../field";
import {CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-image-field',
  standalone: true,
  imports: [
    CdkDragHandle
  ],
  templateUrl: './image-field.component.html',
  styleUrl: './image-field.component.scss',
  hostDirectives: [{
    directive: CommonFieldDirective,
    inputs: ['field', 'zoomLevel'],
    outputs: ['fieldChange']
  }]
})
export class ImageFieldComponent implements DoCheck {

  @Input('field')
  public imageField?: Field;

  private oldImage?: string | Blob;
  protected url?: string;

  /**
   * Vérifie si l'image a changé
   */
  public ngDoCheck(): void {
    if (!!this.oldImage && (this.oldImage == this.getField().imageUrl || this.oldImage == this.getField().image)) {
      return;
    }

    this.getImage();
  }

  /**
   * Récupère et calcule l'URL pour le background-image CSS
   */
  private getImage(): void {
    if (this.getField().imageUrl) {
      this.url = this.getField().imageUrl;
      this.oldImage = this.getField().imageUrl;
      return;
    }
    if (this.getField().image) {
      this.oldImage = this.getField().image;

      const reader = new FileReader();

      reader.onloadend = () => {
        this.url = reader.result as string;
      }
      reader.readAsDataURL(this.getField().image!);
    }
    this.url = undefined;
  }

  /**
   * Récupère une version du champ dans l'interface de bon type (réalise un cast)
   */
  protected getField(): ImageField {
    return <ImageField>this.imageField;
  }
}
