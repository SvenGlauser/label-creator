import {Component, Input} from '@angular/core';
import {DesignCommonDirective} from "../design-common/design-common.directive";
import {CdkDragHandle} from "@angular/cdk/drag-drop";
import {Design, DesignLabel} from "../design";

@Component({
  selector: 'app-design-label',
  standalone: true,
  imports: [
    DesignCommonDirective,
    CdkDragHandle
  ],
  templateUrl: './design-label.component.html',
  styleUrl: './design-label.component.scss',
  hostDirectives: [{
    directive: DesignCommonDirective,
    inputs: ['design', 'zoomLevel'],
    outputs: ['designChange']
  }]
})
export class DesignLabelComponent {
  @Input('design')
  public designLabel?: Design;

  public getText(): string {
    return this.get().content.replaceAll("\n", "<br>");
  }

  public get(): DesignLabel {
    return <DesignLabel>this.designLabel;
  }
}
