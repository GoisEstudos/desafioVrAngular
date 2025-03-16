import { ItemVenda, Venda } from './../venda';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-venda',
  imports: [],
  templateUrl: './venda.component.html',
  styleUrl: './venda.component.css',
})
export class VendaComponent {
  @Input() venda!: Venda;
  @Input() ItemVenda!: ItemVenda;
}
