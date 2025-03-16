import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProdutosService } from '../produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../produto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-produto',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-produto.component.html',
  styleUrl: './editar-produto.component.css',
})
export class EditarProdutoComponent {
  produtosForms!: FormGroup;
  produtoCodigo!: string;

  constructor(
    private fb: FormBuilder,
    private service: ProdutosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.produtosForms = this.fb.group({
      codigo: [''],
      descricao: ['', Validators.required],
      preco: [null, Validators.required],
    });
  }

  onCancelar() {
    this.router.navigate(['listarProdutos']);
  }

  ngOnInit(): void {
    // Pega o código do cliente a partir da URL
    this.produtoCodigo = this.route.snapshot.paramMap.get('codigo')!;
    if (this.produtoCodigo) {
      this.carregarCliente(this.produtoCodigo);
    }
  }

  carregarCliente(codigo: string) {
    this.service.listarPorId(codigo).subscribe((produto: Produto) => {
      this.produtosForms.patchValue({
        codigo: produto.codigo,
        descricao: produto.descricao,
        preco: produto.preco,
      });
    });
  }

  onSubmit() {
    if (this.produtosForms.valid) {
      const produto: Produto = this.produtosForms.value;

      this.service
        .editar(produto)
        .subscribe(() => this.router.navigate(['/listarProdutos']));
    }
  }
}
