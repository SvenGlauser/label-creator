import {Component} from '@angular/core';
import {DesignLabelComponent} from "./design-label/design-label.component";
import {DesignCommonDirective} from "./design-common/design-common.directive";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {NgForOf} from "@angular/common";
import {DesignCommonService} from "./design-common/design-common.service";

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    DesignLabelComponent,
    DesignCommonDirective,
    CdkDropList,
    NgForOf
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss'
})
export class DesignerComponent {
  constructor(protected designService: DesignCommonService) {
  }
}
