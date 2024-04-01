import {Component, HostListener, OnInit, Renderer2} from '@angular/core';
import {DesignLabelComponent} from "./design-label/design-label.component";
import {DesignCommonDirective} from "./design-common/design-common.directive";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";
import {DesignCommonService} from "./design-common/design-common.service";
import {DesignPersonalizationComponent} from "./design-personalization/design-personalization.component";
import {PanZoomComponent} from "ngx-panzoom";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    DesignLabelComponent,
    DesignCommonDirective,
    CdkDropList,
    NgForOf,
    DesignPersonalizationComponent,
    NgIf,
    PanZoomComponent,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss'
})
export class DesignerComponent implements OnInit {
  protected deltaY = 0;
  protected scaleValue = 1;

  constructor(protected designService: DesignCommonService,
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
    if (this.deltaY < -1000) {
      this.deltaY = -1000;
    }

    this.scaleValue = Math.pow(2, this.deltaY / 1000);
  }

  protected zoomIn(): void {
    this.calculateScale(200);
  }

  protected zoomOut(): void {
    this.calculateScale(-200);
  }
}
