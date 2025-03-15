import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { Cliente } from '../cliente';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-cliente',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-cliente.component.html',
  styleUrl: './editar-cliente.component.css',
})
export class EditarClienteComponent {
  clienteForms!: FormGroup;
  minDateString: string;

  clienteCodigo!: string; // Para armazenar o código do cliente a ser editado

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private router: Router,
    private route: ActivatedRoute // Para pegar o código do cliente da URL
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

  ngOnInit(): void {
    // Pega o código do cliente a partir da URL
    this.clienteCodigo = this.route.snapshot.paramMap.get('codigo')!;
    if (this.clienteCodigo) {
      this.carregarCliente(this.clienteCodigo);
    }
  }

  // Função para carregar os dados do cliente
  carregarCliente(codigo: string) {
    this.service.listarPorId(codigo).subscribe((cliente: Cliente) => {
      this.clienteForms.patchValue({
        codigo: cliente.codigo,
        nome: cliente.nome,
        limiteCredito: cliente.limiteCredito,
        fechamentoFatura: cliente.fechamentoFatura,
      });
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
        .editar(cliente) // Aqui você chama o método de editar no serviço
        .subscribe(() => this.router.navigate(['/listarClientes']));
    }
  }

  // Função para garantir que a data seja enviada no formato "dd/MM/yyyy"
  formatDateToSend(date: string): string {
    return formatDate(date, 'dd/MM/yyyy', 'en-US');
  }
}
