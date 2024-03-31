import {Component} from '@angular/core';
import {DesignLabelComponent} from "./design-label/design-label.component";
import {DesignCommonDirective} from "./design-common/design-common.directive";
import {CdkDropList} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    DesignLabelComponent,
    DesignCommonDirective,
    CdkDropList
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss'
})
export class DesignerComponent {

}
