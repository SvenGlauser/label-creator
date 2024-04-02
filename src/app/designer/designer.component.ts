import {Component, OnInit, Renderer2} from '@angular/core';
import {LabelFieldComponent} from "./fields/label-field/label-field.component";
import {CommonFieldDirective} from "./fields/common-field/common-field.directive";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";
import {FieldService} from "./field-service/field.service";
import {FieldPersonalizationComponent} from "./field-personalization/field-personalization.component";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ImageFieldComponent} from "./fields/image-field/image-field.component";
import {FieldCreationComponent} from "./field-creation/field-creation.component";
import {VersioningService} from "./versioning-service/versioning.service";

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    LabelFieldComponent,
    CommonFieldDirective,
    CdkDropList,
    NgForOf,
    FieldPersonalizationComponent,
    NgIf,
    MatIconButton,
    MatIcon,
    ImageFieldComponent,
    FieldCreationComponent
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss'
})
export class DesignerComponent implements OnInit {
  protected deltaY = 0;
  protected scaleValue = 1;

  constructor(protected designService: FieldService,
              protected versioningService: VersioningService,
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
    this.designService.undo();
  }

  protected goNext(): void {
    this.designService.redo();
  }
}
