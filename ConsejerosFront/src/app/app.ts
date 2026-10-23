import { Component, signal } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { PersonaNaturalList } from './components/persona-natural-list/persona-natural-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PersonaNaturalList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'ConsejerosFront';
}