import {Routes} from '@angular/router';
import {EditionPageComponent} from "./designer/edition-page/edition-page.component";
import {AppComponent} from "./app.component";

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'edition/:id', component: EditionPageComponent }
    ]
  }
];
