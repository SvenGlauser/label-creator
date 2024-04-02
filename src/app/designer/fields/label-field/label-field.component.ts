import {Component, Input} from '@angular/core';
import {CommonFieldDirective} from "../../common-field/common-field.directive";
import {CdkDragHandle} from "@angular/cdk/drag-drop";
import {Design, DesignLabel} from "../../design";

/**
 * Composant d'affichage pour les champs de saisie classique
 */
@Component({
  selector: 'app-label-field',
  standalone: true,
  imports: [
    CommonFieldDirective,
    CdkDragHandle
  ],
  templateUrl: './label-field.component.html',
  styleUrl: './label-field.component.scss',
  hostDirectives: [{
    directive: CommonFieldDirective,
    inputs: ['field', 'zoomLevel'],
    outputs: ['fieldChange']
  }]
})
export class LabelFieldComponent {
  @Input('field')
  public labelField?: Design;

  /**
   * Récupère le texte à afficher
   */
  public getText(): string {
    return this.getField().content.replaceAll("\n", "<br>");
  }

  /**
   * Récupère une version du champ dans l'interface de bon type (réalise un cast)
   */
  protected getField(): DesignLabel {
    return <DesignLabel>this.labelField;
  }
}
