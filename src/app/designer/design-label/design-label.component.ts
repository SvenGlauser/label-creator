import {Component} from '@angular/core';
import {DesignCommonComponent} from "../design-common/design-common.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-design-label',
  standalone: true,
  imports: [
    DesignCommonComponent
  ],
  templateUrl: './design-label.component.html',
  styleUrl: './design-label.component.scss'
})
export class DesignLabelComponent {

}
