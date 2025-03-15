import { Component, Input } from '@angular/core';
import { Cliente } from '../cliente';

@Component({
  selector: 'app-cliente',
  imports: [],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent {
  @Input() cliente!: Cliente;
}
