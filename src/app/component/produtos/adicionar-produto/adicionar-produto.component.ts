import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProdutosService } from '../produtos.service';
import { Router } from '@angular/router';
import { Produto } from '../produto';

@Component({
  selector: 'app-adicionar-produto',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adicionar-produto.component.html',
  styleUrl: './adicionar-produto.component.css',
})
export class AdicionarProdutoComponent {
  produtosForms!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ProdutosService,
    private router: Router
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

  onSubmit() {
    if (this.produtosForms.valid) {
      const produto: Produto = this.produtosForms.value;

      this.service
        .adicionar(produto)
        .subscribe(() => this.router.navigate(['/listarProdutos']));
    }
  }
}
