import {Component} from '@angular/core';
import {DesignCommonDirective} from "../design-common/design-common.directive";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-design-label',
  standalone: true,
  imports: [
    DesignCommonDirective,
    CdkDragHandle
  ],
  templateUrl: './design-label.component.html',
  styleUrl: './design-label.component.scss',
  hostDirectives: [CdkDrag]
})
export class DesignLabelComponent {

}
