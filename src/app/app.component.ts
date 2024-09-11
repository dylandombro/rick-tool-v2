import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RickToolComponent } from './components/rick-tool.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RickToolComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'rick-tool';
}
