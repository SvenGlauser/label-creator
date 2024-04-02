import {Component, Input} from '@angular/core';
import {DesignCommonDirective} from "../design-common/design-common.directive";
import {CdkDragHandle} from "@angular/cdk/drag-drop";
import {Design, DesignLabel} from "../design";

/**
 * Composant d'affichage pour les champs de saisie classique
 */
@Component({
  selector: 'app-label-field',
  standalone: true,
  imports: [
    DesignCommonDirective,
    CdkDragHandle
  ],
  templateUrl: './label-field.component.html',
  styleUrl: './label-field.component.scss',
  hostDirectives: [{
    directive: DesignCommonDirective,
    inputs: ['design', 'zoomLevel'],
    outputs: ['designChange']
  }]
})
export class LabelFieldComponent {
  @Input('design')
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
  public getField(): DesignLabel {
    return <DesignLabel>this.labelField;
  }
}
