import { Component } from '@angular/core';
import { Produto } from '../produto';
import { CommonModule } from '@angular/common';
import { ProdutosService } from '../produtos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-produtos',
  imports: [RouterLink, CommonModule],
  templateUrl: './listar-produtos.component.html',
  styleUrl: './listar-produtos.component.css',
})
export class ListarProdutosComponent {
  listarProdutos: Produto[] = [];
  produtoSelecionado: Produto | null = null;

  constructor(private service: ProdutosService) {}

  onDelete(codigo?: string) {
    if (codigo) {
      this.service.excluir(codigo).subscribe(() => {
        // Remover o produto da lista
        this.listarProdutos = this.listarProdutos.filter(
          (produto) => produto.codigo !== codigo
        );

        // Resetar a seleção após a exclusão
        if (this.produtoSelecionado?.codigo === codigo) {
          this.produtoSelecionado = null;
        }
      });
    }
  }

  onSelectProduto(produto: Produto) {
    if (this.produtoSelecionado?.codigo === produto.codigo) {
      // Se o mesmo cliente for clicado, desmarcar
      this.produtoSelecionado = null;
    } else {
      // Caso contrário, marcar o cliente
      this.produtoSelecionado = produto;
    }
  }

  ngOnInit() {
    this.service.listar().subscribe((listaProdutos) => {
      this.listarProdutos = listaProdutos;
    });
  }
}
