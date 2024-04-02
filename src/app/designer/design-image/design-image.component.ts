import {Component, DoCheck, Input} from '@angular/core';
import {DesignCommonDirective} from "../design-common/design-common.directive";
import {Design, DesignImage} from "../design";
import {CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-design-image',
  standalone: true,
  imports: [
    CdkDragHandle
  ],
  templateUrl: './design-image.component.html',
  styleUrl: './design-image.component.scss',
  hostDirectives: [{
    directive: DesignCommonDirective,
    inputs: ['design', 'zoomLevel'],
    outputs: ['designChange']
  }]
})
export class DesignImageComponent implements DoCheck {
  @Input('design')
  public designImage?: Design;

  private oldImage?: string | Blob;

  protected url?: string;

  public getImage(): void {
    if (this.get().imageUrl) {
      this.url = this.get().imageUrl;
      this.oldImage = this.get().imageUrl;
      return;
    }
    if (this.get().image) {
      this.oldImage = this.get().image;

      const reader = new FileReader();

      reader.onloadend = () => {
        this.url = reader.result as string;
      }
      reader.readAsDataURL(this.get().image!);
    }
    this.url = undefined;
  }

  public get(): DesignImage {
    return <DesignImage>this.designImage;
  }

  public ngDoCheck(): void {
    if (!!this.oldImage && (this.oldImage == this.get().imageUrl || this.oldImage == this.get().image)) {
      return;
    }

    this.getImage();
  }
}
