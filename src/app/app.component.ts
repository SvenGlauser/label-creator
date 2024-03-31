import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DesignerComponent} from "./designer/designer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DesignerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
