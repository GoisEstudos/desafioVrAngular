import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cliente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adicionar-cliente',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adicionar-cliente.component.html',
  styleUrl: './adicionar-cliente.component.css',
})
export class AdicionarClienteComponent {
  clienteForms!: FormGroup;
  minDateString: string;

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private router: Router
  ) {
    const today = new Date();
    this.minDateString = today.toISOString().split('T')[0];

    this.clienteForms = this.fb.group({
      codigo: [''],
      nome: ['', Validators.required],
      limiteCredito: [null, [Validators.required, Validators.min(0)]],
      fechamentoFatura: ['', Validators.required],
    });
  }

  onCancelar() {
    this.router.navigate(['/listarClientes']);
  }

  onSubmit() {
    if (this.clienteForms.valid) {
      const cliente: Cliente = this.clienteForms.value;

      // Converte a data de fechamento de fatura para o formato "dd/MM/yyyy"
      cliente.fechamentoFatura = this.formatDateToSend(
        cliente.fechamentoFatura
      );

      this.service
        .adicionar(cliente)
        .subscribe(() => this.router.navigate(['/listarClientes']));
    }
  }

  // Função para garantir que a data seja enviada no formato "dd/MM/yyyy"
  formatDateToSend(date: string): string {
    return formatDate(date, 'dd/MM/yyyy', 'en-US');
  }
}
