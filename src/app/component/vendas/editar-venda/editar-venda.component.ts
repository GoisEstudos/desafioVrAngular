import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { Cliente } from '../../clientes/cliente';
import { Venda } from '../venda';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClienteService } from '../../clientes/cliente.service';
import { ProdutosService } from '../../produtos/produtos.service';
import { VendasService } from '../../vendas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../../produtos/produto';

@Component({
  selector: 'app-editar-venda',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-venda.component.html',
  styleUrl: './editar-venda.component.css',
})
export class EditarVendaComponent {
  vendasForms!: FormGroup;
  vendaCodigo!: string;
  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  minDate = new Date().toISOString().slice(0, 16);

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private produtoService: ProdutosService,
    private vendaService: VendasService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.vendasForms = this.fb.group({
      codigo: ['', Validators.required],
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

    // Obter o parâmetro 'codigo' de forma reativa
    this.route.paramMap.subscribe((params) => {
      this.vendaCodigo = params.get('codigo')!; // Captura o parâmetro 'codigo' da URL
      if (this.vendaCodigo) {
        // Se o 'codigo' for encontrado, carrega a venda correspondente
        this.carregarVenda(this.vendaCodigo);
      }
    });
  }

  carregarVenda(codigo: string): void {
    this.vendaService.listarPorId(codigo).subscribe((venda: Venda) => {
      console.log('Venda carregada:', venda); // Verifique se a venda e o código estão corretos
      if (!venda.codigo) {
        console.error('Código da venda não encontrado no objeto venda:', venda);
        return;
      }

      this.vendasForms.patchValue({
        codigo: venda.codigo,
        cliente: venda.cliente.codigo,
        dataVenda: venda.dataVenda,
        valorTotal: venda.valorTotal,
      });

      // Atualiza a lista de itens, se houver
      const itensArray = this.vendasForms.get('itens') as FormArray;
      itensArray.clear();

      venda.itens.forEach((item) => {
        const itemForm = this.fb.group({
          produto: item.produto.codigo,
          quantidade: item.quantidade,
        });
        itensArray.push(itemForm);
      });

      // Verifique se o código da venda foi atribuído corretamente
      this.vendaCodigo = venda.codigo; // Isso deve ser atribuído corretamente agora
      console.log('Código da venda:', this.vendaCodigo); // Verifique se o código foi atribuído corretamente
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
              this.vendaService.editar(venda).subscribe(() => {
                this.router.navigate(['/listarVendas']);
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
