import { Component, OnInit, Input } from '@angular/core';

type InputTypes = 'password' | 'text' | 'email'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() label!: String
  @Input() type: InputTypes = 'text'
  @Input() iconPath: String = ''

  constructor() { }



}
