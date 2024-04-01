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
    inputs: ['design'],
    outputs: ['designChange']
  }]
})
export class DesignImageComponent implements DoCheck {
  @Input('design')
  public designImage?: Design;

  private oldImage?: string | File;

  protected url?: string;

  public getImage(): void {
    if (this.get().imageUrl) {
      console.log(this.get())
      this.url = this.get().imageUrl;
      this.oldImage = this.get().imageUrl;
      return;
    }
    this.oldImage = this.get().image;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      console.log(base64String)
    }
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
