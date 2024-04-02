import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {EditionPageComponent} from "./designer/edition-page/edition-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditionPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
