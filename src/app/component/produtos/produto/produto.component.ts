import { Component, Input } from '@angular/core';
import { Produto } from '../produto';

@Component({
  selector: 'app-produto',
  imports: [],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css',
})
export class ProdutoComponent {
  @Input() produto!: Produto;
}
