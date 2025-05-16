import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterielcrudComponent } from './materielcrud/materielcrud.component';
@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet,MaterielcrudComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-project';
}
