import {Component} from '@angular/core';
import {DesignLabelComponent} from "./design-label/design-label.component";

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    DesignLabelComponent
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss'
})
export class DesignerComponent {

}
