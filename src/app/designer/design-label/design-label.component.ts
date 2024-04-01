import {Component, Input} from '@angular/core';
import {DesignCommonDirective} from "../design-common/design-common.directive";
import {CdkDragHandle} from "@angular/cdk/drag-drop";
import {Design} from "../design";

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
    inputs: ['design'],
    outputs: ['designChange']
  }]
})
export class DesignLabelComponent {
  @Input('design')
  public designLabel?: Design;

  public getText(): string {
    return <string>this.designLabel?.content.replaceAll("\n", "<br>");
  }
}
