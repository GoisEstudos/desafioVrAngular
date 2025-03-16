import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VendasService } from '../../vendas.service';
import { Router } from '@angular/router';
import { Cliente } from '../../clientes/cliente';
import { Produto } from '../../produtos/produto';
import { ClienteService } from '../../clientes/cliente.service';
import { ProdutosService } from '../../produtos/produtos.service';
import { Venda } from '../venda';

@Component({
  selector: 'app-adicionar-venda',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adicionar-venda.component.html',
  styleUrl: './adicionar-venda.component.css',
})
export class AdicionarVendaComponent {
  vendasForms!: FormGroup;
  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  minDate = new Date().toISOString().slice(0, 16);

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private produtoService: ProdutosService,
    private vendaService: VendasService,
    private router: Router
  ) {
    this.vendasForms = this.fb.group({
      cliente: ['', Validators.required],
      dataVenda: ['', Validators.required],
      itens: this.fb.array([this.createItem()]),
      valorTotal: [{ value: 0, disabled: true }],
    });
  }

  ngOnInit(): void {
    // Carregar clientes do backend
    this.clienteService.listar().subscribe((clientes) => {
      this.clientes = clientes;
    });

    // Carregar produtos do backend
    this.produtoService.listar().subscribe((produtos) => {
      this.produtos = produtos;
    });
  }

  // Acessar a lista de itens
  get itens(): FormArray {
    return this.vendasForms.get('itens') as FormArray;
  }

  createItem(): FormGroup {
    const item = this.fb.group({
      produto: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
    });

    // Listener para alterações na quantidade
    item.get('quantidade')?.valueChanges.subscribe(() => {
      this.calcularValorTotal();
    });

    return item;
  }

  onProdutoSelecionado(index: number): void {
    // Recalcular o valor total
    this.calcularValorTotal();

    // Obter o valor calculado do total
    const valorTotal = this.vendasForms.get('valorTotal')?.value;

    // Atualizar o campo valorTotal
    this.vendasForms.get('valorTotal')?.setValue(valorTotal);
  }

  addItem() {
    const item = this.fb.group({
      produto: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
    });

    this.itens.push(item);
  }

  calcularValorTotal(): void {
    let valorTotal = 0;

    this.itens.controls.forEach((item) => {
      const produtoCodigo = item.get('produto')?.value;
      const quantidade = item.get('quantidade')?.value;

      if (produtoCodigo && quantidade) {
        const produto = this.produtos.find((p) => p.codigo === produtoCodigo);
        if (produto) {
          const precoProduto = produto.preco || 0;
          valorTotal += precoProduto * quantidade; // Multiplicando preço pela quantidade
        }
      }
    });

    this.vendasForms.get('valorTotal')?.setValue(valorTotal); // Atualiza o valor total
  }

  onSubmit() {
    if (this.vendasForms.valid) {
      const venda: Venda = this.vendasForms.value;

      // Formatar a dataVenda para o formato esperado pelo backend
      venda.dataVenda = this.formatDateToSend(venda.dataVenda);

      // Verifique se 'venda.cliente' é uma string (código do cliente)
      if (typeof venda.cliente === 'string') {
        // Buscar o cliente completo usando o código
        this.clienteService
          .listarPorId(venda.cliente)
          .subscribe((clienteSelecionado: Cliente) => {
            if (clienteSelecionado) {
              // Substitui o código do cliente pelo objeto completo
              venda.cliente = clienteSelecionado;

              // Transformar os itens para incluir o produto completo
              venda.itens = venda.itens.map((item: any) => {
                const produtoSelecionado = this.produtos.find(
                  (produto) => produto.codigo === item.produto
                );

                if (produtoSelecionado) {
                  // Substitui o código do produto pelo objeto completo
                  item.produto = produtoSelecionado;
                }

                return item;
              });

              // Envia os dados para o backend
              this.vendaService.adicionar(venda).subscribe(() => {
                this.router.navigate(['/listarProdutos']);
              });
            }
          });
      }
    }
  }

  onCancelar(): void {
    this.router.navigate(['/listarVendas']);
  }

  formatDateToSend(date: string): string {
    return formatDate(date, 'dd/MM/yyyy HH:mm:ss', 'en-US');
  }
}
