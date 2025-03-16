import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { Venda } from '../venda';
import { CommonModule } from '@angular/common';
import { VendasService } from '../../vendas.service';

@Component({
  selector: 'app-listar-vendas',
  imports: [RouterLink, CommonModule],
  templateUrl: './listar-vendas.component.html',
  styleUrl: './listar-vendas.component.css',
})
export class ListarVendasComponent {
  listarVendas: Venda[] = [];
  vendaSelecionada: Venda | null = null;

  constructor(private service: VendasService) {}

  onDelete(codigo?: string) {
    if (codigo) {
      this.service.excluir(codigo).subscribe(() => {
        // Remover o produto da lista
        this.listarVendas = this.listarVendas.filter(
          (venda) => venda.codigo !== codigo
        );

        // Resetar a seleção após a exclusão
        if (this.vendaSelecionada?.codigo === codigo) {
          this.vendaSelecionada = null;
        }
      });
    }
  }
  onSelectVenda(venda: Venda) {
    if (this.vendaSelecionada?.codigo === venda.codigo) {
      // Se o mesmo cliente for clicado, desmarcar
      this.vendaSelecionada = null;
    } else {
      // Caso contrário, marcar o cliente
      this.vendaSelecionada = venda;
    }
  }

  ngOnInit() {
    this.service.listar().subscribe((listaVendas) => {
      this.listarVendas = listaVendas;
    });
  }
}
