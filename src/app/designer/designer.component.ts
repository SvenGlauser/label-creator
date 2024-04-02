import {Component, OnInit, Renderer2} from '@angular/core';
import {LabelFieldComponent} from "./label-field/label-field.component";
import {DesignCommonDirective} from "./design-common/design-common.directive";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";
import {DesignCommonService} from "./design-common/design-common.service";
import {FieldPersonalizationComponent} from "./field-personalization/field-personalization.component";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {DesignImageComponent} from "./design-image/design-image.component";
import {DesignCreationComponent} from "./design-creation/design-creation.component";
import {VersionningService} from "./versionning-service/versionning.service";

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    LabelFieldComponent,
    DesignCommonDirective,
    CdkDropList,
    NgForOf,
    FieldPersonalizationComponent,
    NgIf,
    MatIconButton,
    MatIcon,
    DesignImageComponent,
    DesignCreationComponent
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss'
})
export class DesignerComponent implements OnInit {
  protected deltaY = 0;
  protected scaleValue = 1;

  constructor(protected designService: DesignCommonService,
              protected versionningService: VersionningService,
              private _render: Renderer2) {}

  public ngOnInit(): void {
    this._render.listen(document.getElementById("zoom-zone"), "wheel", (event: WheelEvent) => {
      this.calculateScale(event.deltaY);
    });
  }

  private calculateScale(deltaY: number) {
    this.deltaY = this.deltaY + deltaY;
    if (this.deltaY > 1000) {
      this.deltaY = 1000;
    }
    if (this.deltaY < -1600) {
      this.deltaY = -1600;
    }

    this.scaleValue = Math.pow(2, -this.deltaY / 1000);
  }

  protected zoomIn(): void {
    this.calculateScale(-200);
  }

  protected zoomOut(): void {
    this.calculateScale(+200);
  }

  protected goBack(): void {
    this.designService.goBack();
  }

  protected goNext(): void {
    this.designService.goNext();
  }
}
